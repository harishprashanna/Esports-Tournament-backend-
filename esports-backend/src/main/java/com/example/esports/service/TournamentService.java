package com.example.esports.service;

import com.example.esports.dto.TournamentRequest;
import com.example.esports.dto.TournamentResponse;
import com.example.esports.entity.Tournament;
import com.example.esports.entity.User;
import com.example.esports.enums.TournamentStatus;
import com.example.esports.repository.RegistrationRepository;
import com.example.esports.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final RegistrationRepository registrationRepository;

    public TournamentResponse createTournament(TournamentRequest request, User admin) {
        Tournament tournament = Tournament.builder()
                .name(request.getName())
                .gameType(request.getGameType())
                .category(request.getGameType().getCategory())
                .maxTeams(request.getMaxTeams())
                .registrationDeadline(request.getRegistrationDeadline())
                .startDate(request.getStartDate())
                .description(request.getDescription())
                .prizePool(request.getPrizePool())
                .status(TournamentStatus.UPCOMING)
                .createdBy(admin)
                .build();
        return toResponse(tournamentRepository.save(tournament));
    }

    public TournamentResponse getTournament(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<TournamentResponse> getAllTournaments() {
        return tournamentRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TournamentResponse updateStatus(Long id, TournamentStatus status) {
        Tournament t = findOrThrow(id);
        t.setStatus(status);
        return toResponse(tournamentRepository.save(t));
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }

    private Tournament findOrThrow(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
    }

    private TournamentResponse toResponse(Tournament t) {
        long count = registrationRepository.countByTournamentId(t.getId());
        return TournamentResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .gameType(t.getGameType())
                .gameDisplayName(t.getGameType().getDisplayName())
                .category(t.getCategory())
                .maxTeams(t.getMaxTeams())
                .registeredTeams(count)
                .registrationDeadline(t.getRegistrationDeadline())
                .startDate(t.getStartDate())
                .description(t.getDescription())
                .prizePool(t.getPrizePool())
                .status(t.getStatus())
                .createdBy(t.getCreatedBy() != null ? t.getCreatedBy().getUsername() : null)
                .createdAt(t.getCreatedAt())
                .build();
    }
}
