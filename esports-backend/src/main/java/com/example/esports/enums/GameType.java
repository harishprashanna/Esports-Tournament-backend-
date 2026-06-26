package com.example.esports.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum GameType {
    PUBGM("PUBG Mobile", GameCategory.MOBILE, 4),
    CODM("Call of Duty Mobile", GameCategory.MOBILE, 5),
    MORTAL_KOMBAT("Mortal Kombat", GameCategory.CONSOLE, 1),
    FIFA("FIFA", GameCategory.CONSOLE, 1),
    VALORANT("Valorant", GameCategory.PC, 5);

    private final String displayName;
    private final GameCategory category;
    private final int maxTeamSize;
}
