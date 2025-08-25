/**
 * TokenLogo Smart Component
 * Displays token logo with automatic fallbacks
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { type Address } from 'viem';
import { getTokenLogoWithOverrides, getTokenLogoSync, generateIdenticon } from '@/lib/tokenLogos';
import { cn } from '@/lib/utils';

/**
 * Component props
 */
interface TokenLogoProps {
  address: Address;
  symbol?: string;
  chainId?: string;
  size?: number;
  className?: string;
  fallbackClassName?: string;
}

/**
 * TokenLogo component
 */
export function TokenLogo({
  address,
  symbol,
  chainId,
  size = 32,
  className,
  fallbackClassName,
}: TokenLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  /**
   * Load token logo
   */
  useEffect(() => {
    // Get sync logo immediately (identicon if not cached)
    const syncLogo = getTokenLogoSync(address, chainId, symbol);
    setLogoUrl(syncLogo);
    setIsLoading(true);
    setHasError(false);

    // Then fetch the real logo async
    getTokenLogoWithOverrides(address, chainId, symbol)
      .then(url => {
        if (url !== syncLogo) {
          setLogoUrl(url);
        }
        setIsLoading(false);
      })
      .catch(() => {
        // Keep the identicon on error
        setIsLoading(false);
        setHasError(true);
      });
  }, [address, chainId, symbol]);

  /**
   * Handle image load error
   */
  const handleImageError = () => {
    setHasError(true);
    // Generate identicon as fallback
    const identicon = generateIdenticon(address, symbol);
    setLogoUrl(identicon);
  };

  /**
   * Render identicon fallback
   */
  const renderFallback = () => {
    const letter = symbol ? symbol[0].toUpperCase() : '?';
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10',
          fallbackClassName
        )}
        style={{ width: size, height: size }}
      >
        <span className="font-semibold text-primary" style={{ fontSize: size * 0.4 }}>
          {letter}
        </span>
      </div>
    );
  };

  // If logo is a data URL (identicon), render it directly
  if (logoUrl.startsWith('data:')) {
    return (
      <img
        src={logoUrl}
        alt={symbol || 'Token'}
        width={size}
        height={size}
        className={cn('rounded-full', className)}
      />
    );
  }

  // If we have an error or no URL, show fallback
  if (hasError || !logoUrl) {
    return renderFallback();
  }

  // Render the logo with Next.js Image component
  return (
    <div className={cn('relative overflow-hidden rounded-full', className)} style={{ width: size, height: size }}>
      <Image
        src={logoUrl}
        alt={symbol || 'Token'}
        width={size}
        height={size}
        className="object-cover"
        onError={handleImageError}
        unoptimized // External URLs need unoptimized flag
      />
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted/50" />
      )}
    </div>
  );
}