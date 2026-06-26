package com.example.esports.controller;

import com.example.esports.dto.LeaderboardEntry;
import com.example.esports.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/tournaments/{tournamentId}")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard(@PathVariable Long tournamentId) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(tournamentId));
    }
}
