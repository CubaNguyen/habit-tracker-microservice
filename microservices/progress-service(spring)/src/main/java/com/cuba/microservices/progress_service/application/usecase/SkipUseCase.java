package com.cuba.microservices.progress_service.application.usecase;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.application.dto.request.SkipRequestDTO;
import com.cuba.microservices.progress_service.application.dto.response.SkipResponseDTO;
import com.cuba.microservices.progress_service.domain.model.HabitProgress;
import com.cuba.microservices.progress_service.domain.model.ProgressStatus;
import com.cuba.microservices.progress_service.domain.repository.HabitProgressRepository;
import com.cuba.microservices.progress_service.domain.service.StreakCalculator;
import com.cuba.microservices.progress_service.exception.CustomException;
import com.cuba.microservices.progress_service.infrastructure.messaging.HabitClient;
import com.cuba.microservices.progress_service.infrastructure.messaging.UserClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkipUseCase {

    private final HabitClient habitClient;
    private final UserClient userClient;
    private final HabitProgressRepository repository;
    private final StreakCalculator streakCalculator;

    public SkipResponseDTO execute(SkipRequestDTO req, Integer userId) {

        // 1. Habit có tồn tại không?
        HabitDTO habit = habitClient.getHabit(req.getHabitId(), userId);
        if (habit == null) {
            throw new CustomException("habit not found", "HABIT_NOT_FOUND");
        }

        // 2. Habit đúng user không?
        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        // 3. Lấy TIMEZONE user từ AuthService
        UserProfileDTO profile = userClient.getProfile(userId);
        ZoneId zone = ZoneId.of(profile.getTimezone()); // "Asia/Saigon" vẫn OK

        // === IMPORTANT: Today theo TIMEZONE user ===
        LocalDate today = LocalDate.now(zone);

        LocalDate date = req.getDate();

        // 4. BEFORE_START
        if (date.isBefore(habit.getStartDate())) {
            throw new CustomException("invalid date", "INVALID_DATE");
        }

        // 5. AFTER END
        if (habit.getEndDate() != null && date.isAfter(habit.getEndDate())) {
            throw new CustomException("habit ended", "ENDED");
        }

        // 6. FUTURE DATE (theo timezone user)
        if (date.isAfter(today)) {
            throw new CustomException("cannot skip future date", "FUTURE_DATE");
        }

        // 7. Kiểm tra OFF (ngày không thuộc repeat rule)
        boolean active = habitClient.isActiveDay(req.getHabitId(), date, userId);
        if (!active) {
            throw new CustomException("day off", "DAY_OFF");
        }

        // 8. Upsert SKIP
        HabitProgress record = repository
            .findByHabitIdAndDate(req.getHabitId(), date)
            .orElseGet(() -> {
                HabitProgress p = new HabitProgress();
                p.setId(UUID.randomUUID());
                p.setUserId(userId);
                p.setHabitId(req.getHabitId());
                p.setDate(date); // DATE theo timezone user
                p.setCreatedAt(OffsetDateTime.now()); // UTC
                return p;
            });

        record.setStatus(ProgressStatus.SKIP);
        record.setProgressValue(null);
        record.setNotes(req.getNotes());
        record.setUpdatedAt(OffsetDateTime.now()); // UTC

        repository.save(record);

        // 9. Tính streak đúng TIMEZONE user
        int streak = streakCalculator.calculateCurrentStreak(
                habit.getHabitId(),
                habit.getStartDate(),
                today, // MUST USE TODAY IN USER TIMEZONE
                d -> habitClient.isActiveDay(habit.getHabitId(), d, userId)
        );

        // 10. Return chuẩn
        return new SkipResponseDTO(
                req.getHabitId(),
                date,
                "SKIP",
                streak
        );
    }
}
