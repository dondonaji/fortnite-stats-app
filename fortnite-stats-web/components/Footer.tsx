'use client';

import { useEffect, useState } from 'react';

export function Footer() {
    const [visits, setVisits] = useState<number | null>(null);

    useEffect(() => {
        // Simple fetch to increment and get visits
        console.log('Fetching visit count...');
        fetch('/api/visits')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Visit data received:', data);
                setVisits(data.count);
            })
            .catch(err => console.error('Visit count failed', err));
    }, []);

    return (
        <footer className="fixed bottom-0 left-0 w-full py-4 border-t border-white/5 bg-black/90 backdrop-blur-xl z-[100]">
            <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-white/30 uppercase tracking-widest font-mono gap-4">

                {/* Left: Branding & Status */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-white">FN.STATS PRO</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#bf5af2]/10 text-[#bf5af2] text-[9px] font-bold border border-[#bf5af2]/20">BETA v1.2</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        <span className="text-green-500/80 font-bold">SYSTEM ONLINE</span>
                    </div>
                </div>

                {/* Center: Stats */}
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                        <span className="text-white font-bold tabular-nums">
                            {visits !== null ? visits.toLocaleString() : "..."}
                        </span>
                        <span className="ml-2 text-[9px] text-white/40 font-bold tracking-widest">VISITS</span>
                    </div>
                </div>

                {/* Right: Legal & Credits */}
                <div className="flex flex-col items-start md:items-end gap-1 text-right">
                    <p className="hover:text-white/50 transition-colors">
                        DESIGNED BY <span className="text-white font-bold">DON</span>
                    </p>
                    <p className="max-w-xs text-[9px] leading-relaxed opacity-50">
                        Not affiliated with Epic Games, Inc. Fortnite is a trademark of Epic Games.
                    </p>
                </div>
            </div>
        </footer>
    );
}
