"use client"

import { User, Clock } from "lucide-react"

interface Player {
  id?: string
  username: string
  timestamp: number
}

interface RecentPlayersProps {
  players: Player[]
}

export default function RecentPlayers({ players }: RecentPlayersProps) {
  if (players.length === 0) {
    return (
      <div className="text-center text-gray-400 py-2">
        <p>No hay jugadores recientes</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2 max-h-60 overflow-y-auto">
      {players.map((player, index) => (
        <li
          key={`${player.id || player.username}-${player.timestamp}`}
          className={`flex items-center gap-2 p-2 rounded-md ${index === 0 ? "bg-olive-800/50 border border-olive-700" : "bg-black/30"}`}
        >
          <User className={`${index === 0 ? "text-yellow-400" : "text-olive-400"}`} size={16} />
          <div className="flex flex-col">
            <span className={`text-sm ${index === 0 ? "text-yellow-300 font-bold" : "text-gray-300"}`}>
              {player.username}
            </span>
            <div className="flex items-center gap-1">
              <Clock size={10} className="text-gray-500" />
              <span className="text-xs text-gray-500">{new Date(player.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
