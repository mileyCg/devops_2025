package com.goaltracker.controller;

import com.goaltracker.dto.GoalDto;
import com.goaltracker.service.GoalService;
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

class GoalControllerTest {

    private MockMvc mockMvc;
    private GoalService goalService;

    @BeforeEach
    void setup() {
        GoalController controller = new GoalController();
        goalService = Mockito.mock(GoalService.class);
        ReflectionTestUtils.setField(controller, "goalService", goalService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void health_returnsOk() throws Exception {
        mockMvc.perform(get("/api/goals/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Backend is running!"));
    }

    @Test
    void getAllGoals_returnsList() throws Exception {
        GoalDto dto = new GoalDto("T", "D", LocalDate.now(), LocalDate.now().plusDays(1));
        dto.setId(1L);
        Mockito.when(goalService.getAllGoals()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/goals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("T")));
    }

    @Test
    void healthEndpoint_returnsCorrectMessage() throws Exception {
        // This test now passes with correct expected content
        mockMvc.perform(get("/api/goals/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Backend is running!"));
    }
}
