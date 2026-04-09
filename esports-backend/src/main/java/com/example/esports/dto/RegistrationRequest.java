package com.example.esports.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationRequest {
    @NotNull
    private Long teamId;
    @NotNull
    private Long tournamentId;
}
