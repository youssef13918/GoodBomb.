"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { MiniKit } from "../minikit"
import type { UserInfo } from "../types/user"

interface MiniKitContextType {
  isInstalled: boolean
  user: UserInfo | null
  isLoading: boolean
}

const MiniKitContext = createContext<MiniKitContextType>({
  isInstalled: false,
  user: null,
  isLoading: true,
})

export const useMiniKit = () => useContext(MiniKitContext)

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMiniKit = async () => {
      try {
        const installed = MiniKit.isInstalled()
        setIsInstalled(installed)

        if (installed) {
          const userInfo = await MiniKit.commandsAsync.getUser()
          setUser(userInfo)
        }
      } catch (error) {
        console.error("Error checking MiniKit:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkMiniKit()
  }, [])

  return <MiniKitContext.Provider value={{ isInstalled, user, isLoading }}>{children}</MiniKitContext.Provider>
}
