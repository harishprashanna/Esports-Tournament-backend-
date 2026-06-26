package com.example.esports.service;

import com.example.esports.dto.JoinRequestResponse;
import com.example.esports.dto.TeamRequest;
import com.example.esports.dto.TeamResponse;
import com.example.esports.entity.*;
import com.example.esports.enums.JoinRequestStatus;
import com.example.esports.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamJoinRequestRepository joinRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public TeamResponse createTeam(TeamRequest request, User captain) {
        if (teamRepository.existsByName(request.getName())) {
            throw new RuntimeException("Team name already taken");
        }
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .captain(captain)
                .build();
        team = teamRepository.save(team);

        TeamMember captainMember = TeamMember.builder()
                .team(team)
                .user(captain)
                .build();
        teamMemberRepository.save(captainMember);

        return toResponse(team);
    }

    public TeamResponse getTeam(Long teamId) {
        return toResponse(findTeam(teamId));
    }

    public List<TeamResponse> getAllTeams() {
        return teamRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public JoinRequestResponse requestJoin(Long teamId, User user) {
        Team team = findTeam(teamId);
        if (teamMemberRepository.existsByTeamAndUser(team, user)) {
            throw new RuntimeException("You are already a member of this team");
        }
        if (joinRequestRepository.existsByTeamAndUserAndStatus(team, user, JoinRequestStatus.PENDING)) {
            throw new RuntimeException("Join request already pending");
        }
        TeamJoinRequest req = TeamJoinRequest.builder()
                .team(team).user(user).status(JoinRequestStatus.PENDING).build();
        req = joinRequestRepository.save(req);
        return toJoinResponse(req);
    }

    @Transactional
    public JoinRequestResponse handleJoinRequest(Long requestId, boolean accept, User captain) {
        TeamJoinRequest req = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));
        if (!req.getTeam().getCaptain().getId().equals(captain.getId())) {
            throw new RuntimeException("Only the team captain can manage join requests");
        }
        if (req.getStatus() != JoinRequestStatus.PENDING) {
            throw new RuntimeException("Request already processed");
        }
        req.setStatus(accept ? JoinRequestStatus.ACCEPTED : JoinRequestStatus.REJECTED);
        joinRequestRepository.save(req);
        if (accept) {
            teamMemberRepository.save(TeamMember.builder().team(req.getTeam()).user(req.getUser()).build());
        }
        return toJoinResponse(req);
    }

    @Transactional
    public void leaveTeam(Long teamId, User user) {
        Team team = findTeam(teamId);
        if (team.getCaptain().getId().equals(user.getId())) {
            throw new RuntimeException("Captain cannot leave — delete the team instead");
        }
        TeamMember member = teamMemberRepository.findByTeamAndUser(team, user)
                .orElseThrow(() -> new RuntimeException("You are not a member of this team"));
        teamMemberRepository.delete(member);
    }

    @Transactional
    public void removeMember(Long teamId, Long memberId, User captain) {
        Team team = findTeam(teamId);
        if (!team.getCaptain().getId().equals(captain.getId())) {
            throw new RuntimeException("Only the team captain can remove members");
        }
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (member.getId().equals(captain.getId())) {
            throw new RuntimeException("Captain cannot remove themselves");
        }
        TeamMember teamMember = teamMemberRepository.findByTeamAndUser(team, member)
                .orElseThrow(() -> new RuntimeException("User is not a member of this team"));
        teamMemberRepository.delete(teamMember);
    }

    public List<JoinRequestResponse> getPendingRequests(Long teamId, User captain) {
        Team team = findTeam(teamId);
        if (!team.getCaptain().getId().equals(captain.getId())) {
            throw new RuntimeException("Only the team captain can view join requests");
        }
        return joinRequestRepository.findByTeamAndStatus(team, JoinRequestStatus.PENDING)
                .stream().map(this::toJoinResponse).collect(Collectors.toList());
    }

    private Team findTeam(Long id) {
        return teamRepository.findById(id).orElseThrow(() -> new RuntimeException("Team not found"));
    }

    private TeamResponse toResponse(Team team) {
        List<TeamMember> members = teamMemberRepository.findByTeam(team);
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .captainId(team.getCaptain().getId())
                .captainUsername(team.getCaptain().getUsername())
                .members(members.stream().map(m -> TeamResponse.MemberInfo.builder()
                        .userId(m.getUser().getId())
                        .username(m.getUser().getUsername())
                        .inGameName(m.getUser().getInGameName())
                        .joinedAt(m.getJoinedAt())
                        .build()).collect(Collectors.toList()))
                .createdAt(team.getCreatedAt())
                .build();
    }

    private JoinRequestResponse toJoinResponse(TeamJoinRequest req) {
        return JoinRequestResponse.builder()
                .id(req.getId())
                .teamId(req.getTeam().getId())
                .teamName(req.getTeam().getName())
                .userId(req.getUser().getId())
                .username(req.getUser().getUsername())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .build();
    }
}
