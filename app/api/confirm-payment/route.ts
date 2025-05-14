import { type NextRequest, NextResponse } from "next/server"
import type { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js"

// En una implementación real, esto estaría en una base de datos
const pendingPayments = new Map<string, { amount: number; status: string }>()
const completedPayments = new Map<string, { amount: number; txHash: string }>()

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as MiniAppPaymentSuccessPayload

    // Verificar que el pago sea válido
    if (payload.status !== "success") {
      return NextResponse.json({ success: false, error: "Pago fallido" }, { status: 400 })
    }

    const { reference, transaction_id } = payload

    // IMPORTANT: Here we should fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
    // En una implementación real, verificarías que el reference existe en tu base de datos
    const payment = pendingPayments.get(reference)
    if (!payment) {
      return NextResponse.json({ success: false, error: "Pago no encontrado" }, { status: 404 })
    }

    // Verificar la transacción con el Developer Portal
    try {
      const response = await fetch(
        `https://developer.worldcoin.org/api/v2/minikit/transaction/${transaction_id}?app_id=${process.env.APP_ID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
          },
        },
      )

      const transaction = await response.json()

      // Verificar que la transacción sea válida
      if (transaction.reference == reference && transaction.status != "failed") {
        // Marcar el pago como completado
        pendingPayments.delete(reference)
        completedPayments.set(reference, {
          amount: payment.amount,
          txHash: transaction_id,
        })

        return NextResponse.json({ success: true })
      } else {
        return NextResponse.json({ success: false, error: "Transacción inválida" }, { status: 400 })
      }
    } catch (error) {
      console.error("Error al verificar la transacción:", error)
      return NextResponse.json({ success: false, error: "Error al verificar la transacción" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error al confirmar el pago:", error)
    return NextResponse.json({ error: "Error al procesar la confirmación del pago" }, { status: 500 })
  }
}
