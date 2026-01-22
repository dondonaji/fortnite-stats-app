'use client';

import { useEffect, useState } from 'react';

export function Footer() {
    const [visits, setVisits] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/visits')
            .then(res => res.ok ? res.json() : null)
            .then(data => data && setVisits(data.count))
            .catch(() => { });
    }, []);

    return (
        <footer style={{
            padding: '1rem 1.5rem',
            background: '#09090b',
            borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
            <div style={{
                maxWidth: 1152,
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 11,
                color: '#71717a'
            }}>
                {/* Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 600, color: '#d4d4d8' }}>FN Stats Pro</span>
                    <span style={{ background: '#7c3aed', color: 'white', fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>BETA v1.1</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ color: '#22c55e' }}>Online</span>
                    </div>
                </div>

                {/* Center */}
                {visits !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 600, color: '#d4d4d8', fontVariantNumeric: 'tabular-nums' }}>{visits.toLocaleString()}</span>
                        <span>visitas</span>
                    </div>
                )}

                {/* Right */}
                <div style={{ textAlign: 'right' }}>
                    <span>Diseñado por </span>
                    <span style={{ color: '#d4d4d8', fontWeight: 500 }}>Don</span>
                </div>
            </div>
        </footer>
    );
}
