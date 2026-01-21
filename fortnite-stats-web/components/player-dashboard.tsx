'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Trophy, Target, Shield, Clock, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FortnitePlayer } from '@/types';

// Components
import { SkillRadar } from '@/components/SkillRadar';
import { SurvivalChart } from '@/components/SurvivalChart';
import { ProgressChart } from '@/components/ProgressChart';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-8"
        >
            {/* Header / Nav */}
            <header className="flex justify-between items-center py-4">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary text-primary-foreground w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(191,90,242,0.5)]">
                        FN
                    </div>
                    <h1 className="text-2xl text-white group-hover:text-primary transition-colors">
                        STATS PRO
                    </h1>
                </Link>
                <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-destructive hover:bg-destructive/10 px-4 py-2 rounded-full transition-colors border border-destructive/20"
                >
                    CHANGE PLAYER
                </button>
            </header>

            {/* ERROR STATE */}
            {apiError && !isLoading && (
                <Card className="gaming-card border-red-500/50 bg-red-950/20">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <h2 className="text-3xl text-red-500">Player Not Found</h2>
                        <p className="text-muted-foreground">Could not find stats for "{username}". Check the spelling or privacy settings.</p>
                        <button onClick={handleLogout} className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform uppercase">
                            Try Again
                        </button>
                    </CardContent>
                </Card>
            )}

            {/* LOADING STATE - SKELETONS */}
            {isLoading && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <Skeleton className="h-[400px] w-full rounded-3xl bg-white/5" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-24 w-full rounded-xl bg-white/5" />
                            <Skeleton className="h-24 w-full rounded-xl bg-white/5" />
                        </div>
                    </div>
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/5" />)}
                        </div>
                        <Skeleton className="h-[300px] w-full rounded-3xl bg-white/5" />
                    </div>
                </div>
            )}

            {/* DATA STATE - THE DASHBOARD */}
            {data && !isLoading && !apiError && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: HERO PROFILE */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Card className="gaming-card relative overflow-hidden h-full border-primary/20">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

                            <CardContent className="flex flex-col items-center p-8 h-full">
                                {/* Avatar */}
                                <div className="relative mb-6">
                                    <div className="w-40 h-40 rounded-full bg-black border-4 border-primary shadow-[0_0_40px_rgba(191,90,242,0.4)] flex items-center justify-center overflow-hidden">
                                        <span className="text-6xl font-black text-white">
                                            {data.account.name.slice(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                    <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-black font-black text-xs px-3 py-1 border-2 border-black">
                                        LVL {data.battlePass.level}
                                    </Badge>
                                </div>

                                <h2 className="text-4xl text-center mb-8 break-all leading-none">{data.account.name}</h2>

                                <Separator className="bg-white/10 mb-8" />

                                <div className="grid grid-cols-2 gap-4 w-full mt-auto">
                                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                        <div className="text-muted-foreground text-[10px] font-bold uppercase mb-1">Time Played</div>
                                        <div className="text-lg font-bold">{formatMinutes(data.stats.all.overall.minutesPlayed)}</div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                        <div className="text-muted-foreground text-[10px] font-bold uppercase mb-1">Matches</div>
                                        <div className="text-lg font-bold">{data.stats.all.overall.matches}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: DATA GRID */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* KPI GRID */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'WINS', value: data.stats.all.overall.wins, icon: Trophy, color: 'text-yellow-400', glow: 'shadow-yellow-400/20' },
                                { label: 'K/D', value: data.stats.all.overall.kd.toFixed(2), icon: Target, color: 'text-red-500', glow: 'shadow-red-500/20' },
                                { label: 'WIN %', value: `${data.stats.all.overall.winRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-green-400', glow: 'shadow-green-400/20' },
                                { label: 'KILLS', value: data.stats.all.overall.kills, icon: Shield, color: 'text-blue-400', glow: 'shadow-blue-400/20' }
                            ].map((stat, i) => (
                                <Card key={i} className={`gaming-card border-l-4 border-l-${stat.color.split('-')[1]}-500 group overflow-hidden`}>
                                    <CardContent className="p-5 flex flex-col items-center justify-center relative z-10">
                                        <stat.icon size={24} className={`${stat.color} mb-2 opacity-80 group-hover:scale-110 transition-transform`} />
                                        <div className="text-3xl md:text-4xl font-black tracking-tighter">{stat.value}</div>
                                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</div>
                                    </CardContent>
                                    <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color.split('-')[1]}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                </Card>
                            ))}
                        </div>

                        {/* CHARTS CONTAINER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                            {/* RADAR */}
                            <Card className="gaming-card flex flex-col">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm text-muted-foreground">SKILL RADAR</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 min-h-[250px] flex items-center justify-center">
                                    <div className="w-full h-full max-h-[300px]">
                                        <SkillRadar stats={data.stats.all.overall} />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* TRENDS */}
                            <div className="flex flex-col gap-6">
                                <Card className="gaming-card flex-1">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" /> SURVIVAL
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[150px]">
                                        <SurvivalChart stats={data.stats.all.overall} />
                                    </CardContent>
                                </Card>
                                <Card className="gaming-card flex-1">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" /> PROGRESS
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[150px]">
                                        <ProgressChart history={data.history || []} />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </motion.div>
    );
}
