import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Tokens } from "@/types/payment"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a time in seconds to a display format (MM:SS)
 * @param seconds - Time in seconds to format
 * @returns Formatted time string in MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

/**
 * Converts a token amount to its decimal representation
 * @param amount - The amount to convert
 * @param token - The token type
 * @returns The amount in the token's decimal representation
 */
export function tokenToDecimals(amount: number, token: Tokens): number {
  const decimals = {
    [Tokens.WLD]: 18,
    [Tokens.USDCE]: 6,
    [Tokens.USDC]: 6,
    [Tokens.ETH]: 18,
  }

  return amount * Math.pow(10, decimals[token] || 18)
}
