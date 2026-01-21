'use client';

import { useEffect, useState } from 'react';

export function DevModeBadge() {
    const [env, setEnv] = useState<string | null>(null);

    useEffect(() => {
        // Vercel sets this automagically
        const currentEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || 'development';
        if (currentEnv !== 'production') {
            setEnv(currentEnv.toUpperCase());
        }
    }, []);

    if (!env) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
            <div className="bg-[#bf5af2]/10 backdrop-blur-md border border-[#bf5af2]/30 px-3 py-1 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(191,90,242,0.2)]">
                <div className="w-2 h-2 rounded-full bg-[#bf5af2] animate-pulse"></div>
                <span className="text-[10px] font-mono font-bold text-[#bf5af2] tracking-widest">
                    {env === 'PREVIEW' ? 'LABS / PREVIEW' : 'LOCAL DEV'}
                </span>
            </div>
        </div>
    );
}
