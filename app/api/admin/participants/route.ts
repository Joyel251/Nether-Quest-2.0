import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase_admin'

// GET - Fetch all teams from the original Supabase database
export async function GET() {
  try {
    const supabase = await createAdminClient()
    
    console.log('Fetching teams from original Supabase database...')
    
    // First, try to fetch from auth users (if teams are stored as users)
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Auth users error:', authError)
    } else {
      console.log('Auth users found:', users?.length || 0)
    }

    // Also try to check for other common team tables
    let teamsFromTables = []
    const tablesToCheck = ['teams', 'participants', 'users', 'team_registrations']
    
    for (const tableName of tablesToCheck) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select('*')
          .limit(100)
        
        if (!tableError && tableData && tableData.length > 0) {
          console.log(`Found data in table "${tableName}":`, tableData)
          teamsFromTables.push({ tableName, data: tableData })
        }
      } catch (err) {
        // Table doesn't exist, continue
        console.log(`Table "${tableName}" doesn't exist or is inaccessible`)
      }
    }

    // Process teams from auth users if they have team metadata
    let participants: any[] = []
    
    if (users && users.length > 0) {
      participants = users
        .filter((user: any) => user.user_metadata?.team_name || user.user_metadata?.team_number)
        .map((user: any, index: number) => {
          // Enhanced team number parsing
          let teamNumber = index + 1 // default fallback
          
          if (user.user_metadata?.team_number !== undefined && user.user_metadata?.team_number !== null) {
            // Convert to string first, then parse as integer with explicit base 10
            const teamNumberStr = String(user.user_metadata.team_number).trim()
            const parsed = parseInt(teamNumberStr, 10)
            
            if (!isNaN(parsed) && parsed > 0) {
              teamNumber = parsed
            }
          }

          return {
            id: user.id,
            team_name: user.user_metadata?.team_name || `Team ${teamNumber}`,
            team_number: teamNumber,
            status: user.user_metadata?.status || 'active',
            current_round: user.user_metadata?.current_round || user.user_metadata?.round || 1,
            eliminated_at: user.user_metadata?.eliminated_at || null,
            total_score: user.user_metadata?.total_score || 0,
            answers_correct: user.user_metadata?.answers_correct || 0,
            event_access: user.user_metadata?.event_access || false,
            created_at: user.created_at,
            updated_at: user.user_metadata?.last_updated || user.updated_at || user.created_at
          }
        })
        .sort((a: any, b: any) => a.team_number - b.team_number)
    }

    // If no participants from auth users, try to use data from other tables
    if (participants.length === 0 && teamsFromTables.length > 0) {
      const firstTable = teamsFromTables[0]
      participants = firstTable.data.map((team: any, index: number) => ({
        id: team.id || `team_${index + 1}`,
        team_name: team.team_name || team.name || `Team ${index + 1}`,
        team_number: team.team_number || team.teamNumber || index + 1,
        status: team.status || 'active',
        current_round: team.current_round || team.round || 1,
        eliminated_at: team.eliminated_at || null,
        created_at: team.created_at || new Date().toISOString(),
        updated_at: team.updated_at || new Date().toISOString()
      }))
    }

    console.log('Final processed participants:', participants)
    
    return NextResponse.json({ 
      participants,
      debug: {
        authUsersCount: users?.length || 0,
        tablesFound: teamsFromTables.map(t => t.tableName),
        source: participants.length > 0 ? (users && users.length > 0 ? 'auth_users' : 'database_table') : 'none'
      }
    })
  } catch (error: any) {
    console.error('Error fetching participants:', error)
    return NextResponse.json({ 
      participants: [],
      error: error?.message || 'Unknown error'
    })
  }
}

// POST - Add new team (create entry in round1 table)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient()
    const body = await request.json()
    const { team_name, team_number } = body

    // Check if team already exists
    const { data: existing, error: checkError } = await supabase
      .from('round1')
      .select('teamNumber')
      .eq('teamNumber', team_number)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Team number already exists' }, { status: 400 })
    }

    // Create new team entry
    const { data: newTeam, error } = await supabase
      .from('round1')
      .insert([{
        teamNumber: team_number,
        question: 'Default question',
        answer: '',
        Submitted: false
      }])
      .select()
      .single()

    if (error) throw error

    const participant = {
      id: `team_${team_number}`,
      team_name,
      team_number,
      status: 'active',
      current_round: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ participant })
  } catch (error) {
    console.error('Error adding participant:', error)
    return NextResponse.json({ error: 'Failed to add participant' }, { status: 500 })
  }
}

// PUT - Update team status (we'll store this in localStorage/session for now)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, current_round, eliminated_at } = body

    // For now, just return success - in a real implementation you'd store this in a teams table
    const participant = {
      id,
      status,
      current_round,
      eliminated_at,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json({ participant })
  } catch (error) {
    console.error('Error updating participant:', error)
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 })
  }
}

// DELETE - Remove team from round1 table
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Participant ID required' }, { status: 400 })
    }

    // Extract team number from id (format: "team_123")
    const teamNumber = parseInt(id.replace('team_', ''))

    const { error } = await supabase
      .from('round1')
      .delete()
      .eq('teamNumber', teamNumber)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting participant:', error)
    return NextResponse.json({ error: 'Failed to delete participant' }, { status: 500 })
  }
}
