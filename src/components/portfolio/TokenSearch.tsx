/**
 * TokenSearch Component
 * Search and filter tokens in the portfolio
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, X, Star, Eye, EyeOff } from 'lucide-react';
import { type DiscoveredToken } from '@/lib/tokenDiscovery';
import tokenRegistry from '@/lib/tokenRegistry';
import { cn } from '@/lib/utils';

/**
 * Component props
 */
interface TokenSearchProps {
  tokens: DiscoveredToken[];
  onTokenSelect?: (token: DiscoveredToken) => void;
  onFilterChange?: (filteredTokens: DiscoveredToken[]) => void;
  className?: string;
}

/**
 * Filter options
 */
type FilterOption = 'all' | 'favorites' | 'hidden' | 'custom';

/**
 * TokenSearch component
 */
export function TokenSearch({
  tokens,
  onTokenSelect,
  onFilterChange,
  className,
}: TokenSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOption, setFilterOption] = useState<FilterOption>('all');
  const [showHidden, setShowHidden] = useState(false);

  /**
   * Filter tokens based on search and filter options
   */
  const filteredTokens = useMemo(() => {
    let filtered = tokens;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        token =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.address.toLowerCase().includes(query)
      );
    }

    // Apply filter options
    switch (filterOption) {
      case 'favorites':
        filtered = filtered.filter(token =>
          tokenRegistry.isFavorite(token.address)
        );
        break;
      case 'hidden':
        filtered = filtered.filter(token =>
          tokenRegistry.isHidden(token.address)
        );
        break;
      case 'custom':
        filtered = filtered.filter(token => {
          const metadata = tokenRegistry.getToken(token.address, token.chain);
          return metadata?.isCustom === true;
        });
        break;
      default:
        // For 'all', exclude hidden unless explicitly showing
        if (!showHidden) {
          filtered = filtered.filter(
            token => !tokenRegistry.isHidden(token.address)
          );
        }
    }

    return filtered;
  }, [tokens, searchQuery, filterOption, showHidden]);

  /**
   * Handle filter change
   */
  const handleFilterChange = useCallback(
    (newFilter: FilterOption) => {
      setFilterOption(newFilter);
      if (onFilterChange) {
        onFilterChange(filteredTokens);
      }
    },
    [filteredTokens, onFilterChange]
  );

  /**
   * Clear search
   */
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback((token: DiscoveredToken, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tokenRegistry.isFavorite(token.address)) {
      tokenRegistry.removeFavorite(token.address);
    } else {
      tokenRegistry.addFavorite(token.address);
    }
    // Force re-render
    setSearchQuery(searchQuery + ' ');
    setSearchQuery(searchQuery);
  }, [searchQuery]);

  /**
   * Toggle hidden status
   */
  const toggleHidden = useCallback((token: DiscoveredToken, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tokenRegistry.isHidden(token.address)) {
      tokenRegistry.unhideToken(token.address);
    } else {
      tokenRegistry.hideToken(token.address);
    }
    // Force re-render
    setSearchQuery(searchQuery + ' ');
    setSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tokens by name, symbol, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border bg-background py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            filterOption === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          )}
        >
          All Tokens ({tokens.length})
        </button>
        <button
          onClick={() => handleFilterChange('favorites')}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            filterOption === 'favorites'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          )}
        >
          <Star className="mr-1 inline h-3 w-3" />
          Favorites
        </button>
        <button
          onClick={() => handleFilterChange('custom')}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            filterOption === 'custom'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          )}
        >
          Custom Tokens
        </button>
        <button
          onClick={() => setShowHidden(!showHidden)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            showHidden
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          )}
        >
          {showHidden ? (
            <>
              <Eye className="mr-1 inline h-3 w-3" />
              Show Hidden
            </>
          ) : (
            <>
              <EyeOff className="mr-1 inline h-3 w-3" />
              Hide Hidden
            </>
          )}
        </button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredTokens.length === tokens.length
          ? `Showing all ${tokens.length} tokens`
          : `Showing ${filteredTokens.length} of ${tokens.length} tokens`}
      </div>

      {/* Token List */}
      <div className="space-y-2">
        {filteredTokens.slice(0, 20).map((token) => (
          <div
            key={`${token.chain}:${token.address}`}
            onClick={() => onTokenSelect?.(token)}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-medium">{token.symbol}</span>
                <span className="text-xs text-muted-foreground">{token.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {token.balanceFormatted} {token.symbol}
              </span>
              {token.value && (
                <span className="text-sm text-muted-foreground">
                  ${token.value.toFixed(2)}
                </span>
              )}
              <button
                onClick={(e) => toggleFavorite(token, e)}
                className="p-1 hover:bg-muted rounded"
              >
                <Star
                  className={cn(
                    'h-4 w-4',
                    tokenRegistry.isFavorite(token.address)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-muted-foreground'
                  )}
                />
              </button>
              <button
                onClick={(e) => toggleHidden(token, e)}
                className="p-1 hover:bg-muted rounded"
              >
                {tokenRegistry.isHidden(token.address) ? (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        ))}
        {filteredTokens.length > 20 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing first 20 results. Refine your search to see more.
          </div>
        )}
        {filteredTokens.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            No tokens found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}