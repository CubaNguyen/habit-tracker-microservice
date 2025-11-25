package com.cuba.microservices.progress_service.presentation.controller;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cuba.microservices.progress_service.application.dto.request.CompleteRequestDTO;
import com.cuba.microservices.progress_service.application.dto.request.FailRequestDTO;
import com.cuba.microservices.progress_service.application.dto.request.ResetRequestDTO;
import com.cuba.microservices.progress_service.application.dto.request.SkipRequestDTO;
import com.cuba.microservices.progress_service.application.dto.response.FailResponseDTO;
import com.cuba.microservices.progress_service.application.dto.response.HabitGridResponseDTO;
import com.cuba.microservices.progress_service.application.dto.response.HabitHistoryDTO;
import com.cuba.microservices.progress_service.application.dto.response.HabitSummaryDTO;
import com.cuba.microservices.progress_service.application.dto.response.ProgressOverviewDTO;
import com.cuba.microservices.progress_service.application.dto.response.ResetResponseDTO;
import com.cuba.microservices.progress_service.application.dto.response.SkipResponseDTO;
import com.cuba.microservices.progress_service.application.usecase.CleanupHabitUseCase;
import com.cuba.microservices.progress_service.application.usecase.CompleteUseCase;
import com.cuba.microservices.progress_service.application.usecase.FailUseCase;
import com.cuba.microservices.progress_service.application.usecase.GetHabitGridUseCase;
import com.cuba.microservices.progress_service.application.usecase.GetHabitHistoryUseCase;
import com.cuba.microservices.progress_service.application.usecase.GetHabitSummaryUseCase;
import com.cuba.microservices.progress_service.application.usecase.GetUserOverviewUseCase;
import com.cuba.microservices.progress_service.application.usecase.ResetUseCase;
import com.cuba.microservices.progress_service.application.usecase.SkipUseCase;
import com.cuba.microservices.progress_service.exception.CustomException;
import com.cuba.microservices.progress_service.infrastructure.messaging.UserClient;
import com.cuba.microservices.progress_service.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ProgressController {

    private final CompleteUseCase completeUseCase;
    private final SkipUseCase skipUseCase;
    private final FailUseCase failUseCase;
    private final ResetUseCase resetUseCase;
    private final GetHabitGridUseCase getHabitGridUseCase;
    private final GetUserOverviewUseCase getUserOverviewUseCase;
    private final GetHabitSummaryUseCase getHabitSummaryUseCase;
    private final GetHabitHistoryUseCase getHabitHistoryUseCase;
    private final CleanupHabitUseCase cleanupHabitUseCase;
    private final UserClient userClient;

    
    

    @PostMapping("/complete")
    public ResponseEntity<?> complete(
            @RequestBody CompleteRequestDTO request,
            // @RequestHeader("X-User-Id") Integer userId
            @RequestHeader(value = "X-User-Id") Integer userId
    ) {
        System.out.println("🚀 Calling X-User-Id from progress controller = " + userId);
        var data = completeUseCase.execute(request, userId);
    return ResponseEntity.ok(ApiResponse.success("Check-in successful", data));
    }

    @PostMapping("/skip")
    public ResponseEntity<ApiResponse<SkipResponseDTO>> skip(
            @RequestBody SkipRequestDTO request,
            @RequestHeader("X-User-Id") Integer userId
    ) {
    var data = skipUseCase.execute(request, userId); 
        return ResponseEntity.ok(ApiResponse.success("Skipped successfully", data));
    }
    @PostMapping("/fail")
    public ResponseEntity<ApiResponse<FailResponseDTO>> fail(
            @RequestBody FailRequestDTO request,
            @RequestHeader("X-User-Id") Integer userId
    ) {
        var data = failUseCase.execute(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Marked as failed", data));
    }
    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<ResetResponseDTO>> reset(
            @RequestBody ResetRequestDTO request,
            @RequestHeader("X-User-Id") Integer userId
    ) {
        ResetResponseDTO data = resetUseCase.execute(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Reset successful", data));
    }

    @GetMapping("/habits/{habitId}")
    public ResponseEntity<ApiResponse<HabitGridResponseDTO>> getHabitGrid(
            @PathVariable UUID habitId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @RequestHeader("X-User-Id") Integer userId
    ) {
        var data = getHabitGridUseCase.execute(habitId, from, to, userId);
        return ResponseEntity.ok(ApiResponse.success("Get habit grid success", data));
    }

    @GetMapping("/users/{userId}/overview")
    public ResponseEntity<ApiResponse<ProgressOverviewDTO>> getOverview(
            @PathVariable Integer userId,
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @RequestHeader("X-User-Id") Integer headerUserId
    ) {
        if (!userId.equals(headerUserId)) {
            throw new CustomException("forbidden", "FORBIDDEN");
        }

        ProgressOverviewDTO data = getUserOverviewUseCase.execute(userId, from, to);
        return ResponseEntity.ok(ApiResponse.success("Get overview success", data));
    }

    @GetMapping("/habits/{habitId}/summary")
public ResponseEntity<ApiResponse<HabitSummaryDTO>> getSummary(
        @PathVariable UUID habitId,
        @RequestHeader("X-User-Id") Integer userId) {

    var data = getHabitSummaryUseCase.execute(habitId, userId);

    return ResponseEntity.ok(ApiResponse.success("Get habit summary success", data));
}

    @GetMapping("/habits/{habitId}/history")
    public ResponseEntity<ApiResponse<HabitHistoryDTO>> getHistory(
            @PathVariable UUID habitId,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(required = false) Integer limit,
            @RequestHeader("X-User-Id") Integer userId
    ) {
        var data = getHabitHistoryUseCase.execute(habitId, from, to, limit, userId);
        return ResponseEntity.ok(ApiResponse.success("Get habit history success", data));
    }

    @DeleteMapping("/habits/{habitId}/cleanup")
    public ResponseEntity<ApiResponse<Void>> cleanupHabit(
            @PathVariable UUID habitId,
            @RequestHeader("X-User-Id") Integer userId
    ) {
        cleanupHabitUseCase.execute(habitId, userId);
        return ResponseEntity.ok(ApiResponse.success("Cleanup success", null));
    }


    @GetMapping("/test/profile")
public ResponseEntity<?> testProfile(@RequestHeader("X-User-Id") Integer userId) {
    var data = userClient.getProfile(userId);
    return ResponseEntity.ok(data);
}


}
