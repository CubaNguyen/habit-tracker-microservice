package com.cuba.microservices.habit_service.dto;

import java.time.LocalDate;
import com.cuba.microservices.habit_service.entity.RepeatRule;
import com.cuba.microservices.habit_service.entity.RepeatType;

import lombok.Data;

@Data
public class RepeatRuleRequestDTO {
    private RepeatType repeatType;       // daily, weekly, monthly, custom
    private String repeatValue;      // JSON string
    private LocalDate startDate;
    private LocalDate endDate;

    // getters & setters
}
