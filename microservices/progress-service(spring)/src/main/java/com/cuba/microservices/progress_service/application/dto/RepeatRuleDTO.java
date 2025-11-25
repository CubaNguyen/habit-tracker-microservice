package com.cuba.microservices.progress_service.application.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RepeatRuleDTO {
    private UUID id;
    private UUID habitId;
    private String repeatType;
    private String repeatValue;
    private LocalDate startDate;
    private LocalDate endDate;
}
