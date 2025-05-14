"use client"

import { useState } from "react"
import { MiniKit, tokenToDecimals, Tokens, type PayCommandInput } from "@worldcoin/minikit-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/context/settings-context"

export default function Pay() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { texts } = useSettings()

  const sendPayment = async () => {
    try {
      setIsLoading(true)

      if (!MiniKit.isInstalled()) {
        toast({
          title: texts.error,
          description: "World App no está instalada",
          variant: "destructive",
        })
        return
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
          toast({
            title: texts.bombActivated,
            description: texts.bombActivatedDesc,
          })

          // Aquí puedes actualizar el estado del juego
          // Por ejemplo, reiniciar el temporizador, actualizar el pozo, etc.
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
    <Button
      onClick={sendPayment}
      disabled={isLoading}
      className="w-full py-6 px-4 bg-red-700 hover:bg-red-800 text-white font-bold"
    >
      {isLoading ? "Procesando..." : "Presionar el botón (0.1 WLD)"}
    </Button>
  )
}
