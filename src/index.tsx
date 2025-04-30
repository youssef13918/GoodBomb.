import type React from "react"
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider"

// Add the missing inter import
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default async function Root({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <MiniKitProvider>
        <body className={inter.className}>{children}</body>
      </MiniKitProvider>
    </html>
  )
}
