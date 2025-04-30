import { NextResponse } from "next/server"

export async function POST() {
  // Generate a unique reference ID
  const uuid = crypto.randomUUID().replace(/-/g, "")

  // In a real implementation, you would store this ID in your database
  // to verify the payment later

  return NextResponse.json({ id: uuid })
}
