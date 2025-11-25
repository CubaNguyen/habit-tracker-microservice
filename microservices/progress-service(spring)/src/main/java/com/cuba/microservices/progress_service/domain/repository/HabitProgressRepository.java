package com.cuba.microservices.progress_service.domain.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.cuba.microservices.progress_service.domain.model.HabitProgress;

public interface HabitProgressRepository {

    Optional<HabitProgress> findByHabitIdAndDate(UUID habitId, LocalDate date);

    List<HabitProgress> findByUserIdAndDateBetween(Integer userId, LocalDate from, LocalDate to);

    List<HabitProgress> findByHabitIdAndDateBetween(UUID habitId, LocalDate from, LocalDate to);

    HabitProgress save(HabitProgress progress);

    void delete(HabitProgress progress);

    BigDecimal sumTotalProgress(UUID habitId);

    List<HabitProgress> findByHabitId(UUID habitId);

    List<HabitProgress> findByHabitIdOrderByDateDesc(UUID habitId);

    List<HabitProgress> findByHabitIdAndDateBetweenOrderByDateDesc(UUID habitId, LocalDate from, LocalDate to);

    List<HabitProgress> findTopNByHabitIdOrderByDateDesc(UUID habitId, Integer limit);

    void deleteByHabitId(UUID habitId);


}
