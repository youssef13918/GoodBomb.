// Create missing types file
export enum ErrorCode {
  USER_REJECTED = "USER_REJECTED",
  INVALID_PARAMETERS = "INVALID_PARAMETERS",
  UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export interface MiniKitError {
  code: ErrorCode
  message: string
}
