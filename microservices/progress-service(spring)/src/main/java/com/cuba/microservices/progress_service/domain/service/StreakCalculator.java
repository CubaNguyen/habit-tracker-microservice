package com.cuba.microservices.progress_service.domain.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.domain.model.HabitProgress;
import com.cuba.microservices.progress_service.domain.model.ProgressStatus;
import com.cuba.microservices.progress_service.domain.repository.HabitProgressRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreakCalculator {

    private final HabitProgressRepository repository;

    public int calculateCurrentStreak(UUID habitId, LocalDate startDate, LocalDate today,
                                      Predicate<LocalDate> isActiveDay) {

        int streak = 0;

        List<HabitProgress> records =
            repository.findByHabitIdAndDateBetween(habitId, startDate, today);

        Map<LocalDate, HabitProgress> map = records.stream()
                .collect(Collectors.toMap(HabitProgress::getDate, r -> r));

        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {

            if (!isActiveDay.test(date)) continue;

            HabitProgress rec = map.get(date);

            if (rec == null) {
                streak = 0;
            } else if (rec.getStatus() == ProgressStatus.COMPLETE) {
                streak++;
            } else if (rec.getStatus() == ProgressStatus.SKIP) {
                // do nothing
            } else if (rec.getStatus() == ProgressStatus.FAIL) {
                streak = 0;
            }
        }

        return streak;
    }

    public int calculateLongestStreak(UUID habitId,
                                      LocalDate startDate,
                                      LocalDate endDate,
                                      Predicate<LocalDate> isActiveDay) {

        // FIX NPE: endDate null → today
        LocalDate effectiveEnd = (endDate != null ? endDate : LocalDate.now());

        int longest = 0;
        int current = 0;

        List<HabitProgress> records =
                repository.findByHabitIdAndDateBetween(habitId, startDate, effectiveEnd);

        Map<LocalDate, HabitProgress> map = records.stream()
                .collect(Collectors.toMap(HabitProgress::getDate, r -> r));

        for (LocalDate date = startDate; !date.isAfter(effectiveEnd); date = date.plusDays(1)) {

            // OFF day → bỏ qua
            if (!isActiveDay.test(date)) continue;

            HabitProgress rec = map.get(date);

            if (rec == null) {
                // NONE → streak reset
                current = 0;
            } else if (rec.getStatus() == ProgressStatus.COMPLETE) {
                current++;
            } else if (rec.getStatus() == ProgressStatus.SKIP) {
                // SKIP vẫn tính streak (như Daily Calm, Fabulous)
                current++;
            } else if (rec.getStatus() == ProgressStatus.FAIL) {
                current = 0;
            }

            longest = Math.max(longest, current);
        }

        return longest;
    }


}