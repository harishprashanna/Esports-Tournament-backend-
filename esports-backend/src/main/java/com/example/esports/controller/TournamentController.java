package com.example.esports.controller;

import com.example.esports.dto.TournamentRequest;
import com.example.esports.entity.Tournament;
import com.example.esports.service.TournamentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;

    @PostMapping
    public Tournament createTournament(@Valid @RequestBody TournamentRequest request) {
        return tournamentService.createTournament(request);
    }

    @GetMapping
    public List<Tournament> getAllTournaments() {
        return tournamentService.getAllTournaments();
    }
}
