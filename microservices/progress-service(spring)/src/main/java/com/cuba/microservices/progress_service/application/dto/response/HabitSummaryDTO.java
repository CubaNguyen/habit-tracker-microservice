package com.cuba.microservices.progress_service.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HabitSummaryDTO {
    private UUID habitId;
    private BigDecimal totalProgress;
    private Integer streak;
    private Integer longestStreak;
    private Integer completedDays;
    private Integer skippedDays;
    private Integer failedDays;
    private Integer activeDays;   // (Optional) Useful for milestone % progress
}
