package com.cuba.microservices.progress_service.application.usecase;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.domain.repository.HabitProgressRepository;
import com.cuba.microservices.progress_service.exception.CustomException;
import com.cuba.microservices.progress_service.infrastructure.messaging.HabitClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CleanupHabitUseCase {

    private final HabitClient habitClient;
    private final HabitProgressRepository repository;

    public void execute(UUID habitId, Integer userId) {

        // 1. Kiểm tra habit còn tồn tại không?
        // Nếu Habit Service đã xoá -> getHabit() trả null
        HabitDTO habit = habitClient.getHabit(habitId, userId);

        if (habit != null && !habit.getUserId().equals(userId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        // 2. Xóa toàn bộ progress của habit
        repository.deleteByHabitId(habitId);
    }
}
