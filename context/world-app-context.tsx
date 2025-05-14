"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { MiniKit } from "@worldcoin/minikit-js"

interface WorldAppContextType {
  isWorldAppInstalled: boolean
  isDevelopmentMode: boolean
  username: string | null
  isVerified: boolean
  setIsVerified: (value: boolean) => void
}

const WorldAppContext = createContext<WorldAppContextType | undefined>(undefined)

export function WorldAppProvider({ children }: { children: ReactNode }) {
  const [isWorldAppInstalled, setIsWorldAppInstalled] = useState(false)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const checkWorldApp = async () => {
      try {
        // Verificar si MiniKit está instalado
        const installed = MiniKit.isInstalled()
        setIsWorldAppInstalled(installed)

        if (installed) {
          try {
            // Intentar obtener el nombre de usuario
            const user = await MiniKit.getUser()
            if (user && user.username) {
              setUsername(user.username)
            }
          } catch (error) {
            console.error("Error al obtener el usuario:", error)
          }
        } else {
          // Si no está instalado, estamos en modo desarrollo
          setIsDevelopmentMode(true)
          // Simular un nombre de usuario para desarrollo
          setUsername("dev_user")
        }
      } catch (error) {
        console.error("Error al verificar World App:", error)
        setIsDevelopmentMode(true)
        setUsername("dev_user")
      }
    }

    checkWorldApp()
  }, [])

  return (
    <WorldAppContext.Provider
      value={{
        isWorldAppInstalled,
        isDevelopmentMode,
        username,
        isVerified,
        setIsVerified,
      }}
    >
      {children}
    </WorldAppContext.Provider>
  )
}

export function useWorldApp() {
  const context = useContext(WorldAppContext)
  if (context === undefined) {
    throw new Error("useWorldApp must be used within a WorldAppProvider")
  }
  return context
}
