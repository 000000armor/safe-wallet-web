import Onboard, { type OnboardAPI } from '@web3-onboard/core'
import type { ChainInfo } from '@safe-global/safe-gateway-typescript-sdk'
import { hexValue } from '@ethersproject/bytes'
import { getAllWallets, getRecommendedInjectedWallets } from '@/hooks/wallets/wallets'
import { getRpcServiceUrl } from '@/hooks/wallets/web3'
import type { EnvState } from '@/store/settingsSlice'

let onboard: OnboardAPI | null = null

export const createOnboard = (
  chainConfigs: ChainInfo[],
  currentChain: ChainInfo,
  rpcConfig: EnvState['rpc'] | undefined,
): OnboardAPI => {
  if (onboard) return onboard

  const wallets = getAllWallets(currentChain)

  const chains = chainConfigs.map((cfg) => ({
    id: hexValue(parseInt(cfg.chainId)),
    label: cfg.chainName,
    rpcUrl: rpcConfig?.[cfg.chainId] || getRpcServiceUrl(cfg.rpcUri),
    token: cfg.nativeCurrency.symbol,
    color: cfg.theme.backgroundColor,
    publicRpcUrl: cfg.publicRpcUri.value,
    blockExplorerUrl: new URL(cfg.blockExplorerUriTemplate.address).origin,
  }))

  onboard = Onboard({
    wallets,

    chains,

    accountCenter: {
      mobile: { enabled: false },
      desktop: { enabled: false },
    },

    notify: {
      enabled: false,
    },

    appMetadata: {
      name: 'Safe{Wallet}',
      icon: location.origin + '/images/logo-round.svg',
      description: 'Safe{Wallet} – smart contract wallet for Ethereum (ex-Gnosis Safe multisig)',
      recommendedInjectedWallets: getRecommendedInjectedWallets(),
    },

    connect: {
      removeWhereIsMyWalletWarning: true,
      autoConnectLastWallet: false,
    },
  })

  return onboard
}
