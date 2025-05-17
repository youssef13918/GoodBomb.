"use client"

import { useState } from "react"
import { useGame } from "@/context/game-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, UserCheck } from "lucide-react"

export default function PlayerRegistration() {
  const [username, setUsername] = useState("")
  const [isRegistering, setIsRegistering] = useState(true)
  const { registerPlayer, selectPlayer, registeredPlayers } = useGame()

  const handleRegister = () => {
    if (username.trim().length < 3) {
      return
    }

    registerPlayer(username.trim())
    setUsername("")
  }

  const handleSelectPlayer = (id: string) => {
    selectPlayer(id)
  }

  return (
    <div className="space-y-4">
      <div className="bg-olive-800/50 p-3 rounded-md">
        <h2 className="text-center text-white font-military text-lg mb-2">
          {isRegistering ? "REGISTRO DE JUGADOR" : "SELECCIONA TU JUGADOR"}
        </h2>

        <div className="flex justify-center mb-2">
          <div className="flex">
            <Button
              variant={isRegistering ? "default" : "outline"}
              className={`rounded-r-none ${isRegistering ? "bg-olive-700" : "bg-olive-900/50 hover:bg-olive-800"}`}
              onClick={() => setIsRegistering(true)}
            >
              <User className="mr-2 h-4 w-4" />
              Nuevo
            </Button>
            <Button
              variant={!isRegistering ? "default" : "outline"}
              className={`rounded-l-none ${!isRegistering ? "bg-olive-700" : "bg-olive-900/50 hover:bg-olive-800"}`}
              onClick={() => setIsRegistering(false)}
              disabled={registeredPlayers.length === 0}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Existente
            </Button>
          </div>
        </div>

        {isRegistering ? (
          <div className="space-y-2">
            <Input
              placeholder="Nombre de usuario (mínimo 3 caracteres)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/40 border-olive-600 text-white"
            />
            <Button
              onClick={handleRegister}
              disabled={username.trim().length < 3}
              className="w-full bg-olive-700 hover:bg-olive-600"
            >
              Registrar
            </Button>
          </div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {registeredPlayers.length === 0 ? (
              <p className="text-center text-gray-400">No hay jugadores registrados</p>
            ) : (
              registeredPlayers.map((player) => (
                <Button
                  key={player.id}
                  onClick={() => handleSelectPlayer(player.id)}
                  variant="outline"
                  className="w-full justify-start bg-black/30 border-olive-600 hover:bg-olive-800/30 text-white"
                >
                  <User className="mr-2 h-4 w-4 text-olive-400" />
                  {player.username}
                </Button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
