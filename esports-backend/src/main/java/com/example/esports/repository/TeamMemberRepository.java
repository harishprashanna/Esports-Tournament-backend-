package com.example.esports.repository;

import com.example.esports.entity.Team;
import com.example.esports.entity.TeamMember;
import com.example.esports.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByTeam(Team team);
    List<TeamMember> findByUser(User user);
    Optional<TeamMember> findByTeamAndUser(Team team, User user);
    boolean existsByTeamAndUser(Team team, User user);
    void deleteByTeamAndUser(Team team, User user);
}
