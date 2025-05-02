import { NextResponse } from "next/server"

// En una implementación real, esto se almacenaría en una base de datos
let gameState = {
  timeLeft: 240,
  lastPlayer: "Nadie aún",
  pot: 0,
  isActive: true,
  lastUpdated: Date.now(),
}

export async function GET() {
  // Actualizar el tiempo restante basado en el tiempo transcurrido desde la última actualización
  const now = Date.now()
  const elapsedSeconds = Math.floor((now - gameState.lastUpdated) / 1000)

  if (gameState.isActive && elapsedSeconds > 0) {
    gameState.timeLeft = Math.max(0, gameState.timeLeft - elapsedSeconds)
    gameState.lastUpdated = now

    // Verificar si el juego terminó
    if (gameState.timeLeft === 0) {
      gameState.isActive = false
    }
  }

  return NextResponse.json(gameState)
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar datos
    if (!data.player) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    // Actualizar el estado del juego
    gameState = {
      timeLeft: 240, // Reiniciar temporizador
      lastPlayer: data.player,
      pot: gameState.pot + 0.1,
      isActive: true,
      lastUpdated: Date.now(),
    }

    return NextResponse.json(gameState)
  } catch (error) {
    console.error("Error al actualizar el estado del juego:", error)
    return NextResponse.json({ error: "Error al actualizar el estado del juego" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()

    // Reiniciar juego después de explosión
    if (data.action === "reset") {
      gameState = {
        timeLeft: 240,
        lastPlayer: "Nadie aún",
        pot: 0,
        isActive: true,
        lastUpdated: Date.now(),
      }

      return NextResponse.json(gameState)
    }

    // Pago al ganador
    if (data.action === "payout" && data.winner) {
      // En una implementación real, aquí se procesaría el pago al ganador

      // Reiniciar juego
      gameState = {
        timeLeft: 240,
        lastPlayer: "Nadie aún",
        pot: 0,
        isActive: true,
        lastUpdated: Date.now(),
      }

      return NextResponse.json({
        message: `Pago de ${data.amount} WLD enviado a ${data.winner}`,
        gameState,
      })
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 })
  } catch (error) {
    console.error("Error en acción del juego:", error)
    return NextResponse.json({ error: "Error al procesar la acción del juego" }, { status: 500 })
  }
}
