"use client"

import React, { useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function round2() {
  const [answer, setAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // slightly different question/answer for round 2
  const correctAnswer = "blaze rod"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answer.trim()) return
    setSubmitting(true)

    const normalized = answer.trim().toLowerCase()

    const isCorrect = normalized === correctAnswer || normalized === "blazerod"

    if (isCorrect) {
      toast({ title: "Correct answer", description: "Well done — that's the right item." })
    } else {
      toast({ title: "Wrong answer", description: "Not quite. Think about mob drops in the Nether.", variant: "destructive" })
    }

    setTimeout(() => setSubmitting(false), 350)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-gradient-to-br from-neutral-900/60 to-neutral-800/40 border border-neutral-700/40 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <header className="mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Round 2</h2>
          <p className="mt-2 text-sm text-neutral-300">Second challenge — quick thinking!</p>
        </header>

        <main>
          <div className="rounded-lg bg-gradient-to-r from-white/3 to-white/2 p-6 border border-white/5">
            <h3 className="text-xl font-semibold text-white">Question</h3>
            <p className="mt-3 text-neutral-200">Which Nether mob drops Blaze Rods when defeated?</p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type mob or item name..."
                className="w-full rounded-md border border-neutral-600 bg-transparent px-4 py-3 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={submitting}
              />

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting || !answer.trim()}
                  className="inline-flex items-center gap-2 rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-50"
                >
                  Submit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAnswer("")
                    toast({ title: "Cleared", description: "Answer cleared." })
                  }}
                  className="text-sm text-neutral-300 hover:text-white"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          <footer className="mt-6 text-sm text-neutral-400">Client-side check only — answers are case-insensitive.</footer>
        </main>
      </div>
    </div>
  )
}
