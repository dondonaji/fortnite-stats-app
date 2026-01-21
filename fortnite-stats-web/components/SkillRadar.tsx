'use client';

import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Eye, EyeOff } from 'lucide-react';

interface SkillRadarProps {
    stats: {
        kd: number;
        winRate: number;
        scorePerMin: number;
        matches: number;
        kills: number;
        top10: number;
    };
}

export function SkillRadar({ stats }: SkillRadarProps) {
    const [showLabels, setShowLabels] = useState(true);

    // Baselines for Average Player (Normalization)
    const MAX_KD = 5.0;
    const MAX_WINRATE = 20.0;
    const MAX_SCORE_MIN = 500.0; // Adjusted scale for XP/Score per min
    const MAX_KILLS_MATCH = 6.0;

    const killsPerMatch = stats.matches > 0 ? stats.kills / stats.matches : 0;

    // Calculate Survival (Top 10 Rate)
    const top10Rate = stats.matches > 0 ? (stats.top10 / stats.matches) * 100 : 0;
    const MAX_TOP10_RATE = 25.0;

    // Normalize (0-100 scale)
    const data = [
        {
            subject: 'COMBATE',
            key: 'K/D',
            A: Math.min((stats.kd / MAX_KD) * 100, 100),
            fullMark: 100,
            value: stats.kd.toFixed(2),
        },
        {
            subject: 'VICTORIA',
            key: 'Win %',
            A: Math.min((stats.winRate / MAX_WINRATE) * 100, 100),
            fullMark: 100,
            value: `${stats.winRate.toFixed(1)}%`,
        },
        {
            subject: 'EFICIENCIA',
            key: 'Score/M',
            A: Math.min((stats.scorePerMin / MAX_SCORE_MIN) * 100, 100),
            fullMark: 100,
            value: stats.scorePerMin.toFixed(0),
        },
        {
            subject: 'AGRESIVIDAD',
            key: 'Kills/Match',
            A: Math.min((killsPerMatch / MAX_KILLS_MATCH) * 100, 100),
            fullMark: 100,
            value: killsPerMatch.toFixed(1),
        },
        {
            subject: 'SUPERVIVENCIA',
            key: 'Top 10',
            A: Math.min((top10Rate / MAX_TOP10_RATE) * 100, 100),
            fullMark: 100,
            value: `${top10Rate.toFixed(1)}%`,
        },
    ];

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Toggle Visibility Button - Moved to bottom right */}
            <button
                onClick={() => setShowLabels(!showLabels)}
                className="absolute bottom-0 right-0 p-2 text-white/10 hover:text-white/50 transition-colors z-10"
                title={showLabels ? "Hide Labels" : "Show Labels"}
            >
                {showLabels ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>

            <div className="flex-1 w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#30333d" strokeDasharray="3 3" />

                        {showLabels && (
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#a0a0a0', fontSize: 10, fontWeight: 'bold', fontFamily: 'var(--font-orbitron)' }}
                            />
                        )}

                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                        <Radar
                            name="Stats"
                            dataKey="A"
                            stroke="#bf5af2"
                            strokeWidth={3}
                            fill="#bf5af2"
                            fillOpacity={0.4}
                            isAnimationActive={true}
                        />

                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-[#1a1c24] border border-[#bf5af2]/30 p-3 rounded-lg shadow-xl backdrop-blur-xl">
                                            <p className="text-[#bf5af2] font-orbitron font-bold text-xs mb-1">{data.subject}</p>
                                            <p className="text-white font-black text-xl">{data.value}</p>
                                            <p className="text-white/40 text-[10px] uppercase tracking-wider">{data.key}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="text-center text-[10px] text-[#a0a0a0]/50 mt-2 font-mono">
                * Based on Pro Benchmarks
            </div>
        </div>
    );
}
