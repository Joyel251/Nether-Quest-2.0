import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase_admin'

// POST - Activate filler question for a round
export async function POST(request: NextRequest) {
  try {
    const { roundNumber } = await request.json()
    
    if (!roundNumber || roundNumber < 1 || roundNumber > 8) {
      return NextResponse.json({ error: 'Invalid round number' }, { status: 400 })
    }

    // Here you would typically update the question in your rounds table
    // For now, we'll just return success since questions are managed in frontend state
    
    console.log(`Filler question activated for Round ${roundNumber}`)
    
    return NextResponse.json({ 
      success: true,
      message: `Filler question activated for Round ${roundNumber}`,
      roundNumber
    })

  } catch (error) {
    console.error('Filler question error:', error)
    return NextResponse.json({ 
      error: 'Failed to activate filler question',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
