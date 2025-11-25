package com.cuba.microservices.progress_service.application.usecase;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.application.dto.response.HabitHistoryDTO;
import com.cuba.microservices.progress_service.application.dto.response.HistoryItemDTO;
import com.cuba.microservices.progress_service.domain.model.HabitProgress;
import com.cuba.microservices.progress_service.domain.repository.HabitProgressRepository;
import com.cuba.microservices.progress_service.exception.CustomException;
import com.cuba.microservices.progress_service.infrastructure.messaging.HabitClient;
import com.cuba.microservices.progress_service.infrastructure.messaging.UserClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetHabitHistoryUseCase {

    private final HabitClient habitClient;
    private final HabitProgressRepository repository;
    private final UserClient userClient; // ⬅️ ADD timezone client

    public HabitHistoryDTO execute(
            UUID habitId,
            LocalDate from,
            LocalDate to,
            Integer limit,
            Integer userId
    ) {

        // 1. HABIT VALIDATION
        HabitDTO habit = habitClient.getHabit(habitId, userId);
        if (habit == null) {
            throw new CustomException("habit not found", "HABIT_NOT_FOUND");
        }

        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        // 2. GET USER TIMEZONE
        UserProfileDTO profile = userClient.getProfile(userId);
        ZoneId zone = ZoneId.of(profile.getTimezone());

        // today theo timezone của user
        LocalDate today = LocalDate.now(zone);

        // 3. NORMALIZE RANGE (nếu FE gửi future)
        if (from != null && from.isAfter(today)) {
            from = today;
        }

        if (to != null && to.isAfter(today)) {
            to = today;
        }

        List<HabitProgress> records;

        // 4. QUERY LOGIC
        if (limit != null) {
            // newest N records
            records = repository.findTopNByHabitIdOrderByDateDesc(habitId, limit);

        } else if (from != null && to != null) {

            // RANGE SEARCH với timezone-aware ngày
            records = repository.findByHabitIdAndDateBetweenOrderByDateDesc(habitId, from, to);

        } else {

            // FULL HISTORY
            records = repository.findByHabitIdOrderByDateDesc(habitId);
        }

        // 5. CONVERT RECORDS → DTO
        List<HistoryItemDTO> history = records.stream()
                .map(p -> HistoryItemDTO.builder()
                        .date(p.getDate())
                        .status(p.getStatus().name())
                        .progressValue(p.getProgressValue())
                        .notes(p.getNotes())
                        .build())
                .toList();

        return HabitHistoryDTO.builder()
                .habitId(habitId)
                .history(history)
                .build();
    }
}
