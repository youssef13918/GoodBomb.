import { NextResponse } from "next/server"

interface PaymentPayload {
  status: string
  transaction_id: string
  reference: string
}

export async function POST(req: Request) {
  try {
    const { payload } = (await req.json()) as { payload: PaymentPayload }

    // In a real implementation, you would:
    // 1. Verify that the reference matches one you created
    // 2. Verify the transaction with the World ID API

    // For now, we'll just check that we received a valid payload
    if (payload && payload.status === "success" && payload.transaction_id && payload.reference) {
      // Payment is valid
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Invalid payment payload" })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ success: false, error: "Error processing payment confirmation" })
  }
}
