package com.example.esports.service;

import com.example.esports.dto.ParticipantResponse;
import com.example.esports.entity.*;
import com.example.esports.enums.TournamentStatus;
import com.example.esports.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final TeamRepository teamRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamMemberRepository teamMemberRepository;

    @Transactional
    public Registration register(Long teamId, Long tournamentId, User currentUser) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (!team.getCaptain().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the team captain can register for a tournament");
        }
        // Admin controls registration open/close — status is the sole gatekeeper
        if (tournament.getStatus() != TournamentStatus.REGISTRATION_OPEN) {
            throw new RuntimeException("Registration is not open for this tournament");
        }
        if (registrationRepository.existsByTeamIdAndTournamentId(teamId, tournamentId)) {
            throw new RuntimeException("Team is already registered for this tournament");
        }
        if (registrationRepository.countByTournamentId(tournamentId) >= tournament.getMaxTeams()) {
            throw new RuntimeException("Tournament is full");
        }

        List<Registration> categoryRegs = registrationRepository
                .findByTeamIdAndTournamentCategory(teamId, tournament.getCategory());
        if (!categoryRegs.isEmpty()) {
            throw new RuntimeException("Team already registered in a " +
                    tournament.getCategory() + " tournament. Only one per category allowed.");
        }

        return registrationRepository.save(
                Registration.builder().team(team).tournament(tournament).build());
    }

    @Transactional
    public void leaveTournament(Long teamId, Long tournamentId, User currentUser) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (!team.getCaptain().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the team captain can leave a tournament");
        }
        if (tournament.getStatus() == TournamentStatus.ONGOING ||
                tournament.getStatus() == TournamentStatus.COMPLETED) {
            throw new RuntimeException("Cannot leave an ongoing or completed tournament");
        }
        registrationRepository.deleteByTeamAndTournament(team, tournament);
    }

    public List<Registration> getTeamRegistrations(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return registrationRepository.findByTeam(team);
    }

    public List<Registration> getTournamentRegistrations(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        return registrationRepository.findByTournament(tournament);
    }

    @Transactional(readOnly = true)
    public List<ParticipantResponse> getParticipants(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        return registrationRepository.findByTournament(tournament).stream().map(reg -> {
            Team team = reg.getTeam();
            List<TeamMember> members = teamMemberRepository.findByTeam(team);
            List<ParticipantResponse.PlayerInfo> players = members.stream()
                    .map(m -> ParticipantResponse.PlayerInfo.builder()
                            .userId(m.getUser().getId())
                            .username(m.getUser().getUsername())
                            .inGameName(m.getUser().getInGameName())
                            .captain(m.getUser().getId().equals(team.getCaptain().getId()))
                            .build())
                    .collect(Collectors.toList());
            return ParticipantResponse.builder()
                    .teamId(team.getId())
                    .teamName(team.getName())
                    .description(team.getDescription())
                    .captainId(team.getCaptain().getId())
                    .captainUsername(team.getCaptain().getUsername())
                    .players(players)
                    .registeredAt(reg.getRegisteredAt())
                    .build();
        }).collect(Collectors.toList());
    }
}
