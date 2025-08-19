/**
 * Types for portfolio data structures
 */

export interface TokenPrice {
  usd: number
  usd_24h_change?: number
  last_updated_at?: number
}

export interface TokenPriceData {
  [address: string]: TokenPrice
}

export interface TokenBalance {
  address: string
  symbol: string
  name: string
  balance: bigint
  decimals: number
  price?: TokenPrice
  value?: number // USD value
  logo?: string
}

export interface PriceCacheEntry {
  data: TokenPrice
  timestamp: number
}

export interface PriceCache {
  [key: string]: PriceCacheEntry
}