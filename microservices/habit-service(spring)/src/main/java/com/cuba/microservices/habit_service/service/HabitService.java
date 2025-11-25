package com.cuba.microservices.habit_service.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cuba.microservices.habit_service.dto.GetUserActiveHabitsResponseDTO;
import com.cuba.microservices.habit_service.dto.HabitRequestDTO;
import com.cuba.microservices.habit_service.dto.HabitResponseDTO;
import com.cuba.microservices.habit_service.dto.HabitSummaryDTO;
import com.cuba.microservices.habit_service.dto.IsActiveResponseDTO;
import com.cuba.microservices.habit_service.dto.MilestoneResponseDTO;
import com.cuba.microservices.habit_service.dto.RepeatRuleResponseDTO;
import com.cuba.microservices.habit_service.entity.Category;
import com.cuba.microservices.habit_service.entity.Habit;
import com.cuba.microservices.habit_service.entity.Milestone;
import com.cuba.microservices.habit_service.entity.RepeatRule;
import com.cuba.microservices.habit_service.entity.RepeatType;
import com.cuba.microservices.habit_service.entity.Tag;
import com.cuba.microservices.habit_service.exception.CustomException;
import com.cuba.microservices.habit_service.repository.CategoryRepository;
import com.cuba.microservices.habit_service.repository.HabitRepository;
import com.cuba.microservices.habit_service.repository.TagRepository;
import com.cuba.microservices.habit_service.service.publisher.messaging.ProgressClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@Transactional
public class HabitService {

    private final HabitRepository habitRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final RepeatRuleService repeatRuleService;
    private final ProgressClient progressClient;

    

    public HabitService(HabitRepository habitRepository, CategoryRepository categoryRepository, TagRepository tagRepository,  RepeatRuleService repeatRuleService  ,ProgressClient progressClient   // 👈 MISSING!
) {
        this.habitRepository = habitRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.repeatRuleService = repeatRuleService;   // 👈 ADD THIS
        this.progressClient = progressClient;
    }


         public HabitResponseDTO createHabit(Integer userId, HabitRequestDTO request) {
        System.out.println("[HabitService] 🟢 Starting createHabit for userId=" + userId);

        Habit habit = new Habit();
        habit.setUserId(userId); // ✅ gắn userId lấy từ header
        habit.setName(request.getName());
        habit.setUnit(request.getUnit());
        habit.setTargetAmount(request.getTargetAmount());
        habit.setStartDate(request.getStartDate());
        habit.setEndDate(request.getEndDate());

        try {
            // xử lý category
            if (request.getCategoryId() != null) {
                Category category = categoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new CustomException("Category not found", "CATEGORY_NOT_FOUND"));
                habit.setCategory(category);
            }

            // xử lý tags
            if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
                List<Tag> tags = tagRepository.findAllById(request.getTagIds());
                habit.setTags(new HashSet<>(tags));
            }

