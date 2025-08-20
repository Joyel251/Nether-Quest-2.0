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

  const handleTitleClick = () => {
    triggerPixelTransition('/')
  }

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value)
    setErrors({ ...errors, teamName: "" })
    setSignupMessage("")
  }

  const handleTeamNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setTeamNumber(value)
    setErrors({ ...errors, teamNumber: "" })
    setShowAvatar(value.length > 0)
    setSignupMessage("")
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setErrors({ ...errors, password: "" })
    setSignupMessage("")
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    setErrors({ ...errors, confirmPassword: "" })
    setSignupMessage("")
  }

  const validateRegistrationForm = () => {
    const newErrors = { teamName: "", teamNumber: "", password: "", confirmPassword: "" }
    let hasErrors = false

    // Team name validation
    if (!teamName.trim()) {
      newErrors.teamName = "Team name is required"
      hasErrors = true
    } else if (teamName.trim().length < 2) {
      newErrors.teamName = "Team name must be at least 2 characters"
      hasErrors = true
    } else if (teamName.trim().length > 50) {
      newErrors.teamName = "Team name must be less than 50 characters"
      hasErrors = true
    }

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
    if (!password.trim()) {
      newErrors.password = "Password is required"
      hasErrors = true
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      hasErrors = true
    } else if (password.length > 100) {
      newErrors.password = "Password must be less than 100 characters"
      hasErrors = true
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
      hasErrors = true
    } else if (password !== confirmPassword) {
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
    formData.append('team-name', teamName.trim())
    formData.append('password', password)

    try {
      const result = await signup(formData)
      setIsSigningUp(false)
      
      if (result?.error === 'USER_EXISTS') {
        setUserExists(true)
        setSignupMessage(result.message)
      } else if (result?.success) {
        // Registration successful, redirect to login
        setSignupMessage("Team created successfully! Redirecting to login...")
        setTimeout(() => {
          triggerPixelTransition('/login')
        }, 1500)
      } else if (result?.error) {
        setSignupMessage(result.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error('Signup error:', error)
      setIsSigningUp(false)
      setSignupMessage("Registration failed. Please try again.")
    }
  }

  const handleGoToLogin = () => {
    triggerPixelTransition('/login')
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
      <div className="relative z-10 min-h-screen flex items-center justify-center p-2 xs:p-4 sm:p-6 lg:p-8">
        <div className={`w-full max-w-md lg:max-w-lg transition-all duration-1500 ${
          showContent ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
        }`}>
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 
              className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-minecraft font-bold text-white mb-3 sm:mb-4 tracking-wider cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={handleTitleClick}
            >
              <span 
                className="inline-block bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent hover:from-orange-300 hover:to-red-400 transition-all duration-300"
                style={{
                  textShadow: "3px 3px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8)",
                  WebkitTextStroke: "1px rgba(255,255,255,0.3)"
                }}
              >
                CREATE TEAM
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-orange-200 font-minecraft tracking-wide">
              Join the Nether Quest Adventure
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
            {/* Team Name Input */}
            <div className={`transition-all duration-1000 delay-300 ${showContent ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
              <label className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 tracking-wider uppercase`}>
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={handleTeamNameChange}
                maxLength={50}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                           border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                           border-r-black border-b-black
                           hover:border-t-${currentTheme.accent}-500 hover:border-l-${currentTheme.accent}-500
                           focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                           focus:outline-none
                           text-red-400 font-minecraft text-sm sm:text-base tracking-wider
                           minecraft-block transition-all duration-300
                           placeholder-red-600`}
                placeholder="Enter your team name"
                style={{ imageRendering: "pixelated" }}
                autoComplete="off"
              />
              {errors.teamName && (
                <p className="text-red-400 font-minecraft text-xs mt-2 tracking-wider animate-pulse flex items-center gap-2">
                  <span>⚠</span> {errors.teamName}
                </p>
              )}
            </div>

            {/* Team Number Input */}
            <div className={`transition-all duration-1000 delay-500 ${showContent ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
              <label className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 tracking-wider uppercase`}>
                Team Number 
              </label>
              <input
                type="text"
                value={teamNumber}
                onChange={handleTeamNumberChange}
                maxLength={3}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                           border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                           border-r-black border-b-black
                           hover:border-t-${currentTheme.accent}-500 hover:border-l-${currentTheme.accent}-500
                           focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                           focus:outline-none
                           text-red-400 font-minecraft text-sm sm:text-base tracking-wider
                           minecraft-block transition-all duration-300
                           placeholder-red-600`}
                placeholder="Enter team number"
                style={{ imageRendering: "pixelated" }}
                autoComplete="off"
              />
              {errors.teamNumber && (
                <p className="text-red-400 font-minecraft text-xs mt-2 tracking-wider animate-pulse flex items-center gap-2">
                  <span>⚠</span> {errors.teamNumber}
                </p>
              )}
            </div>

            {/* Team Avatar Display */}
            {showAvatar && teamNumber && !isNaN(Number.parseInt(teamNumber)) && (
              <div className={`text-center transition-all duration-1000 delay-700 ${showAvatar ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="relative">
                    <TeamAvatar teamNumber={Number.parseInt(teamNumber)} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 animate-float" />
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/30 to-red-500/30 rounded-full blur-sm animate-pulse" />
                  </div>
                </div>
                <p className="text-white font-minecraft text-xs sm:text-sm mb-2">Team #{teamNumber}</p>
                <p className="text-gray-300 font-minecraft text-xs">Your team avatar</p>
              </div>
            )}

            {/* Password Input */}
            <div className={`transition-all duration-1000 delay-700 ${showContent ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
              <label className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 tracking-wider uppercase`}>
                Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  maxLength={100}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                             border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                             border-r-black border-b-black
                             hover:border-t-${currentTheme.accent}-500 hover:border-l-${currentTheme.accent}-500
                             focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                             focus:outline-none
                             text-red-400 font-minecraft text-sm sm:text-base tracking-wider
                             minecraft-block transition-all duration-300
                             placeholder-red-600`}
                  placeholder="Create a strong password"
                  style={{ imageRendering: "pixelated" }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base"
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
            <div className={`transition-all duration-1000 delay-900 ${showContent ? 'transform translate-y-0 opacity-100 scale-100' : 'transform translate-y-8 opacity-0 scale-95'}`}>
              <label className={`block text-${currentTheme.accent}-200 font-minecraft text-xs sm:text-sm mb-2 tracking-wider uppercase`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  maxLength={100}
                  className={`w-full px-3 sm:px-4 py-3 sm:py-4 pr-10 sm:pr-12 bg-gradient-to-b from-${currentTheme.accent}-900/90 to-black/90 
                             border-4 border-t-${currentTheme.accent}-600 border-l-${currentTheme.accent}-600 
                             border-r-black border-b-black
                             hover:border-t-${currentTheme.accent}-500 hover:border-l-${currentTheme.accent}-500
                             focus:border-t-${currentTheme.accent}-400 focus:border-l-${currentTheme.accent}-400
                             focus:outline-none
                             text-red-400 font-minecraft text-sm sm:text-base tracking-wider
                             minecraft-block transition-all duration-300
                             placeholder-red-600`}
                  placeholder="Confirm your password"
                  style={{ imageRendering: "pixelated" }}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base"
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

            {/* Create Team Button */}
            <div className={`transition-all duration-1000 delay-1100 ${showContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-8 opacity-0'}`}>
              <button
                type="submit"
                disabled={isSigningUp}
                className={`w-full py-3 sm:py-4 font-minecraft font-bold text-sm sm:text-base lg:text-lg tracking-wider
                           bg-gradient-to-b from-${currentTheme.accent}-400 via-${currentTheme.accent}-600 to-${currentTheme.accent}-800 
                           hover:from-${currentTheme.accent}-300 hover:via-${currentTheme.accent}-500 hover:to-${currentTheme.accent}-700
                           disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800
                           border-4 border-t-${currentTheme.accent}-200 border-l-${currentTheme.accent}-200 
                           border-r-black border-b-black
                           hover:border-t-white hover:border-l-white
                           shadow-2xl hover:shadow-${currentTheme.accent}-500/50
                           transition-all duration-300 
                           hover:scale-105 transform minecraft-block
                           text-white uppercase
                           disabled:cursor-not-allowed disabled:opacity-75`}
                style={{
                  imageRendering: "pixelated",
                  textShadow: "2px 2px 0px rgba(0,0,0,0.8), -1px -1px 0px rgba(0,0,0,0.8), 1px -1px 0px rgba(0,0,0,0.8), -1px 1px 0px rgba(0,0,0,0.8)",
                  WebkitTextStroke: "1px black"
                }}
              >
                {isSigningUp ? "CREATING TEAM..." : "CREATE TEAM"}
              </button>
            </div>

            {/* Messages */}
            {signupMessage && (
              <div className="text-center mt-4">
                <p className={`font-minecraft text-xs sm:text-sm animate-pulse ${
                  userExists ? 'text-yellow-400' : 
                  signupMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {signupMessage}
                </p>
                {userExists && (
                  <button
                    type="button"
                    onClick={handleGoToLogin}
                    className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 font-minecraft text-xs sm:text-sm bg-gradient-to-b from-blue-600 to-blue-800 
                             hover:from-blue-500 hover:to-blue-700 border-4 border-blue-400 hover:border-blue-300 
                             minecraft-block transition-all duration-300 hover:scale-105 uppercase tracking-wider text-white"
                  >
                    Go to Login
                  </button>
                )}
              </div>
            )}

            {/* Login Link */}
            <div className="text-center mt-4 sm:mt-6">
              <p className="text-gray-300 font-minecraft text-xs sm:text-sm">
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

          {/* Loading Overlay */}
          {isSigningUp && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-orange-900/95 to-red-900/95 border-4 border-orange-500 minecraft-block p-6 sm:p-8 lg:p-12 text-center max-w-xs sm:max-w-sm mx-4 shadow-2xl">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-white font-minecraft text-sm sm:text-lg lg:text-xl tracking-wider mb-2 sm:mb-3 uppercase">
                  Creating Team
                </h3>
                <p className="text-orange-200 font-minecraft text-xs sm:text-sm tracking-wider mb-3 sm:mb-4">
                  Forging in Nether Fire...
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
