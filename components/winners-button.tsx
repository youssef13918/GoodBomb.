"use client"

import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"
import { useGame } from "@/context/game-context"

export default function WinnersButton() {
  const { showWinners } = useGame()

  return (
    <Button
      onClick={showWinners}
      variant="outline"
      className="flex items-center gap-2 bg-olive-800 border-olive-600 hover:bg-olive-700 text-olive-300 hover:text-white"
    >
      <Trophy size={16} />
      <span>Ganadores</span>
    </Button>
  )
}
