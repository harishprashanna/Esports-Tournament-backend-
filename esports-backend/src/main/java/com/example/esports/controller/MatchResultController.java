package com.example.esports.controller;

import com.example.esports.dto.MatchResultRequest;
import com.example.esports.entity.MatchResult;
import com.example.esports.service.MatchResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class MatchResultController {

    private final MatchResultService matchResultService;

    @PostMapping("/matches")
    public MatchResult submit(@Valid @RequestBody MatchResultRequest request) {
        return matchResultService.submit(request);
    }

    @GetMapping("/leaderboard")
    public List<Map<String, Object>> leaderboard() {
        return matchResultService.getLeaderboard();
    }
}
