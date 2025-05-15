import { NextResponse } from "next/server"

export async function POST() {
  const uuid = crypto.randomUUID().replace(/-/g, "")

  // En una implementación real, guardaríamos este ID en la base de datos
  // para verificar el pago más tarde

  return NextResponse.json({ id: uuid })
}
