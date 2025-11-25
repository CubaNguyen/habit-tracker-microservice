package com.cuba.microservices.habit_service.service;

import com.cuba.microservices.habit_service.dto.MilestoneRequestDTO;
import com.cuba.microservices.habit_service.dto.MilestoneResponseDTO;
import com.cuba.microservices.habit_service.entity.Habit;
import com.cuba.microservices.habit_service.entity.Milestone;
import com.cuba.microservices.habit_service.exception.CustomException;
import com.cuba.microservices.habit_service.repository.HabitRepository;
import com.cuba.microservices.habit_service.repository.MilestoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final HabitRepository habitRepository;

    public MilestoneService(MilestoneRepository milestoneRepository, HabitRepository habitRepository) {
        this.milestoneRepository = milestoneRepository;
        this.habitRepository = habitRepository;
    }

    public MilestoneResponseDTO createMilestone(UUID habitId, MilestoneRequestDTO request, String userId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new CustomException("Habit not found", "HABIT_NOT_FOUND"));

        // 🧠 Nếu muốn log user nào đang tạo milestone
        System.out.println("✅ [MilestoneService] User " + userId + " is creating milestone for habit " + habitId);

        Milestone milestone = new Milestone();
        milestone.setHabit(habit);
        milestone.setName(request.getName());
        milestone.setTargetAmount(request.getTargetAmount());
        milestone.setOrderIndex(request.getOrderIndex());

        Milestone saved = milestoneRepository.save(milestone);
        return mapToResponse(saved);
    }
    public List<MilestoneResponseDTO> createMilestones(UUID habitId, List<MilestoneRequestDTO> requests, String userId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new CustomException("Habit not found", "HABIT_NOT_FOUND"));

        System.out.println("✅ [MilestoneService] User " + userId + " creating " + requests.size() + " milestones for habit " + habitId);

        List<Milestone> milestones = requests.stream().map(req -> {
            Milestone m = new Milestone();
            m.setHabit(habit);
            m.setName(req.getName());
            m.setTargetAmount(req.getTargetAmount());
            m.setOrderIndex(req.getOrderIndex());
            return m;
        }).toList();

        List<Milestone> saved = milestoneRepository.saveAll(milestones);
        return saved.stream().map(this::mapToResponse).toList();
    }


    public List<MilestoneResponseDTO> getMilestonesByHabit(UUID habitId) {
        if (!habitRepository.existsById(habitId)) {
            throw new CustomException("Habit not found", "HABIT_NOT_FOUND");
        }
        return milestoneRepository.findByHabit_HabitId(habitId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MilestoneResponseDTO getMilestoneById(UUID id) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new CustomException("Milestone not found", "MILESTONE_NOT_FOUND"));
        return mapToResponse(milestone);
    }

    public MilestoneResponseDTO updateMilestone(UUID id, MilestoneRequestDTO request) {
        Milestone milestone = milestoneRepository.findById(id)
                .orElseThrow(() -> new CustomException("Milestone not found", "MILESTONE_NOT_FOUND"));

        milestone.setName(request.getName());
        milestone.setTargetAmount(request.getTargetAmount());
        milestone.setOrderIndex(request.getOrderIndex());

        Milestone updated = milestoneRepository.save(milestone);
        return mapToResponse(updated);
    }

    public void deleteMilestone(UUID id) {
        if (!milestoneRepository.existsById(id)) {
            throw new CustomException("Milestone not found", "MILESTONE_NOT_FOUND");
        }
        milestoneRepository.deleteById(id);
    }

    private MilestoneResponseDTO mapToResponse(Milestone milestone) {
        return new MilestoneResponseDTO(
                milestone.getMilestoneId(),
                milestone.getHabit().getHabitId(),
                milestone.getName(),
                milestone.getTargetAmount(),
                milestone.getOrderIndex()
        );
    }
}
