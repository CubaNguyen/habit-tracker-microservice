package com.cuba.microservices.progress_service.application.dto.response;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HabitHistoryDTO {
    private UUID habitId;
    private List<HistoryItemDTO> history;
}
