"use client"

import { Coins, User, Clock, Settings } from "lucide-react"
import { formatTime } from "@/lib/utils"
import { useSettings } from "@/context/settings-context"
import BombAnimation from "@/components/bomb-animation"
import MilitaryCharacter from "@/components/military-character"
import MilitaryFrame from "@/components/military-frame"
import WorldIDVerification from "@/components/world-id-verification"
import GamePayButton from "@/components/game-pay-button"
import RecentPlayers from "@/components/recent-players"
import WinnersButton from "@/components/winners-button"
import WinnersModal from "@/components/winners-modal"
import { useGame } from "@/context/game-context"
import { useState, useEffect } from "react"

export default function GameComponent() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const { timeLeft, pot, isExploding, isVerified, lastPlayer } = useGame()
  const { language, theme, texts } = useSettings()

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format current time
  const formattedTime = currentTime.toLocaleTimeString(language === "es" ? "es-ES" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Determine timer styles based on time left
  const isUrgent = timeLeft <= 30

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4 ${
        theme === "dark" ? "bg-military-pattern-dark" : "bg-military-pattern-light"
      }`}
    >
      <div className="w-full max-w-md">
        <MilitaryFrame theme={theme === "dark" ? "dark" : "light"}>
          {/* Top Bar with Time and Settings */}
          <div className="flex justify-between items-center px-4 py-2 bg-black/40 border-b border-olive-600">
            <div className="flex items-center gap-2">
              <Clock className="text-olive-300" size={16} />
              <span className="text-olive-300 text-sm">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <WinnersButton />
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-olive-300 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          <div className="p-5">
            {/* Timer Display */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/70 border-2 border-olive-600">
                <span className={`text-2xl ${isUrgent ? "text-red-500" : "text-green-400"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Main Game Area */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-4">
              {/* Military Character */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <MilitaryCharacter />
                <div className="mt-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <User className="text-olive-400" size={16} />
                    <span className="text-sm text-gray-200">
                      {texts.lastPlayer}:{" "}
                      <span className="text-yellow-400">{lastPlayer ? `@${lastPlayer.username}` : texts.noOneYet}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bomb Animation */}
              <div className="w-full md:w-2/3 flex flex-col items-center">
                <BombAnimation isExploding={isExploding} timeLeft={timeLeft} pot={pot} texts={texts} />
              </div>
            </div>

            {/* Pot Display */}
            <div className="mb-4 p-3 bg-black/60 border border-olive-600 rounded-md">
              <div className="flex items-center justify-center gap-2">
                <Coins className="text-yellow-500" size={20} />
                <span className="text-xl font-bold text-gray-200">
                  {texts.reward}: <span className="text-yellow-400">{pot.toFixed(1)} WLD</span>
                </span>
              </div>
            </div>

            {/* Recent Players */}
            <div className="mb-4">
              <RecentPlayers />
            </div>

            {/* Verification or Action Button */}
            {!isVerified ? <WorldIDVerification /> : <GamePayButton text={texts.pressButton} />}
          </div>
        </MilitaryFrame>
      </div>

      {/* Winners Modal */}
      <WinnersModal />
    </main>
  )
}
