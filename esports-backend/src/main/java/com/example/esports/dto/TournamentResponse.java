package com.example.esports.dto;

import com.example.esports.enums.GameCategory;
import com.example.esports.enums.GameType;
import com.example.esports.enums.TournamentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TournamentResponse {
    private Long id;
    private String name;
    private GameType gameType;
    private String gameDisplayName;
    private GameCategory category;
    private Integer maxTeams;
    private long registeredTeams;
    private LocalDateTime registrationDeadline;
    private LocalDateTime startDate;
    private String description;
    private String prizePool;
    private TournamentStatus status;
    private String createdBy;
    private LocalDateTime createdAt;
}
