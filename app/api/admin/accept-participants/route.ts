import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase_admin'

export async function POST(request: NextRequest) {
  try {
    const { participantIds, currentRound, nextRound } = await request.json()
    
    if (!participantIds || !Array.isArray(participantIds) || !currentRound || !nextRound) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const acceptedParticipants = []

    for (const participantId of participantIds) {
      try {
        // Get current user data
        const { data: { user }, error: getUserError } = await supabase.auth.admin.getUserById(participantId)
        
        if (getUserError || !user) {
          console.error(`Error getting user ${participantId}:`, getUserError)
          continue
        }

        // Update user to advance to next round
        const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(participantId, {
          user_metadata: {
            ...user.user_metadata,
            current_round: nextRound,
            status: 'active',
            accepted_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
          }
        })

        if (!updateError && updatedUser) {
          acceptedParticipants.push({
            participantId,
            teamName: user.user_metadata?.team_name || `Team ${user.user_metadata?.team_number}`,
            teamNumber: user.user_metadata?.team_number,
            advancedToRound: nextRound
          })
        } else {
          console.error(`Error updating user ${participantId}:`, updateError)
        }
      } catch (error) {
        console.error(`Error accepting participant ${participantId}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      acceptedParticipants,
      message: `Successfully accepted ${acceptedParticipants.length} participants to Round ${nextRound}`
    })

  } catch (error) {
    console.error('Error accepting participants:', error)
    return NextResponse.json({ error: 'Failed to accept participants' }, { status: 500 })
  }
}
