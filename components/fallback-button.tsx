"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface FallbackButtonProps {
  onSuccess: (username: string) => void
  text: string
}

export default function FallbackButton({ onSuccess, text }: FallbackButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleMouseDown = () => {
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleClick = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)

      // Simular un retraso
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generar un nombre de usuario aleatorio para el modo de desarrollo
      const mockUsername = "Usuario" + Math.floor(Math.random() * 1000)

      toast({
        title: "Modo desarrollo",
        description: "Simulando pago y verificación en modo desarrollo",
      })

      // Llamar al callback con el nombre de usuario simulado
      onSuccess(mockUsername)
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu solicitud.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Button Base */}
      <div className="absolute inset-0 bg-red-900 rounded-md translate-y-2"></div>

      <button
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={isLoading}
        className={`
          relative w-full py-6 px-4 rounded-md font-military text-xl uppercase tracking-wider
          border-2 border-gray-900 shadow-lg transition-all duration-100
          ${isPressed ? "translate-y-2 shadow-none" : "translate-y-0 shadow-lg"}
          ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
          bg-red-700 hover:bg-red-800
        `}
        style={{
          boxShadow: "inset 0px -4px 0px rgba(0,0,0,0.3), inset 0px 1px 0px rgba(255,255,255,0.2)",
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {isLoading ? "PROCESANDO..." : text}
          </span>
        </div>

        {/* Button Details */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-black/20 rounded-full"></div>
        </div>
      </button>
    </div>
  )
}
