package com.example.esports.repository;

import com.example.esports.entity.Team;
import com.example.esports.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    boolean existsByName(String name);
    Optional<Team> findByName(String name);
    List<Team> findByCaptain(User captain);
}
