package com.cuba.microservices.habit_service.service;

import com.cuba.microservices.habit_service.dto.RepeatRuleRequestDTO;
import com.cuba.microservices.habit_service.dto.RepeatRuleResponseDTO;
import com.cuba.microservices.habit_service.dto.RepeatRuleSummaryDTO;
import com.cuba.microservices.habit_service.entity.Habit;
import com.cuba.microservices.habit_service.entity.RepeatRule;
import com.cuba.microservices.habit_service.entity.RepeatType;
import com.cuba.microservices.habit_service.exception.CustomException;
import com.cuba.microservices.habit_service.repository.HabitRepository;
import com.cuba.microservices.habit_service.repository.RepeatRuleRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@Transactional
public class RepeatRuleService {

    private final RepeatRuleRepository repeatRuleRepository;
    private final HabitRepository habitRepository;
private final ObjectMapper objectMapper = new ObjectMapper();

    public RepeatRuleService(RepeatRuleRepository repeatRuleRepository, HabitRepository habitRepository) {
        this.repeatRuleRepository = repeatRuleRepository;
        this.habitRepository = habitRepository;
    }

    public RepeatRuleResponseDTO createRepeatRule(UUID habitId, RepeatRuleRequestDTO request, String userId) {
        System.out.println("✅ [RepeatRuleService] User " + userId + " is creating repeat rule for habit " + habitId);

        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new CustomException("Habit not found", "HABIT_NOT_FOUND"));

        // Sau này ông có thể check: habit.getUserId().equals(userId)

        if (repeatRuleRepository.existsByHabitHabitId(habitId)) {
            throw new CustomException("Repeat rule already exists for this habit", "REPEAT_RULE_EXISTS");
        }

        RepeatRule rule = new RepeatRule();
        rule.setHabit(habit);
        rule.setRepeatType(request.getRepeatType());
        rule.setRepeatValue(request.getRepeatValue());
        rule.setStartDate(request.getStartDate());
        rule.setEndDate(request.getEndDate());

        RepeatRule saved = repeatRuleRepository.save(rule);
        return mapToResponse(saved);
    }

    public RepeatRuleResponseDTO getRepeatRuleByHabitId(UUID habitId, String userId) {
        System.out.println("✅ [RepeatRuleService] User " + userId + " is fetching repeat rule of habit " + habitId);

        RepeatRule rule = repeatRuleRepository.findByHabit_HabitId(habitId)
                .orElseThrow(() -> new CustomException("Repeat rule not found", "REPEAT_RULE_NOT_FOUND"));

        return mapToResponse(rule);
    }

    public RepeatRuleResponseDTO updateRepeatRule(UUID habitId, RepeatRuleRequestDTO request, String userId) {
        System.out.println("✅ [RepeatRuleService] User " + userId + " is updating repeat rule of habit " + habitId);

        RepeatRule rule = repeatRuleRepository.findByHabit_HabitId(habitId)
                .orElseThrow(() -> new CustomException("Repeat rule not found", "REPEAT_RULE_NOT_FOUND"));

        rule.setRepeatType(request.getRepeatType());
        rule.setRepeatValue(request.getRepeatValue());
        rule.setStartDate(request.getStartDate());
        rule.setEndDate(request.getEndDate());

        RepeatRule updated = repeatRuleRepository.save(rule);
        return mapToResponse(updated);
    }

    public void deleteRepeatRule(UUID habitId, String userId) {
        System.out.println("✅ [RepeatRuleService] User " + userId + " is deleting repeat rule of habit " + habitId);

        RepeatRule rule = repeatRuleRepository.findByHabit_HabitId(habitId)
                .orElseThrow(() -> new CustomException("Repeat rule not found", "REPEAT_RULE_NOT_FOUND"));
        repeatRuleRepository.delete(rule);
    }

    private RepeatRuleResponseDTO mapToResponse(RepeatRule rule) {
        return new RepeatRuleResponseDTO(
                rule.getId(),
                rule.getHabit().getHabitId(),
                rule.getRepeatType(),
                rule.getRepeatValue(),
                rule.getStartDate(),
                rule.getEndDate()
        );
    }





    public boolean isActiveDay(Habit habit, LocalDate date) {

        RepeatRule rule = habit.getRepeatRule();
        if (rule == null || rule.getRepeatType() == null) {
            return false;
        }

        RepeatType type = rule.getRepeatType();   // ENUM
        String value = rule.getRepeatValue();     // JSON

        switch (type) {

            case DAILY:
                return true;

            case WEEKLY:
                return isWeeklyActive(value, date);

            case MONTHLY:
                return isMonthlyActive(value, date);

            case CUSTOM:
                return isCustomActive(value, habit.getStartDate(), date);

            default:
                return false;
        }
    }

    // WEEKLY
    private boolean isWeeklyActive(String repeatValue, LocalDate date) {
        try {
            JsonNode node = objectMapper.readTree(repeatValue);
            List<String> days = new ArrayList<>();
            node.get("days").forEach(d -> days.add(d.asText())); // ["Mon","Tue"]

            String today = date.getDayOfWeek()
                .getDisplayName(TextStyle.SHORT, Locale.ENGLISH); // "Thu"


            return days.contains(today);
        } catch (Exception e) {
            return false;
        }
    }

    // MONTHLY
    private boolean isMonthlyActive(String repeatValue, LocalDate date) {
        try {
            JsonNode node = objectMapper.readTree(repeatValue);
            int today = date.getDayOfMonth();

            for (JsonNode n : node.get("dates")) {
                if (n.asInt() == today) {
                    return true;
                }
            }
            return false;

        } catch (Exception e) {
            return false;
        }
    }

    // CUSTOM – cycle
    private boolean isCustomActive(String repeatValue, LocalDate startDate, LocalDate date) {
        try {
            JsonNode node = objectMapper.readTree(repeatValue);
            JsonNode cycle = node.get("cycle"); // [1,1,1,0,0]

            int diff = (int) ChronoUnit.DAYS.between(startDate, date);
            int index = diff % cycle.size();

            return cycle.get(index).asInt() == 1;

        } catch (Exception e) {
            return false;
        }
    }

public RepeatRuleSummaryDTO getRepeatRuleSummary(UUID habitId) {
    RepeatRule rule = repeatRuleRepository.findByHabit_HabitId(habitId)
            .orElseThrow(() -> new CustomException("Repeat rule not found", "NOT_FOUND"));

    return new RepeatRuleSummaryDTO(
            rule.getRepeatType(),
            rule.getRepeatValue()
    );
}


}