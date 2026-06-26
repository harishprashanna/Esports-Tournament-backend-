package com.example.esports.controller;

import com.example.esports.entity.User;
import com.example.esports.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/teams/{teamId}/tournaments/{tournamentId}")
    public ResponseEntity<Map<String, Object>> register(@PathVariable Long teamId,
                                                        @PathVariable Long tournamentId,
                                                        @AuthenticationPrincipal User currentUser) {
        var reg = registrationService.register(teamId, tournamentId, currentUser);
        return ResponseEntity.status(201).body(Map.of(
                "id", reg.getId(),
                "registeredAt", reg.getRegisteredAt().toString()
        ));
    }

    @DeleteMapping("/teams/{teamId}/tournaments/{tournamentId}")
    public ResponseEntity<Void> leaveTournament(@PathVariable Long teamId,
                                                @PathVariable Long tournamentId,
                                                @AuthenticationPrincipal User currentUser) {
        registrationService.leaveTournament(teamId, tournamentId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
