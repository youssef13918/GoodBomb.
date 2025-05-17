import { type NextRequest, NextResponse } from "next/server"

// This would be stored in a database in a real implementation
const winners: { id: string; username: string; timestamp: number; amount: number }[] = []

export async function GET() {
  return NextResponse.json({ winners })
}

export async function POST(req: NextRequest) {
  try {
    const { username, amount } = await req.json()

    // Validate data
    if (!username || !amount) {
      return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 })
    }

    // Register winner
    winners.unshift({
      id: `winner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username,
      timestamp: Date.now(),
      amount: Number(amount),
    })

    return NextResponse.json({
      success: true,
      message: "Winner registered successfully",
    })
  } catch (error) {
    console.error("Error registering winner:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error processing winner registration",
      },
      { status: 500 },
    )
  }
}
