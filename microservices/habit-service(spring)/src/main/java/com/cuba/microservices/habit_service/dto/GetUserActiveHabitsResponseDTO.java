package com.cuba.microservices.habit_service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUserActiveHabitsResponseDTO {
    private Integer userId;
    private List<HabitSummaryDTO> habits;

    // public GetUserActiveHabitsResponseDTO(Integer userId, List<HabitSummaryDTO> habits) {
    //     this.userId = userId;
    //     this.habits = habits;
    // }
}
