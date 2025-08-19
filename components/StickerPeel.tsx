"use client"

import type React from "react"

import { useRef, useEffect, useMemo, useState, type CSSProperties } from "react"
import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"

gsap.registerPlugin(Draggable)

interface StickerPeelProps {
  imageSrc: string
  rotate?: number
  peelBackHoverPct?: number
  peelBackActivePct?: number
  peelEasing?: string
  peelHoverEasing?: string
  width?: number
  shadowIntensity?: number
  lightingIntensity?: number
  initialPosition?: "center" | "random" | { x: number; y: number }
  peelDirection?: number
  className?: string
}

interface CSSVars extends CSSProperties {
  "--sticker-rotate"?: string
  "--sticker-p"?: string
  "--sticker-peelback-hover"?: string
  "--sticker-peelback-active"?: string
  "--sticker-peel-easing"?: string
  "--sticker-peel-hover-easing"?: string
  "--sticker-width"?: string
  "--sticker-shadow-opacity"?: number
  "--sticker-lighting-constant"?: number
  "--peel-direction"?: string
  "--sticker-start"?: string
  "--sticker-end"?: string
}

const StickerPeel: React.FC<StickerPeelProps> = ({
  imageSrc,
  rotate = 30,
  peelBackHoverPct = 30,
  peelBackActivePct = 40,
  peelEasing = "power3.out",
  peelHoverEasing = "power2.out",
  width = 200,
  shadowIntensity = 0.6,
  lightingIntensity = 0.1,
  initialPosition = "center",
  peelDirection = 0,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragTargetRef = useRef<HTMLDivElement>(null)
  const pointLightRef = useRef<SVGFEPointLightElement>(null)
  const pointLightFlippedRef = useRef<SVGFEPointLightElement>(null)
  const draggableInstanceRef = useRef<Draggable | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [animationStage, setAnimationStage] = useState<"normal" | "peeling" | "peeled">("normal")
  const [currentPeelPct, setCurrentPeelPct] = useState(0)
  const [isDragPeeling, setIsDragPeeling] = useState(false)
  const [dragPeelPct, setDragPeelPct] = useState(0)
  const defaultPadding = 10

  useEffect(() => {
    audioRef.current = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peel-prawns-277146-79v5ftH22R1zDtMwbaot37x3awyMHh.mp3")
    audioRef.current.volume = 0.3
    audioRef.current.preload = "auto"
    audioRef.current.load() // Force load

    const prepareAudio = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
      }
    }

    const handleFirstInteraction = () => {
      prepareAudio()
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("touchstart", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("touchstart", handleFirstInteraction)
    }
  }, [])

  const playPeelSound = (peelPercentage: number) => {
    if (audioRef.current && audioRef.current.readyState >= 2) {
      try {
        audioRef.current.currentTime = 0
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              const totalDuration = audioRef.current!.duration
              const playDuration = (peelPercentage / 100) * totalDuration

              setTimeout(() => {
                if (audioRef.current && !audioRef.current.paused) {
                  audioRef.current.pause()
                }
              }, playDuration * 1000)
            })
            .catch((error) => {
              console.log("Audio playback failed:", error)
            })
        }
      } catch (error) {
        console.log("Audio error:", error)
      }
    }
  }

  const playContinuousSound = () => {
    if (audioRef.current && audioRef.current.readyState >= 2) {
      try {
        audioRef.current.currentTime = 0
        audioRef.current.loop = false
        const playPromise = audioRef.current.play()

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio playback failed:", error)
          })
        }
      } catch (error) {
        console.log("Audio error:", error)
      }
    }
  }

  const stopSound = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  useEffect(() => {
    const target = dragTargetRef.current
    if (!target) return

    let startX = 0,
      startY = 0

    if (initialPosition === "center") {
      return
    }

    if (typeof initialPosition === "object" && initialPosition.x !== undefined && initialPosition.y !== undefined) {
      startX = initialPosition.x
      startY = initialPosition.y
    }

    gsap.set(target, { x: startX, y: startY })
  }, [initialPosition])

  useEffect(() => {
    const target = dragTargetRef.current
    if (!target) return

    const boundsEl = target.parentNode as HTMLElement

    const draggable = Draggable.create(target, {
      type: "x,y",
      bounds: boundsEl,
      inertia: true,
      onDrag(this: Draggable) {
        const rot = gsap.utils.clamp(-24, 24, this.deltaX * 0.4)
        gsap.to(target, { rotation: rot, duration: 0.15, ease: "power1.out" })
      },
      onDragEnd() {
        const rotationEase = "power2.out"
        const duration = 0.8
        gsap.to(target, { rotation: 0, duration, ease: rotationEase })
      },
    })

    draggableInstanceRef.current = draggable[0]

    const handleResize = () => {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.update()

        const currentX = gsap.getProperty(target, "x") as number
        const currentY = gsap.getProperty(target, "y") as number

        const boundsRect = boundsEl.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()

        const maxX = boundsRect.width - targetRect.width
        const maxY = boundsRect.height - targetRect.height

        const newX = Math.max(0, Math.min(currentX, maxX))
        const newY = Math.max(0, Math.min(currentY, maxY))

        if (newX !== currentX || newY !== currentY) {
          gsap.to(target, {
            x: newX,
            y: newY,
            duration: 0.3,
            ease: "power2.out",
          })
        }
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.kill()
      }
    }
  }, [])

  useEffect(() => {
    const updateLight = (e: Event) => {
      const mouseEvent = e as MouseEvent
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = mouseEvent.clientX - rect.left
      const y = mouseEvent.clientY - rect.top

      if (pointLightRef.current) {
        gsap.set(pointLightRef.current, { attr: { x, y } })
      }

      const normalizedAngle = Math.abs(peelDirection % 360)
      if (pointLightFlippedRef.current) {
        if (normalizedAngle !== 180) {
          gsap.set(pointLightFlippedRef.current, {
            attr: { x, y: rect.height - y },
          })
        } else {
          gsap.set(pointLightFlippedRef.current, {
            attr: { x: -1000, y: -1000 },
          })
        }
      }
    }

    const container = containerRef.current
    const eventType = "mousemove"

    if (container) {
      container.addEventListener(eventType, updateLight)
      return () => container.removeEventListener(eventType, updateLight)
    }
  }, [peelDirection])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let startY = 0
    let currentY = 0
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      isDragging = true
      setIsDragPeeling(true)
      container.classList.add("touch-active")
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return

      e.preventDefault()
      currentY = e.touches[0].clientY
      const deltaY = currentY - startY

      const maxDrag = 100 // pixels
      const peelPct = Math.max(0, Math.min(80, (deltaY / maxDrag) * 80))

      setDragPeelPct(peelPct)

      if (peelPct > 0) {
        playPeelSound(peelPct)
      }
    }

    const handleTouchEnd = () => {
      isDragging = false
      setIsDragPeeling(false)
      setDragPeelPct(0)
      container.classList.remove("touch-active")
      setTimeout(() => stopSound(), 600) // Match transition duration
    }

    const handleMouseDown = () => {
      playPeelSound(peelBackActivePct)
      setCurrentPeelPct(peelBackActivePct)
    }

    const handleMouseUp = () => {
      setCurrentPeelPct(0)
      setTimeout(() => stopSound(), 600) // Match transition duration
    }

    const handleMouseEnter = () => {
      playPeelSound(peelBackHoverPct)
      setCurrentPeelPct(peelBackHoverPct)
    }

    const handleMouseLeave = () => {
      setCurrentPeelPct(0)
      setTimeout(() => stopSound(), 600) // Match transition duration
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)
    container.addEventListener("touchcancel", handleTouchEnd)
    container.addEventListener("mousedown", handleMouseDown)
    container.addEventListener("mouseup", handleMouseUp)
    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
      container.removeEventListener("touchcancel", handleTouchEnd)
      container.removeEventListener("mousedown", handleMouseDown)
      container.removeEventListener("mouseup", handleMouseUp)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [peelBackHoverPct, peelBackActivePct])

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationStage("peeling")
      playContinuousSound()
      setCurrentPeelPct(60)
    }, 1000)

    const timer2 = setTimeout(() => {
      setAnimationStage("peeled")
      setCurrentPeelPct(70)
    }, 1500)

    const timer3 = setTimeout(() => {
      setAnimationStage("normal")
      setCurrentPeelPct(0)
      stopSound()
    }, 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const cssVars: CSSVars = useMemo(
    () => ({
      "--sticker-rotate": `${rotate}deg`,
      "--sticker-p": `${defaultPadding}px`,
      "--sticker-peelback-hover": `${peelBackHoverPct}%`,
      "--sticker-peelback-active": `${peelBackActivePct}%`,
      "--sticker-peel-easing": peelEasing,
      "--sticker-peel-hover-easing": peelHoverEasing,
      "--sticker-width": `${width}px`,
      "--sticker-shadow-opacity": shadowIntensity,
      "--sticker-lighting-constant": lightingIntensity,
      "--peel-direction": `${peelDirection}deg`,
      "--sticker-start": `calc(-1 * ${defaultPadding}px)`,
      "--sticker-end": `calc(100% + ${defaultPadding}px)`,
    }),
    [
      rotate,
      peelBackHoverPct,
      peelBackActivePct,
      peelEasing,
      peelHoverEasing,
      width,
      shadowIntensity,
      lightingIntensity,
      peelDirection,
      defaultPadding,
    ],
  )

  const stickerMainStyle: CSSProperties = {
    clipPath: `polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end))`,
    transition: "clip-path 0.6s ease-out",
    filter: "url(#dropShadow)",
    willChange: "clip-path, transform",
  }

  const flapStyle: CSSProperties = {
    clipPath: `polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-start) var(--sticker-start))`,
    top: `calc(-100% - var(--sticker-p) - var(--sticker-p))`,
    transform: "scaleY(-1)",
    transition: "all 0.6s ease-out",
    willChange: "clip-path, transform",
  }

  const imageStyle: CSSProperties = {
    transform: `rotate(calc(${rotate}deg - ${peelDirection}deg))`,
    width: `${width}px`,
    maxWidth: "100%",
    height: "auto",
  }

  const shadowImageStyle: CSSProperties = {
    ...imageStyle,
    filter: "url(#expandAndFill)",
  }

  return (
    <div
      className={`relative cursor-grab active:cursor-grabbing transform-gpu ${className}`}
      ref={dragTargetRef}
      style={cssVars}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .sticker-container:hover .sticker-main,
          .sticker-container.touch-active .sticker-main {
            clip-path: polygon(var(--sticker-start) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
          }
          .sticker-container:hover .sticker-flap,
          .sticker-container.touch-active .sticker-flap {
            clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-peelback-hover), var(--sticker-start) var(--sticker-peelback-hover)) !important;
            top: calc(-100% + 2 * var(--sticker-peelback-hover) - 1px) !important;
          }
          .sticker-container:active .sticker-main {
            clip-path: polygon(var(--sticker-start) var(--sticker-peelback-active), var(--sticker-end) var(--sticker-peelback-active), var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-peelback-active)) !important;
          }
          .sticker-container:active .sticker-flap {
            clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) var(--sticker-peelback-active), var(--sticker-start) var(--sticker-peelback-active)) !important;
            top: calc(-100% + 2 * var(--sticker-peelback-active) - 1px) !important;
          }
          .sticker-container.drag-peeling .sticker-main {
            clip-path: polygon(var(--sticker-start) ${dragPeelPct}%, var(--sticker-end) ${dragPeelPct}%, var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
            transition: none !important;
          }
          .sticker-container.drag-peeling .sticker-flap {
            clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) ${dragPeelPct}%, var(--sticker-start) ${dragPeelPct}%) !important;
            top: calc(-100% + ${dragPeelPct * 2}% - 1px) !important;
            transition: none !important;
          }
          .sticker-container.auto-peeling .sticker-main {
            clip-path: polygon(var(--sticker-start) 60%, var(--sticker-end) 60%, var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
            transition: clip-path 0.8s ease-out !important;
          }
          .sticker-container.auto-peeling .sticker-flap {
            clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) 60%, var(--sticker-start) 60%) !important;
            top: calc(-100% + 120% - 1px) !important;
            transition: all 0.8s ease-out !important;
          }
          .sticker-container.auto-peeled .sticker-main {
            clip-path: polygon(var(--sticker-start) 70%, var(--sticker-end) 70%, var(--sticker-end) var(--sticker-end), var(--sticker-start) var(--sticker-end)) !important;
            transition: clip-path 0.5s ease-out !important;
          }
          .sticker-container.auto-peeled .sticker-flap {
            clip-path: polygon(var(--sticker-start) var(--sticker-start), var(--sticker-end) var(--sticker-start), var(--sticker-end) 70%, var(--sticker-start) 70%) !important;
            top: calc(-100% + 140% - 1px) !important;
            transition: all 0.5s ease-out !important;
          }
          @media (max-width: 768px) {
            .sticker-container {
              transform: scale(0.9) !important;
            }
            .sticker-main img {
              max-width: 100% !important;
              height: auto !important;
            }
          }
          @media (max-width: 480px) {
            .sticker-container {
              transform: scale(0.8) !important;
            }
          }
        `,
        }}
      />

      <svg width="0" height="0">
        <defs>
          <filter id="pointLight">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity}
              lightingColor="white"
            >
              <fePointLight ref={pointLightRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="pointLightFlipped">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feSpecularLighting
              result="spec"
              in="blur"
              specularExponent="100"
              specularConstant={lightingIntensity * 7}
              lightingColor="white"
            >
              <fePointLight ref={pointLightFlippedRef} x="100" y="100" z="300" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceGraphic" result="lit" />
            <feComposite in="lit" in2="SourceAlpha" operator="in" />
          </filter>

          <filter id="dropShadow">
            <feDropShadow
              dx="2"
              dy="4"
              stdDeviation={3 * shadowIntensity}
              floodColor="black"
              floodOpacity={shadowIntensity}
            />
          </filter>

          <filter id="expandAndFill">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shape" />
            <feFlood floodColor="rgb(179,179,179)" result="flood" />
            <feComposite operator="in" in="flood" in2="shape" />
          </filter>
        </defs>
      </svg>

      <div
        className={`sticker-container relative select-none touch-none sm:touch-auto ${
          isDragPeeling
            ? "drag-peeling"
            : animationStage === "peeling"
              ? "auto-peeling"
              : animationStage === "peeled"
                ? "auto-peeled"
                : ""
        }`}
        ref={containerRef}
        style={{
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
          transform: `rotate(${peelDirection}deg)`,
          transformOrigin: "center",
          zIndex: 10,
          position: "relative",
        }}
      >
        <div className="sticker-main" style={stickerMainStyle}>
          <div style={{ filter: "url(#pointLight)" }}>
            <img
              src={imageSrc || "/placeholder.svg"}
              alt=""
              className="block"
              style={imageStyle}
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

        <div className="absolute top-4 left-2 w-full h-full opacity-40" style={{ filter: "brightness(0) blur(8px)" }}>
          <div className="sticker-flap" style={flapStyle}>
            <img
              src={imageSrc || "/placeholder.svg"}
              alt=""
              className="block"
              style={shadowImageStyle}
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>

        <div className="sticker-flap absolute w-full h-full left-0" style={flapStyle}>
          <div style={{ filter: "url(#pointLightFlipped)" }}>
            <img
              src={imageSrc || "/placeholder.svg"}
              alt=""
              className="block"
              style={shadowImageStyle}
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickerPeel
