export enum Tokens {
  WLD = "WLD",
  USDCE = "USDC.e",
  USDC = "USDC",
  ETH = "ETH",
}

export enum Network {
  OPTIMISM = "optimism",
  ETHEREUM = "ethereum",
}

// Represents tokens you allow the user to pay with and amount for each
export type TokensPayload = {
  symbol: Tokens
  token_amount: string
}

export type PayCommandInput = {
  reference: string
  to: string
  tokens: TokensPayload[]
  network?: Network // Optional
  description: string
}

export interface PayCommandResponse {
  status: string
  transaction_id: string
  reference: string
}
