"use client"

import React, { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import useQuestion from "./useQuestion"
import { validateAnswer } from "./action"
import BackButton from "@/components/BackButton"

export default function round1() {
  const [answer, setAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'wrong' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter()

  const { question, error, loading, clue } = useQuestion();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answer.trim()) return
    setSubmitting(true)
    setIsSubmitted(true); // Mark as submitted

    const formData = new FormData();
    formData.append('answer', answer.trim().toUpperCase());

    // simple client-side check to trigger UI feedback
    const isCorrect = await validateAnswer(formData) || false;

    if (isCorrect) {
      setAnswerStatus('correct');
      toast({
        title: "Excellent",
        description: "Your answer is correct.",
        className: "bg-emerald-900/90 border-emerald-500/50 text-emerald-100",
      });
      router.push('/redirect'); // Redirect immediately
    } else {
      setAnswerStatus('wrong');
      toast({
        title: "Incorrect",
        description: "That answer is not correct. Please try again.",
        variant: "destructive",
        className: "bg-red-900/90 border-red-500/50 text-red-100",
      })
      setSubmitting(false);
    }

    if (!isCorrect) {
      setAnswer("");
      setAnswerStatus(null);
      setIsSubmitted(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white font-minecraft bg-[url('/dashboardbg.webp')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,0,0,0.15),rgba(0,0,0,0.9))] animation-fade-in" />
      <div className="absolute inset-0 mix-blend-overlay opacity-25 bg-[url('/minecraft-sword-cursor.png')] bg-[length:160px_160px] animate-slow-pan" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,rgba(255,120,40,0.05)_0%,transparent_50%,rgba(255,50,20,0.05)_100%)]" />
      
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <BackButton />
      </div>

      <div className="relative z-10 px-4 py-8 sm:py-16 lg:py-24 max-w-6xl mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl sm:text-3xl font-bold text-white">1</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow">
                Round 1
              </h1>
            </div>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Please answer the following question.
            </p>
            <div className="mt-4 sm:mt-6 w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mx-auto"></div>
          </header>

          {/* Question Card */}
          <div className="relative bg-gradient-to-br from-zinc-950/90 to-black/85 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl mb-8 overflow-hidden">
             {answerStatus === 'correct' && (
                <div className="absolute inset-0 bg-emerald-500/10 animate-[pulse-green_1.5s_ease-out_forwards] z-0"></div>
              )}
              {answerStatus === 'wrong' && (
                <div className="absolute inset-0 bg-red-500/10 animate-[shake_0.5s_ease-in-out] z-0"></div>
              )}
            <div className="relative z-10 space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl sm:text-3xl">❓</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">Question</h2>
                  <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed">
                    {loading ? (<span>Loading...</span>) : (
                      <span>{question}</span>
                    )}
                    {error && <span className="text-red-500">{"error"}</span>}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-white/80 mb-3" htmlFor="answer">
                    Your Answer
                  </label>
                  <input
                    id="answer"
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      if (answerStatus) setAnswerStatus(null); // Clear status on new input
                      if (isSubmitted) setIsSubmitted(false); // Clear submitted status on new input
                    }}
                    placeholder="Type your answer here..."
                    className={`w-full rounded-xl border bg-black/40 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-white placeholder:text-white/50 focus:outline-none transition-all duration-300
                      ${isSubmitted ? (answerStatus === 'correct' ? 'border-emerald-500 ring-2 ring-emerald-500/50' : 'border-red-500 ring-2 ring-red-500/50') : 'border-white/20 focus:ring-amber-500/50 focus:border-amber-500/50'}
                    `}
                    disabled={submitting || isSubmitted}
                    autoComplete="off"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    disabled={submitting || !answer.trim() || isSubmitted || loading}
                    className="flex-1 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl border border-white/10"
                  >         
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">✓</span>
                        Submit Answer
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAnswer("")
                      toast({ 
                        title: "Cleared", 
                        description: "Answer field cleared.",
                        className: "bg-blue-900/90 border-blue-500/50 text-blue-100"
                      })
                    }}
                    className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Card */}
          <div className="relative bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 overflow-hidden shadow-xl">
             <div className="absolute inset-0 bg-blue-500/10 opacity-20 z-0 animate-[fade-in_1s_ease-out]"></div>
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-lg">ℹ</span>
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white/90 mb-2">Clue</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {clue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}