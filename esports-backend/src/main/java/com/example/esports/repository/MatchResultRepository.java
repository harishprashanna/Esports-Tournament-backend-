package com.example.esports.repository;

import com.example.esports.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {
    List<MatchResult> findByTournamentIdOrderByRoundNumberAscMatchNumberAsc(Long tournamentId);
    List<MatchResult> findByTournamentIdAndRoundNumber(Long tournamentId, Integer roundNumber);

    @Query("SELECT m FROM MatchResult m WHERE m.team1.id = :teamId OR m.team2.id = :teamId ORDER BY m.id DESC")
    List<MatchResult> findMatchHistoryByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT m.winner.name, COUNT(m) as wins FROM MatchResult m WHERE m.tournament.id = :tid AND m.status = 'COMPLETED' GROUP BY m.winner.name ORDER BY wins DESC")
    List<Object[]> getLeaderboardByTournament(@Param("tid") Long tournamentId);
}
