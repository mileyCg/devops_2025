package com.goaltracker.controller;

import com.goaltracker.dto.CheckInDto;
import com.goaltracker.service.CheckInService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CheckInControllerTest {

    private MockMvc mockMvc;
    private CheckInService checkInService;

    @BeforeEach
    void setup() {
        CheckInController controller = new CheckInController();
        checkInService = Mockito.mock(CheckInService.class);
        ReflectionTestUtils.setField(controller, "checkInService", checkInService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void getCheckInsForGoal_returnsList() throws Exception {
        CheckInDto dto = new CheckInDto(1L, LocalDate.now());
        dto.setId(10L);
        dto.setNotes("n");
        Mockito.when(checkInService.getCheckInsForGoal(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/checkins/goal/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(10)))
                .andExpect(jsonPath("$[0].goalId", is(1)));
    }
}
