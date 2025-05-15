import { type NextRequest, NextResponse } from "next/server"

// En una implementación real, esto se almacenaría en una base de datos
const players: { username: string; timestamp: number }[] = []

export async function GET() {
  return NextResponse.json({ players: players.slice(0, 5) })
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    // Validar el payload del pago
    if (!payload || payload.status !== "success") {
      return NextResponse.json({ success: false, error: "Payload de pago inválido" }, { status: 400 })
    }

    // En una implementación real, verificarías el pago con la API de World ID
    // y actualizarías tu base de datos

    // Extraer nombre de usuario del payload o usar uno predeterminado
    const username = payload.username || "Anónimo"

    // Añadir usuario al historial
    players.unshift({
      username,
      timestamp: Date.now(),
    })

    // Mantener solo los últimos 100 jugadores
    if (players.length > 100) {
      players.length = 100
    }

    // Devolver respuesta de éxito
    return NextResponse.json({
      success: true,
      message: "Pago confirmado exitosamente",
      username,
    })
  } catch (error) {
    console.error("Error al confirmar pago:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar la confirmación del pago",
      },
      { status: 500 },
    )
  }
}
