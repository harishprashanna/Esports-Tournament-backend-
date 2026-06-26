package com.example.esports.repository;

import com.example.esports.entity.Tournament;
import com.example.esports.enums.GameCategory;
import com.example.esports.enums.GameType;
import com.example.esports.enums.TournamentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    List<Tournament> findByStatus(TournamentStatus status);
    List<Tournament> findByCategory(GameCategory category);
    List<Tournament> findByGameType(GameType gameType);
}
