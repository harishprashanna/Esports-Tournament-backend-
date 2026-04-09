package com.example.esports.repository;

import com.example.esports.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    boolean existsByTeamIdAndTournamentId(Long teamId, Long tournamentId);
    long countByTournamentId(Long tournamentId);
}
