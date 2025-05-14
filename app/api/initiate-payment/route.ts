import { type NextRequest, NextResponse } from "next/server"

// En una implementación real, guardarías estos IDs en una base de datos
const pendingPayments = new Map<string, { amount: number; status: string }>()

export async function POST(req: NextRequest) {
  try {
    // Generar un ID único para la transacción
    const uuid = crypto.randomUUID().replace(/-/g, "")

    // En una implementación real, aquí guardarías detalles adicionales
    pendingPayments.set(uuid, {
      amount: 0.1, // Cantidad para el juego GoodBomb
      status: "pending",
    })

    // TODO: Store the ID field in your database so you can verify the payment later
    return NextResponse.json({ id: uuid })
  } catch (error) {
    console.error("Error al iniciar el pago:", error)
    return NextResponse.json({ error: "Error al iniciar el pago" }, { status: 500 })
  }
}
