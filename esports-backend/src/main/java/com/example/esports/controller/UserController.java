package com.example.esports.controller;

import com.example.esports.dto.UserProfileResponse;
import com.example.esports.entity.User;
import com.example.esports.repository.TeamMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final TeamMemberRepository teamMemberRepository;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal User currentUser) {
        var teams = teamMemberRepository.findByUser(currentUser)
                .stream()
                .map(m -> m.getTeam().getName())
                .collect(Collectors.toList());

        UserProfileResponse profile = UserProfileResponse.builder()
                .id(currentUser.getId())
                .username(currentUser.getUsername())
                .email(currentUser.getEmail())
                .inGameName(currentUser.getInGameName())
                .role(currentUser.getRole())
                .createdAt(currentUser.getCreatedAt())
                .teamNames(teams)
                .build();
        return ResponseEntity.ok(profile);
    }
}
