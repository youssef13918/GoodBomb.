"use client"

import { useState, useEffect, useCallback } from "react"
import { Coins, User, Clock, Settings } from "lucide-react"
import { formatTime } from "@/lib/utils"
import { useSettings } from "@/context/settings-context"
import { useToast } from "@/hooks/use-toast"
import SettingsModal from "@/components/settings-modal"
import BombAnimation from "@/components/bomb-animation"
import MilitaryCharacter from "@/components/military-character"
import MilitaryFrame from "@/components/military-frame"
import WorldButton from "@/components/world-button"
import RecentPlayers from "@/components/recent-players"
import WinnersList from "@/components/winners-list"
// Cambiar la importación para usar el hook desde clientLayout
import { useMiniKit } from "@/app/clientLayout"
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js'

const verifyPayload: VerifyCommandInput = {
	action: 'goodbomb', // This is your action ID from the Developer Portal
	verification_level: VerificationLevel.Orb, // Orb | Device
}

const handleVerify = async () => {
	if (!MiniKit.isInstalled()) {
		return
	}
	// World App will open a drawer prompting the user to confirm the operation, promise is resolved once user confirms or cancels
	const {finalPayload} = await MiniKit.commandsAsync.verify(verifyPayload)
		if (finalPayload.status === 'error') {
			return console.log('Error payload', finalPayload)
		}

		// Verify the proof in the backend
		const verifyResponse = await fetch('/api/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			payload: finalPayload as ISuccessResult, // Parses only the fields we need to verify
			action: 'goodbomb',
			signal: '0x12312', // Optional
		}),
	})

	// TODO: Handle Success!
	const verifyResponseJson = await verifyResponse.json()
	if (verifyResponseJson.status === 200) {
		console.log('Verification success!')
	}
}
const sendPayment = async () => {
  const res = await fetch('/api/initiate-payment', {
    method: 'POST',
  })
  const { id } = await res.json()

  const payload: PayCommandInput = {
    reference: id,
    to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Test address
    tokens: [
      {
        symbol: Tokens.WLD,
        token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(),
      },
    ],
    description: 'Test example payment for minikit',
  }

  if (!MiniKit.isInstalled()) {
    return
  }

  const { finalPayload } = await MiniKit.commandsAsync.pay(payload)

  if (finalPayload.status == 'success') {
    const res = await fetch(`/api/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalPayload),
    })
    const payment = await res.json()
    if (payment.success) {
      // Congrats your payment was successful!
    }
  }
}
// Tipos para nuestros datos
interface Player {
  username: string
  timestamp: number
}

interface Winner {
  username: string
  timestamp: number
  amount: number
}

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

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(240) // 4 minutos en segundos
  const [lastPlayer, setLastPlayer] = useState<Player | null>(null)
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [pot, setPot] = useState(0.1)
  const [isExploding, setIsExploding] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { toast } = useToast()
  const { language, soundEnabled, theme, texts } = useSettings()
  const miniKit = useMiniKit()

  // Cargar jugadores recientes y ganadores al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar jugadores recientes
        const playersResponse = await fetch("/api/confirm-payment")
        const playersData = await playersResponse.json()
        if (playersData.players && playersData.players.length > 0) {
          setRecentPlayers(playersData.players)
          setLastPlayer(playersData.players[0])
        }

        // Cargar ganadores
        const winnersResponse = await fetch("/api/winners")
        const winnersData = await winnersResponse.json()
        if (winnersData.winners) {
          setWinners(winnersData.winners)
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
      }
    }

    loadData()
  }, [])

  // Actualizar hora actual
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Lógica del temporizador
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

  // Manejar la explosión de la bomba
  const handleExplosion = useCallback(async () => {
    setIsExploding(true)

    if (soundEnabled) {
      playSoundSafely("/sounds/explosion.mp3")
    }

    // Si hay un último jugador, es el ganador
    if (lastPlayer) {
      // Calcular premio (85% del pozo)
      const winAmount = pot * 0.85

      // Registrar ganador en la API
      try {
        await fetch("/api/winners", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: lastPlayer.username,
            amount: winAmount,
          }),
        })

        // Actualizar lista local de ganadores
        const newWinner: Winner = {
          username: lastPlayer.username,
          timestamp: Date.now(),
          amount: winAmount,
        }
        setWinners((prev) => [newWinner, ...prev])

        toast({
          title: texts.explosionTitle,
          description: `${texts.explosionPrefix} @${lastPlayer.username} ${texts.explosionWon} ${winAmount.toFixed(1)} WLD!`,
          variant: "destructive",
        })
      } catch (error) {
        console.error("Error al registrar ganador:", error)
      }
    }

    // Reiniciar juego después de la animación
    setTimeout(() => {
      setIsExploding(false)
      setTimeLeft(240)
      // 5% del pozo va a la siguiente ronda
      setPot(pot * 0.05)
    }, 3000)
  }, [lastPlayer, pot, toast, soundEnabled, texts])

  // Manejar presión del botón
  const handleButtonPress = useCallback(
    async (username: string) => {
      try {
        if (soundEnabled) {
          playSoundSafely("/sounds/button-press.mp3")
        }

        // Crear nuevo jugador
        const newPlayer: Player = {
          username,
          timestamp: Date.now(),
        }

        // Actualizar último jugador y lista de jugadores recientes
        setLastPlayer(newPlayer)
        setRecentPlayers((prev) => [newPlayer, ...prev.slice(0, 4)])

        // Actualizar pozo y reiniciar temporizador
        setPot((prev) => prev + 0.1)
        setTimeLeft(240)

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
      }
    },
    [toast, soundEnabled, texts],
  )

  // Formatear hora actual
  const formattedTime = currentTime.toLocaleTimeString(language === "es" ? "es-ES" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Determinar estilos del temporizador según el tiempo restante
  const isUrgent = timeLeft <= 30

  // Obtener la dirección del destinatario para los pagos
  const recipientAddress = process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || ""

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
              <WinnersList winners={winners} />
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
              <RecentPlayers players={recentPlayers} />
            </div>

            {/* Action Button */}
            <WorldButton onSuccess={handleButtonPress} recipientAddress={recipientAddress} />
          </div>
        </MilitaryFrame>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  )
}
