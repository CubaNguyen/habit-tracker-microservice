package com.cuba.microservices.habit_service.dto;
import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MilestoneResponseDTO {
    private UUID milestoneId;
    private UUID habitId;
    private String name;
    private BigDecimal targetAmount;
    private Integer orderIndex;

   
}