package com.example.esports.dto;

import com.example.esports.enums.MatchStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MatchResponse {
    private Long id;
    private Long tournamentId;
    private String tournamentName;
    private Integer roundNumber;
    private Integer matchNumber;
    private String team1Name;
    private Long team1Id;
    private String team2Name;
    private Long team2Id;
    private String winnerName;
    private Long winnerId;
    private Integer team1Score;
    private Integer team2Score;
    private MatchStatus status;
    private LocalDateTime scheduledAt;
    private String notes;
}
