"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { User, AlertTriangle, Check } from "lucide-react"
import { useGame } from "@/context/game-context"
// Replace the line:
// import { useMiniKit } from "@/app/clientLayout"
// with:
import { useMiniKit } from "@worldcoin/minikit-js"

export default function WorldIDVerification() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isVerified, currentUser, verifyUser } = useGame()
  const { toast } = useToast()
  const miniKit = useMiniKit()

  const handleVerification = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!miniKit) {
        setError("MiniKit no está disponible. Por favor, abre esta aplicación desde World App.")
        setIsLoading(false)
        return
      }

      const success = await verifyUser()

      if (!success) {
        setError("No se pudo completar la verificación. Inténtalo de nuevo.")
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

  if (isVerified && currentUser) {
    return (
      <div className="flex flex-col gap-4">
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800 dark:text-green-300">Verificado con World ID</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Tu identidad ha sido verificada
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
          <User className="h-5 w-5 text-olive-500" />
          <span className="font-medium">
            Usuario: <span className="text-olive-600 dark:text-olive-400">{currentUser.username}</span>
          </span>
        </div>
      </div>
    )
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

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Verificación requerida</h3>
        <p className="text-yellow-700 dark:text-yellow-400 mb-4">
          Para jugar, primero debes verificar tu identidad con World ID.
        </p>
        <Button
          onClick={handleVerification}
          disabled={isLoading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
        >
          {isLoading ? "Verificando..." : "Verificar con World ID"}
        </Button>
      </div>
    </div>
  )
}
