package com.cuba.microservices.progress_service.infrastructure.persistence;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.cuba.microservices.progress_service.domain.model.HabitProgress;
import com.cuba.microservices.progress_service.domain.repository.HabitProgressRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class HabitProgressJpaRepository implements HabitProgressRepository {

    private final SpringHabitProgressJpaRepository jpa;

    @Override
    public Optional<HabitProgress> findByHabitIdAndDate(UUID habitId, LocalDate date) {
        return jpa.findByHabitIdAndDate(habitId, date);
    }

    @Override
    public List<HabitProgress> findByUserIdAndDateBetween(Integer userId, LocalDate from, LocalDate to) {
        return jpa.findByUserIdAndDateBetween(userId, from, to);
    }


    @Override
    public List<HabitProgress> findByHabitIdAndDateBetween(UUID habitId, LocalDate from, LocalDate to) {
        return jpa.findByHabitIdAndDateBetween(habitId, from, to);
    }

    @Override
    public HabitProgress save(HabitProgress progress) {
        return jpa.save(progress);
    }

    @Override
    public void delete(HabitProgress progress) {
        jpa.delete(progress);
    }

    @Override
    public BigDecimal sumTotalProgress(UUID habitId) {
        return jpa.sumTotalProgress(habitId);
    }

     @Override
    public List<HabitProgress> findByHabitId(UUID habitId) {
        return jpa.findByHabitId(habitId);
              
    }

    @Override
    public List<HabitProgress> findByHabitIdOrderByDateDesc(UUID habitId) {
        return jpa.findByHabitIdOrderByDateDesc(habitId);
    }

    @Override
    public List<HabitProgress> findByHabitIdAndDateBetweenOrderByDateDesc(
            UUID habitId, LocalDate from, LocalDate to
    ) {
        return jpa.findByHabitIdAndDateBetweenOrderByDateDesc(habitId, from, to);
    }

    @Override
    public List<HabitProgress> findTopNByHabitIdOrderByDateDesc(UUID habitId, Integer limit) {
        return jpa.findTopNByHabitIdOrderByDateDesc(habitId, limit);
    }

    @Override
    public void deleteByHabitId(UUID habitId) {
        jpa.deleteByHabitId(habitId);
    }

}



