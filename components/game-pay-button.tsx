"use client"

import { useState } from "react"
import { MiniKit, tokenToDecimals, Tokens, type PayCommandInput } from "@worldcoin/minikit-js"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/context/settings-context"
import { useWorldApp } from "@/context/world-app-context"
import MilitaryButton from "@/components/military-button"

interface GamePayButtonProps {
  onPaymentSuccess: (username: string) => void
  isUrgent: boolean
  disabled: boolean
}

export default function GamePayButton({ onPaymentSuccess, isUrgent, disabled }: GamePayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { texts } = useSettings()
  const { isWorldAppInstalled, isDevelopmentMode, username } = useWorldApp()

  const handlePayment = async () => {
    try {
      setIsLoading(true)

      // Si estamos en modo desarrollo, simulamos el pago
      if (isDevelopmentMode) {
        // Simular un retraso para el pago
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Usar el nombre de usuario simulado o un valor predeterminado
        const displayName = username || "dev_user"

        // Notificar al componente padre que el pago fue exitoso
        onPaymentSuccess(displayName)

        toast({
          title: texts.bombActivated + " (Modo desarrollo)",
          description: texts.bombActivatedDesc,
        })

        return
      }

      if (!isWorldAppInstalled) {
        toast({
          title: texts.error,
          description: "World App no está instalada",
          variant: "destructive",
        })
        return
      }

      // Obtener el usuario actual
      let playerName = "Anónimo"
      try {
        const user = await MiniKit.getUser()
        if (user && user.username) {
          playerName = user.username
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error)
      }

      // Iniciar el pago en el backend
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Error al iniciar el pago")
      }

      const { id } = await res.json()

      // Configurar el payload de pago
      const payload: PayCommandInput = {
        reference: id,
        to: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(),
          },
        ],
        description: "Pago para jugar GoodBomb",
      }

      // Ejecutar el comando de pago
      const { finalPayload } = await MiniKit.commandsAsync.pay(payload)

      if (finalPayload.status === "success") {
        // Confirmar el pago en el backend
        const confirmRes = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        })

        const payment = await confirmRes.json()

        if (payment.success) {
          // Notificar al componente padre que el pago fue exitoso
          onPaymentSuccess(playerName)

          toast({
            title: texts.bombActivated,
            description: texts.bombActivatedDesc,
          })
        } else {
          throw new Error("Error al confirmar el pago")
        }
      } else {
        toast({
          title: texts.transactionError,
          description: texts.transactionErrorDesc,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error de pago:", error)
      toast({
        title: texts.error,
        description: texts.errorDesc,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MilitaryButton
      onClick={handlePayment}
      disabled={isLoading || disabled}
      isUrgent={isUrgent}
      text={isLoading ? "Procesando..." : isDevelopmentMode ? texts.pressButton + " (Simulado)" : texts.pressButton}
    />
  )
}
