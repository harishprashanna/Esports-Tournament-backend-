package com.example.esports.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TournamentRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String game;
    @NotNull
    private Integer maxTeams;
}
