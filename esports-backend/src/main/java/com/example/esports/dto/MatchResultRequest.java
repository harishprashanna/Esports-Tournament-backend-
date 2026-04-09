package com.example.esports.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchResultRequest {
    @NotNull
    private Long tournamentId;
    @NotNull
    private Long team1Id;
    @NotNull
    private Long team2Id;
    @NotNull
    private Long winnerId;
}
