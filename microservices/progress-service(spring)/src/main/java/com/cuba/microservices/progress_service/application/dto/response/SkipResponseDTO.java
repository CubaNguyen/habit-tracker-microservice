package com.cuba.microservices.progress_service.application.dto.response;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SkipResponseDTO {
    private UUID habitId;
    private LocalDate date;
    private String status;  // SKIP
    private Integer streak;
}
