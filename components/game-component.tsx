"use client"

import { useState, useEffect } from "react"
import { Coins, User, Clock, Settings, Award, Hash } from "lucide-react"
import { formatTime } from "@/lib/utils"
import { useSettings } from "@/context/settings-context"
import BombAnimation from "@/components/bomb-animation"
import MilitaryFrame from "@/components/military-frame"
import MilitaryButton from "@/components/military-button"
import RecentPlayers from "@/components/recent-players"
import WinnersButton from "@/components/winners-button"
import WinnersModal from "@/components/winners-modal"
import PlayerRegistration from "@/components/player-registration"
import SettingsModal from "@/components/settings-modal"
import { useGame } from "@/context/game-context"
import { useToast } from "@/hooks/use-toast"

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { theme, texts, soundEnabled } = useSettings()
  const { timeLeft, buttonPresses, pot, isExploding, lastPlayer, recentPlayers, currentPlayer, pressButton } = useGame()
  const { toast } = useToast()

  // Determine timer styles based on time left
  const isUrgent = timeLeft <= 30

  // Efecto para notificaciones cuando el tiempo es crítico
  useEffect(() => {
    if (isUrgent && timeLeft === 30 && soundEnabled) {
      playSoundSafely("/sounds/alert.mp3")

      // Mostrar notificación si están habilitadas
      if (Notification.permission === "granted") {
        new Notification(texts.notificationTitle, {
          body: texts.notificationBody,
          icon: "/images/bomb-icon.png",
        })
      }
    }
  }, [timeLeft, isUrgent, soundEnabled, texts])

  // Efecto para sonido de explosión
  useEffect(() => {
    if (isExploding && soundEnabled) {
      playSoundSafely("/sounds/explosion.mp3")
    }
  }, [isExploding, soundEnabled])

  // Configurar WebSocket para actualizaciones en tiempo real
  useEffect(() => {
    // En una implementación real, aquí se conectaría a un WebSocket
    const connectToRealtime = () => {
      // Simulación de WebSocket para desarrollo
      const interval = setInterval(() => {
        // Simular actualización del estado del juego
        fetch("/api/game-state")
          .then((response) => response.json())
          .then((data) => {
            // Aquí se actualizaría el estado del juego con los datos recibidos
            console.log("Actualización en tiempo real recibida", data)
          })
          .catch((error) => {
            console.error("Error al obtener actualizaciones en tiempo real:", error)
          })
      }, 5000) // Actualizar cada 5 segundos

      return () => clearInterval(interval)
    }

    const cleanup = connectToRealtime()
    return () => cleanup
  }, [])

  // Manejar pulsación del botón con sonido
  const handleButtonPress = () => {
    if (soundEnabled) {
      playSoundSafely("/sounds/button-press.mp3")
    }
    pressButton()
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-4 ${
        theme === "dark" ? "bg-military-pattern-dark" : "bg-military-pattern-light"
      }`}
    >
      <div className="w-full max-w-5xl">
        <MilitaryFrame theme={theme === "dark" ? "dark" : "light"}>
          {/* Top Bar with Settings */}
          <div className="flex justify-between items-center px-4 py-2 bg-black/40 border-b border-olive-600">
            <div className="flex items-center gap-2">
              <Clock className="text-olive-300" size={16} />
              <span className="text-olive-300 text-sm">{formatTime(timeLeft)}</span>
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

          <div className="grid grid-cols-3 gap-4 p-5">
            {/* Left Column - Recent Players */}
            <div className="col-span-1 space-y-4">
              <div className="bg-black/40 p-3 rounded-md border border-olive-600">
                <h2 className="text-olive-300 text-lg font-military mb-2 flex items-center gap-2">
                  <User className="text-olive-300" size={18} />
                  <span>ÚLTIMOS JUGADORES</span>
                </h2>
                <RecentPlayers players={recentPlayers} />
              </div>

              <div className="bg-black/40 p-3 rounded-md border border-olive-600">
                <h2 className="text-olive-300 text-lg font-military mb-2 flex items-center gap-2">
                  <Award className="text-olive-300" size={18} />
                  <span>GANADORES RECIENTES</span>
                </h2>
                <div className="text-center text-gray-400 py-2">Haz clic en "Ganadores" para ver la lista completa</div>
              </div>
            </div>

            {/* Middle Column - Game */}
            <div className="col-span-2 space-y-4">
              {/* Button Press Counter */}
              <div className="flex justify-center mb-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/70 border-2 border-olive-600">
                  <Hash className="text-olive-300" size={18} />
                  <span className="text-xl text-white">
                    Total de pulsaciones: <span className="text-yellow-400 font-bold">{buttonPresses}</span>
                  </span>
                </div>
              </div>

              {/* Bomb Animation and Pot */}
              <div className="flex flex-col items-center justify-center bg-black/30 p-4 rounded-md border border-olive-600">
                <BombAnimation isExploding={isExploding} timeLeft={timeLeft} pot={pot} texts={texts} />

                <div className="mt-4 p-3 bg-black/60 w-full border border-olive-600 rounded-md">
                  <div className="flex items-center justify-center gap-2">
                    <Coins className="text-yellow-500" size={20} />
                    <span className="text-xl font-bold text-gray-200">
                      {texts.reward}: <span className="text-yellow-400">{pot.toFixed(1)} WLD</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Player Registration or Button */}
              <div className="bg-black/30 p-4 rounded-md border border-olive-600">
                {!currentPlayer ? (
                  <PlayerRegistration />
                ) : (
                  <div className="space-y-4">
                    <div className="bg-olive-800/50 p-3 rounded-md">
                      <p className="text-center text-gray-200">
                        Jugando como: <span className="text-yellow-400 font-bold">{currentPlayer.username}</span>
                      </p>
                    </div>

                    <MilitaryButton
                      onClick={handleButtonPress}
                      disabled={false}
                      isUrgent={isUrgent}
                      text={texts.pressButton}
                    />

                    <div className="flex justify-between items-center bg-black/40 p-2 rounded-md">
                      <span className="text-olive-300 text-sm">Último en presionar:</span>
                      <span className="text-yellow-400">{lastPlayer ? lastPlayer.username : texts.noOneYet}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </MilitaryFrame>
      </div>

      {/* Modals */}
      <WinnersModal />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  )
}
