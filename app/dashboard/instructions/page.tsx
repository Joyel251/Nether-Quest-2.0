"use client";
import React from 'react';

export default function InstructionsPage() {
  return (
    <div className="relative z-10 px-4 pt-24 pb-32 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-400 to-fuchsia-500 drop-shadow">Instructions</h1>
      <p className="mt-3 text-sm text-white/70 max-w-prose">Understand the flow without revealing secrets. Follow these guidelines to advance through the Nether.</p>
      <ol className="mt-8 space-y-3 text-sm text-white/80 list-decimal pl-6">
        <li>Complete the current unlocked round to reveal the next.</li>
        <li>Never share your password or team number outside your team.</li>
        <li>Use logic & collaboration—no brute force attempts.</li>
        <li>Report platform issues quickly so we can assist.</li>
        <li>Leaderboard & stats update periodically—stay sharp.</li>
      </ol>
    </div>
  );
}
