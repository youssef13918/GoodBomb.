import type React from "react"
import { MiniKitProvider } from "@worldcoin/minikit-js"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MiniKitProvider appId={process.env.NEXT_PUBLIC_APP_ID || ""}>{children}</MiniKitProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
