"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Clock } from 'lucide-react';

interface RoundInfo { 
  round: number; 
  status: 'locked' | 'unlocked' | 'completed'; 
}

interface UserData {
  id: string;
  user_metadata: {
    current_round?: number;
    status?: string;
    event_access?: boolean;
    eliminated_at?: string;
    round_1_completed?: boolean;
    round_2_completed?: boolean;
    round_3_completed?: boolean;
    round_4_completed?: boolean;
    round_5_completed?: boolean;
    round_6_completed?: boolean;
    round_7_completed?: boolean;
    round_8_completed?: boolean;
  };
}

const roundColors: Record<RoundInfo['status'], string> = {
  locked: 'from-stone-700/70 to-stone-900/80',
  unlocked: 'from-amber-600/80 to-amber-800/80',
  completed: 'from-emerald-600/80 to-emerald-800/80'
};

export default function ProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [eventStarted, setEventStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState<RoundInfo[]>([]);


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setEventStarted(userData.user_metadata?.event_access || false);
        updateRoundStatus(userData);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const updateRoundStatus = (userData: UserData) => {
    const updatedRounds: RoundInfo[] = [];
    const currentRound = userData.user_metadata?.current_round || 1;
    const eventAccess = userData.user_metadata?.event_access || false;
    const userStatus = userData.user_metadata?.status || 'active';

    for (let i = 1; i <= 8; i++) {
      let status: RoundInfo['status'] = 'locked';
      
      // Check if user is eliminated
      if (userStatus === 'eliminated') {
        status = i <= currentRound ? 'completed' : 'locked';
      }
      // If event hasn't started, all rounds are locked
      else if (!eventAccess) {
        status = 'locked';
      }
      // If event started, determine status based on completion
      else {
        const roundCompleted = userData.user_metadata?.[`round_${i}_completed` as keyof typeof userData.user_metadata] as boolean;
        
        if (roundCompleted) {
          status = 'completed';
        } else if (i === currentRound) {
          status = 'unlocked';
        } else if (i < currentRound) {
          status = 'completed';
        } else {
          status = 'locked';
        }
      }

      updatedRounds.push({ round: i, status });
    }

    setRounds(updatedRounds);
  };

  const handleRoundClick = (roundNumber: number, status: RoundInfo['status']) => {
    if (status === 'locked') return;
    if (user?.user_metadata?.status === 'eliminated') return;
    router.push(`/rounds/round${roundNumber}`);
  };

  const roundStatusIcon = (status: RoundInfo['status']) => {
    switch (status) {
      case 'completed': return <span className="text-emerald-300 font-bold">✔</span>;
      case 'unlocked': return <span className="text-amber-300 font-bold animate-pulse">★</span>;
      default: return <span className="text-stone-400">🔒</span>;
    }
  };

  if (loading) {
    return (
      <div className="relative z-10 px-4 pt-24 pb-32 max-w-6xl mx-auto text-white">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-white/70">Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 px-4 pt-24 pb-32 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow">
        Round Progress
      </h1>
      <p className="mt-3 text-sm text-white/70 max-w-prose">
        Monitor which rounds are unlocked or completed. Rounds unlock sequentially after event starts.
      </p>

      {/* Event Status Alerts */}
      {!eventStarted && (
        <Alert className="mt-6 mb-8 border-yellow-500/50 bg-yellow-500/10">
          <Clock className="h-4 w-4" />
          <AlertDescription className="text-yellow-200">
            <strong>Event Not Started:</strong> The treasure hunt event hasn't begun yet. All rounds are currently locked. Please wait for the admin to start the event.
          </AlertDescription>
        </Alert>
      )}

      {user?.user_metadata?.status === 'eliminated' && (
        <Alert className="mt-6 mb-8 border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            <strong>Eliminated:</strong> You were eliminated from the competition. You can still view your completed rounds but cannot proceed further.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-10 grid md:grid-cols-4 sm:grid-cols-2 gap-5">
        {rounds.map(r => (
          <div key={r.round} className={`relative rounded-lg p-[1px] bg-gradient-to-br ${roundColors[r.status]} shadow-lg shadow-black/40 border border-white/10`}>
            <div className="relative rounded-lg p-4 bg-black/50 backdrop-blur-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold tracking-wide">Round {r.round}</h3>
                {roundStatusIcon(r.status)}
              </div>
              <p className="text-xs text-white/70 flex-1">
                {!eventStarted 
                  ? 'Event not started. All rounds locked.' 
                  : r.status === 'locked' 
                    ? 'Locked. Complete previous rounds to unlock.' 
                    : r.status === 'unlocked' 
                      ? 'Ready to begin!' 
                      : 'Completed!'}
              </p>
              <div className="mt-3">
                <button
                  disabled={r.status === 'locked' || user?.user_metadata?.status === 'eliminated'}
                  onClick={() => handleRoundClick(r.round, r.status)}
                  className={`w-full py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                    r.status === 'locked' || user?.user_metadata?.status === 'eliminated'
                      ? 'border-stone-700 text-stone-500 cursor-not-allowed' 
                      : r.status === 'unlocked' 
                        ? 'border-amber-400 text-amber-200 hover:bg-amber-600/30' 
                        : 'border-emerald-400 text-emerald-200 hover:bg-emerald-600/30'
                  }`}
                >
                  {user?.user_metadata?.status === 'eliminated' 
                    ? 'Eliminated'
                    : r.status === 'completed' 
                      ? 'View Round' 
                      : r.status === 'unlocked' 
                        ? 'Enter Round' 
                        : !eventStarted 
                          ? 'Event Not Started'
                          : 'Locked'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}