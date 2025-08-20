"use client";
import React, { useEffect, useState } from 'react';

interface RoundInfo { round: number; status: 'locked' | 'unlocked' | 'completed'; }
const initialRounds: RoundInfo[] = Array.from({ length: 8 }, (_, i) => ({
  round: i + 1,
  status: i === 0 ? 'unlocked' : 'locked'
}));

const roundColors: Record<RoundInfo['status'], string> = {
  locked: 'from-stone-700/70 to-stone-900/80',
  unlocked: 'from-amber-600/80 to-amber-800/80',
  completed: 'from-emerald-600/80 to-emerald-800/80'
};

export default function ProgressPage() {
  const [rounds, setRounds] = useState<RoundInfo[]>(initialRounds);

  useEffect(() => {
    // Demo auto-complete first round after 2.5s (remove when real data wired)
    const t = setTimeout(() => {
      setRounds(r => r.map(ri => ri.round === 1 ? { ...ri, status: 'completed' } : ri));
      setRounds(r => r.map(ri => ri.round === 2 ? { ...ri, status: 'unlocked' } : ri));
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  const roundStatusIcon = (status: RoundInfo['status']) => {
    switch (status) {
      case 'completed': return <span className="text-emerald-300 font-bold">✔</span>;
      case 'unlocked': return <span className="text-amber-300 font-bold animate-pulse">★</span>;
      default: return <span className="text-stone-400">✦</span>;
    }
  };

  return (
    <div className="relative z-10 px-4 pt-24 pb-32 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow">Round Progress</h1>
      <p className="mt-3 text-sm text-white/70 max-w-prose">Monitor which rounds are unlocked or completed. Rounds unlock sequentially. No clues are exposed here—only status indicators.</p>
      <div className="mt-10 grid md:grid-cols-4 sm:grid-cols-2 gap-5">
        {rounds.map(r => (
          <div key={r.round} className={`relative rounded-lg p-[1px] bg-gradient-to-br ${roundColors[r.status]} shadow-lg shadow-black/40 border border-white/10`}>
            <div className="relative rounded-lg p-4 bg-black/50 backdrop-blur-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold tracking-wide">Round {r.round}</h3>
                {roundStatusIcon(r.status)}
              </div>
              <p className="text-xs text-white/70 flex-1">{r.status === 'locked' ? 'Locked. Complete previous rounds to unlock.' : r.status === 'unlocked' ? 'Ready to begin.' : 'Completed! Awaiting next unlock.'}</p>
              <div className="mt-3">
                <button
                  disabled={r.status === 'locked'}
                  className={`w-full py-1.5 rounded-md text-xs font-semibold border transition-colors ${r.status === 'locked' ? 'border-stone-700 text-stone-500 cursor-not-allowed' : r.status === 'unlocked' ? 'border-amber-400 text-amber-200 hover:bg-amber-600/30' : 'border-emerald-400 text-emerald-200 hover:bg-emerald-600/30'}`}
                >
                  {r.status === 'completed' ? 'View Summary' : r.status === 'unlocked' ? 'Enter Round' : 'Locked'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
