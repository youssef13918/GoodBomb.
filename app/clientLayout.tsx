"use client"

import type React from "react"

import { MiniKitProvider } from "@worldcoin/minikit-js"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SettingsProvider } from "@/context/settings-context"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <MiniKitProvider appId={process.env.NEXT_PUBLIC_APP_ID || ""}>
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
