package com.example.esports.controller;

import com.example.esports.dto.TeamRequest;
import com.example.esports.entity.Team;
import com.example.esports.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public Team createTeam(@Valid @RequestBody TeamRequest request) {
        return teamService.createTeam(request);
    }
}
