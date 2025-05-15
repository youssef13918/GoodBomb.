"use client"

import { GameProvider } from "@/context/game-context"
import GameComponent from "@/components/game-component"
import MiniKitProvider from "@/components/minikit-provider"
import SettingsModal from "@/components/settings-modal"
import { useState } from "react"

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <MiniKitProvider appId={process.env.APP_ID || ""}>
      <GameProvider>
        <GameComponent />
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </GameProvider>
    </MiniKitProvider>
  )
}
