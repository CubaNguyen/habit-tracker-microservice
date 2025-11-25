package com.cuba.microservices.progress_service.infrastructure.messaging;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.cuba.microservices.progress_service.application.dto.HabitDTO;
import com.cuba.microservices.progress_service.application.dto.IsActiveResponseDTO;
import com.cuba.microservices.progress_service.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HabitClient {

    private final WebClient webClient = WebClient.builder().build();

    private static final String HABIT_BASE_URL = "http://localhost:9001/api/v1/habits";

    public HabitDTO getHabit(UUID habitId, Integer userId) {

    ApiResponse<HabitDTO> response = webClient.get()
            .uri(HABIT_BASE_URL + "/" + habitId)
            .header("X-User-Id", userId.toString())
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<ApiResponse<HabitDTO>>() {})
            .block();

    return response.getData();  
}


public boolean isActiveDay(UUID habitId, LocalDate date, Integer userId) {

    ApiResponse<IsActiveResponseDTO> res = webClient.get()
            .uri(HABIT_BASE_URL + "/" + habitId + "/is-active?date=" + date)
            .header("X-User-Id", userId.toString())
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<ApiResponse<IsActiveResponseDTO>>() {})
            .block();

    return res != null
            && res.getData() != null
            && Boolean.TRUE.equals(res.getData().getActive());
}

public List<HabitDTO> getHabitsOfUser(Integer userId) {

    ApiResponse<List<HabitDTO>> res = webClient.get()
            .uri(HABIT_BASE_URL)
            .header("X-User-Id", userId.toString())
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<ApiResponse<List<HabitDTO>>>() {})
            .block();

    if (res == null || res.getData() == null) {
        return Collections.emptyList();
    }

    return res.getData();
}


}
