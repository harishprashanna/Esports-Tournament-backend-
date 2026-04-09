package com.example.esports.service;

import com.example.esports.dto.RegistrationRequest;
import com.example.esports.entity.Registration;
import com.example.esports.entity.Team;
import com.example.esports.entity.Tournament;
import com.example.esports.repository.RegistrationRepository;
import com.example.esports.repository.TeamRepository;
import com.example.esports.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;

    public Registration register(RegistrationRequest request) {
        if (registrationRepository.existsByTeamIdAndTournamentId(request.getTeamId(), request.getTournamentId())) {
            throw new RuntimeException("Team already registered for this tournament");
        }
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));
        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        long registeredCount = registrationRepository.countByTournamentId(tournament.getId());
        if (registeredCount >= tournament.getMaxTeams()) {
            throw new RuntimeException("Tournament is full");
        }
        Registration registration = Registration.builder()
                .team(team)
                .tournament(tournament)
                .build();
        return registrationRepository.save(registration);
    }
}
