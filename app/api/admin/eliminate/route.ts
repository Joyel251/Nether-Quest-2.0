import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase_admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient()
    const { participantIds } = await request.json()
    
    if (!participantIds || !Array.isArray(participantIds)) {
      return NextResponse.json({ error: 'Invalid participant IDs' }, { status: 400 })
    }

    const eliminatedParticipants = []

    for (const participantId of participantIds) {
      try {
        // Get current user data
        const { data: { user }, error: getUserError } = await supabase.auth.admin.getUserById(participantId)
        if (getUserError || !user) {
          console.error(`Error getting user ${participantId}:`, getUserError)
          continue
        }

        // Update user metadata to mark as eliminated
        const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(participantId, {
          user_metadata: {
            ...user.user_metadata,
            status: 'eliminated',
            eliminated_at: new Date().toISOString()
          }
        })

        if (!updateError && updatedUser) {
          eliminatedParticipants.push({
            id: participantId,
            team_name: user.user_metadata?.team_name || `Team ${user.user_metadata?.team_number || 'Unknown'}`,
            team_number: parseInt(user.user_metadata?.team_number) || 0,
            status: 'eliminated',
            eliminated_at: new Date().toISOString()
          })
        }
      } catch (error) {
        console.error(`Error eliminating participant ${participantId}:`, error)
        // Continue with other participants
      }
    }

    return NextResponse.json({
      success: true,
      eliminated: eliminatedParticipants,
      message: `Successfully eliminated ${eliminatedParticipants.length} participants`
    })

  } catch (error) {
    console.error('Error in bulk elimination:', error)
    return NextResponse.json({ error: 'Failed to eliminate participants' }, { status: 500 })
  }
}
