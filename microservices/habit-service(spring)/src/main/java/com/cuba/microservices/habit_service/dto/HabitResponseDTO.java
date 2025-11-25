package com.cuba.microservices.habit_service.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

// @AllArgsConstructor
// @Data
// public class HabitResponseDTO {
//     private UUID habitId;
//     private Integer userId;
//     private String name;
//     private String unit;
//     private BigDecimal targetAmount;
//     private LocalDate startDate;
//     private LocalDate endDate;
//     private UUID categoryId;
//     private String categoryName;
//     private List<String> tagNames;       // Trả về tên tag cho dễ hiển thị
// }


@AllArgsConstructor
@Data
public class HabitResponseDTO {
    private UUID habitId;
    private Integer userId;
    private String name;
    private String unit;
    private BigDecimal targetAmount;
    private LocalDate startDate;
    private LocalDate endDate;

    private UUID categoryId;
    private String categoryName;

    private List<String> tagNames;

    private RepeatRuleResponseDTO repeatRule; // CHỈ SỬA CHỖ NÀY
    private List<MilestoneResponseDTO> milestones;
}

