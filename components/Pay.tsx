"use client"

import { useState } from "react"
import { MiniKit, tokenToDecimals } from "@/lib/minikit"
import { Tokens } from "@/types/payment"

export default function Pay() {
  const [isLoading, setIsLoading] = useState(false)

  const sendPayment = async () => {
    try {
      setIsLoading(true)

      // Get a reference ID from the server
      const res = await fetch("/api/initiate-payment", {
        method: "POST",
      })

      const { id } = await res.json()
      console.log("Payment reference ID:", id)

      // Create the payment payload
      const payload = {
        reference: id,
        to: "0x0c892815f0B058E69987920A23FBb33c834289cf", // Test address
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(0.5, Tokens.WLD).toString(),
          },
        ],
        description: "GoodBomb game payment",
      }

      // Send the payment if MiniKit is installed
      if (MiniKit.isInstalled()) {
        return await MiniKit.commandsAsync.pay(payload)
      }
      return null
    } catch (error) {
      console.error("Error sending payment:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handlePay = async () => {
    if (!MiniKit.isInstalled()) {
      alert("MiniKit is not installed. Please open this app in World App.")
      return
    }

    const sendPaymentResponse = await sendPayment()
    const response = sendPaymentResponse?.finalPayload

    if (!response) {
      alert("Payment failed or was cancelled")
      return
    }

    if (response.status === "success") {
      try {
        const res = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: response }),
        })

        const payment = await res.json()

        if (payment.success) {
          alert("Payment successful!")
        } else {
          alert("Payment verification failed")
        }
      } catch (error) {
        console.error("Error confirming payment:", error)
        alert("Error confirming payment")
      }
    }
  }

  return (
    <button
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors font-military"
      onClick={handlePay}
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "ADD 0.5 WLD"}
    </button>
  )
}
