"use client";
import React from 'react';

export default function LeaderboardPage() {
  return (
    <div className="relative z-10 px-4 pt-24 pb-32 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 drop-shadow">Leaderboard</h1>
      <p className="mt-3 text-sm text-white/70 max-w-prose">Live standings will appear here once enabled. Track how other teams progress through the Nether.</p>
      <div className="mt-10 rounded-xl p-[1px] bg-gradient-to-br from-amber-600/60 to-orange-800/70 border border-white/15 shadow-lg shadow-black/50 min-h-[200px] grid place-items-center">
        <p className="text-white/50 text-sm">Coming Soon</p>
      </div>
    </div>
  );
}
