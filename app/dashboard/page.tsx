import React from 'react';

export default function DashboardPage() {
  return (
    <div className="relative z-10 px-4 pt-24 pb-32 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow-[0_0_6px_rgba(255,120,50,0.5)]">Team Dashboard</h1>
      <p className="mt-4 text-white/75 max-w-prose text-sm md:text-base leading-relaxed">Welcome to your Nether control center. Use the Minecraft-styled menu to open progress, stats, leaderboard, profile, and instructions pages. Each area lives on its own page for clarity. Your journey awaits.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl p-[1px] bg-gradient-to-br from-amber-600/60 to-red-800/70 border border-white/15 shadow-lg shadow-black/50">
          <div className="rounded-xl p-5 bg-black/50 backdrop-blur-sm">
            <h2 className="font-semibold tracking-wide text-amber-300 mb-2">Quick Tip</h2>
            <p className="text-xs text-white/70">Choose <span className="text-amber-200 font-medium">Round Progress</span> to view which round unlocks next.</p>
          </div>
        </div>
        <div className="rounded-xl p-[1px] bg-gradient-to-br from-purple-600/60 to-fuchsia-800/70 border border-white/15 shadow-lg shadow-black/50">
          <div className="rounded-xl p-5 bg-black/50 backdrop-blur-sm">
            <h2 className="font-semibold tracking-wide text-fuchsia-300 mb-2">Need Help?</h2>
            <p className="text-xs text-white/70">Open <span className="text-fuchsia-200 font-medium">Instructions</span> for rules (no clues revealed).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
