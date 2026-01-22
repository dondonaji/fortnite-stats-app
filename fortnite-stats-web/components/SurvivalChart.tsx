'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SurvivalChartProps {
    stats: {
        top25: number;
        top12: number;
        top10: number;
        top6: number;
        top5: number;
        top3: number;
        wins: number;
    };
}

export function SurvivalChart({ stats }: SurvivalChartProps) {
    const data = [
        { name: 'Top 25', value: stats.top25 },
        { name: 'Top 12', value: stats.top12 },
        { name: 'Top 10', value: stats.top10 },
        { name: 'Top 6', value: stats.top6 },
        { name: 'Top 5', value: stats.top5 },
        { name: 'Top 3', value: stats.top3 },
        { name: 'Win', value: stats.wins },
    ];

    return (
        <div className="w-full h-full min-h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="survivalGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0a84ff" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0a84ff" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30333d" vertical={false} opacity={0.5} />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#a0a0a0', fontSize: 10, fontFamily: 'var(--font-orbitron)' }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        dy={10}
                    />
                    <YAxis
                        tick={{ fill: '#a0a0a0', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(26, 28, 36, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}
                        itemStyle={{ color: '#0a84ff' }}
                        cursor={{ stroke: '#30333d', strokeWidth: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0a84ff"
                        strokeWidth={3}
                        dot={{ r: 3, fill: '#0a84ff', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
