/**
 * Token Registry
 * Maintains list of known tokens with metadata
 * Supports custom token addition by contract address
 * Stores user's custom tokens in localStorage
 */

import { type Address } from 'viem';
import { type DiscoveredToken } from './tokenDiscovery';

/**
 * Token metadata structure
 */
export interface TokenMetadata {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
  coingeckoId?: string;
  isCustom?: boolean;
  addedAt?: number;
  verified?: boolean;
  chain: string;
}

/**
 * Registry storage structure
 */
interface TokenRegistryStorage {
  customTokens: TokenMetadata[];
  hiddenTokens: Address[];
  favoriteTokens: Address[];
  lastUpdated: number;
}

// Storage keys
const STORAGE_KEY = 'jarrybank_token_registry';
const KNOWN_TOKENS_KEY = 'jarrybank_known_tokens';

/**
 * Known tokens database (can be expanded with more chains)
 */
const KNOWN_TOKENS: Record<string, TokenMetadata[]> = {
  // Avalanche C-Chain tokens
  '43114': [
    {
      address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      symbol: 'WAVAX',
      name: 'Wrapped AVAX',
      decimals: 18,
      logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png',
      coingeckoId: 'wrapped-avax',
      verified: true,
      chain: '43114',
    },
    {
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
      symbol: 'USDt',
      name: 'Tether USD',
      decimals: 6,
      logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7/logo.png',
      coingeckoId: 'tether',
      verified: true,
      chain: '43114',
    },
    {
      address: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E/logo.png',
      coingeckoId: 'usd-coin',
      verified: true,
      chain: '43114',
    },
    {
      address: '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
      symbol: 'DAI.e',
      name: 'Dai Stablecoin',
      decimals: 18,
      logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70/logo.png',
      coingeckoId: 'dai',
      verified: true,
      chain: '43114',
    },
    {
      address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
      symbol: 'WETH.e',
      name: 'Wrapped Ether',
      decimals: 18,
      logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB/logo.png',
      coingeckoId: 'weth',
      verified: true,
      chain: '43114',
    },
    {
      address: '0x50b7545627a5162F82A992c33b87aDc75187B218',
      symbol: 'WBTC.e',
      name: 'Wrapped BTC',
      decimals: 8,
      logo: 'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0x50b7545627a5162F82A992c33b87aDc75187B218/logo.png',
      coingeckoId: 'wrapped-bitcoin',
      verified: true,
      chain: '43114',
    },
  ],
  // Ethereum mainnet tokens (for future expansion)
  '1': [
    {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      coingeckoId: 'weth',
      verified: true,
      chain: '1',
    },
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      coingeckoId: 'usd-coin',
      verified: true,
      chain: '1',
    },
  ],
};

/**
 * Token Registry class
 */
class TokenRegistry {
  private storage: TokenRegistryStorage;
  private knownTokens: Map<string, TokenMetadata>;

  constructor() {
    this.storage = this.loadFromStorage();
    this.knownTokens = this.initializeKnownTokens();
  }

  /**
   * Initialize known tokens map
   */
  private initializeKnownTokens(): Map<string, TokenMetadata> {
    const map = new Map<string, TokenMetadata>();
    
    Object.values(KNOWN_TOKENS).forEach(tokens => {
      tokens.forEach(token => {
        const key = `${token.chain}:${token.address.toLowerCase()}`;
        map.set(key, token);
      });
    });
    
    // Add custom tokens from storage
    this.storage.customTokens.forEach(token => {
      const key = `${token.chain}:${token.address.toLowerCase()}`;
      map.set(key, token);
    });
    
    return map;
  }

  /**
   * Load registry from localStorage
   */
  private loadFromStorage(): TokenRegistryStorage {
    if (typeof window === 'undefined') {
      return this.getDefaultStorage();
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load token registry from storage:', error);
    }
    
    return this.getDefaultStorage();
  }

  /**
   * Get default storage structure
   */
  private getDefaultStorage(): TokenRegistryStorage {
    return {
      customTokens: [],
      hiddenTokens: [],
      favoriteTokens: [],
      lastUpdated: Date.now(),
    };
  }

  /**
   * Save registry to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      this.storage.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.storage));
    } catch (error) {
      console.error('Failed to save token registry to storage:', error);
    }
  }

  /**
   * Get token metadata by address and chain
   */
  public getToken(address: Address, chainId: string): TokenMetadata | undefined {
    const key = `${chainId}:${address.toLowerCase()}`;
    return this.knownTokens.get(key);
  }

