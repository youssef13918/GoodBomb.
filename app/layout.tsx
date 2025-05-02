import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SettingsProvider } from "@/context/settings-context"
import MiniKitProvider from "@/components/ui/minikit-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GoodBomb - Juego de Bombas",
  description: "Presiona el botón, reinicia el temporizador y gana el pozo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <MiniKitProvider>
              {children}
              <Toaster />
            </MiniKitProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
