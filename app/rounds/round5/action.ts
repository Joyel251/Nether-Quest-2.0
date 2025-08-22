'use server'
import { createClient } from '@/utils/supabase'
import prisma from '@/utils/prisma'
import { redirect } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect'

export async function getQuestion() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('Auth error:', authError)
      return { error: 'Authentication failed' }
    }
    if (!user) return { error: 'User not authenticated' }
    if (!user.user_metadata?.team_number) return { error: 'Team number not found in user metadata' }

    const teamNumber = Number(user.user_metadata.team_number)
    const res = await prisma.round5.findFirst({ where: { teamNumber } })
    if (!res) return { error: 'Team not found' }

    if (res.Submitted === true) {
      redirect('/redirect')
    }

    return { question: res.question, clue: res.clue }
  } catch (error: any) {
    if (isRedirectError(error)) throw error
    console.error('Server error in getQuestion (round5):', error)
    return { error: 'Internal server error' }
  }
}

export async function markCompleted() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const teamNumber = Number(user?.user_metadata?.team_number)
    if (!teamNumber) return { error: 'No team number' }

    // Update round row to Submitted
    await prisma.round5.update({
      where: { teamNumber },
      data: { Submitted: true },
    }).catch(() => { /* ignore if missing */ })

    // Create submission row (ignore if already exists)
    await prisma.round5Submission.create({ data: { teamNumber } })
      .catch((e: any) => {
        if (e?.code !== 'P2002') throw e
      })

    return { success: true }
  } catch (error) {
    console.error('markCompleted error (round5):', error)
    return { error: 'Failed to mark completion' }
  }
}
