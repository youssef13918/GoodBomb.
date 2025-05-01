"use client"

import { useState } from "react"

interface LaunchButtonProps {
  onLaunch: () => void
}

export default function LaunchButton({ onLaunch }: LaunchButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseDown = () => {
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
    onLaunch()
  }

  return (
    <button
      className={`
        relative w-32 h-32 rounded-full 
        bg-gradient-to-b from-red-500 to-red-700
        border-4 border-gray-800 shadow-lg
        transition-transform duration-100
        ${isPressed ? "transform scale-95" : ""}
      `}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">LAUNCH</span>
      </div>
      <div className="absolute inset-0 rounded-full border-4 border-red-400 opacity-50"></div>
    </button>
  )
}
