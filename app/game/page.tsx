"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import TeamAvatar from "@/components/TeamAvatar"

export default function TeamLoginPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [teamName, setTeamName] = useState("")
  const [teamNumber, setTeamNumber] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [errors, setErrors] = useState({ teamName: "", teamNumber: "" })
  const [showAvatar, setShowAvatar] = useState(false)
  const router = useRouter()

  const getTeamTheme = (num: number) => {
    const themes = [
      { bg: "from-blue-900 via-blue-800 to-indigo-900", accent: "blue"},
      { bg: "from-green-900 via-emerald-800 to-green-900", accent: "emerald"},
      { bg: "from-purple-900 via-violet-800 to-purple-900", accent: "purple"},
      { bg: "from-yellow-800 via-orange-700 to-red-800", accent: "orange"},
      { bg: "from-teal-900 via-cyan-800 to-blue-900", accent: "cyan" },
      { bg: "from-pink-900 via-rose-800 to-red-900", accent: "rose"},
    ]
    return themes[num % themes.length] || themes[0]
  }

  const currentTheme = teamNumber
    ? getTeamTheme(Number.parseInt(teamNumber))
    : { bg: "from-red-900 via-red-800 to-black", accent: "orange", name: "Nether" }

  useEffect(() => {
    const timer1 = setTimeout(() => setIsLoaded(true), 100)
    const timer2 = setTimeout(() => setShowContent(true), 800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const handleTeamNumberSubmit = () => {
    if (!teamNumber.trim()) {
      setErrors({ ...errors, teamNumber: "Team number is required" })
      return
    }
    if (!/^\d+$/.test(teamNumber.trim())) {
      setErrors({ ...errors, teamNumber: "Team number must be a valid number" })
      return
    }

    setErrors({ ...errors, teamNumber: "" })
    setShowAvatar(true)
    setTimeout(() => setCurrentStep(2), 500)
  }

  const handleTeamNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '')
    setTeamNumber(value)
  }

  const validateForm = () => {
    const newErrors = { teamName: "", teamNumber: "" }
    let isValid = true

    if (!teamName.trim()) {
      newErrors.teamName = "Team name is required"
      isValid = false
    } else if (teamName.trim().length < 2) {
      newErrors.teamName = "Team name must be at least 2 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoggingIn(true)

    setTimeout(() => {
      console.log(`Team "${teamName}" (${teamNumber}) logged in successfully!`)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${currentTheme.bg} flex items-center justify-center transition-all duration-1000 relative overflow-hidden ${
        isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url(/nether-background.gif)",
        }}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-br from-${currentTheme.accent}-500/5 via-transparent to-${currentTheme.accent}-900/10 animate-pulse`}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-${currentTheme.accent}-400/30 rounded-full animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="text-center mb-12">
          <div className="mb-8">
            <div
              className={`w-24 h-1 bg-gradient-to-r from-transparent via-${currentTheme.accent}-500 to-transparent mx-auto mb-6 animate-pulse`}
            />
            <h1
              className={`text-6xl font-minecraft text-white mb-4 drop-shadow-2xl transition-all duration-1000 ${
                showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{
                textShadow: "6px 6px 0px rgba(0,0,0,0.8), 3px 3px 0px rgba(255,165,0,0.4)",
              }}
            >
              <span className="text-orange-400">NETHER</span> <span className="text-red-300">QUEST</span>
            </h1>
            <div
              className={`w-32 h-1 bg-gradient-to-r from-transparent via-${currentTheme.accent}-400 to-transparent mx-auto mb-6`}
            />
          </div>

          {showAvatar && teamNumber && (
            <div
              className={`mb-12 transition-all duration-700 ${showAvatar ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
            >
              <div className="relative flex flex-col items-center">
                <div className="bg-gradient-to-b from-black/30 to-transparent rounded-full p-6 mb-4">
                  <TeamAvatar teamNumber={Number.parseInt(teamNumber)} className="mx-auto drop-shadow-2xl" />
                </div>
                <div className={`text-center bg-gradient-to-r from-transparent via-${currentTheme.accent}-500/20 to-transparent px-6 py-2 rounded-lg`}>
                  <p className={`text-${currentTheme.accent}-300 font-minecraft text-sm uppercase tracking-wider`}>
                    Team #{teamNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p
            className={`text-2xl font-minecraft text-orange-300 drop-shadow-lg transition-all duration-1000 delay-300 ${
              showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{
              textShadow: "3px 3px 0px rgba(0,0,0,0.8), 1px 1px 0px rgba(255,165,0,0.3)",
            }}
          >
            {currentStep === 1 ? "Enter Your Team Number" : "Enter Your Team Name"}
          </p>
        </div>

        <div
          className={`bg-gradient-to-b from-black/50 to-${currentTheme.accent}-900/50 backdrop-blur-md border-4 border-${currentTheme.accent}-600/60 p-8 minecraft-block transition-all duration-1000 delay-500 relative overflow-hidden ${
            showContent ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ imageRendering: "pixelated" }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-${currentTheme.accent}-500/5 to-transparent animate-pulse`}
          />

          <div className="relative z-10">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <label
                    className={`block text-${currentTheme.accent}-200 font-minecraft text-sm mb-4 tracking-wider uppercase`}
                  >
                    Team Number
                  </label>
                  <input
                    type="text"
                    value={teamNumber}
                    onChange={handleTeamNumberChange}
                    onKeyPress={(e) => e.key === "Enter" && handleTeamNumberSubmit()}
                    className={`w-full px-6 py-5 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                             border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                             border-r-black border-b-black
                             text-red-400 font-minecraft text-lg
                             focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                             focus:outline-none focus:ring-0 focus:shadow-lg focus:shadow-${currentTheme.accent}-500/20
                             minecraft-block custom-cursor
                             placeholder-${currentTheme.accent}-400/60 transition-all duration-300`}
                    placeholder="Enter your team number..."
                    style={{ imageRendering: "pixelated", letterSpacing: "0.08em" }}
                    autoFocus
                  />
                  {errors.teamNumber && (
                    <p className="text-red-400 font-minecraft text-xs mt-3 tracking-wider animate-pulse flex items-center gap-2">
                      <span>⚠</span> {errors.teamNumber}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleTeamNumberSubmit}
                  className={`w-full py-6 font-minecraft font-bold text-xl tracking-wider
                           bg-gradient-to-b from-${currentTheme.accent}-400 via-${currentTheme.accent}-600 to-${currentTheme.accent}-800 
                           hover:from-${currentTheme.accent}-300 hover:via-${currentTheme.accent}-500 hover:to-${currentTheme.accent}-700
                           text-white
                           border-4 border-t-${currentTheme.accent}-200 border-l-${currentTheme.accent}-200 
                           border-r-black border-b-black
                           hover:border-t-white hover:border-l-white
                           shadow-2xl hover:shadow-${currentTheme.accent}-500/50
                           transition-all duration-300 
                           hover:scale-105 transform-gpu minecraft-block custom-cursor
                           uppercase relative overflow-hidden group`}
                  style={{
                    imageRendering: "pixelated",
                    textShadow: "3px 3px 0px rgba(0,0,0,0.8), 1px 1px 0px rgba(0,0,0,0.5)",
                  }}
                >
                  <span className="relative z-10">⚡ CONTINUE ⚡</span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700`}
                  />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <form onSubmit={handleLogin} className="space-y-8">
                <div className="animate-fadeIn">
                  <label
                    className={`block text-${currentTheme.accent}-200 font-minecraft text-sm mb-4 tracking-wider uppercase`}
                  >
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className={`w-full px-6 py-5 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                             border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                             border-r-black border-b-black
                             text-red-400 font-minecraft text-lg
                             focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                             focus:outline-none focus:ring-0 focus:shadow-lg focus:shadow-${currentTheme.accent}-500/20
                             minecraft-block custom-cursor
                             placeholder-${currentTheme.accent}-400/60 transition-all duration-300`}
                    placeholder="Enter your team name..."
                    style={{ imageRendering: "pixelated", letterSpacing: "0.08em" }}
                    disabled={isLoggingIn}
                    autoFocus
                  />
                  {errors.teamName && (
                    <p className="text-red-400 font-minecraft text-xs mt-3 tracking-wider animate-pulse flex items-center gap-2">
                      <span>⚠</span> {errors.teamName}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1)
                      setShowAvatar(false)
                    }}
                    className={`px-8 py-4 font-minecraft text-sm bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white border-4 border-gray-400 hover:border-gray-300 minecraft-block transition-all duration-300 hover:scale-105 uppercase tracking-wider`}
                  >
                    ← BACK
                  </button>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className={`flex-1 py-6 font-minecraft font-bold text-xl tracking-wider
                             bg-gradient-to-b from-${currentTheme.accent}-400 via-${currentTheme.accent}-600 to-${currentTheme.accent}-800 
                             hover:from-${currentTheme.accent}-300 hover:via-${currentTheme.accent}-500 hover:to-${currentTheme.accent}-700
                             text-white
                             border-4 border-t-${currentTheme.accent}-200 border-l-${currentTheme.accent}-200 
                             border-r-black border-b-black
                             hover:border-t-white hover:border-l-white
                             shadow-2xl hover:shadow-${currentTheme.accent}-500/50
                             transition-all duration-300 
                             hover:scale-105 transform-gpu minecraft-block custom-cursor
                             disabled:opacity-50 disabled:cursor-not-allowed
                             disabled:hover:scale-100
                             ${isLoggingIn ? "animate-pulse" : ""}
                             uppercase relative overflow-hidden group`}
                    style={{
                      imageRendering: "pixelated",
                      textShadow: "3px 3px 0px rgba(0,0,0,0.8), 1px 1px 0px rgba(0,0,0,0.5)",
                    }}
                  >
                    <span className="relative z-10">
                      {isLoggingIn ? (
                        <span className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ENTERING...
                        </span>
                      ) : (
                        "⚔ENTER QUEST"
                      )}
                    </span>
                    {!isLoggingIn && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700`}
                      />
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div
          className={`mt-8 text-center transition-all duration-1000 delay-700 ${showContent ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`w-48 h-0.5 bg-gradient-to-r from-transparent via-${currentTheme.accent}-500 to-transparent mx-auto animate-pulse mb-4`}
          />
          <p className={`text-${currentTheme.accent}-400/70 font-minecraft text-xs tracking-wider uppercase`}>
            Prepare for the Ultimate Challenge
          </p>
        </div>
      </div>

      {isLoggingIn && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-md">
          <div
            className={`text-center bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 p-12 border-4 border-${currentTheme.accent}-600 minecraft-block relative overflow-hidden`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-${currentTheme.accent}-500/10 to-transparent animate-pulse`}
            />
            <div className="relative z-10">
              <div
                className={`w-24 h-24 border-4 border-${currentTheme.accent}-500 border-t-transparent rounded-full animate-spin mx-auto mb-8`}
              />
              <p className="text-white font-minecraft text-3xl animate-pulse mb-4 uppercase tracking-wider">
                Authenticating Team...
              </p>
              <p className={`text-${currentTheme.accent}-300 font-minecraft text-sm uppercase tracking-wider`}>
                Connecting to Nether Portal...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
