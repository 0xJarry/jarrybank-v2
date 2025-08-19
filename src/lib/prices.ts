/**
 * Price fetching service using CoinGecko API
 */

import { TokenPrice, TokenPriceData } from '@/types/portfolio'
import { priceCache } from './cache'

// Map token addresses to CoinGecko IDs
const TOKEN_ID_MAP: Record<string, string> = {
  // Native AVAX
  native: 'avalanche-2',
  // WAVAX
  '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': 'avalanche-2',
  // USDC
  '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e': 'usd-coin',
  // USDT
  '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7': 'tether',
  // WETH.e
  '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab': 'ethereum',
  // WBTC.e
  '0x50b7545627a5162f82a992c33b87adc75187b218': 'bitcoin',
}

/**
 * Fetch prices from CoinGecko API
 */
async function fetchFromCoinGecko(ids: string[]): Promise<Record<string, TokenPrice>> {
  const uniqueIds = [...new Set(ids)]
  const idsParam = uniqueIds.join(',')

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()
    const result: Record<string, TokenPrice> = {}

    for (const id of uniqueIds) {
      if (data[id]) {
        result[id] = {
          usd: data[id].usd || 0,
          usd_24h_change: data[id].usd_24h_change || 0,
          last_updated_at: Date.now(),
        }
      }
    }

    return result
  } catch (error) {
    console.error('Error fetching prices from CoinGecko:', error)
    throw error
  }
}

/**
 * Get token prices with caching
 */
export async function getTokenPrices(addresses: string[]): Promise<TokenPriceData> {
  const result: TokenPriceData = {}
  const missingIds: string[] = []
  const addressToId: Record<string, string> = {}

  // Check cache first
  for (const address of addresses) {
    const normalizedAddress = address.toLowerCase()
    const cachedPrice = priceCache.get(normalizedAddress)

    if (cachedPrice) {
      result[address] = cachedPrice
    } else {
      const coinGeckoId = TOKEN_ID_MAP[normalizedAddress]
      if (coinGeckoId) {
        missingIds.push(coinGeckoId)
        addressToId[normalizedAddress] = coinGeckoId
      }
    }
  }

  // Fetch missing prices
  if (missingIds.length > 0) {
    try {
      const prices = await fetchFromCoinGecko(missingIds)

      // Map back to addresses and update cache
      for (const address of addresses) {
        const normalizedAddress = address.toLowerCase()
        const coinGeckoId = addressToId[normalizedAddress]

        if (coinGeckoId && prices[coinGeckoId]) {
          const price = prices[coinGeckoId]
          result[address] = price
          priceCache.set(normalizedAddress, price)
        }
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      // Return cached data or empty prices on error
    }
  }

  return result
}

/**
 * Get price for native token (AVAX)
 */
export async function getNativeTokenPrice(): Promise<TokenPrice | null> {
  try {
    const prices = await getTokenPrices(['native'])
    return prices['native'] || null
  } catch (error) {
    console.error('Failed to fetch native token price:', error)
    return null
  }
}