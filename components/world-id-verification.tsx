"use client"

import { useState } from "react"
import { MiniKit, type VerifyCommandInput, VerificationLevel } from "@worldcoin/minikit-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/context/settings-context"

export default function WorldIDVerification() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const { toast } = useToast()
  const { texts } = useSettings()

  const handleVerify = async () => {
    try {
      setIsVerifying(true)

      if (!MiniKit.isInstalled()) {
        toast({
          title: texts.error,
          description: "World App no está instalada",
          variant: "destructive",
        })
        return
      }

      const verifyPayload: VerifyCommandInput = {
        action: "goodbomb", // Tu action ID del Developer Portal
        verification_level: VerificationLevel.Orb, // Orb | Device
      }

      // World App abrirá un drawer pidiendo al usuario confirmar la operación
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload)

      if (finalPayload.status === "error") {
        toast({
          title: texts.error,
          description: "Error de verificación",
          variant: "destructive",
        })
        return
      }

      // Verificar la prueba en el backend
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: "goodbomb",
          signal: undefined, // Opcional
        }),
      })

      const verifyResponseJson = await verifyResponse.json()

      if (verifyResponseJson.status === 200) {
        setIsVerified(true)
        toast({
          title: "¡Verificación exitosa!",
          description: "Tu identidad ha sido verificada con World ID",
        })
      } else {
        toast({
          title: texts.error,
          description: "No se pudo verificar tu identidad",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error de verificación:", error)
      toast({
        title: texts.error,
        description: "Error al procesar la verificación",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleVerify}
        disabled={isVerifying || isVerified}
        className={`bg-blue-600 hover:bg-blue-700 ${isVerified ? "bg-green-600 hover:bg-green-600" : ""}`}
      >
        {isVerifying ? "Verificando..." : isVerified ? "✓ Verificado" : "Verificar con World ID"}
      </Button>
      {isVerified && <span className="text-xs text-green-500">Identidad verificada con World ID</span>}
    </div>
  )
}
