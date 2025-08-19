"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import ClickSpark from "../components/ClickSpark"
import "../styles/globals.css"

// Removed Next.js font optimization as it conflicts with custom font

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Added global sound effect for all pages
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Click_stereo.ogg-NLydup1s38ij3moKMx9G3AtsKfI7V1.mp3")
    audioRef.current.volume = 0.7

    const handleGlobalClick = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
      }
    }

    document.addEventListener("click", handleGlobalClick)
    return () => document.removeEventListener("click", handleGlobalClick)
  }, [])

  // Only return children, no html/body tags
  return (
    <ClickSpark sparkColor="#FFD700" sparkSize={15} sparkRadius={25} sparkCount={12} duration={600}>
      {children}
    </ClickSpark>
  )
}
