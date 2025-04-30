// Add the tokenToDecimals helper function
import { Tokens } from "../../types/payment"

export function tokenToDecimals(amount: number, token: Tokens): number {
  const decimals = {
    [Tokens.WLD]: 18,
    [Tokens.USDCE]: 6,
    [Tokens.USDC]: 6,
    [Tokens.ETH]: 18,
  }

  return amount * Math.pow(10, decimals[token] || 18)
}
