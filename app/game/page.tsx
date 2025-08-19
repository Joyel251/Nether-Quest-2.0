"use client"

import { useEffect, useState } from "react"

export default function GamePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setIsLoaded(true), 100)
    const timer2 = setTimeout(() => setShowContent(true), 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-black flex items-center justify-center transition-all duration-1000 ${
        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <h1
          className={`text-4xl font-minecraft text-white mb-8 drop-shadow-2xl transition-all duration-1000 ${
            showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Welcome to the Nether!
        </h1>

        <p
          className={`text-xl font-minecraft text-orange-300 drop-shadow-lg transition-all duration-1000 delay-300 ${
            showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          Your adventure begins here...
        </p>

        <div className={`mt-8 transition-all duration-1000 delay-500 ${showContent ? "opacity-100" : "opacity-0"}`}>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  )
}
