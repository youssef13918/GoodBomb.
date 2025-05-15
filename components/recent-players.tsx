"use client"

import { useGame } from "@/context/game-context"
import { User, Clock } from "lucide-react"

export default function RecentPlayers() {
  const { recentPlayers } = useGame()

  if (recentPlayers.length === 0) {
    return (
      <div className="p-3 bg-black/40 border border-olive-600 rounded-md text-center">
        <p className="text-gray-400">No hay jugadores recientes</p>
      </div>
    )
  }

  return (
    <div className="p-3 bg-black/40 border border-olive-600 rounded-md">
      <h3 className="text-olive-300 font-military text-sm mb-2 flex items-center gap-1">
        <Clock size={14} />
        <span>ÚLTIMOS JUGADORES</span>
      </h3>
      <ul className="space-y-2">
        {recentPlayers.map((player, index) => (
          <li
            key={`${player.id}-${player.timestamp}`}
            className={`flex items-center gap-2 p-2 rounded-md ${index === 0 ? "bg-olive-800/50 border border-olive-700" : "bg-black/30"}`}
          >
            <User className={`${index === 0 ? "text-yellow-400" : "text-olive-400"}`} size={16} />
            <div className="flex flex-col">
              <span className={`text-sm ${index === 0 ? "text-yellow-300 font-bold" : "text-gray-300"}`}>
                {player.username}
              </span>
              <span className="text-xs text-gray-500">{new Date(player.timestamp).toLocaleTimeString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
