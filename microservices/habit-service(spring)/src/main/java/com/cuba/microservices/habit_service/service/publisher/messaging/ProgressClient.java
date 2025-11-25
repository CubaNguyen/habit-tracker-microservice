package com.cuba.microservices.habit_service.service.publisher.messaging;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProgressClient {

    private final WebClient webClient = WebClient.create("http://localhost:9011");

    public void cleanupHabit(UUID habitId, Integer userId) {
        webClient.delete()
                .uri("/api/v1/habits/" + habitId + "/cleanup")
                .header("X-User-Id", userId.toString())
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
