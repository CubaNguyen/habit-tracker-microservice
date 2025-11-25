package com.cuba.microservices.progress_service.application.dto.response;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResetResponseDTO {
    private UUID habitId;
    private LocalDate date;
    private String status; // ALWAYS "NONE"
}
