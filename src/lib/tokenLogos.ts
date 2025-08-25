/**
 * Token Logo Service
 * Primary: CoinGecko logos
 * Fallback: TrustWallet token list
 * Generate identicons for unknown tokens
 */

import { type Address } from 'viem';

/**
 * Logo source configuration
 */
interface LogoSource {
  name: string;
  getUrl: (address: Address, chainId?: string) => string;
  priority: number;
}

/**
 * Cache for resolved logos
 */
const logoCache = new Map<string, string>();

/**
 * Logo sources in priority order
 */
const LOGO_SOURCES: LogoSource[] = [
  {
    name: 'TraderJoe',
    priority: 1,
    getUrl: (address: Address) => 
      `https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/${address}/logo.png`,
  },
  {
    name: 'TrustWallet',
    priority: 2,
    getUrl: (address: Address, chainId?: string) => {
      const chainMap: Record<string, string> = {
        '1': 'ethereum',
        '56': 'smartchain',
        '137': 'polygon',
        '43114': 'avalanchec',
        '42161': 'arbitrum',
        '10': 'optimism',
      };
      const chain = chainId ? chainMap[chainId] || 'ethereum' : 'ethereum';
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chain}/assets/${address}/logo.png`;
    },
  },
  {
    name: 'CoinGecko',
    priority: 3,
    getUrl: (address: Address) => 
      `https://assets.coingecko.com/coins/images/${address}/large.png`,
  },
];

/**
 * Fallback identicon colors
 */
const IDENTICON_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#FD79A8', '#A29BFE', '#6C5CE7', '#00B894', '#FDCB6E',
  '#E17055', '#74B9FF', '#A29BFE', '#55A3FF', '#FD79A8',
];

/**
 * Generate a deterministic color based on address
 */
function getColorFromAddress(address: Address): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % IDENTICON_COLORS.length;
  return IDENTICON_COLORS[index];
}

/**
 * Generate identicon SVG for unknown tokens
 */
export function generateIdenticon(address: Address, symbol?: string): string {
  const color = getColorFromAddress(address);
  const letter = symbol ? symbol[0].toUpperCase() : '?';
  
  const svg = `
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="${color}"/>
      <text x="24" y="24" font-family="Arial, sans-serif" font-size="20" font-weight="bold" 
            fill="white" text-anchor="middle" dominant-baseline="middle">
        ${letter}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Check if image URL is valid
 */
async function isImageValid(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 3 seconds
    setTimeout(() => resolve(false), 3000);
  });
}

/**
 * Get token logo with fallback chain
 */
export async function getTokenLogo(
  address: Address,
  chainId?: string,
  symbol?: string
): Promise<string> {
  // Check cache first
  const cacheKey = `${chainId}:${address.toLowerCase()}`;
  const cached = logoCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Try each source in priority order
  for (const source of LOGO_SOURCES) {
    try {
      const url = source.getUrl(address, chainId);
      const isValid = await isImageValid(url);
      
      if (isValid) {
        logoCache.set(cacheKey, url);
        return url;
      }
    } catch (error) {
      console.debug(`Logo source ${source.name} failed for ${address}:`, error);
    }
  }
  
  // Generate identicon as fallback
  const identicon = generateIdenticon(address, symbol);
  logoCache.set(cacheKey, identicon);
  return identicon;
}

/**
 * Get token logo synchronously (returns identicon immediately if not cached)
 */
export function getTokenLogoSync(
  address: Address,
  chainId?: string,
  symbol?: string
): string {
  const cacheKey = `${chainId}:${address.toLowerCase()}`;
  const cached = logoCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  // Return identicon immediately, but trigger async fetch
  const identicon = generateIdenticon(address, symbol);
  
  // Trigger async fetch in background
  getTokenLogo(address, chainId, symbol).catch(() => {
    // Silent fail, identicon is already returned
  });
  
  return identicon;
}

/**
 * Preload logos for multiple tokens
 */
export async function preloadTokenLogos(
  tokens: Array<{ address: Address; chainId?: string; symbol?: string }>
): Promise<void> {
  const promises = tokens.map(token =>
    getTokenLogo(token.address, token.chainId, token.symbol).catch(() => {
      // Silent fail for individual tokens
    })
  );
  
  await Promise.all(promises);
}

/**
 * Clear logo cache
 */
export function clearLogoCache(): void {
  logoCache.clear();
}

/**
 * Get cache statistics
 */
export function getLogoCacheStats() {
  return {
    size: logoCache.size,
    entries: Array.from(logoCache.keys()),
  };
}

/**
 * Common token logo overrides (for known issues)
 */
const LOGO_OVERRIDES: Record<string, string> = {
  // Avalanche WAVAX
  '43114:0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': 
    'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png',
  // Avalanche USDC
  '43114:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e':
    'https://raw.githubusercontent.com/traderjoe-xyz/joe-tokenlists/main/logos/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E/logo.png',
};

/**
 * Get logo with manual overrides
 */
export async function getTokenLogoWithOverrides(
  address: Address,
  chainId?: string,
  symbol?: string
): Promise<string> {
  const overrideKey = `${chainId}:${address.toLowerCase()}`;
  const override = LOGO_OVERRIDES[overrideKey];
  
  if (override) {
    logoCache.set(overrideKey, override);
    return override;
  }
  
  return getTokenLogo(address, chainId, symbol);
}