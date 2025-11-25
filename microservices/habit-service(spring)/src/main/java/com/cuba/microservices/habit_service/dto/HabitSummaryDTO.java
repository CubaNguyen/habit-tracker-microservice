package com.cuba.microservices.habit_service.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HabitSummaryDTO {
    private UUID habitId;
    private String name;
    private LocalDate startDate;
    private LocalDate endDate;
    private RepeatRuleSummaryDTO repeatRule;
}

