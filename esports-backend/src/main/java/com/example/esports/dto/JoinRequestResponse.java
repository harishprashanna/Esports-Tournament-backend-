package com.example.esports.dto;

import com.example.esports.enums.JoinRequestStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class JoinRequestResponse {
    private Long id;
    private Long teamId;
    private String teamName;
    private Long userId;
    private String username;
    private JoinRequestStatus status;
    private LocalDateTime createdAt;
}
