"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { User, AlertTriangle, Check } from "lucide-react"
// Importar desde clientLayout
import { useMiniKit } from "@worldcoin/minikit-js"

interface WorldButtonProps {
  onSuccess: (username: string) => void
  recipientAddress: string
}

export default function WorldButton({ onSuccess, recipientAddress }: WorldButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const miniKit = useMiniKit()

  // Verificar si el usuario ya está autenticado al cargar
  useEffect(() => {
    const checkUser = async () => {
      try {
        if (miniKit) {
          const user = await miniKit.getUser()
          if (user && user.username) {
            setUsername(user.username)
            setIsVerified(true)
          }
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error)
      }
    }

    checkUser()
  }, [miniKit])

  const handleButtonPress = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!miniKit) {
        setError("MiniKit no está disponible. Por favor, abre esta aplicación desde World App.")
        return
      }

      // Si el usuario no está verificado, verificarlo primero
      if (!isVerified) {
        try {
          // Iniciar verificación con World ID
          const verificationResult = await miniKit.verify({
            action: "press_button",
            signal: "wld_jp_" + Date.now().toString(),
          })

          if (verificationResult.status === "success") {
            setIsVerified(true)

            // Obtener información del usuario
            const user = await miniKit.getUser()
            if (user && user.username) {
              setUsername(user.username)
            }

            toast({
              title: "Verificación exitosa",
              description: "Tu identidad ha sido verificada con World ID",
            })
          } else {
            setError("No se pudo completar la verificación")
            return
          }
        } catch (verifyError) {
          console.error("Error en verificación:", verifyError)
          setError("Error en la verificación. Inténtalo de nuevo.")
          return
        }
      }

      // Procesar el pago
      try {
        // Obtener ID único para el pago
        const response = await fetch("/api/initiate-pay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const { id } = await response.json()

        // Realizar el pago
        const paymentResult = await miniKit.pay({
          id,
          amount: "0.1",
          token: "WLD",
          recipientAddress,
        })

        if (paymentResult.status === "success") {
          // Confirmar el pago en el servidor
          const confirmResponse = await fetch("/api/confirm-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              status: "success",
              username: username || "Anonymous",
            }),
          })

          const confirmData = await confirmResponse.json()

          if (confirmData.success) {
            // Notificar éxito
            toast({
              title: "¡Pago exitoso!",
              description: "Has añadido 0.1 WLD al pozo",
            })

            // Llamar al callback con el nombre de usuario
            onSuccess(username || "Anonymous")
          } else {
            setError("Error al confirmar el pago")
          }
        } else {
          setError("El pago no se completó correctamente")
        }
      } catch (payError) {
        console.error("Error en pago:", payError)
        setError("Error al procesar el pago. Inténtalo de nuevo.")
      }
    } catch (error) {
      console.error("Error general:", error)
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
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800 dark:text-green-300">Verificado con World ID</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Tu identidad ha sido verificada
          </AlertDescription>
        </Alert>
      )}

      {username && (
        <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
          <User className="h-4 w-4" />
          <span>Usuario: {username}</span>
        </div>
      )}

      <div className="relative">
        {/* Button Base */}
        <div className="absolute inset-0 bg-red-900 rounded-md translate-y-2"></div>

        <button
          onClick={handleButtonPress}
          disabled={isLoading}
          className={`
            relative w-full py-6 px-4 rounded-md font-military text-xl uppercase tracking-wider
            border-2 border-gray-900 shadow-lg transition-all duration-100
            ${isLoading ? "translate-y-2 shadow-none" : "translate-y-0 shadow-lg"}
            ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
            bg-red-700 hover:bg-red-800
          `}
          style={{
            boxShadow: "inset 0px -4px 0px rgba(0,0,0,0.3), inset 0px 1px 0px rgba(255,255,255,0.2)",
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              {isLoading ? "PROCESANDO..." : "PRESIONAR EL BOTÓN"}
            </span>
          </div>

          {/* Button Details */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-black/20 rounded-full"></div>
          </div>
        </button>
      </div>
    </div>
  )
}
