package com.goaltracker.service;

import com.goaltracker.dto.GoalDto;
import com.goaltracker.entity.Goal;
import com.goaltracker.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class GoalService {
    
    @Autowired
    private GoalRepository goalRepository;
    
    public List<GoalDto> getAllActiveGoals() {
        return goalRepository.findByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<GoalDto> getAllGoals() {
        return goalRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<GoalDto> getGoalById(Long id) {
        return goalRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public GoalDto createGoal(GoalDto goalDto) {
        Goal goal = convertToEntity(goalDto);
        Goal savedGoal = goalRepository.save(goal);
        return convertToDto(savedGoal);
    }
    
    public Optional<GoalDto> updateGoal(Long id, GoalDto goalDto) {
        return goalRepository.findById(id)
                .map(existingGoal -> {
                    existingGoal.setTitle(goalDto.getTitle());
                    existingGoal.setDescription(goalDto.getDescription());
                    existingGoal.setStartDate(goalDto.getStartDate());
                    existingGoal.setEndDate(goalDto.getEndDate());
                    existingGoal.setActive(goalDto.isActive());
                    Goal updatedGoal = goalRepository.save(existingGoal);
                    return convertToDto(updatedGoal);
                });
    }
    
    public boolean deleteGoal(Long id) {
        if (goalRepository.existsById(id)) {
            goalRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<GoalDto> getGoalsForDate(LocalDate date) {
        return goalRepository.findActiveGoalsForDate(date)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<GoalDto> getExpiredGoals() {
        return goalRepository.findExpiredGoals(LocalDate.now())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<GoalDto> getUpcomingGoals() {
        return goalRepository.findUpcomingGoals(LocalDate.now())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private GoalDto convertToDto(Goal goal) {
        GoalDto dto = new GoalDto();
        dto.setId(goal.getId());
        dto.setTitle(goal.getTitle());
        dto.setDescription(goal.getDescription());
        dto.setStartDate(goal.getStartDate());
        dto.setEndDate(goal.getEndDate());
        dto.setIsActive(goal.isActive());
        dto.setDaysRemaining(goal.getDaysRemaining());
        dto.setDaysCompleted(goal.getDaysCompleted());
        dto.setProgressPercentage(goal.getProgressPercentage());
        return dto;
    }
    
    private Goal convertToEntity(GoalDto dto) {
        Goal goal = new Goal();
        goal.setTitle(dto.getTitle());
        goal.setDescription(dto.getDescription());
        goal.setStartDate(dto.getStartDate());
        goal.setEndDate(dto.getEndDate());
        goal.setActive(dto.isActive());
        return goal;
    }
}
