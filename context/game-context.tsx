"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// Tipos para nuestros datos
export interface Player {
  id: string
  username: string
  timestamp: number
}

export interface Winner {
  id: string
  username: string
  timestamp: number
  amount: number
}

interface GameContextType {
  // Estado del juego
  timeLeft: number
  pot: number
  isExploding: boolean
  isButtonDisabled: boolean
  isVerified: boolean
  currentUser: { id: string; username: string } | null
  lastPlayer: Player | null
  recentPlayers: Player[]
  winners: Winner[]

  // Acciones
  verifyUser: () => Promise<boolean>
  pressButton: () => Promise<boolean>
  resetGame: () => void
  showWinners: () => void
  isWinnersModalOpen: boolean
  closeWinnersModal: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  // Estado del juego
  const [timeLeft, setTimeLeft] = useState(240) // 4 minutos en segundos
  const [pot, setPot] = useState(0.1)
  const [isExploding, setIsExploding] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null)
  const [lastPlayer, setLastPlayer] = useState<Player | null>(null)
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState(false)

  const { toast } = useToast()

  // Cargar datos guardados al iniciar
  useEffect(() => {
    try {
      // Cargar ganadores anteriores
      const savedWinners = localStorage.getItem("goodbomb-winners")
      if (savedWinners) {
        setWinners(JSON.parse(savedWinners))
      }

      // Cargar jugadores recientes
      const savedPlayers = localStorage.getItem("goodbomb-players")
      if (savedPlayers) {
        const players = JSON.parse(savedPlayers)
        setRecentPlayers(players)
        if (players.length > 0) {
          setLastPlayer(players[0])
        }
      }

      // Cargar estado del juego
      const savedPot = localStorage.getItem("goodbomb-pot")
      if (savedPot) {
        setPot(Number.parseFloat(savedPot))
      }
    } catch (error) {
      console.error("Error cargando datos guardados:", error)
    }
  }, [])

  // Temporizador del juego
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

  // Guardar datos cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem("goodbomb-players", JSON.stringify(recentPlayers))
      localStorage.setItem("goodbomb-winners", JSON.stringify(winners))
      localStorage.setItem("goodbomb-pot", pot.toString())
    } catch (error) {
      console.error("Error guardando datos:", error)
    }
  }, [recentPlayers, winners, pot])

  // Manejar la explosión de la bomba
  const handleExplosion = async () => {
    setIsExploding(true)

    // Si hay un último jugador, es el ganador
    if (lastPlayer) {
      // Calcular premio (85% del pozo)
      const winAmount = pot * 0.85

      // Registrar ganador
      const winner: Winner = {
        ...lastPlayer,
        amount: winAmount,
      }

      const updatedWinners = [winner, ...winners]
      setWinners(updatedWinners)

      toast({
        title: "¡BOOM!",
        description: `¡${lastPlayer.username} ha ganado ${winAmount.toFixed(2)} WLD!`,
        variant: "destructive",
      })
    }

    // Reiniciar juego después de la animación
    setTimeout(() => {
      setIsExploding(false)
      setTimeLeft(240)
      // 5% del pozo va a la siguiente ronda
      setPot(pot * 0.05)
      setLastPlayer(null)
    }, 3000)
  }

  // Verificar usuario con World ID
  const verifyUser = async (): Promise<boolean> => {
    try {
      // En un entorno real, verificaríamos con World ID
      // Para desarrollo, simulamos la verificación

      // Intentar obtener el usuario de MiniKit
      if (typeof window !== "undefined" && "MiniKit" in window) {
        try {
          // @ts-ignore - MiniKit está disponible globalmente
          const user = await window.MiniKit.getUser()
          if (user && user.username) {
            setCurrentUser({
              id: user.id || `user-${Date.now()}`,
              username: user.username,
            })
            setIsVerified(true)
            return true
          }
        } catch (error) {
          console.error("Error obteniendo usuario de MiniKit:", error)
        }
      }

      // Modo desarrollo - simular usuario
      const mockId = `dev-${Date.now()}`
      const mockUsername = `Usuario${Math.floor(Math.random() * 1000)}`

      setCurrentUser({
        id: mockId,
        username: mockUsername,
      })

      setIsVerified(true)
      return true
    } catch (error) {
      console.error("Error en verificación:", error)
      toast({
        title: "Error de verificación",
        description: "No se pudo verificar tu identidad. Inténtalo de nuevo.",
        variant: "destructive",
      })
      return false
    }
  }

  // Presionar el botón y realizar pago
  const pressButton = async (): Promise<boolean> => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Debes verificarte primero",
        variant: "destructive",
      })
      return false
    }

    // Verificar que no sea el mismo usuario dos veces seguidas
    if (lastPlayer && lastPlayer.id === currentUser.id) {
      toast({
        title: "No permitido",
        description: "No puedes presionar el botón dos veces seguidas",
        variant: "destructive",
      })
      return false
    }

    try {
      setIsButtonDisabled(true)

      // Intentar realizar el pago con MiniKit
      let paymentSuccess = false

      if (typeof window !== "undefined" && "MiniKit" in window) {
        try {
          // Obtener ID único para el pago
          const response = await fetch("/api/initiate-pay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })

          const { id } = await response.json()

          // @ts-ignore - MiniKit está disponible globalmente
          const result = await window.MiniKit.pay({
            id,
            amount: "0.1",
            token: "WLD",
            recipientAddress: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || "",
          })

          if (result && result.status === "success") {
            paymentSuccess = true
          }
        } catch (error) {
          console.error("Error en pago con MiniKit:", error)
        }
      } else {
        // Modo desarrollo - simular pago exitoso
        await new Promise((resolve) => setTimeout(resolve, 1000))
        paymentSuccess = true
      }

      if (paymentSuccess) {
        // Registrar jugador
        const newPlayer: Player = {
          id: currentUser.id,
          username: currentUser.username,
          timestamp: Date.now(),
        }

        // Actualizar último jugador y lista de jugadores recientes
        setLastPlayer(newPlayer)
        setRecentPlayers((prev) => {
          const updated = [newPlayer, ...prev].slice(0, 5)
          return updated
        })

        // Actualizar pozo y reiniciar temporizador
        setPot((prev) => prev + 0.1)
        setTimeLeft(240)

        toast({
          title: "¡Bomba activada!",
          description: "Has añadido 0.1 WLD al pozo. ¡El temporizador se ha reiniciado!",
        })

        return true
      } else {
        toast({
          title: "Error en el pago",
          description: "No se pudo completar el pago. Inténtalo de nuevo.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      console.error("Error al presionar el botón:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu solicitud.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsButtonDisabled(false)
    }
  }

  // Reiniciar juego manualmente
  const resetGame = () => {
    setTimeLeft(240)
    setPot(0.1)
    setIsExploding(false)
    setLastPlayer(null)
    setRecentPlayers([])
  }

  // Mostrar modal de ganadores
  const showWinners = () => {
    setIsWinnersModalOpen(true)
  }

  // Cerrar modal de ganadores
  const closeWinnersModal = () => {
    setIsWinnersModalOpen(false)
  }

  return (
    <GameContext.Provider
      value={{
        timeLeft,
        pot,
        isExploding,
        isButtonDisabled,
        isVerified,
        currentUser,
        lastPlayer,
        recentPlayers,
        winners,
        verifyUser,
        pressButton,
        resetGame,
        showWinners,
        isWinnersModalOpen,
        closeWinnersModal,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
