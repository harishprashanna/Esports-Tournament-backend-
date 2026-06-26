package com.example.esports.repository;

import com.example.esports.entity.Team;
import com.example.esports.entity.TeamJoinRequest;
import com.example.esports.entity.User;
import com.example.esports.enums.JoinRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamJoinRequestRepository extends JpaRepository<TeamJoinRequest, Long> {
    List<TeamJoinRequest> findByTeamAndStatus(Team team, JoinRequestStatus status);
    List<TeamJoinRequest> findByUserAndStatus(User user, JoinRequestStatus status);
    Optional<TeamJoinRequest> findByTeamAndUser(Team team, User user);
    boolean existsByTeamAndUserAndStatus(Team team, User user, JoinRequestStatus status);
}
