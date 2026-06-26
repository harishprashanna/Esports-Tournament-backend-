package com.example.esports.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TeamResponse {
    private Long id;
    private String name;
    private String description;
    private String captainUsername;
    private Long captainId;
    private List<MemberInfo> members;
    private LocalDateTime createdAt;

    @Getter
    @Builder
    public static class MemberInfo {
        private Long userId;
        private String username;
        private String inGameName;
        private LocalDateTime joinedAt;
    }
}
