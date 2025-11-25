package com.cuba.microservices.progress_service.domain.model;

import java.time.LocalDate;
import java.util.UUID;
import java.time.OffsetDateTime;
import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "habit_progress",
    uniqueConstraints = @UniqueConstraint(
        name = "ux_habit_progress_habit_date",
        columnNames = {"habit_id", "progress_date"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HabitProgress {

    @Id
    private UUID id;

    @Column(nullable = false)
    private Integer userId;
    @Column(nullable = false)
    private UUID habitId;

    @Column(name = "progress_date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProgressStatus status;

    private BigDecimal progressValue;
    private String notes;

    @Column(nullable = false)
    private OffsetDateTime createdAt;

    @Column(nullable = false)
    private OffsetDateTime updatedAt;
}
