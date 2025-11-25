package com.cuba.microservices.habit_service.controller;

import com.cuba.microservices.habit_service.dto.ApiResponse;
import com.cuba.microservices.habit_service.dto.RepeatRuleRequestDTO;
import com.cuba.microservices.habit_service.dto.RepeatRuleResponseDTO;
import com.cuba.microservices.habit_service.service.RepeatRuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/habits/{habitId}/repeat-rule")
public class RepeatRuleController {

    private final RepeatRuleService repeatRuleService;

    public RepeatRuleController(RepeatRuleService repeatRuleService) {
        this.repeatRuleService = repeatRuleService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RepeatRuleResponseDTO>> createRepeatRule(
            @PathVariable UUID habitId,
            @RequestBody RepeatRuleRequestDTO request,
            @RequestHeader("X-User-Id") String userId   // ⭐️ thêm duy nhất dòng này
    ) {
        System.out.println("👉 UserId = " + userId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Repeat rule created successfully",
                        repeatRuleService.createRepeatRule(habitId, request, userId)
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<RepeatRuleResponseDTO>> getRepeatRule(
            @PathVariable UUID habitId,
            @RequestHeader("X-User-Id") String userId   // ⭐️ thêm đúng dòng này
    ) {
        System.out.println("👉 UserId = " + userId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Fetched repeat rule successfully",
                        repeatRuleService.getRepeatRuleByHabitId(habitId, userId)
                )
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<RepeatRuleResponseDTO>> updateRepeatRule(
            @PathVariable UUID habitId,
            @RequestBody RepeatRuleRequestDTO request,
            @RequestHeader("X-User-Id") String userId   // ⭐️ chỉ cần dòng này
    ) {
        System.out.println("👉 UserId = " + userId);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Repeat rule updated successfully",
                        repeatRuleService.updateRepeatRule(habitId, request, userId)
                )
        );
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> deleteRepeatRule(
            @PathVariable UUID habitId,
            @RequestHeader("X-User-Id") String userId   // ⭐️ dòng này là xong
    ) {
        System.out.println("👉 UserId = " + userId);
        repeatRuleService.deleteRepeatRule(habitId, userId);
        return ResponseEntity.ok(ApiResponse.success("Repeat rule deleted successfully", null));
    }
}
