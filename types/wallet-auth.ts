// Create missing types file
export interface WalletAuthInput {
  domain: string
  uri: string
  statement?: string
  version?: string
  chainId?: number
  nonce?: string
  issuedAt?: string
  expirationTime?: string
  notBefore?: string
  requestId?: string
  resources?: string[]
}

export interface WalletAuthResponse {
  signature: string
  message: string
}
