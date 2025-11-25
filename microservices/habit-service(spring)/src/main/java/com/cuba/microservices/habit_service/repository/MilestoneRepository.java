package com.cuba.microservices.habit_service.repository;

import com.cuba.microservices.habit_service.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {
    List<Milestone> findByHabit_HabitId(UUID habitId);
}
