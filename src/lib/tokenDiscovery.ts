/**
 * Token Discovery Service
 * Uses Moralis or Covalent API for comprehensive token scanning
 * Fallback to manual contract queries
 * Cache discovered tokens per wallet
 */

import Moralis from 'moralis';
import { type Address } from 'viem';

/**
 * Token information structure
 */
export interface DiscoveredToken {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balanceFormatted: string;
  logo?: string;
  price?: number;
  value?: number;
  chain: string;
  lastUpdated: number;
}

/**
 * Discovery cache structure
 */
interface TokenDiscoveryCache {
  wallet: Address;
  tokens: DiscoveredToken[];
  timestamp: number;
}

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

// In-memory cache for discovered tokens
const discoveryCache = new Map<Address, TokenDiscoveryCache>();

/**
 * Initialize Moralis SDK
 * Uses free tier (10,000 requests/month)
 */
let moralisInitialized = false;

async function initializeMoralis() {
  if (moralisInitialized) return;
  
  try {
    // Initialize with API key from environment
    const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
    
    if (!apiKey) {
      console.warn('Moralis API key not found. Token discovery will use fallback methods.');
      return;
    }
    
    await Moralis.start({
      apiKey,
    });
    
    moralisInitialized = true;
    console.log('Moralis initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Moralis:', error);
  }
}

/**
 * Discover all tokens in a wallet using Moralis
 * @param walletAddress - The wallet address to scan
 * @param chainId - The chain ID to scan on
 * @returns Array of discovered tokens
 */
export async function discoverTokensWithMoralis(
  walletAddress: Address,
  chainId: number = 43114 // Avalanche C-Chain default
): Promise<DiscoveredToken[]> {
  try {
    await initializeMoralis();
    
    if (!moralisInitialized) {
      throw new Error('Moralis not initialized');
    }
    
    // Map chainId to Moralis chain format
    const chainMap: Record<number, string> = {
      1: '0x1', // Ethereum
      43114: '0xa86a', // Avalanche C-Chain
      137: '0x89', // Polygon
      56: '0x38', // BSC
      42161: '0xa4b1', // Arbitrum
      10: '0xa', // Optimism
    };
    
    const chain = chainMap[chainId];
    if (!chain) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    
    // Get token balances from Moralis
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address: walletAddress,
      chain,
    });
    
    interface MoralisTokenResponse {
      token_address: string;
      symbol?: string;
      name?: string;
      decimals?: number;
      balance?: string;
      balance_formatted?: string;
      logo?: string;
      thumbnail?: string;
      usd_price?: number;
      usd_value?: number;
    }
    
    const tokens: DiscoveredToken[] = response.toJSON().map((token: MoralisTokenResponse) => ({
      address: token.token_address as Address,
      symbol: token.symbol || 'UNKNOWN',
      name: token.name || 'Unknown Token',
      decimals: token.decimals || 18,
      balance: token.balance || '0',
      balanceFormatted: token.balance_formatted || '0',
      logo: token.logo || token.thumbnail,
      price: token.usd_price || 0,
      value: token.usd_value || 0,
      chain: chain,
      lastUpdated: Date.now(),
    }));
    
    return tokens;
  } catch (error) {
    console.error('Moralis token discovery failed:', error);
    throw error;
  }
}

/**
 * Fallback token discovery using manual contract queries
 * @param walletAddress - The wallet address to scan
 * @param chainId - The chain ID to scan on
 * @returns Array of discovered tokens
 */
export async function discoverTokensFallback(
  walletAddress: Address,
  chainId: number = 43114
): Promise<DiscoveredToken[]> {
  // This would use direct contract calls via wagmi/viem
  // For now, return empty array as this is a fallback
  console.warn('Using fallback token discovery (limited functionality)');
  
  // Known token list for Avalanche (can be expanded)
  const knownTokens = [
    { address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', symbol: 'WAVAX', name: 'Wrapped AVAX' },
    { address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', symbol: 'USDT', name: 'Tether USD' },
    { address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', symbol: 'USDC', name: 'USD Coin' },
    { address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', symbol: 'DAI', name: 'Dai Stablecoin' },
    { address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', symbol: 'WETH.e', name: 'Wrapped Ether' },
  ];
  
  // In a real implementation, we would query each token contract
  // to get the actual balance for the wallet
  return knownTokens.map(token => ({
    ...token,
    address: token.address as Address,
    decimals: 18,
    balance: '0',
    balanceFormatted: '0',
    chain: chainId.toString(),
    lastUpdated: Date.now(),
  }));
}

/**
 * Main token discovery function with caching
 * @param walletAddress - The wallet address to scan
 * @param chainId - The chain ID to scan on
 * @param forceRefresh - Force refresh the cache
 * @returns Array of discovered tokens
 */
export async function discoverTokens(
  walletAddress: Address,
  chainId: number = 43114,
  forceRefresh: boolean = false
): Promise<DiscoveredToken[]> {
  // Check cache first
  if (!forceRefresh) {
    const cached = discoveryCache.get(walletAddress);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Returning cached token discovery');
      return cached.tokens;
    }
  }
  
  try {
    // Try Moralis first
    const tokens = await discoverTokensWithMoralis(walletAddress, chainId);
    
    // Update cache
    discoveryCache.set(walletAddress, {
      wallet: walletAddress,
      tokens,
      timestamp: Date.now(),
    });
    
    return tokens;
  } catch (error) {
    console.error('Primary token discovery failed, using fallback:', error);
    
    // Use fallback method
    const tokens = await discoverTokensFallback(walletAddress, chainId);
    
    // Still cache the fallback results
    discoveryCache.set(walletAddress, {
      wallet: walletAddress,
      tokens,
      timestamp: Date.now(),
    });
    
    return tokens;
  }
}

/**
 * Clear token discovery cache for a specific wallet
 * @param walletAddress - The wallet address to clear cache for
 */
export function clearTokenCache(walletAddress: Address) {
  discoveryCache.delete(walletAddress);
}

/**
 * Clear entire token discovery cache
 */
export function clearAllTokenCache() {
  discoveryCache.clear();
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus() {
  return {
    entries: discoveryCache.size,
    wallets: Array.from(discoveryCache.keys()),
  };
}