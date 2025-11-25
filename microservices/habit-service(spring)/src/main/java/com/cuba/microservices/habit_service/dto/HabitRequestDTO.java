package com.cuba.microservices.habit_service.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class HabitRequestDTO {
    private Integer userId;              // User ID từ Auth Service
    private String name;                 // Tên habit
    private String unit;                 // Đơn vị đo (km, lần,...)
    private BigDecimal targetAmount;     // Mục tiêu
    private LocalDate startDate;
    private LocalDate endDate;
    private UUID categoryId;             // ID category
    private List<UUID> tagIds;           // Danh sách tag để gắn khi tạo
}
