package com.cuba.microservices.progress_service.application.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HabitOverviewDTO {
    private UUID habitId;
    private Integer streak;
    private BigDecimal totalProgress;
    private List<DayProgressDTO> days;
}
