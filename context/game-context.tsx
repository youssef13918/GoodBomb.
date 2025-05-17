"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/context/settings-context"

// Types for our data
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
  // Game state
  timeLeft: number
  buttonPresses: number
  pot: number
  isExploding: boolean
  lastPlayer: Player | null
  recentPlayers: Player[]
  winners: Winner[]
  registeredPlayers: Player[]
  currentPlayer: Player | null

  // Actions
  registerPlayer: (username: string) => boolean
  selectPlayer: (id: string) => void
  pressButton: () => void
  showWinners: () => void
  isWinnersModalOpen: boolean
  closeWinnersModal: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

// Simulación de un servicio de tiempo real (en una implementación real, esto sería un WebSocket o similar)
class RealtimeService {
  private callbacks: ((data: any) => void)[] = []
  private interval: NodeJS.Timeout | null = null

  constructor() {
    // Simular actualizaciones periódicas
    this.interval = setInterval(() => {
      this.fetchGameState()
    }, 3000)
  }

  subscribe(callback: (data: any) => void) {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  private async fetchGameState() {
    try {
      const response = await fetch("/api/game-state")
      const data = await response.json()
      this.callbacks.forEach((callback) => callback(data))
    } catch (error) {
      console.error("Error fetching game state:", error)
    }
  }

  async updateGameState(player: Player) {
    try {
      const response = await fetch("/api/game-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player: player.username }),
      })
      const data = await response.json()
      this.callbacks.forEach((callback) => callback(data))
      return data
    } catch (error) {
      console.error("Error updating game state:", error)
      throw error
    }
  }

  cleanup() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
}

// Crear una instancia del servicio
const realtimeService = new RealtimeService()

