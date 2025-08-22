"use client"

// removed useRouter (no redirect needed after completion)
import BackButton from "@/components/BackButton"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "@/hooks/use-toast"

const SIZE = 3 // 3x3

export default function round5() {
  const [order, setOrder] = useState<number[]>([]) // piece id at each slot index
  const [selected, setSelected] = useState<number | null>(null) // selected piece id (tap swap)
  const [complete, setComplete] = useState(false)
  const [confetti, setConfetti] = useState<{id:number;left:number;delay:number;duration:number;color:string;size:number;rotate:number;}[]>([])
  const dragFrom = useRef<number | null>(null)

  const ids = useMemo(() => Array.from({ length: SIZE * SIZE }, (_, i) => i), [])
  const [imageAvailable, setImageAvailable] = useState(true)

  // initial shuffle or load solved state & detect image availability
  useEffect(() => {
    // detect image presence
    const img = new Image()
    img.src = '/mine.jpg'
    img.onload = () => setImageAvailable(true)
    img.onerror = () => setImageAvailable(false)

    const solvedFlag = typeof window !== 'undefined' && localStorage.getItem('round5_solved')
    if (solvedFlag) {
      setOrder(ids) // solved order
      setComplete(true)
      return
    }
    const shuffled = [...ids].sort(() => Math.random() - 0.5)
    if (shuffled.every((id, i) => id === i)) {
      ;[shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]] // ensure not pre-solved
    }
    setOrder(shuffled)
  }, [ids])

  // check completion (toast only, no redirect)
  useEffect(() => {
    if (order.length === ids.length && order.every((id, i) => id === i)) {
      if (!complete) {
        setComplete(true)
        if (typeof window !== 'undefined') {
          localStorage.setItem('round5_solved', '1')
        }
        toast({
          title: "🎉 Puzzle Solved!",
          description: "Great job! You completed the 3×3 jigsaw.",
          className: "bg-emerald-900/90 border-emerald-500/50 text-emerald-100",
        })
        // create confetti pieces
        const colors = ['#f472b6','#fb923c','#facc15','#34d399','#60a5fa','#c084fc']
        const pieces = Array.from({length: 40}, (_, i) => ({
          id: i,
          left: Math.random()*100,
          delay: Math.random()*0.25,
          duration: 3 + Math.random()*2.5,
          color: colors[i % colors.length],
          size: 6 + Math.random()*10,
          rotate: Math.random()*360,
        }))
        setConfetti(pieces)
        setTimeout(()=> setConfetti([]), 5500)
      }
    }
  }, [order, ids, complete, toast])

  function swapSlots(a: number, b: number) {
    setOrder(prev => {
      const next = [...prev]
      ;[next[a], next[b]] = [next[b], next[a]]
      return next
    })
  }

  function handlePieceClick(slotIndex: number) {
    if (complete) return
    if (selected === null) {
      setSelected(order[slotIndex])
    } else {
      const firstSlot = order.indexOf(selected)
      if (firstSlot !== slotIndex) swapSlots(firstSlot, slotIndex)
      setSelected(null)
    }
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, slotIndex: number) {
    if (complete) return
    dragFrom.current = slotIndex
    e.dataTransfer.effectAllowed = "move"
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>, target: number) {
    e.preventDefault()
    if (dragFrom.current === null || dragFrom.current === target || complete) return
    swapSlots(dragFrom.current, target)
    dragFrom.current = null
  }

  // Removed shuffle/reset per requirements (single play).

  return (
  <div className="relative min-h-screen w-full overflow-x-hidden text-white font-minecraft bg-[url('/dashboardbg.webp')] bg-cover bg-center bg-fixed">
      {/* overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,0,0,0.15),rgba(0,0,0,0.9))]" />
      <div className="absolute inset-0 mix-blend-overlay opacity-25 bg-[url('/minecraft-sword-cursor.png')] bg-[length:160px_160px] animate-slow-pan" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(45deg,rgba(255,120,40,0.06)_0%,transparent_50%,rgba(255,50,20,0.06)_100%)]" />

      <div className="fixed top-4 left-4 z-50"><BackButton variant="label" /></div>

  <div className="relative z-10 px-4 py-12 sm:py-16 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-4 mb-6 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md ring-1 ring-white/10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/10">
              <span className="text-3xl sm:text-4xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">5</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-red-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Jigsaw Challenge
            </h1>
          </div>
          <p className="mx-auto text-neutral-100/90 text-sm sm:text-lg leading-relaxed px-4 py-3 rounded-xl bg-gradient-to-br from-black/55 via-black/40 to-black/55 backdrop-blur-md ring-1 ring-white/10 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.7)]">
            Reassemble the 3×3 Minecraft image. Drag pieces (desktop) or tap two pieces to swap (mobile). Complete it to finish the round.
          </p>
        </header>

        {/* Selected helper (mobile-friendly) */}
        {selected !== null && !complete && (
          <div className="mb-4 w-full max-w-xl px-4">
            <div className="rounded-xl bg-pink-600/20 border border-pink-500/30 backdrop-blur-sm px-4 py-2 text-xs sm:text-sm text-pink-100 flex items-center gap-2 animate-[fade-in_0.4s_ease]">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              Tile selected – tap another tile to swap.
            </div>
          </div>
        )}

        {/* Puzzle Card */}
        <div className="w-full max-w-xl mx-auto relative">
          <div className="relative bg-gradient-to-br from-black/85 via-zinc-900/80 to-black/70 border border-white/15 backdrop-blur-xl rounded-3xl p-5 sm:p-8 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="absolute inset-0 bg-pink-500/10 opacity-25" />
            {/* Flip Scene */}
            <div className="flip-scene w-full max-w-[min(92vw,520px)] mx-auto aspect-square">
              <div className={`flip-card ${complete ? 'is-complete' : ''}`}>
                {/* FRONT: Puzzle */}
                <div className="flip-face front">
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 w-full h-full select-none" aria-label="Jigsaw puzzle board">
                    {order.length === 0 && (
                      <div className="col-span-3 flex items-center justify-center text-xs sm:text-sm text-white/60 animate-pulse">Preparing pieces...</div>
                    )}
                    {order.map((pieceId, slotIndex) => {
                      const row = Math.floor(pieceId / SIZE)
                      const col = pieceId % SIZE
                      const selectedPiece = selected === pieceId
                      return (
                        <div
                          key={pieceId}
                          role="button"
                          aria-label={`Piece ${pieceId + 1}`}
                          tabIndex={0}
                          draggable={!complete}
                          onDragStart={e => handleDragStart(e, slotIndex)}
                          onDragOver={handleDragOver}
                          onDrop={e => handleDrop(e, slotIndex)}
                          onClick={() => handlePieceClick(slotIndex)}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePieceClick(slotIndex) } }}
              className={`relative rounded-md sm:rounded-lg overflow-hidden group shadow-inner transition-all duration-300 outline-none focus:ring-2 focus:ring-pink-300/70 will-change-transform piece-tile
                            ${selectedPiece
                ? 'ring-4 ring-pink-300 shadow-[0_0_0_4px_rgba(236,72,153,0.4),0_6px_18px_-6px_rgba(236,72,153,0.55)] scale-[1.045] z-10'
                : 'ring-1 ring-white/15 hover:ring-pink-300/50'}
                            ${complete ? 'cursor-default' : 'cursor-pointer'}
                            active:scale-[1.02]`}
                          style={imageAvailable ? {
                            backgroundImage: "url(/mine.jpg)",
                            backgroundSize: `${SIZE * 100}% ${SIZE * 100}%`,
                            backgroundPosition: `${(col / (SIZE - 1)) * 100}% ${(row / (SIZE - 1)) * 100}%`,
                            backgroundRepeat: 'no-repeat'
                          } : {
                            background: 'linear-gradient(135deg, rgba(236,72,153,0.25), rgba(244,114,182,0.15))',
                            backdropFilter: 'blur(2px)'
                          }}
                          data-index={slotIndex}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/30 opacity-0 group-hover:opacity-40 transition-opacity" />
                          <span className={`absolute bottom-1 right-1 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md backdrop-blur-sm transition-colors ${selectedPiece ? 'bg-pink-500/80 text-white drop-shadow' : 'bg-black/55 text-white/80'} shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}>
                            {pieceId + 1}
                          </span>
                          {selectedPiece && (
                            <>
                              <div className="absolute inset-0 pointer-events-none animate-pulse">
                                <div className="absolute inset-0 bg-pink-400/15" />
                              </div>
                              <span className="absolute inset-0 pointer-events-none">
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-pink-400/25 animate-tile-ripple" />
                              </span>
                            </>
                          )}
                          {!imageAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-semibold tracking-wide text-white/70">
                              {pieceId + 1}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {!complete && (
                    <div className="absolute -top-3 -left-3 w-20 h-20 bg-pink-500/20 blur-3xl rounded-full" />
                  )}
                </div>
                {/* BACK: Clue */}
                <div className="flip-face back">
                  {imageAvailable && <div className="absolute inset-0 bg-[url('/mine.jpg')] bg-cover bg-center opacity-25" />}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/60 to-black/75 backdrop-blur-md" />
                  <div className="relative flex flex-col items-center justify-center h-full p-4 sm:p-8 text-center">
                    <div className="max-w-md w-full mx-auto px-4 py-6 sm:py-8 rounded-2xl bg-gradient-to-br from-zinc-900/80 via-black/70 to-zinc-900/80 ring-1 ring-white/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.85)]">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-400 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] tracking-tight">
                        Clue Unlocked
                      </h2>
                      <p className="text-neutral-100/90 text-sm sm:text-lg leading-relaxed">
                        Deep within the Nether, fiery guardians protect what you need next. Remember the blaze that lights the path forward.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] sm:text-xs text-white/80">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.6)]">🔥 Blaze Hint</span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 shadow-[0_2px_6px_rgba(0,0,0,0.6)]">🧩 Solved</span>
                      </div>
                      <div className="mt-8 w-40 h-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 shadow-[0_2px_8px_-2px_rgba(244,114,182,0.6)]" />
                      {!imageAvailable && (
                        <p className="mt-5 text-[10px] sm:text-xs text-white/40">Image not found. Add <code className='px-1 bg-white/10 rounded'>mine.jpg</code> to /public for visual puzzle.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {confetti.length > 0 && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden confetti-layer">
                  {confetti.map(p => (
                    <span
                      key={p.id}
                      className="confetti-piece"
                      style={{
                        left: p.left + '%',
                        animationDelay: p.delay + 's',
                        animationDuration: p.duration + 's',
                        background: p.color,
                        width: p.size,
                        height: p.size * 0.6,
                        transform: `rotate(${p.rotate}deg)`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Flip animation styles */}
      <style jsx>{`
        .flip-scene { position: relative; width: 100%; height: 100%; perspective: 1400px; }
        .flip-card { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.9s cubic-bezier(.76,.01,.24,1); }
        .flip-card.is-complete { transform: rotateY(180deg); }
        .flip-face { position: absolute; inset: 0; backface-visibility: hidden; border-radius: 1rem; overflow: hidden; }
        .flip-face.back { transform: rotateY(180deg); display: flex; }
  /* Tile staggered entrance (remove forced opacity:0 so tiles stay visible if animation is skipped) */
  .piece-tile { animation: tile-in .6s ease forwards; }
        .piece-tile[data-index='0']{animation-delay:.05s}
        .piece-tile[data-index='1']{animation-delay:.1s}
        .piece-tile[data-index='2']{animation-delay:.15s}
        .piece-tile[data-index='3']{animation-delay:.2s}
        .piece-tile[data-index='4']{animation-delay:.25s}
        .piece-tile[data-index='5']{animation-delay:.3s}
        .piece-tile[data-index='6']{animation-delay:.35s}
        .piece-tile[data-index='7']{animation-delay:.4s}
        .piece-tile[data-index='8']{animation-delay:.45s}
        @keyframes tile-in {0%{transform:scale(.55) rotate(-8deg);opacity:0}60%{transform:scale(1.06) rotate(2deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:1} }
        @media (prefers-reduced-motion: reduce){
          .piece-tile{animation:none !important}
        }
        /* Ripple for selection */
        @keyframes tile-ripple {0%{transform:translate(-50%,-50%) scale(.25);opacity:.75}80%{opacity:0}100%{transform:translate(-50%,-50%) scale(2.6);opacity:0}}
        .animate-tile-ripple{animation:tile-ripple .9s ease-out forwards}
        /* Confetti */
        .confetti-layer{pointer-events:none}
        .confetti-piece{position:absolute;top:-12px;border-radius:2px;animation:confetti-fall linear forwards,confetti-spin linear infinite;mix-blend-mode:screen;}
        @keyframes confetti-fall {0%{transform:translateY(0) rotate(0deg);}100%{transform:translateY(125%) rotate(720deg);opacity:0}}
        @keyframes confetti-spin {0%{filter:hue-rotate(0deg);}100%{filter:hue-rotate(180deg);}}
      `}</style>
    </div>
  )
}
