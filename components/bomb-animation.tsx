"use client"

import { useEffect, useRef } from "react"
import { formatTime } from "@/lib/utils"
import { Coins } from "lucide-react"

interface BombAnimationProps {
  isExploding: boolean
  timeLeft: number
  pot: number
  texts: Record<string, string>
}

export default function BombAnimation({ isExploding, timeLeft, pot, texts }: BombAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle explosion animation
  useEffect(() => {
    if (!containerRef.current) return

    if (isExploding) {
      // Create explosion effect
      const container = containerRef.current
      const particleCount = 50

      // Clear any existing particles
      container.innerHTML = ""

      // Create explosion particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")

        // Alternate between yellow, orange and red particles
        const colors = ["bg-yellow-500", "bg-orange-500", "bg-red-500"]
        const colorClass = colors[Math.floor(Math.random() * colors.length)]

        particle.className = `absolute ${colorClass} rounded-full`

        // Random size between 5px and 15px
        const size = Math.random() * 10 + 5
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`

        // Random position around center
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 100
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance

        particle.style.left = `calc(50% + ${x}px)`
        particle.style.top = `calc(50% + ${y}px)`

        // Animation
        particle.animate(
          [
            { opacity: 1, transform: "scale(1)" },
            { opacity: 0, transform: `scale(0) translate(${x * 2}px, ${y * 2}px)` },
          ],
          {
            duration: 1000,
            easing: "ease-out",
          },
        )

        container.appendChild(particle)
      }
    }
  }, [isExploding])

  // Calculate bomb animation based on time left
  const shakeAmount = timeLeft < 30 ? (30 - timeLeft) * 0.2 : 0

  return (
    <div
      ref={containerRef}
      className="relative w-48 h-48 flex items-center justify-center"
      style={{
        transform: shakeAmount
          ? `translate(${Math.sin(Date.now() / 100) * shakeAmount}px, ${Math.cos(Date.now() / 100) * shakeAmount}px)`
          : "none",
      }}
    >
      {!isExploding && (
        <div className="relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-10 bg-gray-700 rounded-t-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>

          <div
            className={`
            relative w-32 h-32 rounded-full bg-gradient-to-b from-gray-800 to-gray-900
            border-4 border-gray-700 shadow-lg flex items-center justify-center
            ${timeLeft < 10 ? "animate-pulse" : ""}
          `}
          >
            {/* Bomb Details */}
            <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-800"></div>
            </div>
            <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gray-800"></div>
            </div>

            {/* Military Stencil */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-military text-2xl text-red-500 opacity-80 rotate-12">TNT</div>
            </div>

            {/* Digital Timer */}
            <div
              className={`
              absolute -bottom-2 left-1/2 -translate-x-1/2 
              w-20 h-10 bg-black border-2 
              ${timeLeft < 30 ? "border-red-500" : "border-gray-700"} 
              rounded-md flex items-center justify-center
            `}
            >
              <span
                className={`
                font-mono text-lg font-bold 
                ${timeLeft < 10 ? "text-red-500" : timeLeft < 30 ? "text-orange-500" : "text-green-500"}
              `}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Pot Display */}
          <div className="absolute -top-8 -right-8 bg-black/80 border border-yellow-500 rounded-full px-3 py-1 flex items-center gap-1">
            <Coins className="text-yellow-500" size={14} />
            <span className="text-yellow-400 text-sm font-bold">{pot.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
