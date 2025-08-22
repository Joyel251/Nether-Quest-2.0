'use server'

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return user data with metadata
    return NextResponse.json({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata || {},
      round_1_completed: user.user_metadata?.round_1_completed || false,
      round_2_completed: user.user_metadata?.round_2_completed || false,
      round_3_completed: user.user_metadata?.round_3_completed || false,
      round_4_completed: user.user_metadata?.round_4_completed || false,
      round_5_completed: user.user_metadata?.round_5_completed || false,
      round_6_completed: user.user_metadata?.round_6_completed || false,
      round_7_completed: user.user_metadata?.round_7_completed || false,
      round_8_completed: user.user_metadata?.round_8_completed || false,
      quest_completed: user.user_metadata?.quest_completed || false,
      round: user.user_metadata?.round || 1
    })
  } catch (error) {
    console.error('Error getting user data:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
