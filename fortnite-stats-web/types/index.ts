export interface FortnitePlayer {
    account: {
        id: string;
        name: string;
    };
    battlePass: {
        level: number;
        progress: number;
    };
    image: string | null;
    stats: {
        all: {
            overall: {
                score: number;
                scorePerMin: number;
                scorePerMatch: number;
                wins: number;
                top3: number;
                top5: number;
                top6: number;
                top10: number;
                top12: number;
                top25: number;
                kills: number;
                killsPerMin: number;
                killsPerMatch: number;
                deaths: number;
                kd: number;
                matches: number;
                winRate: number;
                minutesPlayed: number;
                playersOutlived: number;
                lastModified: string;
            };
        };
    };
    history?: HistorySnapshot[];
}

export interface HistorySnapshot {
    recorded_at: string;
    kd: number;
    win_rate: number;
    wins: number;
}
