package com.cuba.microservices.habit_service.service.publisher;

import com.cuba.microservices.habit_service.config.RabbitMQConfig;
import com.cuba.microservices.habit_service.dto.HabitEventDto;

import java.util.Map;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HabitEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishHabitUpdatedEvent(HabitEventDto event) {
        String routingKey = "habit.rule.updated";
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, routingKey, event);
        System.out.println("✅ Sent event to RabbitMQ: " + event);
    }
    public void publishRuleCreatedEvent(HabitEventDto event) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "habit.rule.created", event);
    }

    public void publishRuleDeletedEvent(String ruleId) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "habit.rule.deleted", Map.of("repeatRuleId", ruleId));
    }

}
