package com.cuba.microservices.habit_service.entity;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "milestones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Milestone {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "milestone_id", columnDefinition = "UUID")
	private UUID milestoneId;

	@ManyToOne
	@JoinColumn(name = "habit_id", nullable = false)
	private Habit habit;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "target_amount", precision = 12, scale = 2)
	private BigDecimal targetAmount;

	@Column(name = "order_index")
	private Integer orderIndex;
}
