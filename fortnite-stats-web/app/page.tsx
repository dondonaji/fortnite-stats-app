'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchUser, setSearchUser] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Auto-redirect if user was last seen
    const savedUser = localStorage.getItem('FN_USER');
    if (savedUser) {
      router.push(`/player/${savedUser}`);
    }
  }, [router]);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // Save for future auto-login
      localStorage.setItem('FN_USER', term);

      // Log search (Fire & forget)
      fetch('/api/log-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: term })
      }).catch(err => console.error('Search log failed', err));

      router.push(`/player/${encodeURIComponent(term)}`);
    }
  };

  // Avoid hydration mismatch
  if (!isClient) return null;

  return (
    <div className="w-full text-white overflow-x-hidden relative selection:bg-white/20 selection:text-white min-h-screen flex flex-col justify-center">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key="hero-container"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center relative z-10 px-4 max-w-5xl mx-auto"
          >
            {/* Main Logo / Title */}
            <motion.div className="mb-16 text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase drop-shadow-2xl leading-none">
                FORTNITE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf5af2] to-white">STATS PRO</span>
              </h1>
            </motion.div>

            {/* Search Module - Constrained Width */}
            <motion.div className="w-full max-w-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#bf5af2] to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-black/80 backdrop-blur-xl rounded-full border border-white/10 p-2 shadow-2xl">
                <Search className="ml-6 text-white/50" />
                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  placeholder="INGRESA USUARIO DE EPIC"
                  className="w-full bg-transparent text-white text-xl py-4 px-4 focus:outline-none font-bold placeholder-white/20 uppercase tracking-wider"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchUser)}
                  autoFocus
                />
                <button
                  onClick={() => handleSearch(searchUser)}
                  className="bg-[#bf5af2] hover:bg-[#bf5af2]/80 text-white font-bold py-3 px-8 rounded-full transition-all uppercase tracking-widest text-sm shadow-lg whitespace-nowrap"
                >
                  BUSCAR
                </button>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <span className="text-white/30 text-xs uppercase tracking-widest py-1 font-bold">Populares:</span>
                {['Tfue', 'Bugha', 'Clix'].map(pro => (
                  <button
                    key={pro}
                    onClick={() => handleSearch(pro)}
                    className="text-xs font-bold text-white/60 hover:text-[#bf5af2] border border-white/10 hover:border-[#bf5af2] px-3 py-1 rounded-full transition-all uppercase"
                  >
                    {pro}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
