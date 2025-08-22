import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase_admin'

// POST - Stop event (prevent participants from accessing rounds)
export async function POST() {
  try {
    const supabase = await createAdminClient()
    
    // Get all users from auth
    const { data: { users }, error: getUsersError } = await supabase.auth.admin.listUsers()

    if (getUsersError) throw getUsersError

    if (!users || users.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No participants to update',
        updatedCount: 0
      })
    }

    // Update all users to block round access
    let updatedCount = 0
    for (const user of users) {
      try {
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          user_metadata: {
            ...user.user_metadata,
            event_access: false,
            event_stopped_at: new Date().toISOString(),
            last_updated: new Date().toISOString()
          }
        })

        if (!updateError) {
          updatedCount++
        }
      } catch (err) {
        console.error(`Error stopping access for user ${user.id}:`, err)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event stopped successfully - participants blocked from rounds',
      updatedCount
    })
  } catch (error) {
    console.error('Error stopping event:', error)
    return NextResponse.json({ error: 'Failed to stop event' }, { status: 500 })
  }
}
