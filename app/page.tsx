"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import StickerPeel from "../components/StickerPeel"
import LoadingScreen from "../components/LoadingScreen"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showLogo, setShowLogo] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isBreaking, setIsBreaking] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [buttonTransform, setButtonTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 })
  const [logoHovered, setLogoHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      const logoTimer = setTimeout(() => {
        setShowLogo(true)
      }, 800)

      const buttonTimer = setTimeout(() => {
        setShowButton(true)
      }, 1600)

      return () => {
        clearTimeout(logoTimer)
        clearTimeout(buttonTimer)
      }
    }
  }, [isLoading])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })

      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2))

        if (distance < 150) {
          const strength = Math.max(0, (150 - distance) / 150) * 0.4
          const deltaX = (e.clientX - centerX) * strength
          const deltaY = (e.clientY - centerY) * strength
          const rotateX = (e.clientY - centerY) * strength * 0.15
          const rotateY = (e.clientX - centerX) * strength * 0.15

          setButtonTransform({ x: deltaX, y: deltaY, rotateX: -rotateX, rotateY: rotateY })
        } else {
          setButtonTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 })
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [showButton])

  const handleStartHunt = () => {
    console.log("Starting the hunt!")

    setIsClicked(true)
    setIsBreaking(true)
    setIsTransitioning(true)

    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
    }))
    setParticles(newParticles)

    setTimeout(() => {
      router.push("/game")
    }, 1200)

    setTimeout(() => {
      setIsClicked(false)
      setIsBreaking(false)
      setParticles([])
    }, 600)
  }

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url(/nether-background.webp)",
          backgroundAttachment: "scroll", // Override bg-fixed on mobile for better performance
        }}
      />

      <style jsx>{`
        @keyframes pixel-fill {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in-delayed {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-pixel-fill {
          animation: pixel-fill 400ms ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 600ms ease-out 600ms forwards;
        }
        
        .grid-cols-20 {
          grid-template-columns: repeat(20, minmax(0, 1fr));
        }
        
        .grid-rows-12 {
          grid-template-rows: repeat(12, minmax(0, 1fr));
        }
        
        @media (max-width: 768px) {
          .mobile-bg {
            background-size: cover !important;
            background-position: center center !important;
            background-attachment: scroll !important;
            min-height: 100vh !important;
            min-height: 100dvh !important;
          }
        }
      `}</style>

      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Pixel grid transition effect */}
          <div className="absolute inset-0 grid grid-cols-20 grid-rows-12 gap-0">
            {Array.from({ length: 240 }, (_, i) => (
              <div
                key={i}
                className="bg-orange-500 opacity-0 animate-pixel-fill"
                style={{
                  animationDelay: `${Math.random() * 800}ms`,
                  animationDuration: "400ms",
                  animationFillMode: "forwards",
                }}
              />
            ))}
          </div>

          {/* Loading text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white font-minecraft text-2xl animate-pulse opacity-0 animate-fade-in-delayed">
              ENTERING THE NETHER...
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/50 mobile-bg" />

      <div
        className="fixed pointer-events-none z-20 w-96 h-96 rounded-full opacity-30 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle, rgba(255,165,0,0.4) 0%, rgba(255,69,0,0.2) 30%, transparent 70%)`,
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-2 xs:px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-4 xs:mb-6 sm:mb-8 lg:mb-12 transition-all duration-1500 ease-out ${
            showLogo ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
          }`}
        >
          <div
            className="relative w-full max-w-[320px] h-48 xs:h-64 sm:h-80 lg:h-96 flex items-center justify-center mx-auto cursor-pointer group"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <div
              className={`absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-white/20 to-transparent 
                           border-t border-l border-white/30 transform rotate-45 origin-bottom-left
                           transition-all duration-300 ${logoHovered ? "opacity-100 scale-110" : "opacity-60 scale-100"}
                           animate-pulse`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />

            <div
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2 
                           text-white/70 text-xs font-minecraft tracking-wider
                           transition-all duration-300 ${logoHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                           pointer-events-none`}
            >
              Try peeling me!
            </div>

            <StickerPeel
              imageSrc="/nether-quest-logo.png"
              width={280}
              rotate={15}
              peelBackHoverPct={25}
              peelBackActivePct={35}
              shadowIntensity={0.8}
              lightingIntensity={0.15}
              initialPosition="center"
              peelDirection={10}
              className="z-20"
            />
          </div>
        </div>

        <div
          className={`relative transition-all duration-1500 ease-out ${
            showButton ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-90"
          }`}
        >
          <button
            ref={buttonRef}
            onClick={handleStartHunt}
            className={`relative bg-gradient-to-b from-orange-300 via-orange-500 to-orange-800 
                     hover:from-orange-200 hover:via-orange-400 hover:to-orange-700
                     text-white font-minecraft font-bold tracking-wider
                     px-4 py-2 xs:px-6 xs:py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5
                     text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl
                     border-4 border-t-orange-100 border-l-orange-100 
                     border-r-orange-900 border-b-orange-900
                     hover:border-t-white hover:border-l-white
                     hover:border-r-orange-800 hover:border-b-orange-800
                     shadow-2xl hover:shadow-orange-500/50
                     transition-all duration-100 
                     hover:scale-110 transform-gpu minecraft-block custom-cursor
                     min-w-[120px] xs:min-w-[140px] sm:min-w-[160px] lg:min-w-[180px]
                     uppercase letter-spacing-widest
                     ${isBreaking ? "block-breaking" : ""}
                     ${
                       isClicked && !isBreaking
                         ? "scale-90 brightness-150 saturate-150 border-t-orange-200 border-l-orange-200 border-r-black border-b-black from-orange-400 via-orange-600 to-orange-900"
                         : "active:scale-95 active:border-t-orange-200 active:border-l-orange-200 active:border-r-black active:border-b-black active:from-orange-400 active:via-orange-600 active:to-orange-900"
                     }`}
            style={{
              imageRendering: "pixelated",
              textShadow: "2px 2px 0px rgba(0,0,0,0.8), 1px 1px 0px rgba(0,0,0,0.5)",
              transform: `translate3d(${buttonTransform.x}px, ${buttonTransform.y}px, 0) rotateX(${buttonTransform.rotateX}deg) rotateY(${buttonTransform.rotateY}deg)`,
              transition: "transform 0.1s ease-out",
              transformStyle: "preserve-3d",
            }}
            disabled={isBreaking}
          >
            <span className="relative z-10 drop-shadow-lg">START HUNT</span>
            <div className="absolute inset-1 bg-gradient-to-br from-orange-200/40 via-orange-300/20 to-transparent pointer-events-none rounded-sm" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />

            {isClicked && <div className="absolute inset-0 bg-white/30 animate-ping rounded-sm pointer-events-none" />}
          </button>

          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-4 h-4 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-700 pointer-events-none"
              style={{
                left: `50%`,
                top: `50%`,
                transform: `translate(${particle.x}px, ${particle.y}px)`,
                animation: `minecraft-particle 0.6s ease-out forwards`,
                boxShadow: "0 0 8px rgba(255, 60, 0, 1), 0 0 4px rgba(255, 69, 0, 0.8)",
                imageRendering: "pixelated",
                borderRadius: "1px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
