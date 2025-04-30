// Create a simple MiniKit implementation that works in the browser
import { Tokens } from "@/types/payment"

// Define the PayCommandInput type
interface PayCommandInput {
  reference: string
  to: string
  tokens: {
    symbol: Tokens
    token_amount: string
  }[]
  description: string
}

// Simple mock implementation for client-side use
export class MiniKit {
  static isInstalled(): boolean {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return false

    // For testing purposes, always return true
    return true
  }

  static commandsAsync = {
    pay: async (payload: PayCommandInput) => {
      console.log("Sending payment with payload:", payload)

      // Mock successful response
      return {
        finalPayload: {
          status: "success",
          transaction_id: "mock-transaction-id",
          reference: payload.reference,
        },
      }
    },
  }
}

// Helper function to convert token amounts to their decimal representation
export function tokenToDecimals(amount: number, token: Tokens): number {
  const decimals = {
    [Tokens.WLD]: 18,
    [Tokens.USDCE]: 6,
    [Tokens.USDC]: 6,
    [Tokens.ETH]: 18,
  }

  return amount * Math.pow(10, decimals[token] || 18)
}
