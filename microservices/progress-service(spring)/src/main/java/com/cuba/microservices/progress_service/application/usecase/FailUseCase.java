package com.cuba.microservices.progress_service.application.usecase;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.application.dto.request.FailRequestDTO;
import com.cuba.microservices.progress_service.application.dto.response.FailResponseDTO;
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
public class FailUseCase {

    private final HabitClient habitClient;
    private final UserClient userClient;
    private final HabitProgressRepository repository;
    private final StreakCalculator streakCalculator;

    public FailResponseDTO execute(FailRequestDTO req, Integer userId) {

        // 1. Habit tồn tại không?
        HabitDTO habit = habitClient.getHabit(req.getHabitId(), userId);
        if (habit == null) {
            throw new CustomException("habit not found", "HABIT_NOT_FOUND");
        }

        // 2. Thuộc user?
        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        // 3. Lấy timezone người dùng
        UserProfileDTO profile = userClient.getProfile(userId);
        ZoneId zone = ZoneId.of(profile.getTimezone());
        LocalDate today = LocalDate.now(zone); // Today theo đúng timezone user

        LocalDate date = req.getDate(); // FE gửi theo user-local date

        // 4. BEFORE_START
        if (date.isBefore(habit.getStartDate())) {
            throw new CustomException("invalid date", "INVALID_DATE");
        }

        // 5. AFTER_END
        if (habit.getEndDate() != null && date.isAfter(habit.getEndDate())) {
            throw new CustomException("habit ended", "ENDED");
        }

        // 6. FUTURE_DATE theo timezone user
        if (date.isAfter(today)) {
            throw new CustomException("cannot fail future date", "FUTURE_DATE");
        }

        // 7. OFF (không active)
        boolean active = habitClient.isActiveDay(req.getHabitId(), date, userId);
        if (!active) {
            throw new CustomException("day off", "DAY_OFF");
        }

        // 8. Upsert FAIL
        HabitProgress record = repository
                .findByHabitIdAndDate(req.getHabitId(), date)
                .orElseGet(() -> {
                    HabitProgress p = new HabitProgress();
                    p.setId(UUID.randomUUID());
                    p.setUserId(userId);
                    p.setHabitId(req.getHabitId());
                    p.setDate(date);
                    p.setCreatedAt(OffsetDateTime.now());
                    return p;
                });

        record.setStatus(ProgressStatus.FAIL);
        record.setProgressValue(null);
        record.setNotes(req.getNotes());
        record.setUpdatedAt(OffsetDateTime.now());

        repository.save(record);

        // 9. FAIL → streak reset về 0
        int streak = 0;

        return new FailResponseDTO(
                req.getHabitId(),
                date,
                "FAIL",
                streak
        );
    }
}
