package com.cuba.microservices.progress_service.application.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class HabitDTO {
    private UUID habitId;
    private Integer userId;
    private String name;
    private String unit;
    private BigDecimal targetAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private RepeatRuleDTO repeatRule;
}
