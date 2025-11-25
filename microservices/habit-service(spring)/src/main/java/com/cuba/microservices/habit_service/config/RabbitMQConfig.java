package com.cuba.microservices.habit_service.config;


import org.springframework.amqp.core.Queue; // ✅ đúng
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {

       public static final String QUEUE_NAME = "habit_events";
    public static final String EXCHANGE_NAME = "habit_exchange";
    public static final String ROUTING_KEY = "habit.*";

    @Bean
    public Queue habitQueue() {
        return new Queue(QUEUE_NAME, true); // durable = true
    }

    @Bean
    public TopicExchange habitExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding habitBinding(Queue habitQueue, TopicExchange habitExchange) {
        return BindingBuilder.bind(habitQueue).to(habitExchange).with(ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
