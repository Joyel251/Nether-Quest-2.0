"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import TeamAvatar from "@/components/TeamAvatar"
import { triggerPixelTransition } from "@/components/PageTransition"
import { login } from "./actions"

export default function LoginPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [teamNumber, setTeamNumber] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [userNotFound, setUserNotFound] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")
  const [errors, setErrors] = useState({ teamName: "", teamNumber: "", loginPassword: "" })
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
    const timer3 = setTimeout(() => setShowAvatar(true), 1200)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const handleTeamNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setTeamNumber(value)
    setErrors({ ...errors, teamNumber: "" })
    setShowAvatar(value.length > 0)
    setLoginMessage("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(e.target.value)
    setErrors({ ...errors, loginPassword: "" })
    setLoginMessage("")
  }

  const validateForm = () => {
    const newErrors = { teamName: "", teamNumber: "", loginPassword: "" }
    let hasErrors = false

    // Team number validation
    if (!teamNumber.trim()) {
      newErrors.teamNumber = "Team number is required"
      hasErrors = true
    } else {
      const num = Number.parseInt(teamNumber)
      if (isNaN(num) || num < 1 || num > 999) {
        newErrors.teamNumber = "Team number must be between 1 and 999"
        hasErrors = true
      }
    }

    // Password validation
    if (!loginPassword.trim()) {
      newErrors.loginPassword = "Password is required"
      hasErrors = true
    } else if (loginPassword.length < 6) {
      newErrors.loginPassword = "Password must be at least 6 characters"
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoggingIn(true)
    setLoginMessage("")
    setUserNotFound(false)

    const formData = new FormData()
    formData.append('team-number', teamNumber)
    formData.append('password', loginPassword)

    try {
      const result = await login(formData)
      setIsLoggingIn(false)
      if (result?.error === 'WRONG_PASSWORD') {
        setLoginMessage(result.message)
      } else if (result?.error === 'USER_NOT_EXISTS') {
        setUserNotFound(true)
        setLoginMessage(result.message)
      } else if (result?.error === 'WRONG_TEAM_NAME') {
        setErrors({ ...errors, teamName: result.message })
        setLoginMessage("")
      } else if (result?.success) {
        // Pixel transition to dashboard
        triggerPixelTransition('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoggingIn(false)
      setLoginMessage("Login failed. Please try again.")
    }
  }

  const handleGoToSignup = () => {
    triggerPixelTransition('/signup')
  }

  const handleGoHome = () => {
    triggerPixelTransition('/')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-2000"
        style={{
          backgroundImage: "url(/nether-background.webp)",
          filter: isLoaded ? "brightness(0.4) contrast(1.2)" : "brightness(0.2) contrast(0.8)",
        }}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bg} transition-all duration-2000 ${
        isLoaded ? "opacity-80" : "opacity-95"
      }`} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className={`w-full max-w-md transition-all duration-1500 ${
          showContent ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}>
          {/* Card Shell */}
          <div className="relative group rounded-2xl p-[2px] bg-gradient-to-br from-orange-500/40 via-red-600/30 to-red-800/40 backdrop-blur-sm shadow-[0_0_25px_-5px_rgba(255,100,40,0.35)] border border-white/10 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_30%_20%,rgba(255,180,90,0.25),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(255,60,40,0.2),transparent_65%)]" />
            <div className="relative rounded-[inherit] px-5 sm:px-7 pt-8 sm:pt-10 pb-8 sm:pb-10 bg-black/65 backdrop-blur-xl">
          <div className="text-center mb-8 sm:mb-10">
            <h1 
              className="text-2xl sm:text-4xl font-minecraft font-bold text-white mb-4 tracking-wider cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleGoHome}
            >
              <span 
                className="inline-block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent hover:from-orange-300 hover:to-red-400 transition-all duration-200"
                style={{
                  textShadow: "3px 3px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8)",
                  WebkitTextStroke: "1px rgba(255,255,255,0.3)"
                }}
              >
                TEAM LOGIN
              </span>
            </h1>
            <p className="text-base sm:text-lg text-orange-200 font-minecraft tracking-wide">
              Enter your team credentials
            </p>
          </div>

          {/* Team Avatar Display */}
            {showAvatar && teamNumber && (
              <div className={`text-center transition-all duration-1000 delay-700 ${showAvatar ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <TeamAvatar teamNumber={Number.parseInt(teamNumber)} className="w-16 h-16 sm:w-20 sm:h-20 animate-float" />
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/30 to-red-500/30 rounded-full blur-sm animate-pulse" />
                  </div>
                </div>
                <p className="text-white font-minecraft text-sm mb-2">Team #{teamNumber}</p>
              </div>
            )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Team Number Input */}
            <div className={`transition-all duration-1000 delay-500 ${showContent ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
              <label
                className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 sm:mb-3 tracking-wider uppercase`}
              >
                Team Number
              </label>
              <input
                type="text"
                value={teamNumber}
                onChange={handleTeamNumberChange}
                className={`w-full px-4 py-3 sm:py-4 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                           border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                           border-r-black border-b-black
                           hover:border-t-${currentTheme.accent}-500 hover:border-l-${currentTheme.accent}-500
                           focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                           focus:outline-none
                           text-red-400 font-minecraft text-sm sm:text-base tracking-wider
                           minecraft-block transition-all duration-300
                           placeholder-red-600`}
                placeholder="Enter your team number"
                style={{
                  imageRendering: "pixelated",
                }}
              />
              {errors.teamNumber && (
                <p className="text-red-400 font-minecraft text-xs mt-2 tracking-wider animate-pulse flex items-center gap-2">
                  <span>⚠</span> {errors.teamNumber}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className={`transition-all duration-1000 delay-700 ${showContent ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
              <label
                className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 sm:mb-3 tracking-wider uppercase`}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 sm:py-4 pr-12 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                             border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                             border-r-black border-b-black
                             hover:border-t-${currentTheme.accent}-500 hover:border-l-${currentTheme.accent}-500
                             focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                             focus:outline-none
                             text-red-400 font-minecraft text-sm sm:text-base tracking-wider
                             minecraft-block transition-all duration-300
                             placeholder-red-600`}
                  placeholder="Enter your password"
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showLoginPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.loginPassword && (
                <p className="text-red-400 font-minecraft text-xs mt-2 tracking-wider animate-pulse flex items-center gap-2">
                  <span>⚠</span> {errors.loginPassword}
                </p>
              )}
            </div>

            {/* Login Button */}
            <div className={`transition-all duration-1000 delay-900 ${showContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'}`}>
              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full py-3 sm:py-4 font-minecraft font-bold text-base sm:text-lg tracking-wider
                           bg-gradient-to-b from-${currentTheme.accent}-400 via-${currentTheme.accent}-600 to-${currentTheme.accent}-800 
                           hover:from-${currentTheme.accent}-300 hover:via-${currentTheme.accent}-500 hover:to-${currentTheme.accent}-700
                           disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800
                           border-4 border-t-${currentTheme.accent}-200 border-l-${currentTheme.accent}-200 
                           border-r-black border-b-black
                           hover:border-t-white hover:border-l-white
                           shadow-2xl hover:shadow-${currentTheme.accent}-500/50
                           transition-all duration-300 
                           hover:scale-105 transform minecraft-block
                           text-white uppercase`}
                style={{
                  imageRendering: "pixelated",
                  textShadow: "2px 2px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8)",
                  WebkitTextStroke: "1px black"
                }}
              >
                {isLoggingIn ? "ACCESSING..." : "LOGIN"}
              </button>
            </div>

            {/* Error Messages */}
            {loginMessage && (
              <div className="text-center">
                <p className={`font-minecraft text-sm ${userNotFound ? 'text-yellow-400' : 'text-red-400'} animate-pulse`}>
                  {loginMessage}
                </p>
                {userNotFound && (
                  <button
                    type="button"
                    onClick={handleGoToSignup}
                    className="mt-4 px-6 py-2 font-minecraft text-sm bg-gradient-to-b from-green-600 to-green-800 
                             hover:from-green-500 hover:to-green-700 border-4 border-green-400 hover:border-green-300 
                             minecraft-block transition-all duration-300 hover:scale-105 uppercase tracking-wider text-white"
                  >
                    Create Team
                  </button>
                )}
              </div>
            )}

            {/* Signup Link */}
            <div className="text-center mt-6">
              <p className="text-gray-300 font-minecraft text-sm">
                Need to create a team?{" "}
                <button
                  type="button"
                  onClick={handleGoToSignup}
                  className="text-orange-400 hover:text-orange-300 underline transition-colors duration-200"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </form>

          {/* Loading Overlay */}
          {isLoggingIn && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-orange-900/95 to-red-900/95 border-4 border-orange-500 minecraft-block p-8 sm:p-12 text-center max-w-sm mx-4 shadow-2xl">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-white font-minecraft text-lg sm:text-xl tracking-wider mb-3 uppercase">
                  Accessing Team
                </h3>
                <p className="text-orange-200 font-minecraft text-sm tracking-wider mb-4">
                  Entering Nether Portal...
                </p>
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
            {/* Card corner accents */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-px -left-px w-10 h-10 border-l-2 border-t-2 border-amber-400/60 rounded-tl-xl" />
              <div className="absolute -top-px -right-px w-10 h-10 border-r-2 border-t-2 border-red-400/60 rounded-tr-xl" />
              <div className="absolute -bottom-px -left-px w-10 h-10 border-l-2 border-b-2 border-orange-500/50 rounded-bl-xl" />
              <div className="absolute -bottom-px -right-px w-10 h-10 border-r-2 border-b-2 border-rose-500/50 rounded-br-xl" />
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}