package com.cuba.microservices.progress_service.infrastructure.messaging;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.cuba.microservices.progress_service.application.dto.UserProfileDTO;
import com.cuba.microservices.progress_service.exception.CustomException;
import com.cuba.microservices.progress_service.util.ApiResponse;

@Service
public class UserClient {

    private final WebClient webClient;

    public UserClient() {
        this.webClient = WebClient.builder()
            .baseUrl("http://localhost:9031/api/v1/") // AUTH SERVICE URL
            .build();
    }

    public UserProfileDTO getProfile(Integer userId) {
        ApiResponse<UserProfileDTO> response =
            webClient.get()
                    .uri("/profile/internal/" + userId)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<ApiResponse<UserProfileDTO>>() {})
                    .block();

        if (response == null || response.getData() == null) {
            throw new CustomException("Cannot fetch user profile", "USER_PROFILE_ERROR");
        }

        return response.getData();
    }
}
