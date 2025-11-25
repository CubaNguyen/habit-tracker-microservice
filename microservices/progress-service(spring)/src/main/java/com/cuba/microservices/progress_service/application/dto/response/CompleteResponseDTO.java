package com.cuba.microservices.progress_service.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CompleteResponseDTO {
    private UUID habitId;
    private LocalDate date;
    private String status;
    private BigDecimal progressValue;
    private int streak;
    private BigDecimal totalProgress;
}
