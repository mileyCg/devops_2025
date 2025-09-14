package com.goaltracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_ins")
public class CheckIn {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "goal_id", nullable = false)
    @NotNull(message = "Goal is required")
    private Goal goal;
    
    @Column(nullable = false)
    private LocalDate checkInDate;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private String notes;
    
    private int mood; // 1-5 scale for mood tracking
    
    // Constructors
    public CheckIn() {
        this.createdAt = LocalDateTime.now();
        this.checkInDate = LocalDate.now();
    }
    
    public CheckIn(Goal goal, LocalDate checkInDate) {
        this();
        this.goal = goal;
        this.checkInDate = checkInDate;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Goal getGoal() {
        return goal;
    }
    
    public void setGoal(Goal goal) {
        this.goal = goal;
    }
    
    public LocalDate getCheckInDate() {
        return checkInDate;
    }
    
    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
