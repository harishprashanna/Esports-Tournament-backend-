package com.example.esports.controller;

import com.example.esports.dto.ParticipantResponse;
import com.example.esports.dto.TournamentRequest;
import com.example.esports.dto.TournamentResponse;
import com.example.esports.entity.User;
import com.example.esports.enums.TournamentStatus;
import com.example.esports.service.RegistrationService;
import com.example.esports.service.TournamentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tournaments")
@RequiredArgsConstructor
public class TournamentController {

    private final TournamentService tournamentService;
    private final RegistrationService registrationService;

    @GetMapping
    public ResponseEntity<List<TournamentResponse>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournamentResponse> getTournament(@PathVariable Long id) {
        return ResponseEntity.ok(tournamentService.getTournament(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TournamentResponse> createTournament(@Valid @RequestBody TournamentRequest request,
                                                               @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(tournamentService.createTournament(request, admin));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TournamentResponse> updateStatus(@PathVariable Long id,
                                                           @RequestParam TournamentStatus status) {
        return ResponseEntity.ok(tournamentService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        tournamentService.deleteTournament(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/participants")
    public ResponseEntity<List<ParticipantResponse>> getParticipants(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.getParticipants(id));
    }
}
