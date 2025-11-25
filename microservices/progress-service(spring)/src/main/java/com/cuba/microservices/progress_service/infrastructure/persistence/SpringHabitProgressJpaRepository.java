package com.cuba.microservices.progress_service.infrastructure.persistence;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cuba.microservices.progress_service.domain.model.HabitProgress;

@Repository
public interface SpringHabitProgressJpaRepository extends JpaRepository<HabitProgress, UUID> {

    Optional<HabitProgress> findByHabitIdAndDate(UUID habitId, LocalDate date);

    List<HabitProgress> findByUserIdAndDateBetween(Integer userId, LocalDate from, LocalDate to);

    List<HabitProgress> findByHabitIdAndDateBetween(UUID habitId, LocalDate from, LocalDate to);

@Query("""
    SELECT COALESCE(SUM(p.progressValue), 0)
    FROM HabitProgress p
    WHERE p.habitId = :habitId
      AND p.status = com.cuba.microservices.progress_service.domain.model.ProgressStatus.COMPLETE
""")
    BigDecimal sumTotalProgress(UUID habitId);

    List<HabitProgress> findByHabitId(UUID habitId);

    List<HabitProgress> findByHabitIdOrderByDateDesc(UUID habitId);

    List<HabitProgress> findByHabitIdAndDateBetweenOrderByDateDesc(
            UUID habitId, LocalDate from, LocalDate to
    );

    @Query(
            value = "SELECT * FROM habit_progress " +
                    "WHERE habit_id = :habitId " +
                    "ORDER BY progress_date DESC " +
                    "LIMIT :limit",
            nativeQuery = true
    )
    List<HabitProgress> findTopNByHabitIdOrderByDateDesc(
            @Param("habitId") UUID habitId,
            @Param("limit") Integer limit
    );

    void deleteByHabitId(UUID habitId);


}
