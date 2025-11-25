package com.cuba.microservices.habit_service.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.cuba.microservices.habit_service.entity.RepeatType;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RepeatRuleResponseDTO {
    private UUID id;
    private UUID habitId;
    private RepeatType repeatType;
    private String repeatValue;
    private LocalDate startDate;
    private LocalDate endDate;

   
}
