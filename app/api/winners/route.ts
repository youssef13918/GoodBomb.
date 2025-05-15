import { NextResponse } from "next/server"

// En una implementación real, esto se almacenaría en una base de datos
const winners: { username: string; timestamp: number; amount: number }[] = []

export async function GET() {
  return NextResponse.json({ winners })
}

export async function POST(req: Request) {
  try {
    const { username, amount } = await req.json()

    // Validar datos
    if (!username || !amount) {
      return NextResponse.json({ success: false, error: "Datos inválidos" }, { status: 400 })
    }

    // Registrar ganador
    winners.unshift({
      username,
      timestamp: Date.now(),
      amount: Number(amount),
    })

    return NextResponse.json({
      success: true,
      message: "Ganador registrado exitosamente",
    })
  } catch (error) {
    console.error("Error al registrar ganador:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar el registro del ganador",
      },
      { status: 500 },
    )
  }
}
