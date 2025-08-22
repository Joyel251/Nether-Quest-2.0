'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  Trophy, 
  Clock, 
  Target, 
  Database,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  User,
  Settings,
  FileQuestion,
  Edit3,
  ChevronRight,
  ChevronDown,
  Save,
  UserCheck,
  UserX,
  Square,
  ArrowRight,
  AlertTriangle,
  Zap
} from 'lucide-react'

interface Participant {
  id: string
  team_name: string
  team_number: number | string
  status: 'active' | 'eliminated'
  round: number
  eliminated_at?: string
  created_at: string
  updated_at: string
  answers_correct?: number
  total_score?: number
}

interface Round {
  id: string
  round_number: number
  status: 'not_started' | 'active' | 'completed'
  start_time?: string
  end_time?: string
  title: string
  question: string
  filler_question: string
  participant_limit?: number
  accepted_participants: string[]
  eliminated_participants: string[]
  total_participants?: number
}

// Helper function to parse team numbers consistently
const parseTeamNumber = (teamNumber: number | string): number => {
  if (typeof teamNumber === 'string') {
    return parseInt(teamNumber, 10) || 0
  }
  return teamNumber
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [eventStarted, setEventStarted] = useState(false)
  const [eventRunning, setEventRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  
  // Round Management States
  const [rounds, setRounds] = useState<Round[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set())
  const [participantLimits, setParticipantLimits] = useState<Record<number, number>>({
    1: 60, 2: 50, 3: 40, 4: 30, 5: 20, 6: 10, 7: 8, 8: 5
  })
  const [tempLimit, setTempLimit] = useState(25)
  const [showLimitConfig, setShowLimitConfig] = useState(false)
  const [isLimitsConfigured, setIsLimitsConfigured] = useState(false)
  
  // Initialize rounds
  useEffect(() => {
    const initialRounds: Round[] = Array.from({ length: 8 }, (_, i) => ({
      id: `round_${i + 1}`,
      round_number: i + 1,
      status: i === 0 ? 'active' : 'not_started',
      title: `Round ${i + 1}`,
      question: `Default question for Round ${i + 1}`,
      filler_question: `Filler question for Round ${i + 1}`,
      participant_limit: participantLimits[i + 1],
      accepted_participants: [],
      eliminated_participants: [],
      total_participants: participantLimits[i + 1]
    }))
    setRounds(initialRounds)
  }, [participantLimits])

  // Auto-set round limits
  useEffect(() => {
    if (participants.length > 0) {
      const totalActive = activeParticipants.length
      setParticipantLimits(prev => ({
        ...prev,
        1: Math.max(totalActive, 60)
      }))
    }
  }, [participants])

  const handleAuth = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true)
      fetchData()
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid password",
        variant: "destructive"
      })
    }
  }

  const fetchData = async () => {
    setRefreshing(true)
    try {
      const [participantsRes, eventRes] = await Promise.all([
        fetch('/api/admin/participants'),
        fetch('/api/admin/event')
      ])

      if (participantsRes.ok) {
        const participantsData = await participantsRes.json()
        console.log('Fetched participants data:', participantsData)
        setParticipants(participantsData.participants || [])
      } else {
        console.error('Failed to fetch participants:', participantsRes.status)
      }

      if (eventRes.ok) {
        const eventData = await eventRes.json()
        console.log('Fetched event data:', eventData)
        setEventStarted(eventData.eventStarted)
        setEventRunning(eventData.eventStarted)
      } else {
        console.error('Failed to fetch event data:', eventRes.status)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      })
    } finally {
      setRefreshing(false)
    }
  }

  const startEvent = async () => {
    const totalParticipants = participants.length
    if (totalParticipants === 0) {
      toast({
        title: "Error",
        description: "No participants found to start event",
        variant: "destructive"
      })
      return
    }

    if (!isLimitsConfigured) {
      toast({
        title: "Configuration Required",
        description: "Please configure round limits before starting the event",
        variant: "destructive"
      })
      setShowLimitConfig(true)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_limits: participantLimits,
          total_participants: totalParticipants
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setEventStarted(true)
        setEventRunning(true)
        await fetchData()
        toast({
          title: "Success",
          description: `Event started! Configured limits: R1(${participantLimits[1]}) → R8(${participantLimits[8]})`
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start event",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const stopEvent = async () => {
    if (!confirm('Are you sure you want to stop the event? Participants will lose access to rounds.')) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/event/stop', {
        method: 'POST'
      })
      
      if (response.ok) {
        setEventRunning(false)
        await fetchData()
        toast({
          title: "Success",
          description: "Event stopped successfully!"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop event",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetEvent = async () => {
    if (!confirm('Are you sure you want to reset the entire event? This will clear all progress and configuration.')) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/event', {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setEventStarted(false)
        setEventRunning(false)
        setCurrentRound(1)
        setIsLimitsConfigured(false)
        setShowLimitConfig(false)
        // Reset to default limits
        setParticipantLimits({1: 60, 2: 50, 3: 40, 4: 30, 5: 20, 6: 10, 7: 8, 8: 5})
        await fetchData()
        toast({
          title: "Success",
          description: "Event reset successfully! Please reconfigure round limits."
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset event",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const processRoundLimits = async (roundNumber: number) => {
    const activeInRound = participants.filter(p => p.status === 'active' && p.round === roundNumber)
    const limit = participantLimits[roundNumber]
    
    if (activeInRound.length > limit) {
      // Auto-eliminate based on scores/answers - taking first N with highest scores
      const sortedByScore = activeInRound.sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
      const toAccept = sortedByScore.slice(0, limit)
      const toEliminate = sortedByScore.slice(limit)
      
      try {
        const response = await fetch('/api/admin/auto-eliminate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            acceptIds: toAccept.map(p => p.id),
            eliminateIds: toEliminate.map(p => p.id),
            round: roundNumber,
            limit
          })
        })

        if (response.ok) {
          await fetchData()
          toast({
            title: "Auto-elimination Complete",
            description: `Round ${roundNumber}: ${toAccept.length} accepted, ${toEliminate.length} eliminated`
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to process round limits",
          variant: "destructive"
        })
      }
    }
  }

  const eliminateSelected = async () => {
    if (selectedParticipants.size === 0) {
      toast({
        title: "Error",
        description: "Please select participants to eliminate",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/admin/eliminate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantIds: Array.from(selectedParticipants),
          round_number: currentRound
        })
      })

      if (response.ok) {
        setSelectedParticipants(new Set())
        await fetchData()
        toast({
          title: "Success",
          description: `${selectedParticipants.size} participants eliminated from Round ${currentRound}!`
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to eliminate participants",
        variant: "destructive"
      })
    }
  }

  const acceptSelected = async () => {
    if (selectedParticipants.size === 0) {
      toast({
        title: "Error",
        description: "Please select participants to accept",
        variant: "destructive"
      })
      return
    }

    // Regular acceptance for all rounds including Round 6 → Round 7
    try {
      const response = await fetch('/api/admin/accept-participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantIds: Array.from(selectedParticipants),
          currentRound,
          nextRound: currentRound + 1
        })
      })

      if (response.ok) {
        // Update rounds state with accepted participants
        setRounds(prev => prev.map(round => 
          round.round_number === currentRound 
            ? {
                ...round, 
                accepted_participants: [...round.accepted_participants, ...Array.from(selectedParticipants)]
              }
            : round
        ))

        setSelectedParticipants(new Set())
        await fetchData()
        toast({
          title: "Success",
          description: `${selectedParticipants.size} participants accepted for Round ${currentRound + 1}!`
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept participants",
        variant: "destructive"
      })
    }
  }

  const useFillerQuestion = async (roundNumber: number) => {
    try {
      const response = await fetch('/api/admin/filler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundNumber })
      })

      if (response.ok) {
        setRounds(prev => prev.map(round => 
          round.round_number === roundNumber 
            ? { ...round, question: round.filler_question }
            : round
        ))
        
        toast({
          title: "Success",
          description: `Filler question activated for Round ${roundNumber}`
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive"
      })
    }
  }

  const updateParticipantLimit = (round: number, limit: number) => {
    setParticipantLimits(prev => ({ ...prev, [round]: limit }))
    
    // Update rounds state
    setRounds(prev => prev.map(r => 
      r.round_number === round 
        ? { ...r, participant_limit: limit, total_participants: limit }
        : r
    ))
  }

  const handleRoundLimitProcess = async () => {
    await processRoundLimits(currentRound)
  }

  const deleteParticipant = async (id: string) => {
    if (!confirm('Are you sure you want to delete this participant?')) return

    try {
      const response = await fetch(`/api/admin/participants?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchData()
        toast({
          title: "Success",
          description: "Participant deleted successfully!"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete participant",
        variant: "destructive"
      })
    }
  }

  const toggleParticipantSelection = (id: string) => {
    const newSelection = new Set(selectedParticipants)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedParticipants(newSelection)
  }

  const activeParticipants = participants.filter(p => p.status === 'active')
  const eliminatedParticipants = participants.filter(p => p.status === 'eliminated')
  const currentRoundParticipants = participants.filter(p => p.round === currentRound && p.status === 'active')

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 flex items-center justify-center p-3 sm:p-4 font-sans">
        <Card className="w-full max-w-sm sm:max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-3 sm:pb-4">
            <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-indigo-100 rounded-full w-fit">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-indigo-600" />
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Admin Access
            </CardTitle>
            <p className="text-gray-600 text-xs sm:text-sm">Enter your credentials to continue</p>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                className="mt-1 border-gray-200 text-sm sm:text-base h-10 sm:h-11"
                placeholder="Enter admin password"
              />
            </div>
            <Button onClick={handleAuth} className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm sm:text-base py-2 sm:py-2.5 h-10 sm:h-11">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Enter Admin Panel
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 font-sans">
      <div className="container mx-auto p-2 sm:p-3 md:p-4 lg:p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 bg-indigo-600 rounded-lg shadow-lg">
              <Database className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent leading-tight text-center">
              Nether Quest Admin
            </h1>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-2 sm:px-4">
            Complete event management dashboard with real-time database integration
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center justify-center mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={refreshing}
              className="text-xs sm:text-sm"
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Badge variant={eventRunning ? "default" : "secondary"} className="text-xs">
              {eventRunning ? "EVENT RUNNING" : "EVENT STOPPED"}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow border-0">
            <CardContent className="p-2 sm:p-3 md:p-4 text-center">
              <div className="p-1 sm:p-1.5 md:p-2 bg-green-100 rounded-full w-fit mx-auto mb-1 sm:mb-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-green-600" />
              </div>
              <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{activeParticipants.length}</div>
              <div className="text-[10px] sm:text-xs text-gray-600">Active Teams</div>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow border-0">
            <CardContent className="p-2 sm:p-3 md:p-4 text-center">
              <div className="p-1 sm:p-1.5 md:p-2 bg-red-100 rounded-full w-fit mx-auto mb-1 sm:mb-2">
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-red-600" />
              </div>
              <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{eliminatedParticipants.length}</div>
              <div className="text-[10px] sm:text-xs text-gray-600">Eliminated</div>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow border-0">
            <CardContent className="p-2 sm:p-3 md:p-4 text-center">
              <div className="p-1 sm:p-1.5 md:p-2 bg-blue-100 rounded-full w-fit mx-auto mb-1 sm:mb-2">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">{participants.length}</div>
              <div className="text-[10px] sm:text-xs text-gray-600">Total Teams</div>
            </CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-lg transition-shadow border-0">
            <CardContent className="p-2 sm:p-3 md:p-4 text-center">
              <div className="p-1 sm:p-1.5 md:p-2 bg-purple-100 rounded-full w-fit mx-auto mb-1 sm:mb-2">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-purple-600" />
              </div>
              <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">R{currentRound}</div>
              <div className="text-[10px] sm:text-xs text-gray-600">Current Round</div>
            </CardContent>
          </Card>
        </div>

        {/* Pre-Event Round Limits Configuration */}
        <div className="mb-4 sm:mb-6">
          <Card className="shadow-md border-0">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-base sm:text-lg">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  Round Limits Configuration
                </div>
                <div className="flex gap-2">
                  <Badge variant={isLimitsConfigured ? "default" : "secondary"} className="text-xs">
                    {isLimitsConfigured ? "CONFIGURED" : "NEEDS SETUP"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLimitConfig(!showLimitConfig)}
                    className="text-xs sm:text-sm h-7 sm:h-8"
                  >
                    {showLimitConfig ? "Hide" : "Configure"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            {showLimitConfig && (
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 text-sm sm:text-base">
                        Configure Participant Limits Before Starting Event
                      </h4>
                      <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                        Set how many participants can advance to each round. Total participants: <strong>{participants.length}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[1,2,3,4,5,6,7,8].map(roundNum => (
                    <div key={roundNum} className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium">
                        Round {roundNum}:
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max={participants.length}
                          value={participantLimits[roundNum]}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1
                            setParticipantLimits(prev => ({ ...prev, [roundNum]: Math.min(value, participants.length) }))
                          }}
                          className="text-sm h-8 sm:h-9"
                        />
                        <span className="text-xs text-gray-500 whitespace-nowrap">max</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {roundNum > 1 && participantLimits[roundNum] > participantLimits[roundNum - 1] && (
                          <span className="text-red-600">⚠ More than prev round</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 border-t">
                  <Button
                    onClick={() => {
                      // Auto-configure decreasing limits
                      const total = participants.length
                      const newLimits: Record<number, number> = {}
                      for (let i = 1; i <= 8; i++) {
                        newLimits[i] = Math.max(1, Math.floor(total * (9 - i) / 9))
                      }
                      setParticipantLimits(newLimits)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Auto-Configure (Decreasing)
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setIsLimitsConfigured(true)
                      setShowLimitConfig(false)
                      toast({
                        title: "Limits Configured",
                        description: "Round participant limits have been set successfully!"
                      })
                    }}
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Save Configuration
                  </Button>

                  <Button
                    onClick={() => {
                      setParticipantLimits({1: 60, 2: 50, 3: 40, 4: 30, 5: 20, 6: 10, 7: 8, 8: 5})
                      setIsLimitsConfigured(false)
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Reset to Default
                  </Button>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Current Configuration:</h5>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[1,2,3,4,5,6,7,8].map(roundNum => (
                      <div key={roundNum} className="text-center p-2 bg-white rounded border">
                        <div className="text-xs font-medium text-gray-600">R{roundNum}</div>
                        <div className="text-sm sm:text-base font-bold text-blue-600">{participantLimits[roundNum]}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Elimination flow: {participants.length} → {participantLimits[1]} → {participantLimits[2]} → {participantLimits[3]} → {participantLimits[4]} → {participantLimits[5]} → {participantLimits[6]} → {participantLimits[7]} → {participantLimits[8]} participants
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Event Controls - Mobile First */}
        <div className="mb-4 sm:mb-6">
          <Card className="shadow-md border-0">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-base sm:text-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  Event Controls
                </div>
                <Badge variant={eventRunning ? "default" : "secondary"} className="text-xs">
                  {eventRunning ? "LIVE EVENT" : "STOPPED"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {/* Event Status Banner */}
              <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                eventRunning 
                  ? 'bg-green-50 border-green-300 text-green-800' 
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {eventRunning ? (
                    <>
                      <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-bold text-sm sm:text-base">EVENT IS LIVE</span>
                    </>
                  ) : (
                    <>
                      <Square className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-bold text-sm sm:text-base">EVENT STOPPED</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-center">
                  {eventRunning 
                    ? 'Participants can access Round 1 and treasure hunt is active'
                    : 'Participants are blocked from accessing rounds'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {!eventStarted ? (
                  <Button 
                    onClick={startEvent}
                    disabled={loading || participants.length === 0 || !isLimitsConfigured}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base h-10 sm:h-11"
                  >
                    <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Start Event ({participants.length} teams)
                  </Button>
                ) : (
                  <Button 
                    onClick={stopEvent}
                    disabled={loading}
                    variant="destructive"
                    className="w-full text-sm sm:text-base h-10 sm:h-11"
                  >
                    <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Stop Event
                  </Button>
                )}
                
                <Button 
                  onClick={resetEvent}
                  variant="outline"
                  disabled={loading}
                  className="w-full text-sm sm:text-base h-10 sm:h-11"
                >
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Reset All
                </Button>

                <Button 
                  onClick={handleRoundLimitProcess}
                  variant="outline"
                  disabled={loading}
                  className="w-full text-sm sm:text-base h-10 sm:h-11"
                >
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Process Round Limits
                </Button>
              </div>
              
              {!isLimitsConfigured && (
                <div className="text-center p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-2 text-red-600" />
                  <p className="text-xs sm:text-sm text-red-800 font-medium">Configure round limits before starting the event</p>
                </div>
              )}
              
              {participants.length === 0 && (
                <div className="text-center p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-2 text-yellow-600" />
                  <p className="text-xs sm:text-sm text-yellow-800">No participants found. Please ensure teams are registered.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Round Management System */}
        <div className="space-y-4 sm:space-y-6">
          {/* Round Selector - Mobile Optimized */}
          <Card className="shadow-md border-0">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-base sm:text-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  Round Management
                </div>
                <Badge className="text-xs bg-blue-100 text-blue-800">
                  Round {currentRound} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Round Buttons */}
              <div>
                <Label className="text-xs sm:text-sm font-medium mb-2 block">Select Round:</Label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 sm:gap-2">
                  {[1,2,3,4,5,6,7,8].map(roundNum => (
                    <Button
                      key={roundNum}
                      variant={currentRound === roundNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentRound(roundNum)}
                      className={`text-xs sm:text-sm h-8 sm:h-9 ${
                        currentRound === roundNum ? "bg-blue-600 hover:bg-blue-700" : ""
                      }`}
                    >
                      {roundNum}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Participant Limit Settings */}
              <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                  Round {currentRound} - Participant Limit Settings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <Label htmlFor="roundLimit" className="text-xs sm:text-sm whitespace-nowrap">
                      Max participants:
                    </Label>
                    <Input
                      id="roundLimit"
                      type="number"
                      value={participantLimits[currentRound] || 0}
                      onChange={(e) => updateParticipantLimit(currentRound, parseInt(e.target.value) || 0)}
                      min="1"
                      max="100"
                      className="w-full sm:w-20 text-sm h-8 sm:h-9"
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <div>Current active: <span className="font-medium">{currentRoundParticipants.length}</span></div>
                    <div>Limit: <span className="font-medium">{participantLimits[currentRound]}</span></div>
                    <div className={
                      currentRoundParticipants.length > participantLimits[currentRound] 
                        ? "text-red-600 font-medium" 
                        : "text-green-600"
                    }>
                      {currentRoundParticipants.length > participantLimits[currentRound] 
                        ? `${currentRoundParticipants.length - participantLimits[currentRound]} over limit` 
                        : "Within limit"
                      }
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Round Details Grid - Mobile First */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Round Information */}
            <Card className="shadow-md border-0">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-base sm:text-lg">
                    <FileQuestion className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    Round {currentRound} Details
                  </span>
                  <Badge 
                    variant={rounds.find(r => r.round_number === currentRound)?.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {rounds.find(r => r.round_number === currentRound)?.status || 'not_started'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium">Current Question:</Label>
                  <div className="mt-1 sm:mt-2 p-2 sm:p-3 bg-gray-50 rounded-lg text-xs sm:text-sm">
                    {rounds.find(r => r.round_number === currentRound)?.question}
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs sm:text-sm font-medium">Filler Question:</Label>
                  <div className="mt-1 sm:mt-2 p-2 sm:p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs sm:text-sm">
                    {rounds.find(r => r.round_number === currentRound)?.filler_question}
                  </div>
                  <Button 
                    onClick={() => useFillerQuestion(currentRound)}
                    size="sm"
                    variant="outline"
                    className="mt-2 text-orange-600 border-orange-300 hover:bg-orange-50 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <FileQuestion className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Use Filler Question
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Participants Management - Mobile Optimized */}
            <Card className="shadow-md border-0">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Participants
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    <Badge className="text-xs bg-green-100 text-green-800">
                      {activeParticipants.length} active
                    </Badge>
                    <Badge className="text-xs bg-red-100 text-red-800">
                      {eliminatedParticipants.length} eliminated
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {/* Active Participants */}
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <h4 className="font-medium text-green-700 text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        Active Teams ({currentRoundParticipants.length} in Round {currentRound})
                      </h4>
                      {selectedParticipants.size > 0 && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          {selectedParticipants.size} selected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="max-h-60 sm:max-h-80 overflow-y-auto space-y-1 sm:space-y-2 border rounded-lg p-2 sm:p-3 bg-gray-50">
                      {currentRoundParticipants.length > 0 ? (
                        currentRoundParticipants.map((participant) => (
                          <div 
                            key={participant.id} 
                            className={`p-2 sm:p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              selectedParticipants.has(participant.id) 
                                ? 'bg-blue-50 border-blue-300 shadow-md' 
                                : 'bg-green-50 border-green-200 hover:border-green-300'
                            }`}
                            onClick={() => toggleParticipantSelection(participant.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                                  {participant.team_name}
                                </div>
                                <div className="text-[10px] sm:text-xs text-gray-600">
                                  <div>Team #{parseTeamNumber(participant.team_number)}</div>
                                  {participant.total_score && (
                                    <div className="mt-1">Score: {participant.total_score}</div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge variant="secondary" className="text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1">
                                  R{participant.round}
                                </Badge>
                                {selectedParticipants.has(participant.id) && (
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 sm:py-8 text-gray-500">
                          <Users className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs sm:text-sm">No participants in Round {currentRound}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedParticipants.size > 0 && (
                    <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold mb-2 sm:mb-3 text-blue-800 text-sm sm:text-base">
                        Selected: {selectedParticipants.size} participants
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <Button 
                          onClick={acceptSelected}
                          className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Accept
                        </Button>
                        <Button 
                          onClick={eliminateSelected}
                          variant="destructive"
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <UserX className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Eliminate
                        </Button>
                        <Button 
                          onClick={() => setSelectedParticipants(new Set())}
                          variant="outline"
                          className="text-xs sm:text-sm h-8 sm:h-9"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* All Participants Summary */}
                  <div className="pt-2 sm:pt-3 border-t">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                      <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                        <div className="text-sm sm:text-lg font-bold text-green-700">{activeParticipants.length}</div>
                        <div className="text-[10px] sm:text-xs text-green-600">Total Active</div>
                      </div>
                      <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm sm:text-lg font-bold text-blue-700">{currentRoundParticipants.length}</div>
                        <div className="text-[10px] sm:text-xs text-blue-600">Round {currentRound}</div>
                      </div>
                      <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
                        <div className="text-sm sm:text-lg font-bold text-red-700">{eliminatedParticipants.length}</div>
                        <div className="text-[10px] sm:text-xs text-red-600">Eliminated</div>
                      </div>
                      <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm sm:text-lg font-bold text-purple-700">{participantLimits[currentRound]}</div>
                        <div className="text-[10px] sm:text-xs text-purple-600">Limit</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button 
                      onClick={() => setSelectedParticipants(new Set(currentRoundParticipants.map(p => p.id)))}
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      Select All in Round
                    </Button>
                    <Button 
                      onClick={() => {
                        const sorted = currentRoundParticipants
                          .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
                          .slice(0, participantLimits[currentRound])
                        setSelectedParticipants(new Set(sorted.map(p => p.id)))
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      Select Top {participantLimits[currentRound]}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
