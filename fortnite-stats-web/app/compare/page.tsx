'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Swords } from 'lucide-react';
import { ComparisonRadar } from '@/components/ComparisonRadar';

export default function ComparePage() {
    const [userA, setUserA] = useState('');
    const [userB, setUserB] = useState('');
    const [dataA, setDataA] = useState<any>(null);
    const [dataB, setDataB] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCompare = async () => {
        if (!userA || !userB) {
            setError("Ingresa dos usuarios para comparar");
            return;
        }
        setLoading(true);
        setError('');
        setDataA(null);
        setDataB(null);

        try {
            const [resA, resB] = await Promise.all([
                fetch(`/api/stats?name=${userA}`),
                fetch(`/api/stats?name=${userB}`)
            ]);

            const jsonA = await resA.json();
            const jsonB = await resB.json();

            if (resA.ok && resB.ok) {
                setDataA(jsonA.data);
                setDataB(jsonB.data);
            } else {
                setError("No se pudo obtener datos de uno o ambos jugadores. Verifica los nombres.");
            }
        } catch (e) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            {/* Navigation */}
            <header className="flex items-center gap-4 mb-8">
                <Link href="/" className="bg-[#1a1c24] p-2 rounded-lg text-white hover:text-[#bf5af2] transition-colors border border-[#30333d]">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                    Modo <span className="text-[#bf5af2]">Versus</span> <Swords className="text-[#bf5af2]" />
                </h1>
            </header>

            {/* Inputs */}
            <div className="bg-[#1a1c24] p-6 rounded-xl border border-[#30333d] mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <label className="text-[#a0a0a0] text-xs font-bold mb-1 block">JUGADOR A (Tu)</label>
                        <input
                            type="text"
                            value={userA}
                            onChange={(e) => setUserA(e.target.value)}
                            placeholder="Epic ID..."
                            className="w-full bg-[#0e1117] border border-[#30333d] text-white p-3 rounded-lg focus:border-[#bf5af2] outline-none"
                        />
                    </div>

                    <div className="text-[#bf5af2] font-black text-xl">VS</div>

                    <div className="flex-1 w-full">
                        <label className="text-[#a0a0a0] text-xs font-bold mb-1 block">JUGADOR B (Rival)</label>
                        <input
                            type="text"
                            value={userB}
                            onChange={(e) => setUserB(e.target.value)}
                            placeholder="Epic ID..."
                            className="w-full bg-[#0e1117] border border-[#30333d] text-white p-3 rounded-lg focus:border-[#32d74b] outline-none"
                        />
                    </div>

                    <button
                        onClick={handleCompare}
                        disabled={loading}
                        className="w-full md:w-auto bg-[#bf5af2] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#a64ce0] transition-colors disabled:opacity-50 mt-4 md:mt-0"
                    >
                        {loading ? 'Peleando...' : 'FIGHT!'}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
            </div>

            {/* Results */}
            {dataA && dataB && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {/* Player A Stats */}
                    <div className="space-y-4">
                        <h2 className="text-[#bf5af2] font-bold text-xl text-center">{dataA.account.name}</h2>
                        <StatBox label="K/D Ratio" value={dataA.stats.all.overall.kd.toFixed(2)} color="text-[#bf5af2]" />
                        <StatBox label="Win Rate" value={dataA.stats.all.overall.winRate.toFixed(1) + '%'} color="text-white" />
                        <StatBox label="Wins" value={dataA.stats.all.overall.wins} color="text-white" />
                    </div>

                    {/* Radar Center */}
                    <div>
                        <ComparisonRadar
                            statsA={dataA.stats.all.overall}
                            statsB={dataB.stats.all.overall}
                            nameA={dataA.account.name}
                            nameB={dataB.account.name}
                        />
                    </div>

                    {/* Player B Stats */}
                    <div className="space-y-4">
                        <h2 className="text-[#32d74b] font-bold text-xl text-center">{dataB.account.name}</h2>
                        <StatBox label="K/D Ratio" value={dataB.stats.all.overall.kd.toFixed(2)} color="text-[#32d74b]" />
                        <StatBox label="Win Rate" value={dataB.stats.all.overall.winRate.toFixed(1) + '%'} color="text-white" />
                        <StatBox label="Wins" value={dataB.stats.all.overall.wins} color="text-white" />
                    </div>
                </div>
            )}
        </div>
    );
}

function StatBox({ label, value, color }: { label: string, value: string | number, color: string }) {
    return (
        <div className="bg-[#1a1c24] p-4 rounded-lg border border-[#30333d] text-center">
            <div className="text-[#a0a0a0] text-xs font-bold uppercase">{label}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
        </div>
    );
}
