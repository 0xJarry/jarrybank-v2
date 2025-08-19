'use client'

import { useState } from 'react'
import { getTokenPrices } from '@/lib/prices'
import type { TokenPrice } from '@/types/portfolio'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Test page for price fetching functionality
 */
export default function TestPricesPage() {
  const [prices, setPrices] = useState<Record<string, TokenPrice> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testTokens = [
    { address: 'native', name: 'AVAX' },
    { address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', name: 'WAVAX' },
    { address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', name: 'USDC' },
    { address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7', name: 'USDT' },
    { address: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', name: 'WETH.e' },
    { address: '0x50b7545627a5162f82a992c33b87adc75187b218', name: 'WBTC.e' },
  ]

  const fetchPrices = async () => {
    setLoading(true)
    setError(null)
    try {
      const addresses = testTokens.map((t) => t.address)
      const result = await getTokenPrices(addresses)
      setPrices(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Price API Test</h1>

      <div className="space-y-6">
        <Button onClick={fetchPrices} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Prices'}
        </Button>

        {error && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {prices && (
          <Card>
            <CardHeader>
              <CardTitle>Token Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testTokens.map((token) => {
                  const price = prices[token.address]
                  return (
                    <div key={token.address} className="border-b pb-2">
                      <div className="font-semibold">{token.name}</div>
                      {price ? (
                        <div className="text-sm">
                          <div>Price: ${price.usd?.toFixed(4) || 'N/A'}</div>
                          <div
                            className={
                              price.usd_24h_change && price.usd_24h_change >= 0
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            24h Change: {price.usd_24h_change?.toFixed(2) || 'N/A'}%
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">No price data</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}