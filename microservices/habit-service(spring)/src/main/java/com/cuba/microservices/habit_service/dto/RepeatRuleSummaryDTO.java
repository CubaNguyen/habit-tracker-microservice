package com.cuba.microservices.habit_service.dto;

import com.cuba.microservices.habit_service.entity.RepeatType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RepeatRuleSummaryDTO {
    private RepeatType repeatType;
    private String repeatValue;
}
