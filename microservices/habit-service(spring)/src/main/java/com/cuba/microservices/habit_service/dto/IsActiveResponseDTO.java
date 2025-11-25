package com.cuba.microservices.habit_service.dto;

import java.time.LocalDate;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IsActiveResponseDTO {
    private UUID habitId;
    private Integer userId;
    private LocalDate date;
    private boolean active;
}
