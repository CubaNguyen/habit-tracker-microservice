package com.cuba.microservices.habit_service.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "categories")
@Data
public class Category {
	@Id
	@GeneratedValue
	private UUID id;

	@Column(nullable = true, unique = true)
	private String name;

	private String description;

	// Quan hệ 1-n với Habits
	@OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
	private List<Habit> habits = new ArrayList<>();
}
