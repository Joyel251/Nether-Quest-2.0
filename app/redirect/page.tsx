// app/rounds/redirect/page.tsx
"use client"

import React from "react";

export default function RoundCompletedPage() {

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center text-white font-minecraft bg-[url('/dashboardbg.webp')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,0,0,0.15),rgba(0,0,0,0.9))] animation-fade-in" />
      <div className="absolute inset-0 mix-blend-overlay opacity-25 bg-[url('/minecraft-sword-cursor.png')] bg-[length:160px_160px] animate-slow-pan" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,rgba(255,120,40,0.05)_0%,transparent_50%,rgba(255,50,20,0.05)_100%)]" />

      <div className="relative z-10 max-w-xl mx-auto p-8 bg-gradient-to-br from-zinc-950/90 to-black/85 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-teal-500 drop-shadow mb-4">
          You have completed this round!
        </h1>
        <button
          onClick={() => window.location.href = "/dashboard/progress"}
          className="inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 text-lg font-semibold text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/10 animate-fade-in-up"
        >
          Back to Progress
        </button>
      </div>
    </div>
  );
}