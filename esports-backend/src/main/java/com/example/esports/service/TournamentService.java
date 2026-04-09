package com.example.esports.service;

import com.example.esports.dto.TournamentRequest;
import com.example.esports.entity.Tournament;
import com.example.esports.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    public Tournament createTournament(TournamentRequest request) {
        Tournament tournament = Tournament.builder()
                .name(request.getName())
                .game(request.getGame())
                .maxTeams(request.getMaxTeams())
                .build();
        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }
}
