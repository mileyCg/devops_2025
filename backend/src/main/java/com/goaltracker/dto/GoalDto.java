package com.goaltracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class GoalDto {
    
    private Long id;
    
    @NotBlank(message = "Goal title is required")
    @Size(max = 200, message = "Goal title must not exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    private boolean isActive;
    private int daysRemaining;
    private int daysCompleted;
    private double progressPercentage;
    
    // Constructors
    public GoalDto() {}
    
    public GoalDto(String title, String description, LocalDate startDate, LocalDate endDate) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = true;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setIsActive(boolean active) {
        isActive = active;
    }
    
    public int getDaysRemaining() {
        return daysRemaining;
    }
    
    public void setDaysRemaining(int daysRemaining) {
        this.daysRemaining = daysRemaining;
    }
    
    public int getDaysCompleted() {
        return daysCompleted;
    }
    
    public void setDaysCompleted(int daysCompleted) {
        this.daysCompleted = daysCompleted;
    }
    
    public double getProgressPercentage() {
        return progressPercentage;
    }
    
    public void setProgressPercentage(double progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
}
