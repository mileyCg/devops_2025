package com.goaltracker.repository;

import com.goaltracker.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    
    List<Goal> findByIsActiveTrueOrderByCreatedAtDesc();
    
    List<Goal> findByIsActiveFalseOrderByCreatedAtDesc();
    
    @Query("SELECT g FROM Goal g WHERE g.isActive = true AND g.startDate <= :date AND g.endDate >= :date")
    List<Goal> findActiveGoalsForDate(@Param("date") LocalDate date);
    
    @Query("SELECT g FROM Goal g WHERE g.isActive = true AND g.endDate < :date")
    List<Goal> findExpiredGoals(@Param("date") LocalDate date);
    
    @Query("SELECT g FROM Goal g WHERE g.isActive = true AND g.startDate > :date")
    List<Goal> findUpcomingGoals(@Param("date") LocalDate date);
}
