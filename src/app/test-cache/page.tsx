'use client'

import { useState, useEffect } from 'react'
import { getTokenPrices } from '@/lib/prices'
import { priceCache } from '@/lib/cache'
import type { TokenPrice } from '@/types/portfolio'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Test page to demonstrate hybrid cache functionality with localStorage
 */
export default function TestCachePage() {
  const [fetchCount, setFetchCount] = useState(0)
  const [apiCallCount, setApiCallCount] = useState(0)
  const [cacheHitCount, setCacheHitCount] = useState(0)
  const [prices, setPrices] = useState<Record<string, TokenPrice> | null>(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [cacheStats, setCacheStats] = useState<ReturnType<typeof priceCache.getStats> | null>(null)
  const [sessionStartTime] = useState(Date.now())

  const testTokens = [
    { address: 'native', name: 'AVAX' },
    { address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', name: 'WAVAX' },
    { address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', name: 'USDC' },
  ]

  /**
   * Intercept fetch to count API calls
   */
  useEffect(() => {
    const originalFetch = window.fetch
    let localApiCount = 0

    window.fetch = async (...args) => {
      const url = args[0]
      if (typeof url === 'string' && url.includes('coingecko')) {
        localApiCount++
        setApiCallCount(localApiCount)
        addLog(`🌐 API CALL #${localApiCount}: ${url.substring(0, 60)}...`)
      }
      return originalFetch(...args)
    }

    // Check for existing cache on mount
    updateCacheStats()
    const stats = priceCache.getStats()
    if (stats.storageEntries > 0) {
      addLog(`📦 Found ${stats.storageEntries} cached items from previous session`)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 30))
  }

  const updateCacheStats = () => {
    const stats = priceCache.getStats()
    setCacheStats(stats)
    return stats
  }

  const fetchPrices = async () => {
    setLoading(true)
    const startTime = Date.now()
    setFetchCount((prev) => prev + 1)
    const currentFetch = fetchCount + 1

    try {
      addLog(`🔄 Fetch #${currentFetch} started`)

      // Check cache state before fetching
      const beforeStats = updateCacheStats()
      if (beforeStats.memoryEntries > 0 || beforeStats.storageEntries > 0) {
        setCacheHitCount(
          (prev) => prev + Math.max(beforeStats.memoryEntries, beforeStats.storageEntries)
        )
        addLog(
          `💾 Cache state: ${beforeStats.memoryEntries} in memory, ${beforeStats.storageEntries} in localStorage`
        )
      } else {
        addLog('❌ Cache is empty')
      }

      const addresses = testTokens.map((t) => t.address)
      const result = await getTokenPrices(addresses)
      setPrices(result)

      const duration = Date.now() - startTime
      addLog(`✅ Fetch #${currentFetch} completed in ${duration}ms`)

      // Check cache state after fetching
      const afterStats = updateCacheStats()
      addLog(
        `📊 Post-fetch: ${afterStats.memoryEntries} in memory, ${afterStats.storageEntries} in localStorage`
      )

      if (afterStats.storageSize > 0) {
        addLog(`💽 localStorage size: ${(afterStats.storageSize / 1024).toFixed(2)} KB`)
      }
    } catch (err) {
      addLog(`❌ ERROR: ${err instanceof Error ? err.message : 'Failed to fetch'}`)
    } finally {
      setLoading(false)
    }
  }

  const clearAllCache = () => {
    priceCache.clear()
    updateCacheStats()
    addLog('🗑️ All cache cleared (memory + localStorage)')
    setCacheHitCount(0)
  }

  const clearStorageOnly = () => {
    priceCache.clearStorage()
    updateCacheStats()
    addLog('🗑️ localStorage cleared (memory cache retained)')
  }

  const checkCacheStatus = () => {
    const stats = updateCacheStats()
    const cacheState = priceCache.getAll()
    const count = Object.keys(cacheState).length

    addLog(`📋 Cache status:`)
    addLog(`  Memory: ${stats.memoryEntries} items`)
    addLog(`  Storage: ${stats.storageEntries} items`)
    addLog(`  Storage size: ${(stats.storageSize / 1024).toFixed(2)} KB`)

    if (count > 0) {
      Object.entries(cacheState).forEach(([key, value]) => {
        addLog(`  • ${key}: $${value.usd?.toFixed(2)}`)
      })
    }
  }

  const formatUptime = () => {
    const seconds = Math.floor((Date.now() - sessionStartTime) / 1000)
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Hybrid Cache Testing (Memory + localStorage)</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls and Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Session Uptime:</span>
                  <span className="font-mono">{formatUptime()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fetch Button Clicks:</span>
                  <span className="font-mono">{fetchCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>API Calls Made:</span>
                  <span className="font-mono text-yellow-600">{apiCallCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cache Hits:</span>
                  <span className="font-mono text-green-600">{cacheHitCount}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Cache Efficiency:</span>
                  <span className="font-mono">
                    {fetchCount > 0
                      ? `${Math.round((1 - apiCallCount / (fetchCount * testTokens.length)) * 100)}%`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cache Storage Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Memory Entries:</span>
                  <span className="font-mono">{cacheStats?.memoryEntries || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>localStorage Entries:</span>
                  <span className="font-mono">{cacheStats?.storageEntries || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Size:</span>
                  <span className="font-mono">
                    {cacheStats?.storageSize
                      ? `${(cacheStats.storageSize / 1024).toFixed(2)} KB`
                      : '0 KB'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Storage Available:</span>
                  <span className="font-mono">
                    {cacheStats?.isStorageAvailable ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Only Mode:</span>
                  <span className="font-mono">{cacheStats?.isMemoryOnly ? '⚠️ Yes' : '✅ No'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={fetchPrices} disabled={loading} className="w-full">
                {loading ? 'Fetching...' : '🔄 Fetch Prices'}
              </Button>
              <Button onClick={checkCacheStatus} variant="outline" className="w-full">
                📋 Check Cache Status
              </Button>
              <Button onClick={clearStorageOnly} variant="outline" className="w-full">
                🗑️ Clear localStorage Only
              </Button>
              <Button onClick={clearAllCache} variant="destructive" className="w-full">
                💣 Clear All Cache
              </Button>
            </CardContent>
          </Card>

          {prices && (
            <Card>
              <CardHeader>
                <CardTitle>Current Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testTokens.map((token) => {
                    const price = prices[token.address]
                    return (
                      <div key={token.address} className="flex justify-between">
                        <span>{token.name}:</span>
                        <span className="font-mono">${price?.usd?.toFixed(4) || 'N/A'}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity Log */}
        <Card className="h-[700px]">
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 h-[600px] overflow-y-auto rounded border p-3">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">
                  No activity yet. Click &quot;Fetch Prices&quot; to start.
                </p>
              ) : (
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.includes('API CALL')
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : log.includes('ERROR')
                            ? 'text-red-600 dark:text-red-400'
                            : log.includes('localStorage') || log.includes('Cache')
                              ? 'text-green-600 dark:text-green-400'
                              : log.includes('cleared')
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-foreground/80'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Test Scenarios</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ol className="space-y-2 text-sm">
              <li>
                <strong>Test memory cache:</strong> Click &quot;Fetch Prices&quot; twice quickly.
                Second fetch should use cache (no API call).
              </li>
              <li>
                <strong>Test localStorage persistence:</strong>
                <ol className="mt-1 ml-4">
                  <li>Click &quot;Fetch Prices&quot; once</li>
                  <li>Refresh the page (F5)</li>
                  <li>Click &quot;Fetch Prices&quot; again</li>
                  <li>Should see &quot;Found X cached items from previous session&quot;</li>
                  <li>No API call if within 5 minutes!</li>
                </ol>
              </li>
              <li>
                <strong>Test cache expiry:</strong> Wait 5+ minutes after fetching, then fetch
                again. Should make new API call.
              </li>
              <li>
                <strong>Test cross-tab sync:</strong> Open this page in two tabs, fetch in one tab,
                then fetch in the other.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📚 How the Hybrid Cache Works</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Two-layer caching:</strong>
                <ul className="mt-1 ml-4">
                  <li>L1: Memory (Map) - Instant access within session</li>
                  <li>L2: localStorage - Persists across page refreshes</li>
                </ul>
              </li>
              <li>
                <strong>Smart features:</strong>
                <ul className="mt-1 ml-4">
                  <li>5-minute TTL for all entries</li>
                  <li>Debounced writes (500ms) to localStorage</li>
                  <li>Max 100 entries to prevent bloat</li>
                  <li>Cross-tab synchronization</li>
                  <li>Automatic fallback if localStorage fails</li>
                </ul>
              </li>
              <li>
                <strong>Performance:</strong>
                <ul className="mt-1 ml-4">
                  <li>Memory hits: ~0ms</li>
                  <li>localStorage hits: ~1-2ms</li>
                  <li>API calls: ~100-500ms</li>
                </ul>
              </li>
            </ul>
            <p className="bg-muted rounded-lg p-3 text-sm">
              <strong>💡 Key Insight:</strong> The cache now survives page refreshes! Your prices
              are stored in localStorage and automatically restored when you return.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
