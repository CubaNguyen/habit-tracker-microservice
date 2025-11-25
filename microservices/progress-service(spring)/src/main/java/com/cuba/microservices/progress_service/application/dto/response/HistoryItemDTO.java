package com.cuba.microservices.progress_service.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HistoryItemDTO {
    private LocalDate date;
    private String status;         // COMPLETE | SKIP | FAIL
    private BigDecimal progressValue;
    private String notes;
}
