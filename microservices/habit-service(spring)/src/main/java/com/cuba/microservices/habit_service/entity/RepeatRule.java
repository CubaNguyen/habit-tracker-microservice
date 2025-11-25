package com.cuba.microservices.habit_service.entity;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "repeat_rules")
@Data
public class RepeatRule {
	@Id
	@GeneratedValue
	private UUID id;

	@OneToOne
	@JoinColumn(name = "habit_id", nullable = false, unique = true)
	private Habit habit;

	@Enumerated(EnumType.STRING)
	private RepeatType repeatType; // daily, weekly, monthly, custom

	@Column(columnDefinition = "TEXT")
	private String repeatValue; // JSON lưu config chi tiết

	private LocalDate startDate;
	private LocalDate endDate;
}


