"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { User, AlertTriangle, Check } from "lucide-react"

interface WorldButtonProps {
  onSuccess: (username: string) => void
  recipientAddress: string
}

export default function WorldButton({ onSuccess, recipientAddress }: WorldButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isWorldAppInstalled, setIsWorldAppInstalled] = useState(false)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(true) // Por defecto en modo desarrollo
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Verificar si World App está instalada
  useEffect(() => {
    const checkWorldApp = async () => {
      try {
        // Verificar si estamos en un entorno de navegador
        if (typeof window === "undefined") {
          setIsDevelopmentMode(true)
          return
        }

        // Importar MiniKit dinámicamente para evitar errores
        try {
          // En lugar de importar MiniKit, simplemente asumimos que estamos en modo desarrollo
          setIsDevelopmentMode(true)
          setUsername("dev_user")
        } catch (error) {
          console.error("Error general:", error)
          setIsDevelopmentMode(true)
        }
      } catch (error) {
        console.error("Error general:", error)
        setIsDevelopmentMode(true)
      }
    }

    checkWorldApp()
  }, [])

  const handleButtonPress = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Si estamos en modo desarrollo, simulamos el proceso
      if (isDevelopmentMode) {
        // Simular un retraso
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Simular verificación exitosa
        setIsVerified(true)

        // Simular nombre de usuario
        const mockUsername = "Usuario" + Math.floor(Math.random() * 1000)

        // Notificar éxito
        toast({
          title: "¡Simulación exitosa!",
          description: "Modo desarrollo: Verificación y pago simulados",
        })

        // Llamar al callback con el nombre de usuario simulado
        onSuccess(mockUsername)
        return
      }

      // Código real para World App (solo se ejecutará si isWorldAppInstalled es true)
      if (!isWorldAppInstalled) {
        setError("World App no está instalada. Por favor, abre esta aplicación desde World App.")
        return
      }

      // En modo desarrollo, no intentamos importar MiniKit
      if (!isDevelopmentMode) {
        // Este código nunca se ejecutará en modo desarrollo
        setError("Esta funcionalidad solo está disponible en World App.")
        return
      }
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isVerified && (
        <Alert>
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>Verificado con World ID</AlertTitle>
          <AlertDescription>Tu identidad ha sido verificada</AlertDescription>
        </Alert>
      )}

      {username && (
        <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
          <User className="h-4 w-4" />
          <span>Usuario: {username}</span>
        </div>
      )}

      <Button
        onClick={handleButtonPress}
        disabled={isLoading}
        className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-bold text-lg"
      >
        {isLoading ? "Procesando..." : isDevelopmentMode ? "Presiona el botón (Modo desarrollo)" : "Presiona el botón"}
      </Button>
    </div>
  )
}
