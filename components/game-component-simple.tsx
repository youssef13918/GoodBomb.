"use client"
import MilitaryFrame from "@/components/military-frame"

export default function GameComponentSimple() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-military-pattern-dark">
      <div className="w-full max-w-md">
        <MilitaryFrame theme="dark">
          <div className="p-5">
            <h1 className="text-2xl text-white text-center mb-4">GoodBomb</h1>
            <p className="text-gray-300 text-center">
              Versión simplificada para solucionar problemas de compatibilidad.
            </p>
          </div>
        </MilitaryFrame>
      </div>
    </main>
  )
}
