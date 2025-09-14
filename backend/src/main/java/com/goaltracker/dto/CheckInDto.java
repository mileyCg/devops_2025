package com.goaltracker.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CheckInDto {
    
    private Long id;
    
    @NotNull(message = "Goal ID is required")
    private Long goalId;
    
    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;
    
    private String notes;
    private int mood; // 1-5 scale
    
    // Constructors
    public CheckInDto() {}
    
    public CheckInDto(Long goalId, LocalDate checkInDate) {
        this.goalId = goalId;
        this.checkInDate = checkInDate;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getGoalId() {
        return goalId;
    }
    
    public void setGoalId(Long goalId) {
        this.goalId = goalId;
    }
    
    public LocalDate getCheckInDate() {
        return checkInDate;
    }
    
    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public int getMood() {
        return mood;
    }
    
    public void setMood(int mood) {
        this.mood = mood;
    }
}
