package com.example.esports.controller;

import com.example.esports.dto.MatchResponse;
import com.example.esports.dto.MatchResultRequest;
import com.example.esports.service.MatchResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchResultController {

    private final MatchResultService matchResultService;

    @PostMapping("/tournaments/{tournamentId}/bracket")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MatchResponse>> generateBracket(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(matchResultService.generateBracket(tournamentId));
    }

    @GetMapping("/tournaments/{tournamentId}")
    public ResponseEntity<List<MatchResponse>> getBracket(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(matchResultService.getBracket(tournamentId));
    }

    @PostMapping("/result")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MatchResponse> submitResult(@Valid @RequestBody MatchResultRequest request) {
        return ResponseEntity.ok(matchResultService.submitResult(request));
    }

    @GetMapping("/history/teams/{teamId}")
    public ResponseEntity<List<MatchResponse>> getTeamHistory(@PathVariable Long teamId) {
        return ResponseEntity.ok(matchResultService.getTeamHistory(teamId));
    }
}
