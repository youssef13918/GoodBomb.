"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface MiniKitProviderProps {
  children: ReactNode
  appId: string
}

export default function MiniKitProvider({ children, appId }: MiniKitProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false)

  useEffect(() => {
    const initializeMiniKit = async () => {
      try {
        // Verificar si estamos en un navegador
        if (typeof window === "undefined") {
          setIsDevelopmentMode(true)
          setIsInitialized(true)
          return
        }

        // Verificar si MiniKit está disponible
        if ("MiniKit" in window) {
          try {
            // @ts-ignore - MiniKit está disponible globalmente
            await window.MiniKit.init({
              appId: appId,
            })
            setIsInitialized(true)
          } catch (initError) {
            console.error("Error inicializando MiniKit:", initError)
            setError("No se pudo inicializar MiniKit. Asegúrate de estar usando World App.")
            setIsDevelopmentMode(true)
            setIsInitialized(true)
          }
        } else {
          console.log("MiniKit no encontrado, usando modo desarrollo")
          setIsDevelopmentMode(true)
          setIsInitialized(true)
        }
      } catch (error) {
        console.error("Error general:", error)
        setError("Ocurrió un error al inicializar la aplicación.")
        setIsDevelopmentMode(true)
        setIsInitialized(true)
      }
    }

    initializeMiniKit()
  }, [appId])

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-military-pattern-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-500 mx-auto mb-4"></div>
          <p className="text-olive-300">Inicializando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isDevelopmentMode && (
        <Alert className="mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">Modo Desarrollo</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            Ejecutando en modo desarrollo. Las funciones de World App están simuladas.
          </AlertDescription>
        </Alert>
      )}

      {children}
    </>
  )
}