            Habit saved = habitRepository.save(habit);
            System.out.println("[HabitService] ✅ Habit saved with ID=" + saved.getHabitId());
            return mapToResponse(saved);

        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("Unexpected error while creating habit", "INTERNAL_ERROR");
        }
    }

    // ✅ Lấy tất cả habits của 1 user
    public List<HabitResponseDTO> getAllHabitsByUserId(Integer userId) {
        System.out.println("[HabitService] 🔍 Fetching habits for userId=" + userId);
        return habitRepository.findAllByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
        // ✅ Lấy  habits theo ngày của 1 user

    public List<HabitResponseDTO> getHabitsForDate(Integer userId, LocalDate date) {
    List<Habit> habits = habitRepository.findAllByUserId(userId);

    return habits.stream()
            .filter(habit -> isHabitActiveOn(habit, date))  // lọc theo ngày
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}

  
    public HabitResponseDTO getHabitByIdAndUser(UUID habitId, Integer userId) {

    Habit habit = habitRepository.findById(habitId)
            .orElseThrow(() -> new CustomException("Habit not found", "NOT_FOUND"));

    if (!habit.getUserId().equals(userId)) {
        throw new CustomException("Habit does not belong to user", "FORBIDDEN");
    }

    return mapToResponse(habit);
    }

    // ✅ Cập nhật habit — có thể xác minh user sở hữu
    public HabitResponseDTO updateHabit(UUID id, Integer userId, HabitRequestDTO request) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new CustomException("Habit not found", "HABIT_NOT_FOUND"));

        // check habit thuộc user nào (nếu muốn)
        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("Access denied", "FORBIDDEN");
        }

        habit.setName(request.getName());
        habit.setUnit(request.getUnit());
        habit.setTargetAmount(request.getTargetAmount());
        habit.setStartDate(request.getStartDate());
        habit.setEndDate(request.getEndDate());

        Habit updated = habitRepository.save(habit);
        return mapToResponse(updated);
    }

    public void deleteHabit(UUID id, Integer userId) {
        Habit habit = habitRepository.findById(id)
                .orElseThrow(() -> new CustomException("Habit not found", "HABIT_NOT_FOUND"));
        if (!habit.getUserId().equals(userId)) {
            throw new CustomException("Access denied", "FORBIDDEN");
        }
        habitRepository.deleteById(id);

        // Gọi Progress Service cleanup
        progressClient.cleanupHabit(id, userId);

    }


    private RepeatRuleResponseDTO mapRepeatRule(RepeatRule rr) {
    return new RepeatRuleResponseDTO(
            rr.getId(),
            rr.getHabit().getHabitId(),
            rr.getRepeatType(),
            rr.getRepeatValue(),
            rr.getStartDate(),
            rr.getEndDate()
    );
    }

  private List<MilestoneResponseDTO> mapMilestones(List<Milestone> list) {
    if (list == null) return Collections.emptyList();

    return list.stream()
            .sorted(Comparator.comparing(
                    Milestone::getOrderIndex,
                    Comparator.nullsLast(Integer::compareTo)   // ⭐ CHỈNH Ở ĐÂY
            ))
            .map(m -> new MilestoneResponseDTO(
                    m.getMilestoneId(),
                    m.getHabit().getHabitId(),
                    m.getName(),
                    m.getTargetAmount(),
                    m.getOrderIndex()
            ))
            .collect(Collectors.toList());
}


private HabitResponseDTO mapToResponse(Habit habit) {

    // repeat rule (bắt buộc)
    RepeatRuleResponseDTO repeatRuleDTO = habit.getRepeatRule() != null
            ? new RepeatRuleResponseDTO(
                habit.getRepeatRule().getId(),
                habit.getHabitId(),
                habit.getRepeatRule().getRepeatType(),
                habit.getRepeatRule().getRepeatValue(),
                habit.getRepeatRule().getStartDate(),
                habit.getRepeatRule().getEndDate()
            )
            : null; // nếu ông muốn strict → throw error

    // milestones (có thể null)
    List<MilestoneResponseDTO> milestoneDTOs = habit.getMilestones() != null
            ? habit.getMilestones().stream()
                .sorted(Comparator.comparing(
                        Milestone::getOrderIndex,
                        Comparator.nullsLast(Integer::compareTo)
                ))
                .map(m -> new MilestoneResponseDTO(
                        m.getMilestoneId(),
                        habit.getHabitId(),
                        m.getName(),
                        m.getTargetAmount(),
                        m.getOrderIndex()
                ))
                .collect(Collectors.toList())
            : Collections.emptyList();

        return new HabitResponseDTO(
                habit.getHabitId(),
                habit.getUserId(),
                habit.getName(),
                habit.getUnit(),
                habit.getTargetAmount(),
                habit.getStartDate(),
                habit.getEndDate(),

                habit.getCategory() != null ? habit.getCategory().getId() : null,
                habit.getCategory() != null ? habit.getCategory().getName() : null,

                habit.getTags() != null
                        ? habit.getTags().stream().map(Tag::getName).collect(Collectors.toList())
                        : Collections.emptyList(),

                repeatRuleDTO,
                milestoneDTOs
        );
    }