export function GameProvider({ children }: { children: ReactNode }) {
  // Game state
  const [timeLeft, setTimeLeft] = useState(240) // 4 minutes in seconds
  const [buttonPresses, setButtonPresses] = useState(0)
  const [pot, setPot] = useState(0.1)
  const [isExploding, setIsExploding] = useState(false)
  const [lastPlayer, setLastPlayer] = useState<Player | null>(null)
  const [recentPlayers, setRecentPlayers] = useState<Player[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [registeredPlayers, setRegisteredPlayers] = useState<Player[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [isWinnersModalOpen, setIsWinnersModalOpen] = useState(false)

  const { toast } = useToast()
  const { texts, soundEnabled } = useSettings()

  // Suscribirse a actualizaciones en tiempo real
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((data) => {
      // Actualizar el estado del juego con los datos recibidos
      if (data.timeLeft !== undefined) setTimeLeft(data.timeLeft)
      if (data.pot !== undefined) setPot(data.pot)
      if (data.buttonPresses !== undefined) setButtonPresses(data.buttonPresses)

      // Actualizar último jugador y lista de jugadores recientes
      if (data.lastPlayer && data.lastPlayer !== "Nadie aún") {
        const player = {
          id: `player-${Date.now()}`,
          username: data.lastPlayer,
          timestamp: Date.now(),
        }
        setLastPlayer(player)

        // Actualizar lista de jugadores recientes sin duplicados
        setRecentPlayers((prev) => {
          const exists = prev.some((p) => p.username === player.username)
          if (exists) {
            return [player, ...prev.filter((p) => p.username !== player.username)].slice(0, 5)
          } else {
            return [player, ...prev].slice(0, 5)
          }
        })
      }
    })

    return () => {
      unsubscribe()
      realtimeService.cleanup()
    }
  }, [])

  // Load saved data on mount
  useEffect(() => {
    try {
      // Load saved winners
      const savedWinners = localStorage.getItem("goodbomb-winners")
      if (savedWinners) {
        setWinners(JSON.parse(savedWinners))
      }

      // Load registered players
      const savedRegisteredPlayers = localStorage.getItem("goodbomb-registered-players")
      if (savedRegisteredPlayers) {
        setRegisteredPlayers(JSON.parse(savedRegisteredPlayers))
      }

      // Cargar jugador actual si existe
      const savedCurrentPlayer = localStorage.getItem("goodbomb-current-player")
      if (savedCurrentPlayer) {
        setCurrentPlayer(JSON.parse(savedCurrentPlayer))
      }

      // Cargar estado inicial del juego
      fetch("/api/game-state")
        .then((response) => response.json())
        .then((data) => {
          if (data.timeLeft !== undefined) setTimeLeft(data.timeLeft)
          if (data.pot !== undefined) setPot(data.pot)
          if (data.buttonPresses !== undefined) setButtonPresses(data.buttonPresses)

          // Actualizar último jugador y lista de jugadores recientes
          if (data.lastPlayer && data.lastPlayer !== "Nadie aún") {
            const player = {
              id: `player-${Date.now()}`,
              username: data.lastPlayer,
              timestamp: Date.now(),
            }
            setLastPlayer(player)
            setRecentPlayers([player])
          }
        })
        .catch((error) => {
          console.error("Error loading initial game state:", error)
        })
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [])

  // Game timer
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

  // Save data when it changes
  useEffect(() => {
    try {
      localStorage.setItem("goodbomb-winners", JSON.stringify(winners))
      localStorage.setItem("goodbomb-registered-players", JSON.stringify(registeredPlayers))
      if (currentPlayer) {
        localStorage.setItem("goodbomb-current-player", JSON.stringify(currentPlayer))
      }
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }, [winners, registeredPlayers, currentPlayer])

  // Handle bomb explosion
  const handleExplosion = useCallback(() => {
    setIsExploding(true)

    // If there's a last player, they're the winner
    if (lastPlayer) {
      // Calculate prize (85% of pot)
      const winAmount = pot * 0.85

      // Register winner
      const winner: Winner = {
        ...lastPlayer,
        amount: winAmount,
      }

      const updatedWinners = [winner, ...winners]
      setWinners(updatedWinners)

      // Registrar ganador en la API
      fetch("/api/winners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: lastPlayer.username,
          amount: winAmount,
        }),
      }).catch((error) => {
        console.error("Error registering winner:", error)
      })

      toast({
        title: texts.explosionTitle,
        description: `${texts.explosionPrefix} @${lastPlayer.username} ${texts.explosionWon} ${winAmount.toFixed(2)} WLD!`,
        variant: "destructive",
      })
    }

    // Restart game after animation
    setTimeout(() => {
      setIsExploding(false)
      setTimeLeft(240)
      // 5% of pot goes to next round
      setPot(pot * 0.05)

      // Reiniciar juego en la API
      fetch("/api/game-state", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reset",
        }),
      }).catch((error) => {
        console.error("Error resetting game:", error)
      })
    }, 3000)
  }, [lastPlayer, pot, winners, toast, texts])

  // Register a new player
  const registerPlayer = (username: string): boolean => {
    // Check if username is already taken
    if (registeredPlayers.some((player) => player.username.toLowerCase() === username.toLowerCase())) {
      toast({
        title: "Error",
        description: "Este nombre de usuario ya está en uso",
        variant: "destructive",
      })
      return false
    }

    // Create new player
    const newPlayer: Player = {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username,
      timestamp: Date.now(),
    }

    // Add to registered players
    setRegisteredPlayers((prev) => [...prev, newPlayer])

    // Set as current player
    setCurrentPlayer(newPlayer)

    // Registrar jugador en la API
    fetch("/api/game-state", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "register",
        username,
      }),
    }).catch((error) => {
      console.error("Error registering player:", error)
    })

    toast({
      title: "¡Registro exitoso!",
      description: `Bienvenido, ${username}. ¡Ahora puedes jugar!`,
    })

    return true
  }

  // Select an existing player
  const selectPlayer = (id: string) => {
    const player = registeredPlayers.find((p) => p.id === id)
    if (player) {
      setCurrentPlayer(player)
      toast({
        title: "Jugador seleccionado",
        description: `Bienvenido de nuevo, ${player.username}`,
      })
    }
  }

  // Press the button
  const pressButton = () => {
    if (!currentPlayer) {
      toast({
        title: "Error",
        description: "Debes registrarte primero",
        variant: "destructive",
      })
      return
    }

    // Check if it's the same player twice in a row
    if (lastPlayer && lastPlayer.id === currentPlayer.id) {
      toast({
        title: "No permitido",
        description: "No puedes presionar el botón dos veces seguidas",
        variant: "destructive",
      })
      return
    }

    try {
      // Create new player action
      const newAction: Player = {
        ...currentPlayer,
        timestamp: Date.now(),
      }

      // Update last player and recent players list
      setLastPlayer(newAction)
      setRecentPlayers((prev) => [newAction, ...prev].slice(0, 5))

      // Update pot, button presses and reset timer
      setPot((prev) => prev + 0.1)
      setButtonPresses((prev) => prev + 1)
      setTimeLeft(240)

      // Actualizar estado del juego en tiempo real
      realtimeService.updateGameState(newAction).catch((error) => {
        console.error("Error updating game state:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al actualizar el estado del juego.",
          variant: "destructive",
        })
      })

      toast({
        title: texts.bombActivated,
        description: texts.bombActivatedDesc,
      })
    } catch (error) {
      console.error("Error pressing button:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu solicitud.",
        variant: "destructive",
      })
    }
  }

  // Show winners modal
  const showWinners = () => {
    setIsWinnersModalOpen(true)
  }

  // Close winners modal
  const closeWinnersModal = () => {
    setIsWinnersModalOpen(false)
  }

  return (
    <GameContext.Provider
      value={{
        timeLeft,
        buttonPresses,
        pot,
        isExploding,
        lastPlayer,
        recentPlayers,
        winners,
        registeredPlayers,
        currentPlayer,
        registerPlayer,
        selectPlayer,
        pressButton,
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
