import { type NextRequest, NextResponse } from "next/server"

// In a real implementation, this would be stored in a database
const users: { username: string; timestamp: number }[] = []

export async function GET() {
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    // Validate the payment payload
    if (!payload || payload.status !== "success") {
      return NextResponse.json({ success: false, error: "Invalid payment payload" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Verify the payment with World ID's API
    // 2. Update your database with the payment information
    // 3. Update the game state

    // Extract username from the payload or use a default
    const username = payload.username || "Anonymous"

    // Add user to history
    users.push({
      username,
      timestamp: Date.now(),
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Payment confirmed successfully",
      username,
    })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error processing payment confirmation",
      },
      { status: 500 },
    )
  }
}
