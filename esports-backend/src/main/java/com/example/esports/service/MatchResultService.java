package com.example.esports.service;

import com.example.esports.dto.MatchResultRequest;
import com.example.esports.entity.MatchResult;
import com.example.esports.entity.Team;
import com.example.esports.entity.Tournament;
import com.example.esports.repository.MatchResultRepository;
import com.example.esports.repository.TeamRepository;
import com.example.esports.repository.TournamentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MatchResultService {

    private final MatchResultRepository matchResultRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MatchResult submit(MatchResultRequest request) {
        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        Team team1 = teamRepository.findById(request.getTeam1Id())
                .orElseThrow(() -> new RuntimeException("Team 1 not found"));
        Team team2 = teamRepository.findById(request.getTeam2Id())
                .orElseThrow(() -> new RuntimeException("Team 2 not found"));
        Team winner = teamRepository.findById(request.getWinnerId())
                .orElseThrow(() -> new RuntimeException("Winner not found"));
        if (!winner.getId().equals(team1.getId()) && !winner.getId().equals(team2.getId())) {
            throw new RuntimeException("Winner must be one of the two teams");
        }
        MatchResult matchResult = MatchResult.builder()
                .tournament(tournament)
                .team1(team1)
                .team2(team2)
                .winner(winner)
                .build();
        MatchResult saved = matchResultRepository.save(matchResult);
        redisTemplate.delete("leaderboard");
        return saved;
    }

    public List<Map<String, Object>> getLeaderboard() {
        String cached = redisTemplate.opsForValue().get("leaderboard");
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<>() {});
            } catch (JsonProcessingException e) {
                redisTemplate.delete("leaderboard");
            }
        }
        List<Map<String, Object>> leaderboard = new ArrayList<>();
        for (Object[] row : matchResultRepository.getLeaderboard()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("team", row[0]);
            item.put("wins", row[1]);
            leaderboard.add(item);
        }
        try {
            redisTemplate.opsForValue().set("leaderboard", objectMapper.writeValueAsString(leaderboard), Duration.ofMinutes(5));
        } catch (JsonProcessingException ignored) {
        }
        return leaderboard;
    }
}
