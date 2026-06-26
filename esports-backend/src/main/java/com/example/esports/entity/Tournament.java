package com.example.esports.entity;

import com.example.esports.enums.GameCategory;
import com.example.esports.enums.GameType;
import com.example.esports.enums.TournamentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tournaments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameType gameType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameCategory category;

    @Column(nullable = false)
    private Integer maxTeams;

    @Column(name = "registration_deadline")
    private LocalDateTime registrationDeadline;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "prize_pool")
    private String prizePool;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TournamentStatus status = TournamentStatus.UPCOMING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
