'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { SkillRadar } from '@/components/SkillRadar';
import { SurvivalChart } from '@/components/SurvivalChart';
import { ProgressChart } from '@/components/ProgressChart';
import { Trophy, Target, Shield, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FortnitePlayer } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatMinutes(minutes: number) {
    if (!minutes) return '0H';
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    if (days > 0) return `${days}D ${hours}H`;
    return `${hours}H ${(minutes % 60)}M`;
}

interface PlayerDashboardProps {
    username: string;
}

export function PlayerDashboard({ username }: PlayerDashboardProps) {
    const router = useRouter();

    const { data: response, error, isLoading } = useSWR(
        `/api/stats?name=${username}`,
        fetcher,
        { revalidateOnFocus: false }
    );

    const data = response?.data as FortnitePlayer | undefined;
    const apiError = response?.error || error;

    const handleLogout = () => {
        localStorage.removeItem('FN_USER');
        router.push('/');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full"
        >
            {/* Header Compacto */}
            <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                <div onClick={handleLogout} className="cursor-pointer group flex items-center gap-3">
                    <div className="bg-[#bf5af2] w-8 h-8 rounded-lg flex items-center justify-center font-black text-black">F</div>
                    <h1 className="text-xl font-bold tracking-tighter text-white uppercase group-hover:text-[#bf5af2] transition-colors">
                        STATS PRO
                    </h1>
                </div>
                <button onClick={handleLogout} className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-500 px-6 py-2 rounded-full uppercase tracking-widest transition-colors font-bold border border-red-500/20">
                    SALIR
                </button>
            </header>

            <main>
                {/* Loading State with Custom Skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-fr">
                        {/* Profile Skeleton */}
                        <div className="lg:col-span-4 h-full min-h-[500px]">
                            <Skeleton className="w-full h-full rounded-3xl bg-white/5" />
                        </div>
                        {/* Main Data Skeleton */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <Skeleton key={i} className="h-32 rounded-2xl bg-white/5" />
                                ))}
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                                <Skeleton className="h-[300px] rounded-3xl bg-white/5" />
                                <div className="flex flex-col gap-6 h-full">
                                    <Skeleton className="flex-1 rounded-3xl bg-white/5" />
                                    <Skeleton className="flex-1 rounded-3xl bg-white/5" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {apiError && !isLoading && (
                    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
                        <h2 className="text-4xl font-black mb-4 text-white uppercase">Jugador No Encontrado</h2>
                        <button onClick={handleLogout} className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-widest">Intentar de Nuevo</button>
                    </div>
                )}

                {/* Data State */}
                {data && !isLoading && !apiError && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-fr">

                        {/* === COL 1: PERFIL (4/12) === */}
                        <div className="lg:col-span-4 flex flex-col h-full">
                            <motion.div
                                className="glass-panel rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden h-full shadow-2xl border border-white/10 bg-[#0a0a0a]"
                                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            >
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#bf5af2] to-transparent opacity-50"></div>

                                {/* Avatar */}
                                <div className="mt-4 mb-6 relative">
                                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#111] to-black border-[3px] border-[#bf5af2] flex items-center justify-center shadow-[0_0_60px_-10px_rgba(191,90,242,0.3)]">
                                        <span className="text-7xl font-black text-white tracking-tighter">
                                            {data.account.name.substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                                        <div className="bg-[#bf5af2] text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg border-2 border-black">
                                            NIVEL {data.battlePass.level}
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 break-all uppercase leading-[0.9]">
                                    {data.account.name}
                                </h2>

                                <div className="w-full h-px bg-white/10 my-8"></div>

                                <div className="grid grid-cols-2 gap-4 w-full mt-auto">
                                    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-[#161616] transition-colors group">
                                        <Clock size={20} className="text-white/30 mb-2 group-hover:text-[#bf5af2] transition-colors" />
                                        <div className="text-xl font-bold text-white tabular-nums">{formatMinutes(data.stats.all.overall.minutesPlayed)}</div>
                                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-1">JUGADO</div>
                                    </div>
                                    <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-[#161616] transition-colors group">
                                        <Target size={20} className="text-white/30 mb-2 group-hover:text-[#bf5af2] transition-colors" />
                                        <div className="text-xl font-bold text-white tabular-nums">{data.stats.all.overall.matches}</div>
                                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-1">PARTIDAS</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* === COL 2: MAIN DATA (8/12) === */}
                        <div className="lg:col-span-8 flex flex-col gap-6">

                            {/* KPI ROW - Horizontal on Desktop */}
                            <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                                {[
                                    { label: 'VICTORIAS', value: data.stats.all.overall.wins, icon: Trophy, color: 'text-[#bf5af2]', border: 'border-[#bf5af2]' },
                                    { label: 'K/D RATIO', value: data.stats.all.overall.kd.toFixed(2), icon: Target, color: 'text-blue-500', border: 'border-blue-500' },
                                    { label: 'WIN RATE', value: `${data.stats.all.overall.winRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-green-500', border: 'border-green-500' },
                                    { label: 'KILLS', value: data.stats.all.overall.kills, icon: Shield, color: 'text-red-500', border: 'border-red-500' }
                                ].map((stat, i) => (
                                    <div key={i} className={`glass-card bg-[#0a0a0a] rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden group border-b-4 ${stat.border}`}>
                                        <stat.icon size={24} className={`${stat.color} mb-2 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`} />
                                        <div className="text-3xl lg:text-4xl font-black text-white tabular-nums tracking-tight">{stat.value}</div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CHARTS ROW - 2 Cols on Desktop */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                                <motion.div className="glass-panel rounded-3xl p-6 bg-[#0a0a0a] border border-white/10 flex flex-col" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                                    <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#bf5af2]"></div>
                                        <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Radar de Habilidad</h3>
                                    </div>
                                    <div className="flex-1 w-full min-h-[250px]">
                                        <SkillRadar stats={data.stats.all.overall} />
                                    </div>
                                </motion.div>

                                <div className="flex flex-col gap-6">
                                    <motion.div className="glass-panel rounded-3xl p-6 bg-[#0a0a0a] border border-white/10 flex-1" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Supervivencia</h3>
                                        </div>
                                        <div className="h-[150px] w-full">
                                            <SurvivalChart stats={data.stats.all.overall} />
                                        </div>
                                    </motion.div>

                                    <motion.div className="glass-panel rounded-3xl p-6 bg-[#0a0a0a] border border-white/10 flex-1" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Tendencia</h3>
                                        </div>
                                        <div className="h-[150px] w-full">
                                            <ProgressChart history={data.history || []} />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </motion.div>
    );
}
