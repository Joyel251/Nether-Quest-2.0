import React from 'react';

export default function DashboardPage() {
  return (
    <div className="relative z-10 px-4 pt-24 pb-32 max-w-5xl mx-auto text-white animate-[fadeInUp_0.8s_ease]">
      <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow-[0_0_6px_rgba(255,120,50,0.5)]">Team Dashboard</h1>
      <p className="mt-4 text-white/75 max-w-prose text-sm md:text-base leading-relaxed">Welcome to your Nether control center. Use the Minecraft-styled menu to open progress, stats, leaderboard, profile, and instructions pages. Each area lives on its own page for clarity. Your journey awaits.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl p-[1px] bg-gradient-to-br from-amber-600/60 to-red-800/70 border border-white/15 shadow-lg shadow-black/50">
          <div className="rounded-xl p-5 bg-black/50 backdrop-blur-sm">
            <h2 className="font-semibold tracking-wide text-amber-300 mb-2">TIPS</h2>
            <ul className="text-xs md:text-sm text-white/80 space-y-2 list-disc list-inside">
              <li>Go to <span className="text-amber-200">Round Progress</span> to see your current round.</li>
              <li>Open the round and complete the task. Submit your answer to proceed.</li>
              <li>After each round some teams will get eliminated based on the order of submissions. If you completed the round and cannot proceed to the next round then you are eliminated.</li>
            </ul>
          </div>
        </div>
        <div className="rounded-xl p-[1px] bg-gradient-to-br from-purple-600/60 to-fuchsia-800/70 border border-white/15 shadow-lg shadow-black/50">
          <div className="rounded-xl p-5 bg-black/50 backdrop-blur-sm">
            <h2 className="font-semibold tracking-wide text-fuchsia-300 mb-2">IMPORTANT</h2>
            <ul className="text-xs md:text-sm text-white/80 space-y-2 list-disc list-inside">
              <li>In Round 5, once you submit and then refresh the page or click back, the clue will no longer be accessible.</li>
              <li>Do not refresh during submission; wait for the success message.</li>
              <li>The quicker you submit, the better your chances of advancing to the next round (not getting eliminated).</li>
              <li>Leaderboard updates after each successful submission.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <a
          href="/dashboard/progress"
          className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-700 px-6 py-3 text-sm md:text-base font-semibold text-white hover:from-purple-700 hover:to-fuchsia-800 transition-all duration-200 shadow-lg border border-white/10"
        >
          Open Round Progress
          <span aria-hidden>→</span>
        </a>
        <p className="mt-3 text-white/60 text-xs md:text-sm">Start here to play the next available round.</p>
      </div>
    </div>
  );
}
