package com.cuba.microservices.habit_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HabitEventDto {
    private static final long serialVersionUID = 1L; // khuyến khích thêm
    private String habitId;
    private String repeatRuleId;
    private String repeatType;
    private Object repeatValue;
    private String startDate;
    private String timezone;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RepeatValue {
        private int interval;
    }
}
