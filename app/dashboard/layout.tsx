"use client";
import React, { useEffect, useState } from 'react';
import { triggerPixelTransition } from '@/components/PageTransition';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import TeamAvatar from '@/components/TeamAvatar';
import { usePathname } from 'next/navigation';

interface NavItem {
  key: string;
  title: string;
  desc: string;
  href: string;
  gradient: string;
}

const navItems: NavItem[] = [
  { key: 'dashboard', title: 'Dashboard', desc: 'Overview & tips', href: '/dashboard', gradient: 'from-amber-600/70 to-red-700/70' },
  { key: 'progress', title: 'Round Progress', desc: 'Unlock status', href: '/dashboard/progress', gradient: 'from-purple-600/70 to-fuchsia-800/70' },
  { key: 'leaderboard', title: 'Leaderboard', desc: 'Standings', href: '/dashboard/leaderboard', gradient: 'from-yellow-600/70 to-orange-700/70' },
  { key: 'stats', title: 'Stats', desc: 'Team metrics', href: '/dashboard/stats', gradient: 'from-emerald-600/70 to-green-800/70' },
  { key: 'profile', title: 'Profile', desc: 'Team identity', href: '/dashboard/profile', gradient: 'from-sky-600/70 to-indigo-800/70' },
  { key: 'instructions', title: 'Instructions', desc: 'How it works', href: '/dashboard/instructions', gradient: 'from-rose-600/70 to-pink-800/70' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [animReady, setAnimReady] = useState(false);
  const [teamNumber, setTeamNumber] = useState<number | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const pathname = usePathname();

  // Pull team data saved during login (we'll add storing if not already) from sessionStorage
  useEffect(() => {
    try {
      const tn = sessionStorage.getItem('teamNumber');
      const tnm = sessionStorage.getItem('teamName');
      if (tn) setTeamNumber(Number.parseInt(tn));
      if (tnm) setTeamName(tnm);
    } catch {}
    const t = setTimeout(() => setAnimReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Close menu automatically after route change completes (pixel transition delay assumption ~600ms)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white font-minecraft bg-[url('/dashboardbg.webp')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,0,0,0.15),rgba(0,0,0,0.9))]" />
      <div className="absolute inset-0 mix-blend-overlay opacity-25 bg-[url('/minecraft-sword-cursor.png')] bg-[length:160px_160px] animate-slow-pan" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,rgba(255,120,40,0.05)_0%,transparent_50%,rgba(255,50,20,0.05)_100%)]" />

      {/* Hamburger */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-md bg-black/60 border border-white/20 hover:bg-black/80 transition-all duration-300 ${open ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
        aria-label="Menu"
        aria-expanded={open}
      >
        <Menu className="w-6 h-6 text-amber-300" />
      </button>

      {/* Outside click overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-[2px] md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-zinc-950/95 to-black/95 border-r border-white/10 z-40 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center gap-3 border-b border-white/10 relative">
            <Image src="/nether-quest-logo.png" alt="Logo" width={44} height={44} className="rounded" />
            <h1 className="text-xl font-bold tracking-wide text-amber-300 drop-shadow flex-1">NetherQuest</h1>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-1 rounded-md hover:bg-white/10 transition-colors absolute right-2 top-2 md:hidden"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          {teamNumber !== null && (
            <div className="px-4 py-4 border-b border-white/10 flex items-center gap-4 bg-black/40 backdrop-blur-sm">
              <TeamAvatar teamNumber={teamNumber} className="w-16 h-16" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Team</p>
                <p className="font-semibold text-amber-300 leading-tight truncate" title={teamName || undefined}>{teamName || 'Unknown'}</p>
                <p className="text-[11px] text-white/60 mt-0.5"># {teamNumber}</p>
              </div>
            </div>
          )}
          <nav className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => triggerPixelTransition(item.href)}
                className={`relative w-full text-left rounded-lg p-[1px] bg-gradient-to-br ${item.gradient} border border-white/10 shadow-md shadow-black/40 group overflow-hidden ${pathname === item.href ? 'ring-2 ring-amber-400/60' : ''}`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="rounded-lg p-4 bg-black/55 backdrop-blur-sm relative">
                  <h3 className="font-semibold tracking-wide mb-1 flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${pathname === item.href ? 'bg-amber-300 animate-ping' : 'bg-amber-400'} group-hover:scale-125 transition-transform`} />
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-white/70 leading-snug">{item.desc}</p>
                </div>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => triggerPixelTransition('/login')}
              className="w-full py-2 rounded-md bg-red-600/70 hover:bg-red-600 font-semibold text-sm tracking-wide shadow border border-white/20"
            >Logout</button>
          </div>
        </div>
      </aside>
      {/* Content wrapper with entrance animation */}
      <div className={`pl-0 md:pl-0 relative transition-all duration-700 ${animReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Faint vertical glow accents */}
        <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-amber-500/0 via-amber-400/25 to-transparent" />
          <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-red-500/0 via-red-400/20 to-transparent" />
        </div>
        {children}
      </div>
    </div>
  );
}
