package com.cuba.microservices.progress_service.application.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Data;

@Data
public class SkipRequestDTO {
    private UUID habitId;
    private LocalDate date;
    private String notes;
}
