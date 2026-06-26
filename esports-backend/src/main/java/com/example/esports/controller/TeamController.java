package com.example.esports.controller;

import com.example.esports.dto.JoinRequestResponse;
import com.example.esports.dto.TeamRequest;
import com.example.esports.dto.TeamResponse;
import com.example.esports.entity.User;
import com.example.esports.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<TeamResponse> createTeam(@Valid @RequestBody TeamRequest request,
                                                   @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.createTeam(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<TeamResponse>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeam(teamId));
    }

    @PostMapping("/{teamId}/join")
    public ResponseEntity<JoinRequestResponse> requestJoin(@PathVariable Long teamId,
                                                           @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.requestJoin(teamId, currentUser));
    }

    @GetMapping("/{teamId}/requests")
    public ResponseEntity<List<JoinRequestResponse>> getPendingRequests(@PathVariable Long teamId,
                                                                        @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.getPendingRequests(teamId, currentUser));
    }

    @PatchMapping("/requests/{requestId}/accept")
    public ResponseEntity<JoinRequestResponse> acceptRequest(@PathVariable Long requestId,
                                                             @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.handleJoinRequest(requestId, true, currentUser));
    }

    @PatchMapping("/requests/{requestId}/reject")
    public ResponseEntity<JoinRequestResponse> rejectRequest(@PathVariable Long requestId,
                                                             @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(teamService.handleJoinRequest(requestId, false, currentUser));
    }

    @DeleteMapping("/{teamId}/leave")
    public ResponseEntity<Void> leaveTeam(@PathVariable Long teamId,
                                          @AuthenticationPrincipal User currentUser) {
        teamService.leaveTeam(teamId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long teamId,
                                             @PathVariable Long memberId,
                                             @AuthenticationPrincipal User currentUser) {
        teamService.removeMember(teamId, memberId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
