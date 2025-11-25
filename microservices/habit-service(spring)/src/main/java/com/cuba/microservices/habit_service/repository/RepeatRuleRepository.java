package com.cuba.microservices.habit_service.repository;

import com.cuba.microservices.habit_service.entity.RepeatRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RepeatRuleRepository extends JpaRepository<RepeatRule, UUID> {
    Optional<RepeatRule> findByHabit_HabitId(UUID habitId);
    boolean existsByHabitHabitId(UUID habitId);

}
