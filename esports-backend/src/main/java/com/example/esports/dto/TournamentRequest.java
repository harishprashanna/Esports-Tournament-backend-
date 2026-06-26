package com.example.esports.dto;

import com.example.esports.enums.GameType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TournamentRequest {
    @NotBlank
    private String name;

    @NotNull
    private GameType gameType;

    @NotNull
    private Integer maxTeams;

    private LocalDateTime registrationDeadline;
    private LocalDateTime startDate;
    private String description;
    private String prizePool;
}
