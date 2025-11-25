package com.cuba.microservices.habit_service.controller;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cuba.microservices.habit_service.dto.ApiResponse;
import com.cuba.microservices.habit_service.dto.MilestoneRequestDTO;
import com.cuba.microservices.habit_service.dto.MilestoneResponseDTO;
import com.cuba.microservices.habit_service.service.MilestoneService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/milestones")
public class MilestoneController {

    private final MilestoneService milestoneService;

    public MilestoneController(MilestoneService milestoneService) {
        this.milestoneService = milestoneService;
    }

    // ✅ Khi tạo milestone, đọc thêm X-User-Id từ header
    @PostMapping("/habits/{habitId}")
    public ResponseEntity<ApiResponse<?>> createMilestone(
            @PathVariable UUID habitId,
            @RequestBody Object body,
            @RequestHeader(value = "X-User-Id", required = true) String userId,
            @RequestHeader(value = "X-User-Email", required = true) String userEmail) {

        System.out.println("🔥 [MilestoneController] Request from userId=" + userId);

        if (body instanceof List<?>) {
            // Nếu frontend gửi mảng milestones
            List<LinkedHashMap<String, Object>> rawList = (List<LinkedHashMap<String, Object>>) body;
List<MilestoneRequestDTO> requests = rawList.stream()
    .map(map -> {
        String name = (String) map.get("name");
        Integer orderIndex = map.get("orderIndex") instanceof Number
                ? ((Number) map.get("orderIndex")).intValue()
                : 0;

        BigDecimal targetAmount = null;
        Object rawTarget = map.get("targetAmount");

        if (rawTarget instanceof Number) {
            targetAmount = BigDecimal.valueOf(((Number) rawTarget).doubleValue());
        } else if (rawTarget instanceof String && !((String) rawTarget).isBlank()) {
            try {
                targetAmount = new BigDecimal((String) rawTarget);
            } catch (NumberFormatException e) {
                targetAmount = null; // bỏ qua giá trị sai
            }
        }

        return new MilestoneRequestDTO(name, orderIndex, targetAmount);
    })
    .toList();


            List<MilestoneResponseDTO> created = milestoneService.createMilestones(habitId, requests, userId);
            return ResponseEntity.ok(ApiResponse.success("Multiple milestones created successfully", created));
        } else {
            // Nếu frontend gửi 1 milestone
            MilestoneRequestDTO request = new ObjectMapper().convertValue(body, MilestoneRequestDTO.class);
            MilestoneResponseDTO created = milestoneService.createMilestone(habitId, request, userId);
            return ResponseEntity.ok(ApiResponse.success("Single milestone created successfully", created));
        }
}


    @GetMapping("/habits/{habitId}")
    public ResponseEntity<ApiResponse<List<MilestoneResponseDTO>>> getMilestonesByHabit(
            @PathVariable UUID habitId) {
        List<MilestoneResponseDTO> milestones = milestoneService.getMilestonesByHabit(habitId);
        return ResponseEntity.ok(ApiResponse.success("Fetched milestones successfully", milestones));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MilestoneResponseDTO>> getMilestoneById(@PathVariable UUID id) {
        MilestoneResponseDTO milestone = milestoneService.getMilestoneById(id);
        return ResponseEntity.ok(ApiResponse.success("Fetched milestone successfully", milestone));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MilestoneResponseDTO>> updateMilestone(
            @PathVariable UUID id,
            @RequestBody MilestoneRequestDTO request) {
        MilestoneResponseDTO updated = milestoneService.updateMilestone(id, request);
        return ResponseEntity.ok(ApiResponse.success("Milestone updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMilestone(@PathVariable UUID id) {
        milestoneService.deleteMilestone(id);
        return ResponseEntity.ok(ApiResponse.success("Milestone deleted successfully", null));
    }
}