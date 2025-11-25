package com.cuba.microservices.progress_service.application.usecase;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.application.dto.response.HabitSummaryDTO;
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
public class GetHabitSummaryUseCase {

    private final HabitClient habitClient;
    private final UserClient userClient;
    private final HabitProgressRepository repository;
    private final StreakCalculator streakCalculator;

    public HabitSummaryDTO execute(UUID habitId, Integer userId) {

        // 1. Validate habit
        HabitDTO habit = habitClient.getHabit(habitId, userId);
        if (habit == null) {
            throw new CustomException("Habit not found", "HABIT_NOT_FOUND");
        }

        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        // 2. Get user timezone
        UserProfileDTO profile = userClient.getProfile(userId);
        ZoneId zone = ZoneId.of(profile.getTimezone());
        LocalDate today = LocalDate.now(zone);

        // 3. Get all progress records
        List<HabitProgress> list = repository.findByHabitId(habitId);

        // 4. Total progress
        BigDecimal totalProgress = repository.sumTotalProgress(habitId);

        // 5. Count by status
        long completed = list.stream().filter(p -> p.getStatus() == ProgressStatus.COMPLETE).count();
        long skipped   = list.stream().filter(p -> p.getStatus() == ProgressStatus.SKIP).count();
        long failed    = list.stream().filter(p -> p.getStatus() == ProgressStatus.FAIL).count();

        // 6. Calculate current streak (timezone-aware)
        int streak = streakCalculator.calculateCurrentStreak(
                habitId,
                habit.getStartDate(),
                today,
                date -> habitClient.isActiveDay(habitId, date, userId)
        );

        // 7. Calculate longest streak (timezone-aware)
        LocalDate endDate = habit.getEndDate() != null ? habit.getEndDate() : today;

        int longestStreak = streakCalculator.calculateLongestStreak(
                habitId,
                habit.getStartDate(),
                endDate,
                date -> habitClient.isActiveDay(habitId, date, userId)
        );

        // 8. Count total active days (timezone-aware)
        int activeDays = calculateActiveDays(habit, userId, zone);

        return HabitSummaryDTO.builder()
                .habitId(habitId)
                .totalProgress(totalProgress)
                .streak(streak)
                .longestStreak(longestStreak)
                .completedDays((int) completed)
                .skippedDays((int) skipped)
                .failedDays((int) failed)
                .activeDays(activeDays)
                .build();
    }

    private int calculateActiveDays(HabitDTO habit, Integer userId, ZoneId zone) {
        LocalDate start = habit.getStartDate();
        LocalDate end = habit.getEndDate() != null ? habit.getEndDate() : LocalDate.now(zone);

        int count = 0;
        LocalDate d = start;

        while (!d.isAfter(end)) {
            if (habitClient.isActiveDay(habit.getHabitId(), d, userId)) {
                count++;
            }
            d = d.plusDays(1);
        }

        return count;
    }
}
