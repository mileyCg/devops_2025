package com.goaltracker;

import com.goaltracker.controller.GoalController;
import com.goaltracker.dto.GoalDto;
import com.goaltracker.service.GoalService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoalControllerTest {

    @Mock
    private GoalService goalService;

    @InjectMocks
    private GoalController goalController;

    @Test
    void testGetAllGoals() {
        // Given
        GoalDto goal1 = new GoalDto();
        goal1.setId(1L);
        goal1.setTitle("Test Goal 1");
        goal1.setStartDate(LocalDate.now());
        goal1.setEndDate(LocalDate.now().plusDays(30));

        GoalDto goal2 = new GoalDto();
        goal2.setId(2L);
        goal2.setTitle("Test Goal 2");
        goal2.setStartDate(LocalDate.now());
        goal2.setEndDate(LocalDate.now().plusDays(30));

        List<GoalDto> goals = Arrays.asList(goal1, goal2);
        when(goalService.getAllGoals()).thenReturn(goals);

        // When
        ResponseEntity<List<GoalDto>> response = goalController.getAllGoals();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertEquals("Test Goal 1", response.getBody().get(0).getTitle());
        verify(goalService, times(1)).getAllGoals();
    }

    @Test
    void testGetGoalById() {
        // Given
        Long goalId = 1L;
        GoalDto goal = new GoalDto();
        goal.setId(goalId);
        goal.setTitle("Test Goal");
        goal.setStartDate(LocalDate.now());
        goal.setEndDate(LocalDate.now().plusDays(30));

        when(goalService.getGoalById(goalId)).thenReturn(Optional.of(goal));

        // When
        ResponseEntity<GoalDto> response = goalController.getGoalById(goalId);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(goalId, response.getBody().getId());
        assertEquals("Test Goal", response.getBody().getTitle());
        verify(goalService, times(1)).getGoalById(goalId);
    }

    @Test
    void testGetGoalByIdNotFound() {
        // Given
        Long goalId = 999L;
        when(goalService.getGoalById(goalId)).thenReturn(Optional.empty());

        // When
        ResponseEntity<GoalDto> response = goalController.getGoalById(goalId);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(goalService, times(1)).getGoalById(goalId);
    }

    @Test
    void testCreateGoal() {
        // Given
        GoalDto goalDto = new GoalDto();
        goalDto.setTitle("New Goal");
        goalDto.setDescription("Test Description");
        goalDto.setStartDate(LocalDate.now());
        goalDto.setEndDate(LocalDate.now().plusDays(30));

        GoalDto createdGoal = new GoalDto();
        createdGoal.setId(1L);
        createdGoal.setTitle("New Goal");
        createdGoal.setDescription("Test Description");
        createdGoal.setStartDate(LocalDate.now());
        createdGoal.setEndDate(LocalDate.now().plusDays(30));

        when(goalService.createGoal(goalDto)).thenReturn(createdGoal);

        // When
        ResponseEntity<GoalDto> response = goalController.createGoal(goalDto);

        // Then
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
        assertEquals("New Goal", response.getBody().getTitle());
        verify(goalService, times(1)).createGoal(goalDto);
    }

    @Test
    void testDeleteGoal() {
        // Given
        Long goalId = 1L;
        when(goalService.deleteGoal(goalId)).thenReturn(true);

        // When
        ResponseEntity<Void> response = goalController.deleteGoal(goalId);

        // Then
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(goalService, times(1)).deleteGoal(goalId);
    }

    @Test
    void testDeleteGoalNotFound() {
        // Given
        Long goalId = 999L;
        when(goalService.deleteGoal(goalId)).thenReturn(false);

        // When
        ResponseEntity<Void> response = goalController.deleteGoal(goalId);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(goalService, times(1)).deleteGoal(goalId);
    }
}
