import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase'

// GET - Fetch all rounds
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: rounds, error } = await supabase
      .from('rounds')
      .select('*')
      .order('round_number', { ascending: true })

    if (error) throw error

    return NextResponse.json({ rounds })
  } catch (error) {
    console.error('Error fetching rounds:', error)
    return NextResponse.json({ error: 'Failed to fetch rounds' }, { status: 500 })
  }
}

// POST - Create or update round
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { round_number, status, start_time, end_time } = body

    // Check if round exists
    const { data: existingRound } = await supabase
      .from('rounds')
      .select('*')
      .eq('round_number', round_number)
      .single()

    if (existingRound) {
      // Update existing round
      const { data: round, error } = await supabase
        .from('rounds')
        .update({
          status,
          start_time,
          end_time,
          updated_at: new Date().toISOString()
        })
        .eq('round_number', round_number)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ round })
    } else {
      // Create new round
      const { data: round, error } = await supabase
        .from('rounds')
        .insert([{
          round_number,
          status,
          start_time,
          end_time,
          title: `Round ${round_number}`,
          description: `Round ${round_number} challenge`
        }])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ round })
    }
  } catch (error) {
    console.error('Error managing round:', error)
    return NextResponse.json({ error: 'Failed to manage round' }, { status: 500 })
  }
}
