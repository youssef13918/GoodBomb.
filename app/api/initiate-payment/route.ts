import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

// En una implementación real, guardarías estos IDs en una base de datos
const pendingPayments = new Map<string, { amount: number; status: string }>()

export async function POST(request: Request) {
  try {
    // Generar un ID único para la transacción
    const id = randomUUID()

    // En una implementación real, aquí guardarías detalles adicionales
    pendingPayments.set(id, {
      amount: 0.1, // Cantidad para el juego GoodBomb
      status: "pending",
    })

    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error("Error al iniciar el pago:", error)
    return NextResponse.json({ error: "Error al iniciar el pago" }, { status: 500 })
  }
}
