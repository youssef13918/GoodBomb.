// Fix import paths to use relative paths
export { MiniKit } from "./minikit"

export * from "./types/commands"
export * from "./types/errors"
export * from "./types/payment"
export * from "./types/responses"
export * from "./types/user"
export * from "./types/wallet-auth"

export { tokenToDecimals } from "./helpers/payment/client"

export { VerificationLevel, type ISuccessResult } from "@worldcoin/idkit-core"
export {
  verifyCloudProof,
  type IVerifyResponse,
} from "@worldcoin/idkit-core/backend"

// Comment out imports that might not be available
// export { parseSiweMessage, verifySiweMessage } from './helpers/siwe/siwe';
// export { getIsUserVerified } from './helpers/address-book';
