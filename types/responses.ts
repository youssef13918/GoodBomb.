// Create missing types file
import type { MiniKitError } from "./errors"

export interface CommandResponse<T = unknown> {
  success: boolean
  data?: T
  error?: MiniKitError
}
