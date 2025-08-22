'use server'

import prisma from '@/utils/prisma'

export type LeaderboardEntry = {
  teamNumber: number
  submissionTime: string // ISO string for safe serialization
}

const tableByRound: Record<number, keyof typeof prisma> = {
  1: 'round1Submission',
  2: 'round2Submission',
  3: 'round3Submission',
  4: 'round4Submission',
  5: 'round5Submission',
  6: 'round6Submission',
} as const

export async function getLeaderboard(round: number, limit = 100): Promise<{ entries: LeaderboardEntry[] } | { error: string } > {
  try {
    if (!tableByRound[round]) {
      return { error: 'This round does not have a leaderboard yet.' }
    }
    const table = tableByRound[round] as any
    const rows = await (prisma as any)[table].findMany({
      select: { teamNumber: true, submissionTime: true },
      orderBy: { submissionTime: 'asc' },
      take: limit,
    })
    const entries: LeaderboardEntry[] = rows.map((r: any) => ({
      teamNumber: r.teamNumber,
      submissionTime: new Date(r.submissionTime).toISOString(),
    }))
    return { entries }
  } catch (err: any) {
    console.error('Leaderboard fetch failed:', err)
    return { error: 'Failed to load leaderboard' }
  }
}
