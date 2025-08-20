"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { gsap } from "gsap"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  gridSize?: number
  pixelColor?: string
  animationDuration?: number
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = "",
  gridSize = 12,
  pixelColor = "#ff6600",
  animationDuration = 0.8,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pixelGridRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [nextPath, setNextPath] = useState<string>("")
  const router = useRouter()

  // Create pixel grid
  useEffect(() => {
    const pixelGridEl = pixelGridRef.current
    if (!pixelGridEl) return

    pixelGridEl.innerHTML = ""

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div")
        pixel.classList.add("pixel-transition__pixel")
        pixel.classList.add("absolute", "opacity-0")
        pixel.style.backgroundColor = pixelColor
        pixel.style.boxShadow = `0 0 4px ${pixelColor}, inset 0 0 2px rgba(255,255,255,0.3)`

        const size = 100 / gridSize
        pixel.style.width = `${size}%`
        pixel.style.height = `${size}%`
        pixel.style.left = `${col * size}%`
        pixel.style.top = `${row * size}%`
        pixel.style.imageRendering = "pixelated"
        pixel.style.border = "1px solid rgba(0,0,0,0.3)"

        pixelGridEl.appendChild(pixel)
      }
    }
  }, [gridSize, pixelColor])

  const startTransition = useCallback((path: string) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setNextPath(path)

    const pixelGridEl = pixelGridRef.current
    const contentEl = contentRef.current
    if (!pixelGridEl || !contentEl) return

    const pixels = pixelGridEl.querySelectorAll<HTMLDivElement>(".pixel-transition__pixel")
    if (!pixels.length) return

    // Show pixel grid
    pixelGridEl.style.display = "block"
    pixelGridEl.style.zIndex = "9999"

    // Reset all pixels
    gsap.set(pixels, { opacity: 0, scale: 0.5 })

    const totalPixels = pixels.length
    const staggerDuration = animationDuration / totalPixels * 0.8

    // Add glow effect to random pixels
    const randomPixels = Array.from(pixels).sort(() => Math.random() - 0.5).slice(0, totalPixels * 0.3)
    randomPixels.forEach(pixel => pixel.classList.add('glowing'))

    // Animate pixels in (covering the screen)
    gsap.to(pixels, {
      opacity: 1,
      scale: 1,
      duration: 0.1,
      stagger: {
        each: staggerDuration,
        from: "random",
      },
      ease: "power2.out",
      onComplete: () => {
        // Navigate to new page after covering animation
        router.push(path)
      }
    })

    // Start fade out after half duration
    gsap.to(pixels, {
      opacity: 0,
      scale: 0.3,
      duration: 0.15,
      delay: animationDuration * 0.6,
      stagger: {
        each: staggerDuration * 0.5,
        from: "random",
      },
      ease: "power2.in",
      onComplete: () => {
        pixelGridEl.style.display = "none"
        setIsTransitioning(false)
        setNextPath("")
        // Remove glow effects
        randomPixels.forEach(pixel => pixel.classList.remove('glowing'))
      }
    })
  }, [isTransitioning, animationDuration, router])

  // Expose transition function globally
  useEffect(() => {
    const handleTransition = (event: CustomEvent<{ path: string }>) => {
      startTransition(event.detail.path)
    }

    window.addEventListener('pixelTransition' as any, handleTransition)
    return () => window.removeEventListener('pixelTransition' as any, handleTransition)
  }, [startTransition])

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {/* Main content */}
      <div ref={contentRef} className="relative w-full h-full">
        {children}
      </div>

      {/* Pixel transition overlay */}
      <div 
        ref={pixelGridRef} 
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ 
          display: "none",
          zIndex: 9999
        }}
      />

      {/* Transition status indicator */}
      {isTransitioning && (
        <div className="fixed top-4 right-4 z-[10000] bg-black/80 text-orange-400 px-3 py-2 rounded font-minecraft text-xs">
          Transitioning to {nextPath}...
        </div>
      )}
    </div>
  )
}

// Helper function to trigger pixel transition
export const triggerPixelTransition = (path: string) => {
  const event = new CustomEvent('pixelTransition', { detail: { path } })
  window.dispatchEvent(event)
}

export default PageTransition