public IsActiveResponseDTO checkActiveDay(UUID habitId, Integer userId, String dateStr) {

    Habit habit = habitRepository.findById(habitId)
            .orElseThrow(() -> new CustomException("Habit not found", "NOT_FOUND"));

    if (!habit.getUserId().equals(userId)) {
        throw new CustomException("Habit does not belong to user", "FORBIDDEN");
    }

    LocalDate date = LocalDate.parse(dateStr);

    boolean active = repeatRuleService.isActiveDay(habit, date);

    return new IsActiveResponseDTO(habitId, userId, date, active);
}

public GetUserActiveHabitsResponseDTO getActiveHabits(Integer userId) {

    List<Habit> habits = habitRepository.findAllByUserId(userId);

 LocalDate today = LocalDate.now();

List<HabitSummaryDTO> activeHabits = habits.stream()
    // startDate ≤ today
    .filter(h -> h.getStartDate() != null && !today.isBefore(h.getStartDate()))

    // endDate == null => không giới hạn
    .filter(h ->
         h.getEndDate() == null || !today.isAfter(h.getEndDate())
    )

    .map(h -> new HabitSummaryDTO(
            h.getHabitId(),
            h.getName(),
            h.getStartDate(),
            h.getEndDate(),
            repeatRuleService.getRepeatRuleSummary(h.getHabitId())
    ))
    .toList();



    return new GetUserActiveHabitsResponseDTO(userId, activeHabits);
}


private boolean isHabitActiveOn(Habit habit, LocalDate date) {
    try {
        RepeatRule repeatRule = habit.getRepeatRule();
        RepeatType repeatType = repeatRule.getRepeatType();
        String repeatValue = repeatRule.getRepeatValue();
        LocalDate startDate = habit.getStartDate();

        // Nếu ngày trước startDate → không active
        if (date.isBefore(startDate)) return false;

        switch (repeatType) {

            case DAILY:
                return true;

            case WEEKLY: {
                // repeatValue: {"days":["Mon","Wed","Fri"]}
                ObjectMapper objectMapper = new ObjectMapper();

                JsonNode node = objectMapper.readTree(repeatValue);
                JsonNode days = node.get("days");

                String weekday = date.getDayOfWeek().name().substring(0, 3); // MON → "Mon" nếu ông cần viết lại map

                for (JsonNode d : days) {
                    if (d.asText().equalsIgnoreCase(weekday)) {
                        return true;
                    }
                }
                return false;
            }

            case MONTHLY: {
                // repeatValue: {"dates":[5,10,20]}
                ObjectMapper objectMapper = new ObjectMapper();

                JsonNode node = objectMapper.readTree(repeatValue);
                JsonNode dates = node.get("dates");

                for (JsonNode d : dates) {
                    if (d.asInt() == date.getDayOfMonth()) {
                        return true;
                    }
                }
                return false;
            }

            case CUSTOM:
                return isCustomActive(repeatValue, startDate, date);

            default:
                return false;
        }

    } catch (Exception e) {
        System.err.println("❌ isHabitActiveOn error: " + e.getMessage());
        return false;
    }
}

private boolean isCustomActive(String repeatValue, LocalDate startDate, LocalDate date) {
    try {
        ObjectMapper objectMapper = new ObjectMapper();

        JsonNode node = objectMapper.readTree(repeatValue);
        JsonNode cycle = node.get("cycle"); // [1,1,1,0,0]

        int diff = (int) ChronoUnit.DAYS.between(startDate, date);
        if (diff < 0) return false;

        int index = diff % cycle.size();
        return cycle.get(index).asInt() == 1;

    } catch (Exception e) {
        return false;
    }
}



}
