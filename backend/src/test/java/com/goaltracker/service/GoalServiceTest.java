package com.goaltracker.service;

import com.goaltracker.dto.GoalDto;
import com.goaltracker.entity.Goal;
import com.goaltracker.repository.GoalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoalServiceTest {

    @Mock
    private GoalRepository goalRepository;

    @InjectMocks
    private GoalService goalService;

    private Goal sampleGoal;

    @BeforeEach
    void setUp() {
        sampleGoal = new Goal("Title", "Desc", LocalDate.now().minusDays(1), LocalDate.now().plusDays(10));
        sampleGoal.setId(1L);
        sampleGoal.setActive(true);
    }

    @Test
    void getAllActiveGoals_returnsMappedDtos() {
        when(goalRepository.findByIsActiveTrueOrderByCreatedAtDesc()).thenReturn(List.of(sampleGoal));

        List<GoalDto> dtos = goalService.getAllActiveGoals();

        assertEquals(1, dtos.size());
        assertEquals(sampleGoal.getTitle(), dtos.get(0).getTitle());
        verify(goalRepository, times(1)).findByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Test
    void createGoal_savesAndReturnsDto() {
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> {
            Goal g = invocation.getArgument(0);
            g.setId(100L);
            return g;
        });

        GoalDto input = new GoalDto("New", "D", LocalDate.now(), LocalDate.now().plusDays(30));
        GoalDto created = goalService.createGoal(input);

        assertNotNull(created.getId());
        assertEquals("New", created.getTitle());
        verify(goalRepository, times(1)).save(any(Goal.class));
    }

    @Test
    void updateGoal_whenExists_updatesAndReturnsDto() {
        when(goalRepository.findById(1L)).thenReturn(Optional.of(sampleGoal));
        when(goalRepository.save(any(Goal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        GoalDto update = new GoalDto("Updated", "U", LocalDate.now(), LocalDate.now().plusDays(5));
        Optional<GoalDto> result = goalService.updateGoal(1L, update);

        assertTrue(result.isPresent());
        assertEquals("Updated", result.get().getTitle());
        verify(goalRepository).save(any(Goal.class));
    }

    @Test
    void updateGoal_whenMissing_returnsEmpty() {
        when(goalRepository.findById(2L)).thenReturn(Optional.empty());

        Optional<GoalDto> result = goalService.updateGoal(2L, new GoalDto("A", "B", LocalDate.now(), LocalDate.now().plusDays(1)));

        assertTrue(result.isEmpty());
        verify(goalRepository, never()).save(any());
    }

    @Test
    void deleteGoal_whenExists_returnsTrue() {
        when(goalRepository.existsById(1L)).thenReturn(true);

        boolean deleted = goalService.deleteGoal(1L);

        assertTrue(deleted);
        verify(goalRepository).deleteById(1L);
    }

    @Test
    void deleteGoal_whenNotExists_returnsFalse() {
        when(goalRepository.existsById(99L)).thenReturn(false);

        boolean deleted = goalService.deleteGoal(99L);

        assertFalse(deleted);
        verify(goalRepository, never()).deleteById(anyLong());
    }
}


