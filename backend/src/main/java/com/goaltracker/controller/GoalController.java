package com.goaltracker.controller;

import com.goaltracker.dto.GoalDto;
import com.goaltracker.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:4200")
public class GoalController {
    
    @Autowired
    private GoalService goalService;
    
    @GetMapping
    public ResponseEntity<List<GoalDto>> getAllGoals() {
        List<GoalDto> goals = goalService.getAllGoals();
        return ResponseEntity.ok(goals);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<GoalDto>> getActiveGoals() {
        List<GoalDto> goals = goalService.getAllActiveGoals();
        return ResponseEntity.ok(goals);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<GoalDto> getGoalById(@PathVariable Long id) {
        Optional<GoalDto> goal = goalService.getGoalById(id);
        return goal.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<GoalDto> createGoal(@Valid @RequestBody GoalDto goalDto) {
        try {
            GoalDto createdGoal = goalService.createGoal(goalDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGoal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<GoalDto> updateGoal(@PathVariable Long id, @Valid @RequestBody GoalDto goalDto) {
        Optional<GoalDto> updatedGoal = goalService.updateGoal(id, goalDto);
        return updatedGoal.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        boolean deleted = goalService.deleteGoal(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/for-date")
    public ResponseEntity<List<GoalDto>> getGoalsForDate(@RequestParam LocalDate date) {
        List<GoalDto> goals = goalService.getGoalsForDate(date);
        return ResponseEntity.ok(goals);
    }
    
    @GetMapping("/expired")
    public ResponseEntity<List<GoalDto>> getExpiredGoals() {
        List<GoalDto> goals = goalService.getExpiredGoals();
        return ResponseEntity.ok(goals);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<GoalDto>> getUpcomingGoals() {
        List<GoalDto> goals = goalService.getUpcomingGoals();
        return ResponseEntity.ok(goals);
    }
}
