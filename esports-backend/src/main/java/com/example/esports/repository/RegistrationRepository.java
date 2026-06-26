package com.example.esports.repository;

import com.example.esports.entity.Registration;
import com.example.esports.entity.Team;
import com.example.esports.entity.Tournament;
import com.example.esports.enums.GameCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByTeamIdAndTournamentId(Long teamId, Long tournamentId);
    long countByTournamentId(Long tournamentId);
    List<Registration> findByTeam(Team team);
    List<Registration> findByTournament(Tournament tournament);
    void deleteByTeamAndTournament(Team team, Tournament tournament);

    @Query("SELECT r FROM Registration r WHERE r.team.id = :teamId AND r.tournament.category = :category")
    List<Registration> findByTeamIdAndTournamentCategory(@Param("teamId") Long teamId, @Param("category") GameCategory category);
}
