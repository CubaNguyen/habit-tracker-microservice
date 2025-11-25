package com.cuba.microservices.habit_service.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cuba.microservices.habit_service.dto.ApiResponse;
import com.cuba.microservices.habit_service.dto.GetUserActiveHabitsResponseDTO;
import com.cuba.microservices.habit_service.dto.HabitRequestDTO;
import com.cuba.microservices.habit_service.dto.HabitResponseDTO;
import com.cuba.microservices.habit_service.dto.IsActiveResponseDTO;
import com.cuba.microservices.habit_service.service.HabitService;
@RestController
@RequestMapping("/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    // ✅ Tạo habit — nhận userId từ header
    @PostMapping
    public ResponseEntity<ApiResponse<HabitResponseDTO>> createHabit(
            @RequestHeader("X-User-Id") Integer userId,  // 🧠 lấy từ header do Gateway truyền xuống
            @RequestBody HabitRequestDTO request) {

        System.out.println("[HabitController] 👤 User ID from header: " + userId);
        HabitResponseDTO created = habitService.createHabit(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Habit created successfully", created));
    }

    // ✅ Lấy tất cả habit của user hiện tại
@GetMapping
public ResponseEntity<ApiResponse<List<HabitResponseDTO>>> getHabits(
        @RequestHeader("X-User-Id") Integer userId,
        @RequestParam(value = "date", required = false) String dateStr
) {

    if (dateStr == null) {
        // mặc định return tất cả habits không lọc
        List<HabitResponseDTO> habits = habitService.getAllHabitsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Fetched habits", habits));
    }

    LocalDate date = LocalDate.parse(dateStr);

    List<HabitResponseDTO> habits = habitService.getHabitsForDate(userId, date);

    return ResponseEntity.ok(ApiResponse.success("Fetched habits for date", habits));
}


    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HabitResponseDTO>> updateHabit(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") Integer userId,  // vẫn nên nhận header để xác thực đúng người
            @RequestBody HabitRequestDTO request) {

        HabitResponseDTO updated = habitService.updateHabit(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success("Habit updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHabit(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") Integer userId) {

        habitService.deleteHabit(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Habit deleted successfully", null));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HabitResponseDTO>> getHabitById(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") Integer userId
    ) {
        HabitResponseDTO habit = habitService.getHabitByIdAndUser(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Fetched habit successfully", habit));
    }

    @GetMapping("/{habitId}/is-active")
public ResponseEntity<ApiResponse<IsActiveResponseDTO>> isActive(
        @PathVariable UUID habitId,
        @RequestParam("date") String date,
@RequestHeader(value = "X-User-Id", required = true) Integer userId) {
    IsActiveResponseDTO data = habitService.checkActiveDay(habitId, userId, date);
    return ResponseEntity.ok(ApiResponse.success("Check active success", data));
}

@GetMapping("/users/me/active")
public ResponseEntity<ApiResponse<GetUserActiveHabitsResponseDTO>> getActiveHabits(
        @RequestHeader(value = "X-User-Id", required = true) Integer userId
) {
    GetUserActiveHabitsResponseDTO data = habitService.getActiveHabits(userId);
    return ResponseEntity.ok(ApiResponse.success("Get active habits success", data));
}

}
