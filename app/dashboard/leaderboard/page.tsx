"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { getLeaderboard, type LeaderboardEntry } from './actions';

const roundOptions = [
  { id: 1, label: 'Round 1' },
  { id: 2, label: 'Round 2' },
  { id: 3, label: 'Round 3' },
  { id: 4, label: 'Round 4' },
  { id: 5, label: 'Round 5' },
  { id: 6, label: 'Round 6' },
];

function formatTimeAgo(iso: string) {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export default function LeaderboardPage() {
  const [round, setRound] = useState<number>(1);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    getLeaderboard(round, 200)
      .then((res) => {
        if (!alive) return;
        if ('error' in res) {
          setError(res.error);
          setEntries([]);
        } else {
          setEntries(res.entries);
        }
      })
      .catch(() => alive && setError('Failed to load leaderboard'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false };
  }, [round]);

  const hasData = entries.length > 0;

  return (
    <div className="relative z-10 px-4 pt-24 pb-32 mx-auto text-white max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 drop-shadow">Leaderboard</h1>
          <p className="mt-2 text-sm text-white/70">See which teams submitted first. Switch between rounds.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-white/70">Round</label>
          <select
            value={round}
            onChange={(e) => setRound(Number(e.target.value))}
            className="bg-black/50 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          >
            {roundOptions.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-br from-amber-600/60 to-orange-800/70 border border-white/15 shadow-lg shadow-black/50">
        <div className="rounded-2xl bg-black/50 backdrop-blur-sm p-3 sm:p-4">

          {/* Mobile cards */}
          <div className="sm:hidden">
            {loading && <p className="text-white/70 text-sm">Loading…</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {!loading && !hasData && !error && (
              <p className="text-white/60 text-sm">No submissions yet.</p>
            )}
            <ul className="space-y-2">
              {entries.map((e, idx) => (
                <li key={`${e.teamNumber}-${idx}`} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-amber-300 font-semibold">#{idx + 1}</span>
                      <span className="text-white">Team {e.teamNumber}</span>
                    </div>
                    <span className="text-xs text-white/60">{formatTimeAgo(e.submissionTime)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-white/70">
                  <th className="py-2 px-3">Rank</th>
                  <th className="py-2 px-3">Team</th>
                  <th className="py-2 px-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={3} className="py-4 px-3 text-white/70">Loading…</td></tr>
                )}
                {error && (
                  <tr><td colSpan={3} className="py-4 px-3 text-red-400">{error}</td></tr>
                )}
                {!loading && !hasData && !error && (
                  <tr><td colSpan={3} className="py-4 px-3 text-white/60">No submissions yet.</td></tr>
                )}
                {entries.map((e, idx) => (
                  <tr key={`${e.teamNumber}-${idx}`} className="border-t border-white/10 hover:bg-white/5">
                    <td className="py-2 px-3 text-amber-300 font-semibold">{idx + 1}</td>
                    <td className="py-2 px-3">Team {e.teamNumber}</td>
                    <td className="py-2 px-3 text-white/70">{new Date(e.submissionTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
