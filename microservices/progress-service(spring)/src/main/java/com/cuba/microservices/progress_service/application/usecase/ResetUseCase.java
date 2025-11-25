package com.cuba.microservices.progress_service.application.usecase;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.application.dto.request.ResetRequestDTO;
import com.cuba.microservices.progress_service.application.dto.response.ResetResponseDTO;
import com.cuba.microservices.progress_service.domain.model.HabitProgress;
import com.cuba.microservices.progress_service.domain.repository.HabitProgressRepository;
import com.cuba.microservices.progress_service.exception.CustomException;
import com.cuba.microservices.progress_service.infrastructure.messaging.HabitClient;
import com.cuba.microservices.progress_service.infrastructure.messaging.UserClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResetUseCase {

    private final HabitClient habitClient;
    private final UserClient userClient;
    private final HabitProgressRepository repository;

    public ResetResponseDTO execute(ResetRequestDTO req, Integer userId) {

        // 1. Habit tồn tại không?
        HabitDTO habit = habitClient.getHabit(req.getHabitId(), userId);
        if (habit == null) {
            throw new CustomException("habit not found", "HABIT_NOT_FOUND");
        }

        // 2. Habit thuộc user không?
        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        // 3. Lấy timezone từ AuthService
        UserProfileDTO profile = userClient.getProfile(userId);
        String timezone = profile.getTimezone();               // "Asia/Saigon" hoặc canonical
        ZoneId zone = ZoneId.of(timezone);                     // JVM tự map alias → canonical

        // 4. Lấy today theo timezone user
        LocalDate today = LocalDate.now(zone);

        // 5. Lấy ngày request từ FE
        LocalDate date = req.getDate();

        // 6. BEFORE_START
        if (date.isBefore(habit.getStartDate())) {
            throw new CustomException("invalid date", "INVALID_DATE");
        }

        // 7. AFTER END
        if (habit.getEndDate() != null && date.isAfter(habit.getEndDate())) {
            throw new CustomException("habit ended", "ENDED");
        }

        // 8. FUTURE DATE (theo timezone user)
        if (date.isAfter(today)) {
            throw new CustomException("cannot reset future date", "FUTURE_DATE");
        }

        // 9. Xóa record nếu tồn tại
        Optional<HabitProgress> existing = repository.findByHabitIdAndDate(req.getHabitId(), date);

        existing.ifPresent(progress -> repository.delete(progress));

        // 10. Return về NONE
        return new ResetResponseDTO(
                req.getHabitId(),
                date,
                "NONE"
        );
    }
}
