/**
 * Hybrid cache with memory (L1) and localStorage (L2) support
 * Provides persistence across page refreshes while maintaining fast memory access
 */

import { TokenPrice } from '@/types/portfolio'

interface CacheEntry {
  data: TokenPrice
  timestamp: number
}

interface StorageData {
  version: number
  data: Record<string, CacheEntry>
}

/**
 * HybridCache combines in-memory caching with localStorage persistence
 * - L1: Memory cache for instant access within session
 * - L2: localStorage for persistence across page refreshes
 */
class HybridCache {
  private memCache: Map<string, CacheEntry> = new Map()
  private ttl: number
  private STORAGE_KEY = 'jarrybank_price_cache_v1'
  private CURRENT_VERSION = 1
  private MAX_ENTRIES = 100
  private syncTimer: NodeJS.Timeout | null = null
  private isClient: boolean
  private hasStorage: boolean
  private useMemoryOnly: boolean = false

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000 // Convert to milliseconds
    
    // Check if we're in a browser environment with localStorage
    this.isClient = typeof window !== 'undefined'
    this.hasStorage = this.isClient && 'localStorage' in window
    
    // Hydrate memory cache from localStorage on initialization
    if (this.hasStorage) {
      this.hydrate()
      this.setupStorageListener()
    }
  }

  /**
   * Get item from cache (checks memory first, then localStorage)
   */
  get(key: string): TokenPrice | null {
    const now = Date.now()
    
    // 1. Check memory cache first (fastest)
    const memEntry = this.memCache.get(key)
    if (memEntry && !this.isExpired(memEntry, now)) {
      return memEntry.data
    }
    
    // 2. Check localStorage if not in memory
    if (this.hasStorage && !this.useMemoryOnly) {
      const stored = this.getFromStorage()
      const storageEntry = stored.data[key]
      
      if (storageEntry && !this.isExpired(storageEntry, now)) {
        // Promote to memory cache for faster subsequent access
        this.memCache.set(key, storageEntry)
        return storageEntry.data
      }
    }
    
    return null
  }

  /**
   * Set item in cache (both memory and localStorage)
   */
  set(key: string, data: TokenPrice): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    }
    
    // Update memory cache
    this.memCache.set(key, entry)
    
    // Schedule localStorage sync (debounced)
    if (this.hasStorage && !this.useMemoryOnly) {
      this.scheduleSyncToStorage()
    }
  }

  /**
   * Clear all cache entries (both memory and localStorage)
   */
  clear(): void {
    this.memCache.clear()
    
    if (this.hasStorage && !this.useMemoryOnly) {
      try {
        localStorage.removeItem(this.STORAGE_KEY)
      } catch (e) {
        console.warn('Failed to clear localStorage:', e)
      }
    }
  }

  /**
   * Clear only localStorage cache (keeps memory cache)
   */
  clearStorage(): void {
    if (this.hasStorage) {
      try {
        localStorage.removeItem(this.STORAGE_KEY)
      } catch (e) {
        console.warn('Failed to clear localStorage:', e)
      }
    }
  }

  /**
   * Get all non-expired entries from memory cache
   */
  getAll(): Record<string, TokenPrice> {
    const now = Date.now()
    const result: Record<string, TokenPrice> = {}
    
    // Clean up expired entries while iterating
    const expiredKeys: string[] = []
    
    for (const [key, entry] of this.memCache.entries()) {
      if (!this.isExpired(entry, now)) {
        result[key] = entry.data
      } else {
        expiredKeys.push(key)
      }
    }
    
    // Remove expired entries
    expiredKeys.forEach(key => this.memCache.delete(key))
    
    return result
  }

  /**
   * Get cache statistics for debugging
   */
  getStats(): {
    memoryEntries: number
    storageEntries: number
    storageSize: number
    isStorageAvailable: boolean
    isMemoryOnly: boolean
  } {
    let storageEntries = 0
    let storageSize = 0
    
    if (this.hasStorage && !this.useMemoryOnly) {
      const stored = this.getFromStorage()
      storageEntries = Object.keys(stored.data).length
      
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY)
        storageSize = raw ? new Blob([raw]).size : 0
      } catch {
        // Ignore size calculation errors
      }
    }
    
    return {
      memoryEntries: this.memCache.size,
      storageEntries,
      storageSize,
      isStorageAvailable: this.hasStorage,
      isMemoryOnly: this.useMemoryOnly,
    }
  }

  /**
   * Check if a cache entry is expired
   */
  private isExpired(entry: CacheEntry, now: number): boolean {
    return now - entry.timestamp > this.ttl
  }

  /**
   * Load data from localStorage into memory cache
   */
  private hydrate(): void {
    if (!this.hasStorage || this.useMemoryOnly) return
    
    const stored = this.getFromStorage()
    const now = Date.now()
    
    // Load non-expired entries into memory cache
    Object.entries(stored.data).forEach(([key, entry]) => {
      if (!this.isExpired(entry, now)) {
        this.memCache.set(key, entry)
      }
    })
  }

  /**
   * Get data from localStorage safely
   */
  private getFromStorage(): StorageData {
    if (!this.hasStorage) {
      return { version: this.CURRENT_VERSION, data: {} }
    }
    
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY)
      if (!raw) {
        return { version: this.CURRENT_VERSION, data: {} }
      }
      
      const parsed = JSON.parse(raw) as StorageData
      
      // Check version compatibility
      if (parsed.version !== this.CURRENT_VERSION) {
        localStorage.removeItem(this.STORAGE_KEY)
        return { version: this.CURRENT_VERSION, data: {} }
      }
      
      return parsed
    } catch (e) {
      console.warn('Failed to read from localStorage:', e)
      return { version: this.CURRENT_VERSION, data: {} }
    }
  }

  /**
   * Schedule a debounced sync to localStorage
   */
  private scheduleSyncToStorage(): void {
    // Cancel any pending sync
    if (this.syncTimer) {
      clearTimeout(this.syncTimer)
    }
    
    // Schedule new sync (debounced by 500ms)
    this.syncTimer = setTimeout(() => {
      this.syncToStorage()
    }, 500)
  }

  /**
   * Sync memory cache to localStorage
   */
  private syncToStorage(): void {
    if (!this.hasStorage || this.useMemoryOnly) return
    
    try {
      const now = Date.now()
      const data: Record<string, CacheEntry> = {}
      
      // Convert Map to object, excluding expired entries
      let count = 0
      for (const [key, entry] of this.memCache.entries()) {
        if (!this.isExpired(entry, now) && count < this.MAX_ENTRIES) {
          data[key] = entry
          count++
        }
      }
      
      const storageData: StorageData = {
        version: this.CURRENT_VERSION,
        data,
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageData))
    } catch (e) {
      // Handle QuotaExceededError or other storage errors
      console.warn('Failed to sync to localStorage:', e)
      
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        // Storage is full, fall back to memory-only mode
        this.useMemoryOnly = true
        console.warn('localStorage quota exceeded, falling back to memory-only cache')
      }
    }
  }

  /**
   * Setup listener for cross-tab synchronization
   */
  private setupStorageListener(): void {
    if (!this.isClient) return
    
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === this.STORAGE_KEY && e.newValue) {
        // Another tab updated the cache, re-hydrate
        this.hydrate()
      }
    })
  }
}

// Export singleton instance with 5-minute TTL
export const priceCache = new HybridCache(5)