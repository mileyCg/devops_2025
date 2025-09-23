package com.goaltracker.service;

import com.goaltracker.dto.CheckInDto;
import com.goaltracker.entity.CheckIn;
import com.goaltracker.entity.Goal;
import com.goaltracker.repository.CheckInRepository;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CheckInServiceTest {

    @Mock
    private CheckInRepository checkInRepository;

    @Mock
    private GoalRepository goalRepository;

    @InjectMocks
    private CheckInService checkInService;

    private Goal goal;
    private CheckIn checkIn;

    @BeforeEach
    void setUp() {
        goal = new Goal("Title", "Desc", LocalDate.now().minusDays(1), LocalDate.now().plusDays(5));
        goal.setId(1L);

        checkIn = new CheckIn();
        checkIn.setId(10L);
        checkIn.setGoal(goal);
        checkIn.setCheckInDate(LocalDate.now());
        checkIn.setNotes("notes");
        checkIn.setMood(4);
    }

    @Test
    void getCheckInsForGoal_whenGoalExists_returnsDtos() {
        when(goalRepository.findById(1L)).thenReturn(Optional.of(goal));
        when(checkInRepository.findByGoalOrderByCheckInDateDesc(goal)).thenReturn(List.of(checkIn));

        List<CheckInDto> dtos = checkInService.getCheckInsForGoal(1L);

        assertEquals(1, dtos.size());
        assertEquals(checkIn.getNotes(), dtos.get(0).getNotes());
    }

    @Test
    void createCheckIn_whenGoalMissing_throws() {
        when(goalRepository.findById(999L)).thenReturn(Optional.empty());

        CheckInDto dto = new CheckInDto(999L, LocalDate.now());

        assertThrows(RuntimeException.class, () -> checkInService.createCheckIn(dto));
    }

    @Test
    void createCheckIn_whenDuplicateForDate_throws() {
        when(goalRepository.findById(1L)).thenReturn(Optional.of(goal));
        when(checkInRepository.findCheckInForGoalAndDate(eq(goal), any(LocalDate.class))).thenReturn(Optional.of(checkIn));

        CheckInDto dto = new CheckInDto(1L, LocalDate.now());

        assertThrows(RuntimeException.class, () -> checkInService.createCheckIn(dto));
    }

    @Test
    void createCheckIn_savesAndReturnsDto() {
        when(goalRepository.findById(1L)).thenReturn(Optional.of(goal));
        when(checkInRepository.findCheckInForGoalAndDate(eq(goal), any(LocalDate.class))).thenReturn(Optional.empty());
        when(checkInRepository.save(any(CheckIn.class))).thenAnswer(invocation -> {
            CheckIn c = invocation.getArgument(0);
            c.setId(123L);
            return c;
        });

        CheckInDto dto = new CheckInDto(1L, LocalDate.now());
        dto.setNotes("hello");
        dto.setMood(5);

        CheckInDto created = checkInService.createCheckIn(dto);

        assertNotNull(created.getId());
        assertEquals(5, created.getMood());
        verify(checkInRepository).save(any(CheckIn.class));
    }

    @Test
    void updateCheckIn_whenExists_updates() {
        when(checkInRepository.findById(10L)).thenReturn(Optional.of(checkIn));
        when(checkInRepository.save(any(CheckIn.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CheckInDto update = new CheckInDto(1L, LocalDate.now());
        update.setNotes("updated");
        update.setMood(3);

        Optional<CheckInDto> result = checkInService.updateCheckIn(10L, update);
        assertTrue(result.isPresent());
        assertEquals("updated", result.get().getNotes());
        assertEquals(3, result.get().getMood());
    }

    @Test
    void deleteCheckIn_returnsTrueWhenExists() {
        when(checkInRepository.existsById(10L)).thenReturn(true);

        boolean removed = checkInService.deleteCheckIn(10L);

        assertTrue(removed);
        verify(checkInRepository).deleteById(10L);
    }

    @Test
    void deleteCheckIn_returnsFalseWhenMissing() {
        when(checkInRepository.existsById(anyLong())).thenReturn(false);

        assertFalse(checkInService.deleteCheckIn(55L));
        verify(checkInRepository, never()).deleteById(anyLong());
    }
}
