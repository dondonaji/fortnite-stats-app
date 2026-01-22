'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const POPULAR_PLAYERS = ['Tfue', 'Bugha', 'Clix', 'Mongraal', 'MrSavage'];

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  const handleSearch = () => {
    if (username.trim()) {
      localStorage.setItem('FN_USER', username);
      router.push(`/player/${encodeURIComponent(username)}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>

      {/* SEARCH CARD */}
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '2rem',
        textAlign: 'center'
      }}>
        {/* Logo + Name in one row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4c1d95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} style={{ color: 'white' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>FN Stats Pro</h1>
        </div>
        <p style={{ color: '#52525b', fontSize: 11, margin: '0 0 1.5rem' }}>Estadísticas de Fortnite</p>

        {/* Search Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#52525b', pointerEvents: 'none', zIndex: 1 }} />
            <Input
              placeholder="Nombre de jugador..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                paddingLeft: 36,
                height: 40,
                fontSize: 13,
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6
              }}
            />
          </div>
          <Button
            onClick={handleSearch}
            style={{ height: 40, paddingLeft: 16, paddingRight: 16, background: '#7c3aed', borderRadius: 6 }}
          >
            Buscar
          </Button>
        </div>

        {/* Popular Suggestions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', justifyContent: 'center' }}>
          {POPULAR_PLAYERS.map((player) => (
            <button
              key={player}
              onClick={() => {
                localStorage.setItem('FN_USER', player);
                router.push(`/player/${encodeURIComponent(player)}`);
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 500,
                color: '#71717a',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
                e.currentTarget.style.color = '#a1a1aa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = '#71717a';
              }}
            >
              {player}
            </button>
          ))}
        </div>
      </div>

      {/* CORNER INFO */}
      <div style={{ position: 'absolute', bottom: 16, right: 20, fontSize: 10, color: '#52525b', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e' }} />
        <span>Online</span>
        <span style={{ background: '#7c3aed', color: 'white', fontSize: 8, padding: '1px 4px', borderRadius: 3, fontWeight: 600, marginLeft: 4 }}>BETA</span>
      </div>
    </div>
  );
}
