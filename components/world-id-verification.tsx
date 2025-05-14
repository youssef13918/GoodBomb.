"use client"

import { useState } from "react"
import { MiniKit, type VerifyCommandInput, VerificationLevel, type ISuccessResult } from "@worldcoin/minikit-js"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/context/settings-context"
import { useWorldApp } from "@/context/world-app-context"

interface WorldIDVerificationProps {
  onVerified: () => void
}

export default function WorldIDVerification({ onVerified }: WorldIDVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const { toast } = useToast()
  const { texts } = useSettings()
  const { isWorldAppInstalled, isDevelopmentMode, setIsVerified: setContextVerified } = useWorldApp()

  const handleVerify = async () => {
    try {
      setIsVerifying(true)

      // Si estamos en modo desarrollo, simulamos la verificación
      if (isDevelopmentMode) {
        // Simular un retraso para la verificación
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsVerified(true)
        setContextVerified(true)

        toast({
          title: "¡Verificación exitosa! (Modo desarrollo)",
          description: "Tu identidad ha sido simulada para desarrollo",
        })

        onVerified()
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
          payload: finalPayload as ISuccessResult,
          action: "goodbomb",
          signal: undefined, // Opcional
        }),
      })

      const verifyResponseJson = await verifyResponse.json()

      if (verifyResponseJson.status === 200) {
        setIsVerified(true)
        setContextVerified(true)

        toast({
          title: "¡Verificación exitosa!",
          description: "Tu identidad ha sido verificada con World ID",
        })

        onVerified()
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
        {isVerifying
          ? "Verificando..."
          : isVerified
            ? "✓ Verificado"
            : isDevelopmentMode
              ? "Verificar (Modo desarrollo)"
              : "Verificar con World ID"}
      </Button>
      {isVerified && (
        <span className="text-xs text-green-500">
          {isDevelopmentMode ? "Identidad simulada para desarrollo" : "Identidad verificada con World ID"}
        </span>
      )}
    </div>
  )
}
