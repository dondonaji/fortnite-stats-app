'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ComparisonRadarProps {
    statsA: any;
    statsB: any;
    nameA: string;
    nameB: string;
}

export function ComparisonRadar({ statsA, statsB, nameA, nameB }: ComparisonRadarProps) {
    // Baselines
    const MAX_KD = 3.0;
    const MAX_WINRATE = 10.0;
    const MAX_SCORE_MIN = 25.0;
    const MAX_KILLS_MATCH = 4.0;
    const MAX_TOP10 = 20.0;

    const getMetrics = (stats: any) => {
        const kpm = stats.matches > 0 ? stats.kills / stats.matches : 0;
        const top10 = stats.matches > 0 ? (stats.top10 / stats.matches) * 100 : 0;
        return { kpm, top10 };
    };

    const metricsA = getMetrics(statsA);
    const metricsB = getMetrics(statsB);

    const data = [
        {
            subject: 'Combate',
            A: (Math.min(statsA.kd, MAX_KD) / MAX_KD) * 100,
            B: (Math.min(statsB.kd, MAX_KD) / MAX_KD) * 100,
            fullMark: 100,
            valA: statsA.kd.toFixed(2),
            valB: statsB.kd.toFixed(2),
        },
        {
            subject: 'Victoria',
            A: (Math.min(statsA.winRate, MAX_WINRATE) / MAX_WINRATE) * 100,
            B: (Math.min(statsB.winRate, MAX_WINRATE) / MAX_WINRATE) * 100,
            fullMark: 100,
            valA: `${statsA.winRate.toFixed(1)}%`,
            valB: `${statsB.winRate.toFixed(1)}%`,
        },
        {
            subject: 'Eficiencia',
            A: (Math.min(statsA.scorePerMin, MAX_SCORE_MIN) / MAX_SCORE_MIN) * 100,
            B: (Math.min(statsB.scorePerMin, MAX_SCORE_MIN) / MAX_SCORE_MIN) * 100,
            fullMark: 100,
            valA: statsA.scorePerMin.toFixed(1),
            valB: statsB.scorePerMin.toFixed(1),
        },
        {
            subject: 'Agresividad',
            A: (Math.min(metricsA.kpm, MAX_KILLS_MATCH) / MAX_KILLS_MATCH) * 100,
            B: (Math.min(metricsB.kpm, MAX_KILLS_MATCH) / MAX_KILLS_MATCH) * 100,
            fullMark: 100,
            valA: metricsA.kpm.toFixed(1),
            valB: metricsB.kpm.toFixed(1),
        },
        {
            subject: 'Supervivencia',
            A: (Math.min(metricsA.top10, MAX_TOP10) / MAX_TOP10) * 100,
            B: (Math.min(metricsB.top10, MAX_TOP10) / MAX_TOP10) * 100,
            fullMark: 100,
            valA: `${metricsA.top10.toFixed(1)}%`,
            valB: `${metricsB.top10.toFixed(1)}%`,
        },
    ];

    return (
        <div className="bg-[#1a1c24] p-4 rounded-xl border border-[#30333d] h-[400px] flex flex-col">
            <h3 className="text-white font-bold mb-2 text-center">
                Radar Comparativo
            </h3>

            <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#30333d" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0a0a0', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                        <Radar
                            name={nameA}
                            dataKey="A"
                            stroke="#bf5af2"
                            strokeWidth={3}
                            fill="#bf5af2"
                            fillOpacity={0.3}
                        />
                        <Radar
                            name={nameB}
                            dataKey="B"
                            stroke="#32d74b"
                            strokeWidth={3}
                            fill="#32d74b"
                            fillOpacity={0.3}
                        />

                        <Legend />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1c24', borderColor: '#30333d', color: '#fff' }}
                            formatter={(value: any, name: any, props: any) => {
                                const key = name === nameA ? 'valA' : 'valB';
                                return [props.payload[key], name];
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
