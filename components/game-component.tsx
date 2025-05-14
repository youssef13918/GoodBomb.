"use client"

import { useState, useEffect, useCallback } from "react"
import { Coins, User, Clock, Settings } from "lucide-react"
import { formatTime } from "@/lib/utils"
import { useSettings } from "@/context/settings-context"
import { useWorldApp } from "@/context/world-app-context"
import { useToast } from "@/hooks/use-toast"
import SettingsModal from "@/components/settings-modal"
import BombAnimation from "@/components/bomb-animation"
import MilitaryCharacter from "@/components/military-character"
import MilitaryButton from "@/components/military-button"
import MilitaryFrame from "@/components/military-frame"
import WorldIDVerification from "@/components/world-id-verification"
import GamePayButton from "@/components/game-pay-button"

// Función auxiliar para reproducir sonidos de manera segura
const playSoundSafely = (soundPath: string) => {
  try {
    const sound = new Audio(soundPath)
    sound.addEventListener("error", (e) => {
      console.log(`Error al cargar el sonido ${soundPath}: ${e.message}`)
    })

    const playPromise = sound.play()

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log(`Error al reproducir el sonido: ${error.message}`)
      })
    }
  } catch (error) {
    console.log(`Error al crear el objeto de audio: ${error}`)
  }
}

export default function GameComponent() {
  const [timeLeft, setTimeLeft] = useState(240) // 4 minutes in seconds
  const [lastPlayer, setLastPlayer] = useState("Nadie aún")
  const [pot, setPot] = useState(0)
  const [isExploding, setIsExploding] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { toast } = useToast()
  const { language, soundEnabled, theme, texts } = useSettings()
  const { isWorldAppInstalled, isDevelopmentMode, username, isVerified } = useWorldApp()

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      handleExplosion()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Handle bomb explosion
  const handleExplosion = useCallback(() => {
    setIsExploding(true)

    if (soundEnabled) {
      playSoundSafely("/sounds/explosion.mp3")
    }

    toast({
      title: texts.explosionTitle,
      description: `${texts.explosionPrefix} @${lastPlayer} ${texts.explosionWon} ${(pot * 0.85).toFixed(1)} WLD!`,
      variant: "destructive",
    })

    // Reset game after explosion animation
    setTimeout(() => {
      setIsExploding(false)
      setTimeLeft(240)
      // 5% of the pot goes to the next round
      setPot(pot * 0.05)
      setLastPlayer(texts.noOneYet)
    }, 3000)
  }, [lastPlayer, pot, toast, soundEnabled, texts])

  // Handle button press with World App integration
  const handleButtonPress = useCallback(async () => {
    try {
      setIsButtonDisabled(true)

      if (soundEnabled) {
        playSoundSafely("/sounds/button-press.mp3")
      }

      // Si World App está instalada, usamos el nombre de usuario real
      const displayName = username || "Usuario" + Math.floor(Math.random() * 1000)

      setTimeLeft(240)
      setLastPlayer(displayName)
      setPot((prev) => prev + 0.1)

      toast({
        title: texts.bombActivated,
        description: texts.bombActivatedDesc,
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: texts.error,
        description: texts.errorDesc,
        variant: "destructive",
      })
    } finally {
      setIsButtonDisabled(false)
    }
  }, [toast, soundEnabled, texts, username])

  // Manejar el pago exitoso
  const handlePaymentSuccess = useCallback(
    (playerName: string) => {
      if (soundEnabled) {
        playSoundSafely("/sounds/button-press.mp3")
      }

      setTimeLeft(240)
      setLastPlayer(playerName)
      setPot((prev) => prev + 0.1)
    },
    [soundEnabled],
  )

  // Format current time
  const formattedTime = currentTime.toLocaleTimeString(language === "es" ? "es-ES" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Determine timer styles based on time left
  const isUrgent = timeLeft <= 30

  // Determinar si mostrar la verificación o el botón de pago
  const showWorldIDVerification = (isWorldAppInstalled || isDevelopmentMode) && !isVerified
  const showPayButton = (isWorldAppInstalled || isDevelopmentMode) && isVerified

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
              {username && (
                <span className="text-olive-300 text-sm">
                  @{username} {isDevelopmentMode && "(Dev)"}
                </span>
              )}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-olive-300 hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          <div className="p-5">
            {/* World ID Verification */}
            {showWorldIDVerification && (
              <div className="mb-4">
                <WorldIDVerification onVerified={() => {}} />
              </div>
            )}

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
                      {texts.lastPlayer}: <span className="text-yellow-400">@{lastPlayer}</span>
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

            {/* Action Button */}
            {showPayButton ? (
              <GamePayButton
                onPaymentSuccess={handlePaymentSuccess}
                isUrgent={isUrgent}
                disabled={isButtonDisabled || isExploding}
              />
            ) : (
              <MilitaryButton
                onClick={handleButtonPress}
                disabled={isButtonDisabled || isExploding || showWorldIDVerification}
                isUrgent={isUrgent}
                text={texts.pressButton}
              />
            )}

            {/* Mensaje si no está verificado */}
            {showWorldIDVerification && (
              <div className="mt-2 text-center text-yellow-400 text-sm">
                Debes verificarte {isDevelopmentMode ? "(modo desarrollo) " : "con World ID "}para poder jugar
              </div>
            )}

            {/* Modo desarrollo */}
            {isDevelopmentMode && (
              <div className="mt-4 p-2 bg-blue-900/50 border border-blue-700 rounded-md text-center">
                <p className="text-xs text-blue-300">Modo desarrollo activo: World App simulado para pruebas</p>
              </div>
            )}
          </div>
        </MilitaryFrame>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  )
}
