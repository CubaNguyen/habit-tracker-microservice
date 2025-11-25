package com.cuba.microservices.progress_service.application.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProgressOverviewDTO {
    private Integer userId;
    private LocalDate from;
    private LocalDate to;
    private List<HabitOverviewDTO> habits;
}
