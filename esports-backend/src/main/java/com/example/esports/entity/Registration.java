package com.example.esports.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "registrations", uniqueConstraints = @UniqueConstraint(columnNames = {"team_id", "tournament_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;
}
