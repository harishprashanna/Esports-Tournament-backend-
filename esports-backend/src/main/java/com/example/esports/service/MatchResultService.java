package com.example.esports.service;

import com.example.esports.dto.MatchResponse;
import com.example.esports.dto.MatchResultRequest;
import com.example.esports.entity.*;
import com.example.esports.enums.MatchStatus;
import com.example.esports.enums.TournamentStatus;
import com.example.esports.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchResultService {

    private final MatchResultRepository matchResultRepository;
    private final TournamentRepository tournamentRepository;
    private final TeamRepository teamRepository;
    private final RegistrationRepository registrationRepository;
    private final StringRedisTemplate redisTemplate;

    @Transactional
    public List<MatchResponse> generateBracket(Long tournamentId) {
        Tournament tournament = findTournament(tournamentId);
        List<Registration> registrations = registrationRepository.findByTournament(tournament);
        if (registrations.size() < 2) {
            throw new RuntimeException("Need at least 2 registered teams to generate a bracket");
        }

        List<Team> teams = registrations.stream()
                .map(Registration::getTeam).collect(Collectors.toList());
        Collections.shuffle(teams);

        List<MatchResult> matches = new ArrayList<>();
        int matchNumber = 1;
        for (int i = 0; i < teams.size() - 1; i += 2) {
            matches.add(MatchResult.builder()
                    .tournament(tournament).roundNumber(1).matchNumber(matchNumber++)
                    .team1(teams.get(i)).team2(teams.get(i + 1)).status(MatchStatus.SCHEDULED)
                    .build());
        }
        if (teams.size() % 2 != 0) {
            Team bye = teams.get(teams.size() - 1);
            matches.add(MatchResult.builder()
                    .tournament(tournament).roundNumber(1).matchNumber(matchNumber)
                    .team1(bye).status(MatchStatus.BYE).winner(bye).build());
        }

        matchResultRepository.saveAll(matches);
        tournament.setStatus(TournamentStatus.ONGOING);
        tournamentRepository.save(tournament);
        redisTemplate.delete("leaderboard:tournament:" + tournamentId);
        return matches.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public MatchResponse submitResult(MatchResultRequest request) {
        MatchResult match = matchResultRepository.findById(request.getMatchId())
                .orElseThrow(() -> new RuntimeException("Match not found"));
        if (match.getStatus() == MatchStatus.COMPLETED) {
            throw new RuntimeException("Result already submitted");
        }
        if (match.getStatus() == MatchStatus.BYE) {
            throw new RuntimeException("Cannot submit result for a bye match");
        }

        Team winner = teamRepository.findById(request.getWinnerId())
                .orElseThrow(() -> new RuntimeException("Winner team not found"));
        boolean valid = (match.getTeam1() != null && match.getTeam1().getId().equals(winner.getId())) ||
                (match.getTeam2() != null && match.getTeam2().getId().equals(winner.getId()));
        if (!valid) throw new RuntimeException("Winner must be one of the two teams");

        match.setWinner(winner);
        match.setTeam1Score(request.getTeam1Score());
        match.setTeam2Score(request.getTeam2Score());
        match.setNotes(request.getNotes());
        match.setStatus(MatchStatus.COMPLETED);
        matchResultRepository.save(match);
        advanceBracket(match);
        redisTemplate.delete("leaderboard:tournament:" + match.getTournament().getId());
        return toResponse(match);
    }

    private void advanceBracket(MatchResult completed) {
        Tournament tournament = completed.getTournament();
        int round = completed.getRoundNumber();
        List<MatchResult> roundMatches = matchResultRepository
                .findByTournamentIdAndRoundNumber(tournament.getId(), round);
        boolean allDone = roundMatches.stream()
                .allMatch(m -> m.getStatus() == MatchStatus.COMPLETED || m.getStatus() == MatchStatus.BYE);
        if (!allDone) return;

        List<Team> winners = roundMatches.stream().map(MatchResult::getWinner).collect(Collectors.toList());
        if (winners.size() == 1) {
            tournament.setStatus(TournamentStatus.COMPLETED);
            tournamentRepository.save(tournament);
            return;
        }

        int nextRound = round + 1;
        int matchNum = 1;
        List<MatchResult> next = new ArrayList<>();
        for (int i = 0; i < winners.size() - 1; i += 2) {
            next.add(MatchResult.builder()
                    .tournament(tournament).roundNumber(nextRound).matchNumber(matchNum++)
                    .team1(winners.get(i)).team2(winners.get(i + 1)).status(MatchStatus.SCHEDULED)
                    .build());
        }
        if (winners.size() % 2 != 0) {
            Team bye = winners.get(winners.size() - 1);
            next.add(MatchResult.builder()
                    .tournament(tournament).roundNumber(nextRound).matchNumber(matchNum)
                    .team1(bye).status(MatchStatus.BYE).winner(bye).build());
        }
        matchResultRepository.saveAll(next);
    }

    public List<MatchResponse> getBracket(Long tournamentId) {
        return matchResultRepository
                .findByTournamentIdOrderByRoundNumberAscMatchNumberAsc(tournamentId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MatchResponse> getTeamHistory(Long teamId) {
        return matchResultRepository.findMatchHistoryByTeamId(teamId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private Tournament findTournament(Long id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
    }

    private MatchResponse toResponse(MatchResult m) {
        return MatchResponse.builder()
                .id(m.getId())
                .tournamentId(m.getTournament().getId())
                .tournamentName(m.getTournament().getName())
                .roundNumber(m.getRoundNumber())
                .matchNumber(m.getMatchNumber())
                .team1Id(m.getTeam1() != null ? m.getTeam1().getId() : null)
                .team1Name(m.getTeam1() != null ? m.getTeam1().getName() : "TBD")
                .team2Id(m.getTeam2() != null ? m.getTeam2().getId() : null)
                .team2Name(m.getTeam2() != null ? m.getTeam2().getName() : "BYE")
                .winnerId(m.getWinner() != null ? m.getWinner().getId() : null)
                .winnerName(m.getWinner() != null ? m.getWinner().getName() : null)
                .team1Score(m.getTeam1Score())
                .team2Score(m.getTeam2Score())
                .status(m.getStatus())
                .scheduledAt(m.getScheduledAt())
                .notes(m.getNotes())
                .build();
    }
}
