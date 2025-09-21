package com.goaltracker.controller;

import com.goaltracker.dto.CheckInDto;
import com.goaltracker.service.CheckInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/checkins")

public class CheckInController {
    
    @Autowired
    private CheckInService checkInService;
    
    @GetMapping("/goal/{goalId}")
    public ResponseEntity<List<CheckInDto>> getCheckInsForGoal(@PathVariable Long goalId) {
        List<CheckInDto> checkIns = checkInService.getCheckInsForGoal(goalId);
        return ResponseEntity.ok(checkIns);
    }
    
    @GetMapping("/goal/{goalId}/date/{date}")
    public ResponseEntity<CheckInDto> getCheckInForGoalAndDate(@PathVariable Long goalId, @PathVariable LocalDate date) {
        Optional<CheckInDto> checkIn = checkInService.getCheckInForGoalAndDate(goalId, date);
        return checkIn.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<CheckInDto> createCheckIn(@Valid @RequestBody CheckInDto checkInDto) {
        try {
            CheckInDto createdCheckIn = checkInService.createCheckIn(checkInDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCheckIn);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CheckInDto> updateCheckIn(@PathVariable Long id, @Valid @RequestBody CheckInDto checkInDto) {
        Optional<CheckInDto> updatedCheckIn = checkInService.updateCheckIn(id, checkInDto);
        return updatedCheckIn.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCheckIn(@PathVariable Long id) {
        boolean deleted = checkInService.deleteCheckIn(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/goal/{goalId}/range")
    public ResponseEntity<List<CheckInDto>> getCheckInsForDateRange(
            @PathVariable Long goalId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<CheckInDto> checkIns = checkInService.getCheckInsForDateRange(goalId, startDate, endDate);
        return ResponseEntity.ok(checkIns);
    }
    
    @GetMapping("/goal/{goalId}/count")
    public ResponseEntity<Long> getCheckInCountForGoal(@PathVariable Long goalId) {
        long count = checkInService.getCheckInCountForGoal(goalId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/goal/{goalId}/recent")
    public ResponseEntity<List<CheckInDto>> getRecentCheckInsForGoal(
            @PathVariable Long goalId,
            @RequestParam(defaultValue = "10") int limit) {
        List<CheckInDto> checkIns = checkInService.getRecentCheckInsForGoal(goalId, limit);
        return ResponseEntity.ok(checkIns);
    }
}
