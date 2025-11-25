package com.cuba.microservices.progress_service.application.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HabitGridResponseDTO {
    private UUID habitId;
    private LocalDate from;
    private LocalDate to;
    private List<DayProgressDTO> days;
    private Integer streak;
    private BigDecimal totalProgress;
}
