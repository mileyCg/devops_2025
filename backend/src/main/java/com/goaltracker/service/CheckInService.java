package com.goaltracker.service;

import com.goaltracker.dto.CheckInDto;
import com.goaltracker.entity.CheckIn;
import com.goaltracker.entity.Goal;
import com.goaltracker.repository.CheckInRepository;
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
public class CheckInService {
    
    @Autowired
    private CheckInRepository checkInRepository;
    
    @Autowired
    private GoalRepository goalRepository;
    
    public List<CheckInDto> getCheckInsForGoal(Long goalId) {
        return goalRepository.findById(goalId)
                .map(goal -> checkInRepository.findByGoalOrderByCheckInDateDesc(goal)
                        .stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }
    
    public Optional<CheckInDto> getCheckInForGoalAndDate(Long goalId, LocalDate date) {
        return goalRepository.findById(goalId)
                .flatMap(goal -> checkInRepository.findCheckInForGoalAndDate(goal, date)
                        .map(this::convertToDto));
    }
    
    public CheckInDto createCheckIn(CheckInDto checkInDto) {
        Goal goal = goalRepository.findById(checkInDto.getGoalId())
                .orElseThrow(() -> new RuntimeException("Goal not found with id: " + checkInDto.getGoalId()));
        
        // Check if check-in already exists for this date
        Optional<CheckIn> existingCheckIn = checkInRepository.findCheckInForGoalAndDate(goal, checkInDto.getCheckInDate());
        if (existingCheckIn.isPresent()) {
            throw new RuntimeException("Check-in already exists for this date");
        }
        
        CheckIn checkIn = convertToEntity(checkInDto, goal);
        CheckIn savedCheckIn = checkInRepository.save(checkIn);
        return convertToDto(savedCheckIn);
    }
    
    public Optional<CheckInDto> updateCheckIn(Long id, CheckInDto checkInDto) {
        return checkInRepository.findById(id)
                .map(existingCheckIn -> {
                    existingCheckIn.setNotes(checkInDto.getNotes());
                    existingCheckIn.setMood(checkInDto.getMood());
                    CheckIn updatedCheckIn = checkInRepository.save(existingCheckIn);
                    return convertToDto(updatedCheckIn);
                });
    }
    
    public boolean deleteCheckIn(Long id) {
        if (checkInRepository.existsById(id)) {
            checkInRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<CheckInDto> getCheckInsForDateRange(Long goalId, LocalDate startDate, LocalDate endDate) {
        return goalRepository.findById(goalId)
                .map(goal -> checkInRepository.findByGoalAndCheckInDateBetween(goal, startDate, endDate)
                        .stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }
    
    public long getCheckInCountForGoal(Long goalId) {
        return goalRepository.findById(goalId)
                .map(goal -> checkInRepository.countCheckInsForGoal(goal))
                .orElse(0L);
    }
    
    public List<CheckInDto> getRecentCheckInsForGoal(Long goalId, int limit) {
        return goalRepository.findById(goalId)
                .map(goal -> checkInRepository.findRecentCheckInsForGoal(goal)
                        .stream()
                        .limit(limit)
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .orElse(List.of());
    }
    
    private CheckInDto convertToDto(CheckIn checkIn) {
        CheckInDto dto = new CheckInDto();
        dto.setId(checkIn.getId());
        dto.setGoalId(checkIn.getGoal().getId());
        dto.setCheckInDate(checkIn.getCheckInDate());
        dto.setNotes(checkIn.getNotes());
        dto.setMood(checkIn.getMood());
        return dto;
    }
    
    private CheckIn convertToEntity(CheckInDto dto, Goal goal) {
        CheckIn checkIn = new CheckIn();
        checkIn.setGoal(goal);
        checkIn.setCheckInDate(dto.getCheckInDate());
        checkIn.setNotes(dto.getNotes());
        checkIn.setMood(dto.getMood());
        return checkIn;
    }
}
