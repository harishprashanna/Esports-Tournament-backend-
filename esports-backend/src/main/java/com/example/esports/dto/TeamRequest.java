package com.example.esports.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeamRequest {
    @NotBlank
    private String name;
    @NotNull
    private Long captainId;
}
