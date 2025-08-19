import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Token balance interface representing a single token in the portfolio
 */
export interface TokenBalance {
  address: string
  symbol: string
  name: string
  decimals: number
  balance: string
  price: number
  value: number
  logoURI?: string
  chainId: number
  priceChange24h?: number // 24-hour price change percentage
}

/**
 * DeFi position interface for tracking protocol positions
 */
export interface DeFiPosition {
  protocol: string
  type: 'liquidity' | 'lending' | 'yield' | 'trading'
  tokenAddress: string
  symbol: string
  balance: string
  value: number
  rewards?: {
    token: string
    amount: string
    value: number
    claimable: boolean
  }[]
  health?: 'healthy' | 'warning' | 'danger'
}

/**
 * Portfolio store state interface
 */
interface PortfolioState {
  // Wallet connection state
  isConnected: boolean
  address: string | null
  chainId: number | null

  // Portfolio data
  tokens: TokenBalance[]
  defiPositions: DeFiPosition[]
  totalValue: number

  // UI state
  isLoading: boolean
  lastUpdated: number | null

  // Actions
  setConnection: (address: string | null, chainId: number | null) => void
  setTokens: (tokens: TokenBalance[]) => void
  setDeFiPositions: (positions: DeFiPosition[]) => void
  setLoading: (loading: boolean) => void
  updateTotalValue: () => void
  clearPortfolio: () => void
}

/**
 * Zustand store for portfolio state management
 * Persists user preferences and wallet addresses to localStorage
 */
export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      // Initial state
      isConnected: false,
      address: null,
      chainId: null,
      tokens: [],
      defiPositions: [],
      totalValue: 0,
      isLoading: false,
      lastUpdated: null,

      // Actions
      setConnection: (address, chainId) => {
        set({
          isConnected: !!address,
          address,
          chainId,
          lastUpdated: Date.now(),
        })
      },

      setTokens: (tokens) => {
        set({ tokens, lastUpdated: Date.now() })
        get().updateTotalValue()
      },

      setDeFiPositions: (defiPositions) => {
        set({ defiPositions, lastUpdated: Date.now() })
        get().updateTotalValue()
      },

      setLoading: (isLoading) => set({ isLoading }),

      updateTotalValue: () => {
        const { tokens, defiPositions } = get()
        const tokenValue = tokens.reduce((sum, token) => sum + token.value, 0)
        const positionValue = defiPositions.reduce((sum, position) => sum + position.value, 0)
        const rewardsValue = defiPositions.reduce((sum, position) => {
          return sum + (position.rewards?.reduce((rSum, reward) => rSum + reward.value, 0) || 0)
        }, 0)

        set({ totalValue: tokenValue + positionValue + rewardsValue })
      },

      clearPortfolio: () => {
        set({
          tokens: [],
          defiPositions: [],
          totalValue: 0,
          lastUpdated: null,
        })
      },
    }),
    {
      name: 'jarrybank-portfolio',
      partialize: (state) => ({
        address: state.address,
        chainId: state.chainId,
      }),
    }
  )
)
