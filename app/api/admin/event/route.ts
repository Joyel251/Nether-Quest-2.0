import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase_admin'

// GET - Get event status from original Supabase database
export async function GET() {
  try {
    const supabase = await createAdminClient()
    
    // Check event status by looking for users with event_access: true
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Error getting auth users:', error)
      // If there's a Supabase auth error, return a fallback response
      return NextResponse.json({ 
        eventStarted: false,
        participantCount: 0,
        error: 'Unable to connect to authentication service'
      })
    }

    // Event is started only if users have event_access: true (set by admin)
    const usersWithAccess = users?.filter(user => user.user_metadata?.event_access === true) || []
    const eventStarted = usersWithAccess.length > 0
    
    return NextResponse.json({ 
      eventStarted,
      participantCount: users?.length || 0,
      activeParticipants: usersWithAccess.length
    })
  } catch (error) {
    console.error('Error getting event status:', error)
    // Return a graceful fallback even if there are network issues
    return NextResponse.json({ 
      eventStarted: false,
      participantCount: 0,
      error: 'Network connectivity issue with authentication service'
    })
  }
}

// POST - Start event with participant limits
export async function POST(request: NextRequest) {
  try {
    const { participant_limits, total_participants } = await request.json()
    const supabase = await createAdminClient()
    
    // Get all users from auth
    const { data: { users }, error: getUsersError } = await supabase.auth.admin.listUsers()

    if (getUsersError) throw getUsersError

    if (!users || users.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No teams found to start event',
        resetTeams: 0
      })
    }

    // Reset all users to active status and enable event access with round limits
    let resetCount = 0
    for (const user of users) {
      try {
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            status: 'active',
            current_round: 1,
            eliminated_at: null,
            eliminated_round: null,
            event_access: true,
            event_started_at: new Date().toISOString(),
            participant_limits: participant_limits || {1: 30, 2: 28, 3: 25, 4: 22, 5: 20, 6: 18, 7: 15, 8: 10},
            total_score: 0,
            answers_correct: 0,
            last_updated: new Date().toISOString()
          }
        })

        if (!updateError) {
          resetCount++
        }
      } catch (err) {
        console.error(`Error resetting user ${user.id}:`, err)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Event started successfully with configured round limits`,
      resetTeams: resetCount,
      participant_limits: participant_limits,
      total_participants: users.length
    })
  } catch (error) {
    console.error('Error starting event:', error)
    return NextResponse.json({ error: 'Failed to start event' }, { status: 500 })
  }
}

// DELETE - Reset event completely
export async function DELETE() {
  try {
    const supabase = await createAdminClient()
    
    // Get all users from auth
    const { data: { users }, error: getUsersError } = await supabase.auth.admin.listUsers()

    if (getUsersError) throw getUsersError

    if (!users || users.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No participants to reset',
        resetCount: 0
      })
    }

    // Reset all users completely
    let resetCount = 0
    for (const user of users) {
      try {
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            status: 'active',
            current_round: 1,
            eliminated_at: null,
            eliminated_round: null,
            event_access: false,
            event_started_at: null,
            event_stopped_at: null,
            total_score: 0,
            answers_correct: 0,
            participant_limits: null,
            round1_limit: null,
            last_updated: new Date().toISOString()
          }
        })

        if (!updateError) {
          resetCount++
        }
      } catch (err) {
        console.error(`Error resetting user ${user.id}:`, err)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event reset completely - all participants reset to initial state',
      resetCount
    })
  } catch (error) {
    console.error('Error resetting event:', error)
    return NextResponse.json({ error: 'Failed to reset event' }, { status: 500 })
  }
}
