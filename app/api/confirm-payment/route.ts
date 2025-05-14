import { NextResponse } from "next/server"

// En una implementación real, esto estaría en una base de datos
const pendingPayments = new Map<string, { amount: number; status: string }>()
const completedPayments = new Map<string, { amount: number; txHash: string }>()

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    // Verificar que el pago sea válido
    if (payload.status !== "success") {
      return NextResponse.json({ success: false, error: "Pago fallido" }, { status: 400 })
    }

    const { reference, txHash } = payload

    // Verificar que el pago exista en pendientes
    const payment = pendingPayments.get(reference)
    if (!payment) {
      return NextResponse.json({ success: false, error: "Pago no encontrado" }, { status: 404 })
    }

    // Marcar el pago como completado
    pendingPayments.delete(reference)
    completedPayments.set(reference, {
      amount: payment.amount,
      txHash,
    })

    // En una implementación real, aquí actualizarías el estado del juego

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al confirmar el pago:", error)
    return NextResponse.json({ error: "Error al procesar la confirmación del pago" }, { status: 500 })
  }
}
