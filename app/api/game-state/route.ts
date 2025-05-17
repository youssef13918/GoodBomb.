import { type NextRequest, NextResponse } from "next/server"

// This would be stored in a database in a real implementation
let gameState = {
  timeLeft: 240,
  lastPlayer: "Nadie aún",
  pot: 0.1,
  buttonPresses: 0,
  isActive: true,
  lastUpdated: Date.now(),
  recentPlayers: [],
  registeredPlayers: [],
}

export async function GET() {
  // Update remaining time based on elapsed time since last update
  const now = Date.now()
  const elapsedSeconds = Math.floor((now - gameState.lastUpdated) / 1000)

  if (gameState.isActive && elapsedSeconds > 0) {
    gameState.timeLeft = Math.max(0, gameState.timeLeft - elapsedSeconds)
    gameState.lastUpdated = now

    // Check if game ended
    if (gameState.timeLeft === 0) {
      gameState.isActive = false
    }
  }

  return NextResponse.json(gameState)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate data
    if (!data.player) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Update game state
    gameState = {
      ...gameState,
      timeLeft: 240, // Reset timer
      lastPlayer: data.player,
      pot: gameState.pot + 0.1,
      buttonPresses: gameState.buttonPresses + 1,
      isActive: true,
      lastUpdated: Date.now(),
      recentPlayers: [{ username: data.player, timestamp: Date.now() }, ...gameState.recentPlayers.slice(0, 4)],
    }

    return NextResponse.json(gameState)
  } catch (error) {
    console.error("Error updating game state:", error)
    return NextResponse.json({ error: "Error updating game state" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Register player
    if (data.action === "register" && data.username) {
      // Check if username already exists
      if (gameState.registeredPlayers.some((p) => p.username === data.username)) {
        return NextResponse.json(
          {
            error: "Username already taken",
          },
          { status: 400 },
        )
      }

      const newPlayer = {
        id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        username: data.username,
        timestamp: Date.now(),
      }

      gameState.registeredPlayers.push(newPlayer)

      return NextResponse.json({
        success: true,
        player: newPlayer,
      })
    }

    // Reset game after explosion
    if (data.action === "reset") {
      gameState = {
        ...gameState,
        timeLeft: 240,
        lastPlayer: "Nadie aún",
        pot: 0,
        isActive: true,
        lastUpdated: Date.now(),
      }

      return NextResponse.json(gameState)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error in game action:", error)
    return NextResponse.json({ error: "Error processing game action" }, { status: 500 })
  }
}
