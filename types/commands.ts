// Create missing types file
export type CommandName = "pay" | "sign" | "verify" | "getUser"

export interface Command<T = unknown> {
  name: CommandName
  payload: T
}
