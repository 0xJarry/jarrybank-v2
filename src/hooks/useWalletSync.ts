'use client'

import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useTokenBalances } from './useTokenBalances'

/**
 * Hook to sync wallet connection state with portfolio store
 * Automatically fetches token balances when wallet connects
 * Clears data when wallet disconnects
 */
export function useWalletSync() {
  const { address, chainId, isConnected } = useAccount()
  const { setConnection, setTokens, setLoading, clearPortfolio } = usePortfolioStore()

  // Fetch token balances with prices
  const { tokens, isLoading } = useTokenBalances()

  // Sync wallet connection state
  useEffect(() => {
    if (isConnected && address && chainId) {
      setConnection(address, chainId)
    } else {
      setConnection(null, null)
      clearPortfolio()
    }
  }, [isConnected, address, chainId, setConnection, clearPortfolio])

  // Update tokens in store when data changes
  useEffect(() => {
    if (tokens.length > 0) {
      setTokens(tokens)
    }
  }, [tokens, setTokens])

  // Update loading state
  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  return {
    isConnected,
    address,
    chainId,
    tokens,
    isLoading,
  }
}
