'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Trophy, Target, Percent, Gamepad2, Crosshair, Skull, Timer, Search, Zap, Crown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FortnitePlayer } from '@/types';
import { theme } from '@/lib/theme';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { SkillRadar } from '@/components/SkillRadar';
import { SurvivalChart } from '@/components/SurvivalChart';
import { ProgressChart } from '@/components/ProgressChart';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface PlayerDashboardProps {
    username: string;
}

export function PlayerDashboard({ username }: PlayerDashboardProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const { data: response, isLoading } = useSWR(
        `/api/stats?name=${encodeURIComponent(username)}`,
        fetcher,
        { revalidateOnFocus: false }
    );

    const data = response?.data as FortnitePlayer | undefined;

    const handleSearch = () => {
        if (searchQuery.trim()) {
            localStorage.setItem('FN_USER', searchQuery);
            router.push(`/player/${encodeURIComponent(searchQuery)}`);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-16 bg-zinc-800 rounded-lg" />
                    <div className="h-40 bg-zinc-800 rounded-lg" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-zinc-800 rounded-lg" />)}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-2xl font-bold mb-2">Jugador No Encontrado</h2>
                <p className="text-zinc-400 mb-6">No pudimos encontrar "{username}"</p>
                <Button onClick={() => router.push('/')}>Volver al Inicio</Button>
            </div>
        );
    }

    const stats = data.stats.all.overall;
    const initials = data.account.name?.slice(0, 2).toUpperCase() || 'FN';
    const killsPerMatch = stats.matches > 0 ? (stats.kills / stats.matches).toFixed(1) : '0';
    const avgSurvivalMins = stats.matches > 0 ? Math.round(stats.minutesPlayed / stats.matches) : 0;
    const hours = stats.minutesPlayed ? Math.round(stats.minutesPlayed / 60) : 0;

    // Border radius constants - gaming aesthetic
    const R = { card: 10, inner: 6, badge: 4 };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 pb-20">

            {/* HEADER */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Link href="/" onClick={() => localStorage.removeItem('FN_USER')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: 'linear-gradient(135deg, #7c3aed, #4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={16} style={{ color: 'white' }} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>FN Stats Pro</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#52525b', pointerEvents: 'none' }} />
                        <Input
                            placeholder="Buscar jugador..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            style={{ paddingLeft: 30, width: 160, height: 32, fontSize: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: R.inner }}
                        />
                    </div>
                    <Button onClick={handleSearch} size="sm" style={{ height: 32, fontSize: 12, borderRadius: R.inner }}>Buscar</Button>
                    <Button
                        size="sm"
                        disabled
                        style={{ height: 32, fontSize: 12, borderRadius: R.inner, opacity: 0.5, cursor: 'not-allowed' }}
                        title="Próximamente"
                    >
                        Versus
                    </Button>
                </div>
            </header>

            {/* PLAYER CARD - HERO SIZE */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: R.card, padding: '2rem 2.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {/* Avatar - Hero Size */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 100, height: 100, borderRadius: 16, background: 'linear-gradient(135deg, #7c3aed, #4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, color: 'white' }}>
                            {initials}
                        </div>
                        <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', background: '#eab308', color: 'black', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: R.badge, whiteSpace: 'nowrap' }}>
                            LVL {data.battlePass.level}
                        </div>
                    </div>

                    {/* Name & Stats */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{data.account.name}</h1>
                        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '1rem' }}>
                            <StatPill icon={Timer} label="Tiempo Jugado" value={`${hours.toLocaleString()}h`} />
                            <StatPill icon={Gamepad2} label="Partidas" value={stats.matches.toLocaleString()} />
                            <StatPill icon={Crown} label="Pase de Batalla" value={`Nivel ${data.battlePass.level}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* KPIs - 4 columnas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.25rem' }}>
                <KpiCard icon={Trophy} label="Victorias" value={stats.wins} iconColor="#facc15" r={R} />
                <KpiCard icon={Gamepad2} label="Partidas" value={stats.matches} iconColor="#3b82f6" r={R} />
                <KpiCard icon={Target} label="K/D Ratio" value={stats.kd.toFixed(2)} iconColor="#ef4444" r={R} />
                <KpiCard icon={Percent} label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} iconColor="#22c55e" r={R} />
            </div>

            {/* PENTAGRAMA + ANÁLISIS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: R.card, padding: '1rem' }}>
                    <h3 style={{ fontSize: 10, fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>Pentagrama</h3>
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SkillRadar stats={stats} />
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: R.card, padding: '1rem' }}>
                    <h3 style={{ fontSize: 10, fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>Análisis de Habilidades</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                        <StatBox icon={Crosshair} label="Kills/Partida" value={killsPerMatch} r={R} />
                        <StatBox icon={Timer} label="Supervivencia" value={`${avgSurvivalMins}m`} r={R} />
                        <StatBox icon={Trophy} label="Ratio Victoria" value={`1:${stats.wins > 0 ? Math.round(stats.matches / stats.wins) : '∞'}`} r={R} />
                        <StatBox icon={Skull} label="Total Kills" value={stats.kills.toLocaleString()} r={R} />
                    </div>
                </div>
            </div>

            {/* SUPERVIVENCIA + POSICIONES */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: R.card, padding: '1rem' }}>
                    <h3 style={{ fontSize: 10, fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>Análisis de Supervivencia</h3>
                    <div style={{ height: 180 }}>
                        <SurvivalChart stats={stats} />
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: R.card, padding: '1rem' }}>
                    <h3 style={{ fontSize: 10, fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem' }}>Posiciones</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        <ProgressRow label="Top 25" value={stats.top25 || 0} total={stats.matches} color="#3b82f6" />
                        <ProgressRow label="Top 10" value={stats.top10 || 0} total={stats.matches} color="#8b5cf6" />
                        <ProgressRow label="Top 5" value={stats.top5 || 0} total={stats.matches} color="#f97316" />
                        <ProgressRow label="Top 3" value={stats.top3 || 0} total={stats.matches} color="#eab308" />
                        <ProgressRow label="Wins" value={stats.wins} total={stats.matches} color="#22c55e" />
                    </div>
                </div>
            </div>

            {/* HISTÓRICO */}
            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: R.card, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                    <h3 style={{ fontSize: 10, fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Progreso Histórico</h3>
                    <span style={{ fontSize: 11, color: '#52525b' }}>Últimos 30 días</span>
                </div>
                <div style={{ height: 140 }}>
                    <ProgressChart history={data.history || []} />
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function StatPill({ icon: Icon, label, value, subtitle }: { icon: any; label: string; value: string; subtitle?: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon size={11} style={{ color: '#71717a' }} />
                <span style={{ fontSize: 10, fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{value}</span>
            {subtitle && <span style={{ fontSize: 9, color: '#52525b' }}>{subtitle}</span>}
        </div>
    );
}

function KpiCard({ icon: Icon, label, value, iconColor, r }: { icon: any; label: string; value: string | number; iconColor: string; r: { card: number; inner: number } }) {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: r.card,
                padding: '0.875rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: 'default'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <Icon size={18} style={{ color: iconColor, opacity: 0.85, marginBottom: 6 }} />
            <div style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</div>
            <div style={{ fontSize: 9, fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>{label}</div>
        </div>
    );
}

function StatBox({ icon: Icon, label, value, r }: { icon: any; label: string; value: string; r: { inner: number } }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: r.inner, padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <Icon size={11} style={{ color: '#a855f7' }} />
                <span style={{ fontSize: 9, fontWeight: 500, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</div>
        </div>
    );
}

function ProgressRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
    const pct = total > 0 ? (value / total) * 100 : 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: '#71717a', width: 44 }}>{label}</span>
            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 999 }}>
                <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 999 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums', width: 32, textAlign: 'right' }}>{value}</span>
        </div>
    );
}
