import { type NextRequest, NextResponse } from "next/server"
import type { MiniAppPaymentSuccessPayload } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: MiniAppPaymentSuccessPayload
}

// Add a mock function to get reference from DB
function getReferenceFromDB() {
  // In a real implementation, this would fetch from your database
  return "mock-reference-id"
}

export async function POST(req: NextRequest) {
  const { payload } = (await req.json()) as IRequestPayload

  // IMPORTANT: Here we should fetch the reference you created in /initiate-payment to ensure the transaction we are verifying is the same one we initiated
  const reference = getReferenceFromDB()

  // 1. Check that the transaction we received from the mini app is the same one we sent
  if (payload.reference === reference) {
    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${process.env.APP_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
        },
      },
    )
    const transaction = await response.json()

    // 2. Here we optimistically confirm the transaction.
    // Otherwise, you can poll until the status == mined
    if (transaction.reference == reference && transaction.status != "failed") {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false })
    }
  }

  return NextResponse.json({ success: false, error: "Reference mismatch" })
}
