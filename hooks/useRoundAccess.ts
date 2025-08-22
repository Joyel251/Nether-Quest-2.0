import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserStatus {
  id: string
  email: string
  user_metadata: {
    display_name?: string
    avatar_url?: string
    team?: string
    team_number?: number
    current_round?: number
    status?: string
    eliminated_at?: string
    eliminated_round?: number
    event_access?: boolean
  }
}

interface RoundAccessResult {
  hasAccess: boolean
  loading: boolean
  user: UserStatus | null
  eventStarted: boolean
  currentRound: number
  status: string
  message?: string
}

export function useRoundAccess(requiredRound: number): RoundAccessResult {
  const [user, setUser] = useState<UserStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [eventStarted, setEventStarted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch('/api/user')
        
        if (!response.ok) {
          // User not authenticated, redirect to login
          router.push('/login')
          return
        }
        
        const userData = await response.json()
        setUser(userData)
        setEventStarted(userData.user_metadata?.event_access || false)
      } catch (error) {
        console.error('Error fetching user status:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUserStatus()
  }, [router])

  if (loading) {
    return {
      hasAccess: false,
      loading: true,
      user: null,
      eventStarted: false,
      currentRound: 1,
      status: 'loading'
    }
  }

  if (!user) {
    return {
      hasAccess: false,
      loading: false,
      user: null,
      eventStarted: false,
      currentRound: 1,
      status: 'unauthorized',
      message: 'Please log in to access this round'
    }
  }

  const currentRound = user.user_metadata?.current_round || 1
  const status = user.user_metadata?.status || 'active'

  // Check if event has started
  if (!eventStarted) {
    return {
      hasAccess: false,
      loading: false,
      user,
      eventStarted: false,
      currentRound,
      status: 'event_not_started',
      message: 'The event has not started yet. Please wait for the admin to begin.'
    }
  }

  // Check if user is eliminated
  if (status === 'eliminated') {
    return {
      hasAccess: false,
      loading: false,
      user,
      eventStarted,
      currentRound,
      status: 'eliminated',
      message: `You were eliminated in Round ${user.user_metadata?.eliminated_round || 'unknown'}`
    }
  }

  // Check if user can access this round
  if (requiredRound > currentRound) {
    return {
      hasAccess: false,
      loading: false,
      user,
      eventStarted,
      currentRound,
      status: 'round_locked',
      message: `You must complete Round ${currentRound} first to access this round`
    }
  }

  // User has access
  return {
    hasAccess: true,
    loading: false,
    user,
    eventStarted,
    currentRound,
    status: 'active'
  }
}
