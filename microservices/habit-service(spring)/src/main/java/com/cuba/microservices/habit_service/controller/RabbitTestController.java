package com.cuba.microservices.habit_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cuba.microservices.habit_service.dto.HabitEventDto;
import com.cuba.microservices.habit_service.service.publisher.HabitEventPublisher;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/test/rabbit")
@RequiredArgsConstructor
public class RabbitTestController {

    private final HabitEventPublisher habitEventPublisher;

     @PostMapping
    public ResponseEntity<?> publishEvent(@RequestBody HabitEventDto eventDto) {
        try {
            System.err.println("Publishing event to RabbitMQ: " + eventDto);
            habitEventPublisher.publishHabitUpdatedEvent(eventDto);
            return ResponseEntity.ok("✅ Event sent to RabbitMQ");
        } catch (Exception e) {
            System.err.println("Failed to send event to RabbitMQ: " + e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("❌ Error: " + e.getMessage());
        }
    }
}
