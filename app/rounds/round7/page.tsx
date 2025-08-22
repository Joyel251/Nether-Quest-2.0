"use client"
import { useState } from "react"
import BackButton from "@/components/BackButton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function round7() {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim()) return
    setIsSubmitting(true)
    // Hook up server action here later
    await new Promise(r => setTimeout(r, 600))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white font-minecraft bg-[url('/dashboardbg.webp')] bg-cover bg-center bg-fixed">
      {/* decorative layers (non-interactive) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,0,0,0.15),rgba(0,0,0,0.9))] animation-fade-in" />
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-25 bg-[url('/minecraft-sword-cursor.png')] bg-[length:160px_160px] animate-slow-pan" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,rgba(139,92,246,0.08)_0%,transparent_50%,rgba(99,102,241,0.08)_100%)]" />

      <div className="fixed top-4 left-4 z-50">
        <BackButton variant="label" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
        <div className="max-w-2xl w-full">
          <div className="relative bg-gradient-to-br from-zinc-950/90 to-black/85 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-violet-500/10 opacity-20 z-0" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-white/10">
                <span className="text-2xl sm:text-3xl font-bold text-white">7</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 drop-shadow">
                  Round 7
                </h1>
                <p className="text-white/60 text-xs sm:text-sm">Solve the riddle using the three clues below.</p>
              </div>
            </div>

            {/* Clues */}
            <div className="space-y-3 sm:space-y-4">
              {[1,2,3].map((n) => (
                <div key={n} className="flex items-start gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.03] p-4">
                  <div className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-600/80 text-xs font-bold ring-1 ring-white/10">
                    {n}
                  </div>
                  <div className="min-w-0 text-sm sm:text-base leading-relaxed text-white/90">
                    <p className="whitespace-pre-wrap break-words">Clue {n} goes here.</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Answer */}
            <form onSubmit={onSubmit} className="mt-6 sm:mt-8">
              <label htmlFor="answer" className="block text-xs sm:text-sm text-white/70 mb-2">
                Your Answer
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Input
                  id="answer"
                  placeholder="Type your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="bg-black/40 border-white/15 text-white placeholder:text-white/40 h-11 sm:h-12"
                />
                <Button
                  type="submit"
                  disabled={!answer.trim() || isSubmitting || submitted}
                  className="h-11 sm:h-12 px-6 font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30 disabled:opacity-60"
                >
                  {submitted ? 'Submitted' : (isSubmitting ? 'Submitting…' : 'Submit')}
                </Button>
              </div>
            </form>

            {submitted && (
              <p className="mt-3 text-emerald-300/90 text-xs sm:text-sm">Your answer has been recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
