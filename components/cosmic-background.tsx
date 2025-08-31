"use client"

import { useEffect, useMemo, useState } from "react"

type Star = { left: number; top: number; size: number; duration: number }
type Planet = { left: number; top: number; size: number; bg: string; delay: number }

export function CosmicBackground() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const stars = useMemo<Star[]>(() => {
    const arr: Star[] = []
    for (let i = 0; i < 200; i++) {
      arr.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3,
        duration: 2 + Math.random() * 8,
      })
    }
    return arr
  }, [])

  const planetColors = useMemo(
    () => [
      "radial-gradient(circle at 30% 30%, #4a90e2, #1c3a6b)",
      "radial-gradient(circle at 30% 30%, #7b68ee, #4b0082)",
      "radial-gradient(circle at 30% 30%, #ff6b6b, #c0392b)",
      "radial-gradient(circle at 30% 30%, #1abc9c, #16a085)",
    ],
    [],
  )

  const planets = useMemo<Planet[]>(() => {
    const arr: Planet[] = []
    for (let i = 0; i < 8; i++) {
      arr.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 20 + Math.random() * 80,
        bg: planetColors[Math.floor(Math.random() * planetColors.length)],
        delay: Math.random() * 10,
      })
    }
    return arr
  }, [planetColors])

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[linear-gradient(135deg,#001f3f_0%,#000000_100%)]"
      role="presentation"
      aria-hidden="true"
    >
      {/* Stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: "rgba(255,255,255,1)",
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            opacity: 0.8,
          }}
        />
      ))}
      {/* Planets */}
      {mounted &&
        planets.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full shadow-inner"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.bg,
              boxShadow: "inset 0 0 50px rgba(0,0,0,0.5)",
              animation: "float 20s ease-in-out infinite",
              animationDelay: `-${p.delay}s`,
            }}
          />
        ))}
      <style>{`
        @keyframes twinkle { 0%,100% { opacity: .2 } 50% { opacity: 1 } }
        @keyframes float {
          0%,100% { transform: translateY(0) translateX(0) }
          25% { transform: translateY(-20px) translateX(10px) }
          50% { transform: translateY(0) translateX(20px) }
          75% { transform: translateY(20px) translateX(10px) }
        }
      `}</style>
    </div>
  )
}
