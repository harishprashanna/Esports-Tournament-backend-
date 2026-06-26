package com.example.esports.service;

import com.example.esports.dto.LeaderboardEntry;
import com.example.esports.repository.MatchResultRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final MatchResultRepository matchResultRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<LeaderboardEntry> getLeaderboard(Long tournamentId) {
        String key = "leaderboard:tournament:" + tournamentId;
        String cached = redisTemplate.opsForValue().get(key);
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, new TypeReference<>() {});
            } catch (Exception ignored) {
                redisTemplate.delete(key);
            }
        }

        List<Object[]> rows = matchResultRepository.getLeaderboardByTournament(tournamentId);
        List<LeaderboardEntry> leaderboard = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            Object[] row = rows.get(i);
            leaderboard.add(LeaderboardEntry.builder()
                    .rank(i + 1)
                    .teamName((String) row[0])
                    .wins(((Number) row[1]).longValue())
                    .build());
        }

        try {
            redisTemplate.opsForValue().set(key,
                    objectMapper.writeValueAsString(leaderboard),
                    Duration.ofMinutes(5));
        } catch (Exception ignored) {}

        return leaderboard;
    }

    public void invalidate(Long tournamentId) {
        redisTemplate.delete("leaderboard:tournament:" + tournamentId);
    }
}
