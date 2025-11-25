package com.cuba.microservices.progress_service.application.usecase;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.application.dto.request.CompleteRequestDTO;
import com.cuba.microservices.progress_service.application.dto.response.CompleteResponseDTO;
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
public class CompleteUseCase {

    private final HabitProgressRepository repository;
    private final StreakCalculator streakCalculator;

    private final HabitClient habitClient;
    private final UserClient userClient; // ⭐ THÊM USER CLIENT ĐỂ LẤY TIMEZONE

    public CompleteResponseDTO execute(CompleteRequestDTO req, Integer userId) {

        // 1. Get habit
        HabitDTO habit = habitClient.getHabit(req.getHabitId(), userId);
        if (habit == null) {
            throw new CustomException("habit not found", "HABIT_NOT_FOUND");
        }
        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        // 2. Get timezone from AuthService ⭐ (BẮT BUỘC)
        UserProfileDTO profile = userClient.getProfile(userId);
        ZoneId zone = ZoneId.of(profile.getTimezone());  // vd: Asia/Saigon
        LocalDate today = LocalDate.now(zone);            // today theo timezone user

        // 3. Validate date
        LocalDate targetDate = req.getDate();

        if (targetDate.isAfter(today)) {
            throw new CustomException("cannot check future date", "FUTURE_DATE");
        }

        if (targetDate.isBefore(habit.getStartDate())) {
            throw new CustomException("invalid date", "INVALID_DATE");
        }

        if (!habitClient.isActiveDay(habit.getHabitId(), targetDate, userId)) {
            throw new CustomException("day off", "DAY_OFF");
        }

        // 4. UPSERT progress record
        HabitProgress entity = repository
                .findByHabitIdAndDate(req.getHabitId(), targetDate)
                .orElseGet(() -> new HabitProgress(
                        UUID.randomUUID(),
                        userId,
                        req.getHabitId(),
                        targetDate,
                        ProgressStatus.COMPLETE,
                        req.getProgressValue(),
                        req.getNotes(),
                        OffsetDateTime.now(),
                        OffsetDateTime.now()
                ));

        entity.setStatus(ProgressStatus.COMPLETE);
        entity.setProgressValue(req.getProgressValue());
        entity.setNotes(req.getNotes());
        entity.setUpdatedAt(OffsetDateTime.now());

        repository.save(entity);

        // 5. Calculate streak (theo timezone user)
        int streak = streakCalculator.calculateCurrentStreak(
                habit.getHabitId(),
                habit.getStartDate(),
                today,         // ⭐ today theo timezone
                date -> habitClient.isActiveDay(habit.getHabitId(), date, userId)
        );

        // 6. Total progress
        BigDecimal total = repository.sumTotalProgress(habit.getHabitId());

        // 7. Response
        return new CompleteResponseDTO(
                habit.getHabitId(),
                targetDate,
                "COMPLETE",
                req.getProgressValue(),
                streak,
                total
        );
    }
}
