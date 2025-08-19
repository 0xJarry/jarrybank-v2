'use client'

import { usePortfolioStore } from '@/store/portfolioStore'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { RefreshCw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PortfolioPerformanceChart } from './PortfolioPerformanceChart'
import { formatUnits } from 'viem'

/**
 * Portfolio overview component displaying token balances and total value
 * Shows aggregated portfolio information with refresh functionality
 */
export function PortfolioOverview() {
  const { totalValue, lastUpdated, tokens, isLoading, isConnected } = usePortfolioStore()
  const [timeAgo, setTimeAgo] = useState<string>('')

  // Calculate total portfolio 24h change
  const totalValueChange = tokens.reduce((acc, token) => {
    if (token.priceChange24h && token.value) {
      return acc + (token.value * token.priceChange24h) / 100
    }
    return acc
  }, 0)
  const totalValueChangePercent = totalValue > 0 ? (totalValueChange / totalValue) * 100 : 0

  // Update time ago display
  useEffect(() => {
    if (lastUpdated) {
      const updateTimeAgo = () => {
        const seconds = Math.floor((Date.now() - lastUpdated) / 1000)
        if (seconds < 60) {
          setTimeAgo(`${seconds}s ago`)
        } else if (seconds < 3600) {
          setTimeAgo(`${Math.floor(seconds / 60)}m ago`)
        } else {
          setTimeAgo(`${Math.floor(seconds / 3600)}h ago`)
        }
      }

      updateTimeAgo()
      const interval = setInterval(updateTimeAgo, 1000)
      return () => clearInterval(interval)
    }
  }, [lastUpdated])

  // Use real tokens if connected, otherwise show mock data for demo
  const displayTokens =
    isConnected && tokens.length > 0
      ? tokens
      : [
          {
            address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
            symbol: 'WAVAX',
            name: 'Wrapped AVAX',
            decimals: 18,
            balance: '1000000000000000000',
            price: 25.5,
            value: 25.5,
            logoURI: '/api/placeholder/32/32',
            chainId: 43114,
          },
          {
            address: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
            symbol: 'WETH.e',
            name: 'Wrapped Ether',
            decimals: 18,
            balance: '500000000000000000',
            price: 3200.0,
            value: 1600.0,
            logoURI: '/api/placeholder/32/32',
            chainId: 43114,
          },
        ]

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards - matches image layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Portfolio Value */}
        <Card className="bg-card border-border hover:bg-muted shadow-sm transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground text-lg font-semibold">
                Total Value
              </CardTitle>
              <DollarSign className="text-primary h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-card-foreground mb-2 text-3xl font-bold">
              {formatCurrency(totalValue || 0)}
            </div>
            <div
              className={`flex items-center text-sm ${
                totalValueChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {totalValueChangePercent >= 0 ? (
                <TrendingUp className="mr-1 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4" />
              )}
              <span>
                {totalValueChangePercent >= 0 ? '+' : ''}
                {totalValueChangePercent.toFixed(2)}% (24h)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Token Count */}
        <Card className="bg-card border-border hover:bg-muted shadow-sm transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground text-lg font-semibold">Tokens</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-card-foreground mb-2 text-3xl font-bold">
              {displayTokens.length}
            </div>
            <div className="text-muted-foreground text-sm">
              Across {displayTokens.length} different assets
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <Card className="bg-card border-border hover:bg-muted shadow-sm transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground text-lg font-semibold">
                Last Updated
              </CardTitle>
              <RefreshCw className="text-primary hover:text-primary/80 h-5 w-5 cursor-pointer transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-card-foreground mb-2 text-3xl font-bold">
              {timeAgo || '14m ago'}
            </div>
            <div className="text-primary cursor-pointer text-sm hover:underline">Refresh now</div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <PortfolioPerformanceChart />

      {/* Token Balances Table - matches image exactly */}
      <div className="space-y-4">
        <h3 className="text-foreground text-xl font-semibold">Token Balances</h3>

        {/* Table Header */}
        <div className="bg-card border-border overflow-hidden rounded-xl border">
          <div className="bg-muted/50 border-border text-muted-foreground grid grid-cols-5 gap-4 border-b p-4 text-sm font-medium">
            <div>TOKEN</div>
            <div>BALANCE</div>
            <div>PRICE</div>
            <div>VALUE</div>
            <div>CHANGE</div>
          </div>

          {/* Table Rows */}
          {isLoading ? (
            <div className="text-muted-foreground p-8 text-center">Loading token balances...</div>
          ) : displayTokens.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center">
              No tokens found. Connect your wallet to see your balances.
            </div>
          ) : (
            displayTokens.map((token) => (
              <div
                key={token.address}
                className="border-border hover:bg-muted grid grid-cols-5 gap-4 border-b p-4 transition-colors last:border-b-0"
              >
                {/* Token Column */}
                <div className="flex items-center space-x-3">
                  <div className="from-primary/20 to-primary/10 border-border flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-br">
                    <span className="text-primary text-xs font-bold">
                      {token.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="text-card-foreground font-semibold">{token.symbol}</div>
                    <div className="text-muted-foreground font-mono text-xs">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </div>
                  </div>
                </div>

                {/* Balance Column */}
                <div className="flex items-center">
                  <div className="text-card-foreground font-medium">
                    {formatNumber(
                      parseFloat(formatUnits(BigInt(token.balance), token.decimals)),
                      4
                    )}
                  </div>
                </div>

                {/* Price Column */}
                <div className="flex items-center">
                  <div className="text-card-foreground font-medium">
                    {formatCurrency(token.price)}
                  </div>
                </div>

                {/* Value Column */}
                <div className="flex items-center">
                  <div className="text-card-foreground font-medium">
                    {formatCurrency(token.value)}
                  </div>
                </div>

                {/* Change Column */}
                <div className="flex items-center">
                  <div
                    className={`text-sm font-medium ${
                      token.priceChange24h && token.priceChange24h >= 0
                        ? 'text-green-500'
                        : token.priceChange24h
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {token.priceChange24h !== undefined ? (
                      <>
                        {token.priceChange24h >= 0 ? '+' : ''}
                        {token.priceChange24h.toFixed(2)}%
                      </>
                    ) : (
                      '--'
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
