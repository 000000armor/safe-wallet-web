import type { TransactionReceipt } from '@ethersproject/abstract-provider/lib'
import type { ErrorCode } from '@ethersproject/logger'

// https://docs.ethers.io/v5/api/providers/types/#providers-TransactionResponse
export enum EthersTxReplacedReason {
  repriced = 'repriced',
  cancelled = 'cancelled',
  replaced = 'replaced',
}

// TODO: Replace this with ethers v6 types once released and create similar helper to `asError`
export type EthersError = Error & { code: ErrorCode; reason?: EthersTxReplacedReason; receipt?: TransactionReceipt }

export const didRevert = (receipt: EthersError['receipt']): boolean => {
  return receipt?.status === 0
}

export const didReprice = (error: EthersError): boolean => {
  return error.reason === EthersTxReplacedReason.repriced
}

type TimeoutError = Error & {
  timeout: number
  code: ErrorCode.TIMEOUT
}

export const isTimeoutError = (value?: Error): value is TimeoutError => {
  return !!value && 'timeout' in value && 'code' in value
}

export const getTimeoutErrorMessage = (error: TimeoutError) => {
  return `Transaction timed out after ${Math.floor(error.timeout / 1000)} seconds`
}
