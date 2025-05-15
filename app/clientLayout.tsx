"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SettingsProvider } from "@/context/settings-context"
import { createContext, useContext, useState, useEffect } from "react"

const inter = Inter({ subsets: ["latin"] })

// Tipos para MiniKit
interface User {
  id: string
  username: string
}

interface VerifyOptions {
  action: string
  signal: string
}

interface PayOptions {
  id: string
  amount: string
  token: string
  recipientAddress: string
}

interface MiniKitResult {
  status: "success" | "error"
  message?: string
}

interface MiniKitContextType {
  getUser: () => Promise<User>
  verify: (options: VerifyOptions) => Promise<MiniKitResult>
  pay: (options: PayOptions) => Promise<MiniKitResult>
}

// Crear contexto
const MiniKitContext = createContext<MiniKitContextType | null>(null)

// Hook para usar MiniKit
export function useMiniKit() {
  return useContext(MiniKitContext)
}

// Proveedor simulado
function MiniKitProvider({ children, appId }: { children: React.ReactNode; appId: string }) {
  const [mockUser] = useState<User>({
    id: `mock-user-${Math.random().toString(36).substring(2, 9)}`,
    username: `usuario${Math.floor(Math.random() * 1000)}`,
  })

  // Simular inicialización
  useEffect(() => {
    console.log(`[Mock MiniKit] Inicializado con appId: ${appId}`)
  }, [appId])

  // Implementación simulada de getUser
  const getUser = async (): Promise<User> => {
    // Simular retraso de red
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockUser
  }

  // Implementación simulada de verify
  const verify = async (options: VerifyOptions): Promise<MiniKitResult> => {
    console.log(`[Mock MiniKit] Verificando con acción: ${options.action}, señal: ${options.signal}`)

    // Simular retraso de red
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simular éxito
    return {
      status: "success",
      message: "Verificación simulada exitosa",
    }
  }

  // Implementación simulada de pay
  const pay = async (options: PayOptions): Promise<MiniKitResult> => {
    console.log(`[Mock MiniKit] Procesando pago:`, options)

    // Simular retraso de red
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular éxito
    return {
      status: "success",
      message: `Pago simulado de ${options.amount} ${options.token} a ${options.recipientAddress}`,
    }
  }

  return <MiniKitContext.Provider value={{ getUser, verify, pay }}>{children}</MiniKitContext.Provider>
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <MiniKitProvider appId={process.env.APP_ID || ""}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <SettingsProvider>
              {children}
              <Toaster />
            </SettingsProvider>
          </ThemeProvider>
        </MiniKitProvider>
      </body>
    </html>
  )
}
