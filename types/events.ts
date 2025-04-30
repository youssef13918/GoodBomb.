// Convert the Solidity event to a TypeScript interface
export interface TransferReferenceEvent {
  sender: string
  recipient: string
  amount: string
  token: string
  referenceId: string
  success: boolean
}
