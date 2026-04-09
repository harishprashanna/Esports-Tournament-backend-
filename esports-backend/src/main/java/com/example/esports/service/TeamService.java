package com.example.esports.service;

import com.example.esports.dto.TeamRequest;
import com.example.esports.entity.Team;
import com.example.esports.entity.User;
import com.example.esports.repository.TeamRepository;
import com.example.esports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public Team createTeam(TeamRequest request) {
        if (teamRepository.existsByName(request.getName())) {
            throw new RuntimeException("Team name already exists");
        }
        User captain = userRepository.findById(request.getCaptainId())
                .orElseThrow(() -> new RuntimeException("Captain not found"));
        Team team = Team.builder()
                .name(request.getName())
                .captain(captain)
                .build();
        return teamRepository.save(team);
    }
}
