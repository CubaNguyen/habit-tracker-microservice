package com.cuba.microservices.progress_service.application.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteRequestDTO {
    private UUID habitId;
    
    private LocalDate date;
    private BigDecimal progressValue;
    private String notes;
}
