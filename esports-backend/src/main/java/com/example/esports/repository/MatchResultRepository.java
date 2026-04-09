package com.example.esports.repository;

import com.example.esports.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {

    @Query("select m.winner.name, count(m) from MatchResult m group by m.winner.id, m.winner.name order by count(m) desc")
    List<Object[]> getLeaderboard();
}