  /**
   * Add custom token to registry
   */
  public async addCustomToken(token: TokenMetadata): Promise<void> {
    // Validate token data
    if (!token.address || !token.symbol || !token.name) {
      throw new Error('Invalid token data: address, symbol, and name are required');
    }
    
    // Mark as custom and add timestamp
    token.isCustom = true;
    token.addedAt = Date.now();
    
    // Check if token already exists
    const key = `${token.chain}:${token.address.toLowerCase()}`;
    if (this.knownTokens.has(key) && !this.knownTokens.get(key)?.isCustom) {
      throw new Error('Token already exists in registry');
    }
    
    // Add to storage and map
    this.storage.customTokens = this.storage.customTokens.filter(
      t => !(t.address.toLowerCase() === token.address.toLowerCase() && t.chain === token.chain)
    );
    this.storage.customTokens.push(token);
    this.knownTokens.set(key, token);
    
    // Save to localStorage
    this.saveToStorage();
  }

  /**
   * Remove custom token from registry
   */
  public removeCustomToken(address: Address, chainId: string): void {
    const key = `${chainId}:${address.toLowerCase()}`;
    const token = this.knownTokens.get(key);
    
    if (!token?.isCustom) {
      throw new Error('Cannot remove non-custom token');
    }
    
    // Remove from storage and map
    this.storage.customTokens = this.storage.customTokens.filter(
      t => !(t.address.toLowerCase() === address.toLowerCase() && t.chain === chainId)
    );
    this.knownTokens.delete(key);
    
    // Save to localStorage
    this.saveToStorage();
  }

  /**
   * Hide token from display
   */
  public hideToken(address: Address): void {
    if (!this.storage.hiddenTokens.includes(address)) {
      this.storage.hiddenTokens.push(address);
      this.saveToStorage();
    }
  }

  /**
   * Unhide token
   */
  public unhideToken(address: Address): void {
    this.storage.hiddenTokens = this.storage.hiddenTokens.filter(
      a => a.toLowerCase() !== address.toLowerCase()
    );
    this.saveToStorage();
  }

  /**
   * Check if token is hidden
   */
  public isHidden(address: Address): boolean {
    return this.storage.hiddenTokens.some(
      a => a.toLowerCase() === address.toLowerCase()
    );
  }

  /**
   * Add token to favorites
   */
  public addFavorite(address: Address): void {
    if (!this.storage.favoriteTokens.includes(address)) {
      this.storage.favoriteTokens.push(address);
      this.saveToStorage();
    }
  }

  /**
   * Remove token from favorites
   */
  public removeFavorite(address: Address): void {
    this.storage.favoriteTokens = this.storage.favoriteTokens.filter(
      a => a.toLowerCase() !== address.toLowerCase()
    );
    this.saveToStorage();
  }

  /**
   * Check if token is favorite
   */
  public isFavorite(address: Address): boolean {
    return this.storage.favoriteTokens.some(
      a => a.toLowerCase() === address.toLowerCase()
    );
  }

  /**
   * Get all custom tokens
   */
  public getCustomTokens(): TokenMetadata[] {
    return [...this.storage.customTokens];
  }

  /**
   * Get all known tokens for a chain
   */
  public getKnownTokensForChain(chainId: string): TokenMetadata[] {
    const tokens: TokenMetadata[] = [];
    
    this.knownTokens.forEach(token => {
      if (token.chain === chainId) {
        tokens.push(token);
      }
    });
    
    return tokens;
  }

  /**
   * Search tokens by symbol or name
   */
  public searchTokens(query: string, chainId?: string): TokenMetadata[] {
    const lowerQuery = query.toLowerCase();
    const results: TokenMetadata[] = [];
    
    this.knownTokens.forEach(token => {
      if (chainId && token.chain !== chainId) return;
      
      if (
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.name.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
      ) {
        results.push(token);
      }
    });
    
    return results;
  }

  /**
   * Merge discovered tokens with registry metadata
   */
  public enrichTokens(discoveredTokens: DiscoveredToken[]): DiscoveredToken[] {
    return discoveredTokens.map(token => {
      const metadata = this.getToken(token.address, token.chain);
      
      if (metadata) {
        return {
          ...token,
          symbol: metadata.symbol || token.symbol,
          name: metadata.name || token.name,
          decimals: metadata.decimals || token.decimals,
          logo: metadata.logo || token.logo,
        };
      }
      
      return token;
    });
  }

  /**
   * Clear all custom tokens
   */
  public clearCustomTokens(): void {
    this.storage.customTokens = [];
    this.knownTokens = this.initializeKnownTokens();
    this.saveToStorage();
  }

  /**
   * Export registry data
   */
  public exportData(): TokenRegistryStorage {
    return { ...this.storage };
  }

  /**
   * Import registry data
   */
  public importData(data: TokenRegistryStorage): void {
    this.storage = { ...data };
    this.knownTokens = this.initializeKnownTokens();
    this.saveToStorage();
  }
}

// Create singleton instance
const tokenRegistry = new TokenRegistry();

export default tokenRegistry;