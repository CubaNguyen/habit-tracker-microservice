package com.cuba.microservices.progress_service.application.usecase;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.application.dto.response.DayProgressDTO;
import com.cuba.microservices.progress_service.application.dto.response.HabitGridResponseDTO;
import com.cuba.microservices.progress_service.domain.model.HabitProgress;
import com.cuba.microservices.progress_service.domain.repository.HabitProgressRepository;
import com.cuba.microservices.progress_service.domain.service.StreakCalculator;
import com.cuba.microservices.progress_service.exception.CustomException;
import com.cuba.microservices.progress_service.infrastructure.messaging.HabitClient;
import com.cuba.microservices.progress_service.infrastructure.messaging.UserClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHabitGridUseCase {

    private final HabitClient habitClient;
    private final UserClient userClient;
    private final HabitProgressRepository repository;
    private final StreakCalculator streakCalculator;

    public HabitGridResponseDTO execute(UUID habitId, LocalDate from, LocalDate to, Integer userId) {

        // 1. Lấy habit
        HabitDTO habit = habitClient.getHabit(habitId, userId);
        if (habit == null) {
            throw new CustomException("habit not found", "HABIT_NOT_FOUND");
        }

        // 2. Validate ownership
        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        // 3. Lấy timezone của user từ AuthService
        UserProfileDTO profile = userClient.getProfile(userId);
        ZoneId zone = ZoneId.of(profile.getTimezone());   // "Asia/Saigon" -> OK

        LocalDate today = LocalDate.now(zone);            // Hôm nay theo user timezone

        // 4. Lấy progress trong range
        List<HabitProgress> progresses = repository
                .findByHabitIdAndDateBetween(habitId, from, to);

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

            // AFTER END
            if (habit.getEndDate() != null && d.isAfter(habit.getEndDate())) {
                dto.setStatus("OFF");
                days.add(dto);
                d = d.plusDays(1);
                continue;
            }

            // NGÀY TƯƠNG LAI: disable grid để không clickable
            if (d.isAfter(today)) {
                dto.setStatus("NONE"); 
                days.add(dto);
                d = d.plusDays(1);
                continue;
            }

            // ACTIVE or OFF theo repeat rule
            boolean active = habitClient.isActiveDay(habitId, d, userId);
            if (!active) {
                dto.setStatus("OFF");
                days.add(dto);
                d = d.plusDays(1);
                continue;
            }

            // Nếu có record progress
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

        // 5. Tính streak theo timezone
        int streak = streakCalculator.calculateCurrentStreak(
                habitId,
                habit.getStartDate(),
                today,  // dùng ngày today USER timezone
                date -> habitClient.isActiveDay(habitId, date, userId)
        );

        // 6. Tổng tiến trình
        BigDecimal total = repository.sumTotalProgress(habitId);

        return HabitGridResponseDTO.builder()
                .habitId(habitId)
                .from(from)
                .to(to)
                .days(days)
                .streak(streak)
                .totalProgress(total)
                .build();
    }
}
