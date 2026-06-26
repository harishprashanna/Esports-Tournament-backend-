package com.example.esports.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ParticipantResponse {
    private Long teamId;
    private String teamName;
    private String description;
    private Long captainId;
    private String captainUsername;
    private List<PlayerInfo> players;
    private LocalDateTime registeredAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class PlayerInfo {
        private Long userId;
        private String username;
        private String inGameName;
        private boolean captain;
    }
}
