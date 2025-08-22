import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase_admin'

export async function POST(request: NextRequest) {
  try {
    const { acceptIds, eliminateIds, round, limit } = await request.json()
    
    if (!acceptIds || !eliminateIds || !round || !limit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    let successCount = 0
    let errorCount = 0

    // Accept participants (move to next round)
    for (const id of acceptIds) {
      try {
        const { error: updateError } = await supabase.auth.admin.updateUserById(id, {
          user_metadata: {
            status: 'active',
            current_round: round + 1,
            last_updated: new Date().toISOString()
          }
        })

        if (!updateError) {
          successCount++
        } else {
          console.error(`Error accepting participant ${id}:`, updateError)
          errorCount++
        }
      } catch (err) {
        console.error(`Error accepting participant ${id}:`, err)
        errorCount++
      }
    }

    // Eliminate participants
    for (const id of eliminateIds) {
      try {
        const { error: updateError } = await supabase.auth.admin.updateUserById(id, {
          user_metadata: {
            status: 'eliminated',
            eliminated_at: new Date().toISOString(),
            eliminated_round: round,
            last_updated: new Date().toISOString()
          }
        })

        if (!updateError) {
          successCount++
        } else {
          console.error(`Error eliminating participant ${id}:`, updateError)
          errorCount++
        }
      } catch (err) {
        console.error(`Error eliminating participant ${id}:`, err)
        errorCount++
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `Auto-elimination completed for Round ${round}`,
      accepted: acceptIds.length,
      eliminated: eliminateIds.length,
      successCount,
      errorCount,
      limit
    })

  } catch (error) {
    console.error('Auto-elimination error:', error)
    return NextResponse.json({ 
      error: 'Failed to process auto-elimination',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
