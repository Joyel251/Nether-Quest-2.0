"use client"

import { useRouter } from "next/navigation"

export default function round5() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white font-minecraft bg-[url('/dashboardbg.webp')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,0,0,0.15),rgba(0,0,0,0.9))]" />
      <div className="absolute inset-0 mix-blend-overlay opacity-25 bg-[url('/minecraft-sword-cursor.png')] bg-[length:160px_160px] animate-slow-pan" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,rgba(255,120,40,0.05)_0%,transparent_50%,rgba(255,50,20,0.05)_100%)]" />
      
      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard/progress')}
        className="fixed top-4 left-4 z-10 p-3 rounded-md bg-black/60 border border-white/20 hover:bg-black/80 transition-all duration-300 group"
        aria-label="Back to Progress"
      >
        <svg className="w-5 h-5 text-amber-300 group-hover:text-amber-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-gradient-to-br from-zinc-950/90 to-black/85 border border-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">5</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-red-500 drop-shadow">
                Round 5
              </h1>
            </div>
            
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-5xl">🚧</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Coming Soon!</h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-md mx-auto">
                This round is currently under development. Check back soon for an exciting new challenge!
              </p>
              
              <div className="pt-6">
                <button
                  onClick={() => router.push('/dashboard/progress')}
                  className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 text-lg font-semibold text-white hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
