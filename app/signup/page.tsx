"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import TeamAvatar from "@/components/TeamAvatar"
import { triggerPixelTransition } from "@/components/PageTransition"
import { signup } from "./actions"

export default function SignupPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: team name & number, 2: password details
  const [teamName, setTeamName] = useState("")
  const [teamNumber, setTeamNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [signupMessage, setSignupMessage] = useState("")
  const [errors, setErrors] = useState({ teamName: "", teamNumber: "", password: "", confirmPassword: "" })
  const [showAvatar, setShowAvatar] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
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

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value)
    setErrors({ ...errors, teamName: "" })
  }

  const handleTeamNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setTeamNumber(value)
    setErrors({ ...errors, teamNumber: "" })
  }

  const handleContinueToPassword = () => {
    if (!teamName.trim()) {
      setErrors({ ...errors, teamName: "Team name is required" })
      return
    }

    if (!teamNumber.trim()) {
      setErrors({ ...errors, teamNumber: "Team number is required" })
      return
    }

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(2)
      setIsTransitioning(false)
    }, 300)
  }

  const handleBackToTeamInfo = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(1)
      setIsTransitioning(false)
    }, 300)
  }

  const validateRegistrationForm = () => {
    const newErrors = { teamName: "", teamNumber: "", password: "", confirmPassword: "" }
    let hasErrors = false

    // Team name validation
    if (!teamName.trim()) {
      newErrors.teamName = "Team name is required"
      hasErrors = true
    }

    // Team number validation
    if (!teamNumber.trim()) {
      newErrors.teamNumber = "Team number is required"
      hasErrors = true
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required"
      hasErrors = true
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      hasErrors = true
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
      hasErrors = true
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateRegistrationForm()) {
      return
    }

    setIsSigningUp(true)
    setSignupMessage("")
    setUserExists(false)

    const formData = new FormData()
    formData.append('team-number', teamNumber)
    formData.append('team-name', teamName)
    formData.append('password', password)

    try {
      const result = await signup(formData)
      setIsSigningUp(false)
      
      if (result?.error === 'USER_EXISTS') {
        setUserExists(true)
        setSignupMessage(result.message)
      } else if (result?.success) {
        // Registration successful, redirect to login
        triggerPixelTransition('/login')
      }
      // If signup is successful, the server action will redirect
    } catch (error) {
      console.error('Signup error:', error)
      setIsSigningUp(false)
      setSignupMessage("Registration failed. Please try again.")
    }
  }

  const handleGoToLogin = () => {
    triggerPixelTransition('/login')
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

          {/* Step 1: Team Name & Number */}
          {currentStep === 1 && (
            <>
              <div className="text-center mb-8 sm:mb-12">
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
                    CREATE TEAM
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-orange-200 font-minecraft tracking-wide">
                  Step 1: Enter your team details
                </p>
              </div>

              <div className="space-y-6">
                {/* Team Name Input */}
                <div>
                  <label
                    className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 sm:mb-3 tracking-wider uppercase`}
                  >
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={handleTeamNameChange}
                    className={`w-full px-4 py-3 sm:py-4 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                               border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                               border-r-black border-b-black
                               hover:border-t-${currentTheme.accent}-500 hover:border-l-${currentTheme.accent}-500
                               focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                               focus:outline-none
                               text-red-400 font-minecraft text-sm sm:text-base tracking-wider
                               minecraft-block transition-all duration-300
                               placeholder-red-600`}
                    placeholder="Enter your team name"
                    style={{
                      imageRendering: "pixelated",
                    }}
                  />
                  {errors.teamName && (
                    <p className="text-red-400 font-minecraft text-xs mt-2 tracking-wider animate-pulse flex items-center gap-2">
                      <span>⚠</span> {errors.teamName}
                    </p>
                  )}
                </div>

                {/* Team Number Input */}
                <div>
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
                    placeholder="Enter team number"
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

                {/* Team Avatar Display */}
                {teamNumber && (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <TeamAvatar teamNumber={Number.parseInt(teamNumber)} className="w-16 h-16 sm:w-20 sm:h-20 animate-float" />
                        <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/30 to-red-500/30 rounded-full blur-sm animate-pulse" />
                      </div>
                    </div>
                    <p className="text-white font-minecraft text-sm mb-2">Team #{teamNumber}</p>
                    <p className="text-gray-300 font-minecraft text-xs">Your team avatar</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleContinueToPassword}
                  className={`w-full py-3 sm:py-4 font-minecraft font-bold text-base sm:text-lg tracking-wider
                             bg-gradient-to-b from-${currentTheme.accent}-400 via-${currentTheme.accent}-600 to-${currentTheme.accent}-800 
                             hover:from-${currentTheme.accent}-300 hover:via-${currentTheme.accent}-500 hover:to-${currentTheme.accent}-700
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
                  NEXT →
                </button>
              </div>
            </>
          )}

          {/* Step 2: Password Setup */}
          {currentStep === 2 && (
            <>
              <div className="text-center mb-8 sm:mb-12">
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
                    SET PASSWORD
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-orange-200 font-minecraft tracking-wide">
                  Step 2: Secure your team - {teamName}
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4 sm:space-y-6">

                {/* Password Input */}
                <div className={`transition-all duration-1000 delay-400 ${!isTransitioning ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
                  <label
                    className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 sm:mb-3 tracking-wider uppercase`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 font-minecraft text-xs mt-2 tracking-wider animate-pulse flex items-center gap-2">
                      <span>⚠</span> {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className={`transition-all duration-1000 delay-600 ${!isTransitioning ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
                  <label
                    className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 sm:mb-3 tracking-wider uppercase`}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 sm:py-4 pr-12 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                                 border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                                 border-r-black border-b-black
                                 hover:border-t-${currentTheme.accent}-500 hover:border-l-${currentTheme.accent}-500
                                 focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                                 focus:outline-none
                                 text-red-400 font-minecraft text-sm sm:text-base tracking-wider
                                 minecraft-block transition-all duration-300
                                 placeholder-red-600`}
                      placeholder="Confirm your password"
                      style={{
                        imageRendering: "pixelated",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 font-minecraft text-xs mt-2 tracking-wider animate-pulse flex items-center gap-2">
                      <span>⚠</span> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-1000 delay-800 ${!isTransitioning ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'}`}>
                  <button
                    type="button"
                    onClick={handleBackToTeamInfo}
                    className={`px-6 py-3 sm:py-4 font-minecraft text-sm sm:text-base bg-gradient-to-b from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 border-4 border-gray-400 hover:border-gray-300 minecraft-block transition-all duration-300 hover:scale-105 uppercase tracking-wider`}
                    style={{
                      imageRendering: "pixelated",
                    }}
                  >
                    <span 
                      className="text-white font-bold"
                      style={{
                        textShadow: "2px 2px 0px rgba(0,0,0,1), -1px -1px 0px rgba(0,0,0,1), 1px -1px 0px rgba(0,0,0,1), -1px 1px 0px rgba(0,0,0,1)",
                        WebkitTextStroke: "1px black"
                      }}
                    >
                      ← BACK
                    </span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className={`flex-1 py-3 sm:py-4 font-minecraft font-bold text-base sm:text-lg tracking-wider
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
                    {isSigningUp ? "CREATING..." : "CREATE TEAM"}
                  </button>
                </div>

                {/* Error Messages */}
                {signupMessage && (
                  <div className="text-center">
                    <p className={`font-minecraft text-sm ${userExists ? 'text-yellow-400' : 'text-red-400'} animate-pulse`}>
                      {signupMessage}
                    </p>
                    {userExists && (
                      <button
                        type="button"
                        onClick={handleGoToLogin}
                        className="mt-4 px-6 py-2 font-minecraft text-sm bg-gradient-to-b from-blue-600 to-blue-800 
                                 hover:from-blue-500 hover:to-blue-700 border-4 border-blue-400 hover:border-blue-300 
                                 minecraft-block transition-all duration-300 hover:scale-105 uppercase tracking-wider text-white"
                      >
                        Go to Login
                      </button>
                    )}
                  </div>
                )}

                {/* Login Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-300 font-minecraft text-sm">
                    Already have a team?{" "}
                    <button
                      type="button"
                      onClick={handleGoToLogin}
                      className="text-orange-400 hover:text-orange-300 underline transition-colors duration-200"
                    >
                      Login here
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}

          {/* Loading Overlay */}
          {isSigningUp && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-orange-900/95 to-red-900/95 border-4 border-orange-500 minecraft-block p-8 sm:p-12 text-center max-w-sm mx-4 shadow-2xl">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-white font-minecraft text-lg sm:text-xl tracking-wider mb-3 uppercase">
                  Creating Team
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
        </div>
      </div>
    </div>
  )
}
