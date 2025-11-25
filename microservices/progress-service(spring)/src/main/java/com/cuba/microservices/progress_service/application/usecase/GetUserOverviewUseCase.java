package com.cuba.microservices.progress_service.application.usecase;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.application.dto.response.DayProgressDTO;
import com.cuba.microservices.progress_service.application.dto.response.HabitOverviewDTO;
import com.cuba.microservices.progress_service.application.dto.response.ProgressOverviewDTO;
import com.cuba.microservices.progress_service.domain.model.HabitProgress;
import com.cuba.microservices.progress_service.domain.repository.HabitProgressRepository;
import com.cuba.microservices.progress_service.domain.service.StreakCalculator;
import com.cuba.microservices.progress_service.infrastructure.messaging.HabitClient;
import com.cuba.microservices.progress_service.infrastructure.messaging.UserClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUserOverviewUseCase {

    private final HabitClient habitClient;
    private final UserClient userClient;                   // ⚡ NEW: lấy timezone
    private final HabitProgressRepository repository;
    private final StreakCalculator streakCalculator;

    public ProgressOverviewDTO execute(Integer userId, LocalDate from, LocalDate to) {

        // 1. Lấy timezone user từ AuthService
        UserProfileDTO profile = userClient.getProfile(userId);
        ZoneId zone = ZoneId.of(profile.getTimezone());

        // TODAY theo timezone user
        LocalDate today = LocalDate.now(zone);

        // Nếu UI gửi range future → tự động clamp về hôm nay
        if (to.isAfter(today)) {
            to = today;
        }

        // 2. Lấy tất cả habits của user từ HabitService
        List<HabitDTO> habits = habitClient.getHabitsOfUser(userId);
        if (habits.isEmpty()) {
            return new ProgressOverviewDTO(userId, from, to, new ArrayList<>());
        }

        List<HabitOverviewDTO> list = new ArrayList<>();

        for (HabitDTO habit : habits) {

            UUID habitId = habit.getHabitId();

            // 3. Query progress trong khoảng ngày
            List<HabitProgress> progresses =
                    repository.findByHabitIdAndDateBetween(habitId, from, to);

            Map<LocalDate, HabitProgress> map = progresses.stream()
                    .collect(Collectors.toMap(HabitProgress::getDate, p -> p));

            List<DayProgressDTO> days = new ArrayList<>();

            LocalDate d = from;

            while (!d.isAfter(to)) {

                DayProgressDTO dto = new DayProgressDTO();
                dto.setDate(d);

                // BEFORE_START
                if (d.isBefore(habit.getStartDate())) {
                    dto.setStatus("BEFORE_START");
                    days.add(dto);
                    d = d.plusDays(1);
                    continue;
                }

                // AFTER_END
                if (habit.getEndDate() != null && d.isAfter(habit.getEndDate())) {
                    dto.setStatus("OFF");
                    days.add(dto);
                    d = d.plusDays(1);
                    continue;
                }

                // OFF theo repeat rule
                boolean active = habitClient.isActiveDay(habitId, d, userId);
                if (!active) {
                    dto.setStatus("OFF");
                    days.add(dto);
                    d = d.plusDays(1);
                    continue;
                }

                // RECORD?
                HabitProgress p = map.get(d);
                if (p != null) {
                    dto.setStatus(p.getStatus().name());
                    dto.setProgressValue(p.getProgressValue());
                } else {
                    dto.setStatus("NONE");
                }

                days.add(dto);
                d = d.plusDays(1);
            }

            // 4. Tính streak theo timezone
            int streak = streakCalculator.calculateCurrentStreak(
                    habitId,
                    habit.getStartDate(),
                    today,   // ⚡ dùng today theo timezone user
                    date -> habitClient.isActiveDay(habitId, date, userId)
            );

            // 5. Tổng progress
            BigDecimal total = repository.sumTotalProgress(habitId);

            list.add(
                HabitOverviewDTO.builder()
                    .habitId(habitId)
                    .streak(streak)
                    .totalProgress(total)
                    .days(days)
                    .build()
            );
        }

        return new ProgressOverviewDTO(userId, from, to, list);
    }
}
