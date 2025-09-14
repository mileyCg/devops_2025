package com.goaltracker.repository;

import com.goaltracker.entity.CheckIn;
import com.goaltracker.entity.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    
    List<CheckIn> findByGoalOrderByCheckInDateDesc(Goal goal);
    
    List<CheckIn> findByGoalAndCheckInDateBetween(Goal goal, LocalDate startDate, LocalDate endDate);
    
    Optional<CheckIn> findByGoalAndCheckInDate(Goal goal, LocalDate checkInDate);
    
    @Query("SELECT c FROM CheckIn c WHERE c.goal = :goal AND c.checkInDate = :date")
    Optional<CheckIn> findCheckInForGoalAndDate(@Param("goal") Goal goal, @Param("date") LocalDate date);
    
    @Query("SELECT COUNT(c) FROM CheckIn c WHERE c.goal = :goal")
    long countCheckInsForGoal(@Param("goal") Goal goal);
    
    @Query("SELECT c FROM CheckIn c WHERE c.goal = :goal ORDER BY c.checkInDate DESC")
    List<CheckIn> findRecentCheckInsForGoal(@Param("goal") Goal goal);
}
