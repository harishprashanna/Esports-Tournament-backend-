package com.example.esports.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MatchResultRequest {
    @NotNull
    private Long matchId;

    @NotNull
    private Long winnerId;

    private Integer team1Score;
    private Integer team2Score;
    private String notes;
}
