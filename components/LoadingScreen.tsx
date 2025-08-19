"use client"

import { useState } from "react"
import PixelTransition from "./PixelTransition"

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleClick = () => {
    if (isTransitioning) return
    setIsTransitioning(true)

    setTimeout(() => {
      onComplete()
    }, 1200) // Match GSAP animation duration
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Background pixels */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="z-10 relative" onClick={handleClick}>
        <PixelTransition
          firstContent={
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="font-minecraft text-lg mb-8 animate-pulse">
                  <span className="text-white-400">NETHER</span> <span className="text-white-300">QUEST</span> <span className="text-white">2.0</span>
                </div>
                <div className="text-orange-400 font-minecraft text-sm mb-4">CLICK ANYWHERE TO ENTER</div>
                <div className="w-2 h-2 bg-orange-500 mx-auto animate-ping" />
              </div>
            </div>
          }
          secondContent={
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div className="text-center">
                <div className="text-orange-400 font-minecraft text-lg animate-pulse">LOADING...</div>
              </div>
            </div>
          }
          gridSize={12}
          pixelColor="#f97316"
          animationStepDuration={0.6}
          className="w-screen h-screen rounded-none border-none"
          style={{ width: "100vw", height: "100vh" }}
          aspectRatio="0%"
        />
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
      `}</style>
    </div>
  )
}
