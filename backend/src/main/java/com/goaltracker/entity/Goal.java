package com.goaltracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "goals")
public class Goal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Goal title is required")
    @Size(max = 200, message = "Goal title must not exceed 200 characters")
    @Column(nullable = false)
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private boolean isActive = true;
    
    @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CheckIn> checkIns;
    
    // Constructors
    public Goal() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Goal(String title, String description, LocalDate startDate, LocalDate endDate) {
        this();
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public List<CheckIn> getCheckIns() {
        return checkIns;
    }
    
    public void setCheckIns(List<CheckIn> checkIns) {
        this.checkIns = checkIns;
    }
    
    // Helper methods
    public int getDaysRemaining() {
        LocalDate today = LocalDate.now();
        if (today.isAfter(endDate)) {
            return 0;
        }
        return (int) java.time.temporal.ChronoUnit.DAYS.between(today, endDate);
    }
    
    public int getDaysCompleted() {
        if (checkIns == null) {
            return 0;
        }
        return checkIns.size();
    }
    
    public double getProgressPercentage() {
        int totalDays = (int) java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate) + 1;
        if (totalDays == 0) {
            return 0.0;
        }
        return (double) getDaysCompleted() / totalDays * 100;
    }
}
