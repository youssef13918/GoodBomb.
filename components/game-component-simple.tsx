"use client"
import { useState, useEffect } from "react"
import { Coins } from "lucide-react"
import MilitaryFrame from "@/components/military-frame"
import MilitaryButton from "@/components/military-button"
import { useToast } from "@/hooks/use-toast"
import { formatTime } from "@/lib/utils"

export default function GameComponentSimple() {
  const [timeLeft, setTimeLeft] = useState(240)
  const [pot, setPot] = useState(0.1)
  const [lastPlayer, setLastPlayer] = useState("Nadie aún")
  const { toast } = useToast()

  // Temporizador
  useEffect(() => {
    if (timeLeft <= 0) {
      // Manejar explosión
      toast({
        title: "¡BOOM!",
        description: `¡${lastPlayer} ha ganado ${(pot * 0.85).toFixed(1)} WLD!`,
        variant: "destructive",
      })

      // Reiniciar juego
      setTimeout(() => {
        setTimeLeft(240)
        setPot(pot * 0.05)
        setLastPlayer("Nadie aún")
      }, 3000)

      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, lastPlayer, pot, toast])

  const handleButtonPress = () => {
    // Generar nombre aleatorio
    const randomName = "Usuario" + Math.floor(Math.random() * 1000)

    // Actualizar estado
    setLastPlayer(randomName)
    setPot((prev) => prev + 0.1)
    setTimeLeft(240)

    // Mostrar notificación
    toast({
      title: "¡Bomba activada!",
      description: "Has añadido 0.1 WLD al pozo. ¡El temporizador se ha reiniciado!",
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-military-pattern-dark">
      <div className="w-full max-w-md">
        <MilitaryFrame theme="dark">
          <div className="p-5">
            <h1 className="text-2xl text-white text-center mb-4 font-military">GoodBomb</h1>

            {/* Timer */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/70 border-2 border-olive-600">
                <span className={`text-2xl ${timeLeft <= 30 ? "text-red-500" : "text-green-400"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Pot */}
            <div className="mb-6 p-3 bg-black/60 border border-olive-600 rounded-md">
              <div className="flex items-center justify-center gap-2">
                <Coins className="text-yellow-500" size={20} />
                <span className="text-xl font-bold text-gray-200">
                  Recompensa: <span className="text-yellow-400">{pot.toFixed(1)} WLD</span>
                </span>
              </div>
            </div>

            {/* Last Player */}
            <div className="mb-6 p-3 bg-black/40 border border-olive-600 rounded-md">
              <p className="text-center text-gray-300">
                Último jugador: <span className="text-yellow-400">{lastPlayer}</span>
              </p>
            </div>

            {/* Button */}
            <MilitaryButton
              onClick={handleButtonPress}
              disabled={false}
              isUrgent={timeLeft <= 30}
              text="PRESIONAR EL BOTÓN"
            />
          </div>
        </MilitaryFrame>
      </div>
    </main>
  )
}
