import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase_admin'

// GET - Get round progress information
export async function GET() {
  try {
    const supabase = await createAdminClient()
    
    // Get all users and their round progress
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) throw error

    const roundProgress = {
      1: { active: 0, eliminated: 0 },
      2: { active: 0, eliminated: 0 },
      3: { active: 0, eliminated: 0 },
      4: { active: 0, eliminated: 0 },
      5: { active: 0, eliminated: 0 },
      6: { active: 0, eliminated: 0 },
      7: { active: 0, eliminated: 0 },
      8: { active: 0, eliminated: 0 }
    }

    users?.forEach((user: any) => {
      const currentRound = user.user_metadata?.current_round || 1
      const status = user.user_metadata?.status || 'active'
      
      if (roundProgress[currentRound as keyof typeof roundProgress]) {
        if (status === 'active') {
          roundProgress[currentRound as keyof typeof roundProgress].active++
        } else {
          roundProgress[currentRound as keyof typeof roundProgress].eliminated++
        }
      }
    })

    return NextResponse.json({ 
      success: true,
      roundProgress,
      totalParticipants: users?.length || 0
    })

  } catch (error) {
    console.error('Error getting round progress:', error)
    return NextResponse.json({ error: 'Failed to get round progress' }, { status: 500 })
  }
}
