package com.cuba.microservices.habit_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cuba.microservices.habit_service.entity.Habit;

public interface HabitRepository extends JpaRepository<Habit, UUID> {
    List<Habit> findAllByUserId(Integer userId);
}
