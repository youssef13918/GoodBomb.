"use client"

import { type ReactNode, useEffect } from "react"
import { MiniKit } from "@worldcoin/minikit-js"

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Inicializar MiniKit con tu APP_ID
    const appId = process.env.APP_ID as `app_${string}`
    if (appId) {
      MiniKit.install({ appId })
    } else {
      console.warn("APP_ID no está definido en las variables de entorno")
      MiniKit.install()
    }
  }, [])

  return <>{children}</>
}
