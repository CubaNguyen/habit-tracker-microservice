package com.cuba.microservices.habit_service.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cuba.microservices.habit_service.entity.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {
	boolean existsByName(String name);
}