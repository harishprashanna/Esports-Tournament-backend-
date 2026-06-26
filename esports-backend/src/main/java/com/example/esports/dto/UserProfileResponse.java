package com.example.esports.dto;

import com.example.esports.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String inGameName;
    private Role role;
    private LocalDateTime createdAt;
    private List<String> teamNames;
}
