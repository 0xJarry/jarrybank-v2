import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  argentWallet,
  trustWallet,
  ledgerWallet,
  phantomWallet,
  rabbyWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { createConfig, http } from 'wagmi'
import { mainnet, avalanche } from 'wagmi/chains'

/**
 * Get RPC URLs with fallback support
 * Priority: Custom URL -> Public RPC
 */
const getRpcUrls = () => {
  const urls = []

  // Add custom RPC if provided
  if (process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL) {
    urls.push(process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL)
  }

  // Add fallback RPC if provided
  if (process.env.NEXT_PUBLIC_AVALANCHE_RPC_FALLBACK) {
    urls.push(process.env.NEXT_PUBLIC_AVALANCHE_RPC_FALLBACK)
  }

  // Always include public RPC as final fallback
  urls.push('https://api.avax.network/ext/bc/C/rpc')

  return urls
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

/**
 * Configure wallet groups for RainbowKit
 * Includes popular wallets with Phantom and Rabby (no duplicates)
 */
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        phantomWallet,
        rabbyWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: 'More',
      wallets: [
        coinbaseWallet,
        argentWallet,
        trustWallet,
        ledgerWallet,
      ],
    },
  ],
  {
    appName: 'JarryBank',
    projectId,
  }
)

/**
 * Wagmi configuration for Web3 integration
 * Supports Avalanche C-Chain with automatic RPC fallback
 */
export const config = createConfig({
  connectors,
  chains: [avalanche, mainnet],
  transports: {
    [avalanche.id]: http(getRpcUrls()[0], {
      batch: true,
      retryCount: 2,
      retryDelay: 1000,
    }),
    [mainnet.id]: http(),
  },
  ssr: true,
})

export default config
