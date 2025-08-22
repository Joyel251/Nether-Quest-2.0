import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase_admin';

// API endpoint to check event status changes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient()
    
    // Get the last known status from client (via query param)
    const { searchParams } = new URL(request.url);
    const lastKnownStatus = searchParams.get('lastStatus');

    // Check current event status from auth users
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      return NextResponse.json({
        statusChanged: false,
        currentStatus: 'inactive',
        error: 'Unable to check event status'
      });
    }

    // Event is active if users have event_access: true
    const usersWithAccess = users?.filter((user: any) => user.user_metadata?.event_access === true) || []
    const currentStatus = usersWithAccess.length > 0 ? 'active' : 'inactive';
    
    return NextResponse.json({
      statusChanged: currentStatus !== lastKnownStatus,
      currentStatus,
      participantCount: users?.length || 0,
      activeParticipants: usersWithAccess.length
    });
  } catch (error) {
    console.error('Error checking event status:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check event status',
        statusChanged: false,
        currentStatus: 'unknown'
      },
      { status: 500 }
    );
  }
}
