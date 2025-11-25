package com.cuba.microservices.progress_service.application.dto.response;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FailResponseDTO {
    private UUID habitId;
    private LocalDate date;
    private String status;     // FAIL
    private Integer streak;    // = 0
}
