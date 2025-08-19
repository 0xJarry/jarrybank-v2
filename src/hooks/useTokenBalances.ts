'use client'

import { useAccount, useBalance, useReadContracts } from 'wagmi'
import { formatUnits } from 'viem'
import { useEffect, useState } from 'react'
import type { TokenBalance } from '@/store/portfolioStore'
import { getTokenPrices } from '@/lib/prices'

/**
 * Common ERC20 tokens on Avalanche C-Chain
 */
const AVALANCHE_TOKENS = [
  {
    address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7' as const,
    symbol: 'WAVAX',
    name: 'Wrapped AVAX',
    decimals: 18,
    logoURI: '/api/placeholder/32/32',
  },
  {
    address: '0xffff003a6bad9b743d658048742935fffe2b6ed7' as const,
    symbol: 'KET',
    name: 'Yellow Ket',
    decimals: 18,
    logoURI: '/api/placeholder/32/32',
  },
  {
    address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E' as const,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: '/api/placeholder/32/32',
  },
  {
    address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7' as const,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: '/api/placeholder/32/32',
  },
  {
    address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB' as const,
    symbol: 'WETH.e',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: '/api/placeholder/32/32',
  },
  {
    address: '0x50b7545627a5162F82A992c33b87aDc75187B218' as const,
    symbol: 'WBTC.e',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    logoURI: '/api/placeholder/32/32',
  },
]

// ERC20 ABI - only the functions we need
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'decimals', type: 'uint8' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'symbol', type: 'string' }],
  },
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: 'name', type: 'string' }],
  },
] as const

/**
 * Hook to fetch token balances for the connected wallet
 * Returns native AVAX + major ERC20 tokens on Avalanche with real prices
 */
export function useTokenBalances() {
  const { address, chainId, isConnected } = useAccount()
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pricesLoading, setPricesLoading] = useState(false)

  // Fetch native AVAX balance
  const { data: avaxBalance, isLoading: avaxLoading } = useBalance({
    address: address,
    chainId: 43114, // Avalanche C-Chain
  })

  // Prepare contract reads for all tokens
  const contracts = AVALANCHE_TOKENS.map((token) => ({
    address: token.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  }))

  // Fetch all ERC20 balances in one multicall
  const { data: tokenBalances, isLoading: tokensLoading } = useReadContracts({
    contracts: address ? contracts : [],
  })

  // Process and format token data with prices
  useEffect(() => {
    if (!isConnected || !address || chainId !== 43114) {
      setTokens([])
      return
    }

    const fetchTokenData = async () => {
      const formattedTokens: TokenBalance[] = []
      const addressesToFetch: string[] = []

      // Add native AVAX
      if (avaxBalance) {
        formattedTokens.push({
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'AVAX',
          name: 'Avalanche',
          decimals: 18,
          balance: avaxBalance.value.toString(),
          price: 0,
          value: 0,
          logoURI: '/api/placeholder/32/32',
          chainId: 43114,
        })
        addressesToFetch.push('native')
      }

      // Add ERC20 tokens with non-zero balances
      if (tokenBalances) {
        tokenBalances.forEach((result, index) => {
          if (result.status === 'success' && result.result) {
            const balance = BigInt(result.result.toString())
            if (balance > BigInt(0)) {
              const token = AVALANCHE_TOKENS[index]
              formattedTokens.push({
                address: token.address,
                symbol: token.symbol,
                name: token.name,
                decimals: token.decimals,
                balance: balance.toString(),
                price: 0,
                value: 0,
                logoURI: token.logoURI,
                chainId: 43114,
              })
              addressesToFetch.push(token.address)
            }
          }
        })
      }

      // Fetch prices for all tokens
      if (addressesToFetch.length > 0) {
        setPricesLoading(true)
        try {
          const prices = await getTokenPrices(addressesToFetch)
          
          // Update tokens with prices and calculate values
          const tokensWithPrices = formattedTokens.map((token, index) => {
            const priceKey = index === 0 ? 'native' : token.address
            const priceData = prices[priceKey]
            
            if (priceData) {
              const balance = parseFloat(formatUnits(BigInt(token.balance), token.decimals))
              return {
                ...token,
                price: priceData.usd,
                value: balance * priceData.usd,
                priceChange24h: priceData.usd_24h_change,
              }
            }
            return token
          })
          
          setTokens(tokensWithPrices)
        } catch (error) {
          console.error('Failed to fetch prices:', error)
          // Set tokens without prices on error
          setTokens(formattedTokens)
        } finally {
          setPricesLoading(false)
        }
      } else {
        setTokens(formattedTokens)
      }
    }

    fetchTokenData()
    setIsLoading(avaxLoading || tokensLoading)
  }, [isConnected, address, chainId, avaxBalance, tokenBalances, avaxLoading, tokensLoading])

  return {
    tokens,
    isLoading: isLoading || pricesLoading,
    refetch: () => {
      // Trigger refetch logic if needed
      console.log('Refetching token balances...')
    },
  }
}

