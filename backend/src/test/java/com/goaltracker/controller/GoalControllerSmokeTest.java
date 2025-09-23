package com.goaltracker.controller;

import com.goaltracker.dto.GoalDto;
import com.goaltracker.service.GoalService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = GoalController.class)
class GoalControllerSmokeTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private GoalService goalService;

	@Test
	void getAllGoals_returns200AndJsonArray() throws Exception {
		GoalDto sample = new GoalDto();
		sample.setId(1L);
		sample.setTitle("Demo Goal");
		sample.setStartDate(LocalDate.now());
		sample.setEndDate(LocalDate.now().plusDays(30));
		sample.setActive(true);

		when(goalService.getAllGoals()).thenReturn(List.of(sample));

		mockMvc.perform(get("/api/goals")
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
	}
}
