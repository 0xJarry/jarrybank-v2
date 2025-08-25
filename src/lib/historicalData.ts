/**
 * Historical Data Service
 * Store snapshots of portfolio value over time
 * Use IndexedDB for client-side storage
 * Calculate performance metrics
 */

import { openDB, type IDBPDatabase } from 'idb';
import { type Address } from 'viem';
import { type DiscoveredToken } from './tokenDiscovery';

/**
 * Portfolio snapshot structure
 */
export interface PortfolioSnapshot {
  id?: number;
  walletAddress: Address;
  timestamp: number;
  totalValue: number;
  tokenCount: number;
  tokens: TokenSnapshot[];
  chainId: string;
}

/**
 * Token snapshot structure
 */
export interface TokenSnapshot {
  address: Address;
  symbol: string;
  name: string;
  balance: string;
  price: number;
  value: number;
  allocation: number; // Percentage of portfolio
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  period: '24h' | '7d' | '30d' | '90d' | 'all';
}

/**
 * Database configuration
 */
const DB_NAME = 'JarryBankHistoricalData';
const DB_VERSION = 1;
const STORE_NAME = 'portfolioSnapshots';

/**
 * Database instance
 */
let db: IDBPDatabase | null = null;

/**
 * Initialize IndexedDB
 */
async function initDB(): Promise<IDBPDatabase> {
  if (db) return db;
  
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Create portfolio snapshots store
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        
        // Create indexes for efficient queries
        store.createIndex('walletAddress', 'walletAddress', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('walletTimestamp', ['walletAddress', 'timestamp'], { unique: false });
      }
    },
  });
  
  return db;
}

/**
 * Create a portfolio snapshot
 */
export async function createSnapshot(
  walletAddress: Address,
  tokens: DiscoveredToken[],
  chainId: string = '43114'
): Promise<PortfolioSnapshot> {
  const totalValue = tokens.reduce((sum, token) => sum + (token.value || 0), 0);
  
  const tokenSnapshots: TokenSnapshot[] = tokens.map(token => ({
    address: token.address,
    symbol: token.symbol,
    name: token.name,
    balance: token.balance,
    price: token.price || 0,
    value: token.value || 0,
    allocation: totalValue > 0 ? ((token.value || 0) / totalValue) * 100 : 0,
  }));
  
  const snapshot: PortfolioSnapshot = {
    walletAddress,
    timestamp: Date.now(),
    totalValue,
    tokenCount: tokens.length,
    tokens: tokenSnapshots,
    chainId,
  };
  
  // Save to IndexedDB
  const database = await initDB();
  const id = await database.add(STORE_NAME, snapshot);
  snapshot.id = id as number;
  
  return snapshot;
}

/**
 * Get snapshots for a wallet
 */
export async function getSnapshots(
  walletAddress: Address,
  limit?: number
): Promise<PortfolioSnapshot[]> {
  const database = await initDB();
  const tx = database.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('walletAddress');
  
  let snapshots = await index.getAll(walletAddress);
  
  // Sort by timestamp descending
  snapshots.sort((a, b) => b.timestamp - a.timestamp);
  
  if (limit) {
    snapshots = snapshots.slice(0, limit);
  }
  
  return snapshots;
}

/**
 * Get snapshots within a time range
 */
export async function getSnapshotsInRange(
  walletAddress: Address,
  startTime: number,
  endTime: number
): Promise<PortfolioSnapshot[]> {
  const database = await initDB();
  const tx = database.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('walletAddress');
  
  const allSnapshots = await index.getAll(walletAddress);
  
  return allSnapshots.filter(
    snapshot => snapshot.timestamp >= startTime && snapshot.timestamp <= endTime
  );
}

/**
 * Get latest snapshot for a wallet
 */
export async function getLatestSnapshot(
  walletAddress: Address
): Promise<PortfolioSnapshot | null> {
  const snapshots = await getSnapshots(walletAddress, 1);
  return snapshots[0] || null;
}

/**
 * Get snapshot at a specific time (or closest before)
 */
export async function getSnapshotAtTime(
  walletAddress: Address,
  targetTime: number
): Promise<PortfolioSnapshot | null> {
  const database = await initDB();
  const tx = database.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('walletAddress');
  
  const snapshots = await index.getAll(walletAddress);
  
  // Find closest snapshot before target time
  const filtered = snapshots
    .filter(s => s.timestamp <= targetTime)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  return filtered[0] || null;
}

/**
 * Calculate performance metrics
 */
export async function calculatePerformance(
  walletAddress: Address,
  period: '24h' | '7d' | '30d' | '90d' | 'all'
): Promise<PerformanceMetrics | null> {
  const now = Date.now();
  let startTime: number;
  
  switch (period) {
    case '24h':
      startTime = now - 24 * 60 * 60 * 1000;
      break;
    case '7d':
      startTime = now - 7 * 24 * 60 * 60 * 1000;
      break;
    case '30d':
      startTime = now - 30 * 24 * 60 * 60 * 1000;
      break;
    case '90d':
      startTime = now - 90 * 24 * 60 * 60 * 1000;
      break;
    case 'all':
      startTime = 0;
      break;
  }
  
  const currentSnapshot = await getLatestSnapshot(walletAddress);
  if (!currentSnapshot) return null;
  
  const previousSnapshot = await getSnapshotAtTime(walletAddress, startTime);
  if (!previousSnapshot) return null;
  
  const change = currentSnapshot.totalValue - previousSnapshot.totalValue;
  const changePercent = previousSnapshot.totalValue > 0
    ? (change / previousSnapshot.totalValue) * 100
    : 0;
  
  return {
    currentValue: currentSnapshot.totalValue,
    previousValue: previousSnapshot.totalValue,
    change,
    changePercent,
    period,
  };
}

/**
 * Get token performance over time
 */
export async function getTokenPerformance(
  walletAddress: Address,
  tokenAddress: Address,
  period: '24h' | '7d' | '30d' | '90d' | 'all'
): Promise<{ timestamps: number[]; values: number[] } | null> {
  const now = Date.now();
  let startTime: number;
  
  switch (period) {
    case '24h':
      startTime = now - 24 * 60 * 60 * 1000;
      break;
    case '7d':
      startTime = now - 7 * 24 * 60 * 60 * 1000;
      break;
    case '30d':
      startTime = now - 30 * 24 * 60 * 60 * 1000;
      break;
    case '90d':
      startTime = now - 90 * 24 * 60 * 60 * 1000;
      break;
    case 'all':
      startTime = 0;
      break;
  }
  
  const snapshots = await getSnapshotsInRange(walletAddress, startTime, now);
  
  const timestamps: number[] = [];
  const values: number[] = [];
  
  snapshots.forEach(snapshot => {
    const token = snapshot.tokens.find(
      t => t.address.toLowerCase() === tokenAddress.toLowerCase()
    );
    if (token) {
      timestamps.push(snapshot.timestamp);
      values.push(token.value);
    }
  });
  
  return timestamps.length > 0 ? { timestamps, values } : null;
}

/**
 * Delete old snapshots (data pruning)
 */
export async function pruneOldSnapshots(
  walletAddress: Address,
  olderThanDays: number = 90
): Promise<number> {
  const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  const database = await initDB();
  const tx = database.transaction(STORE_NAME, 'readwrite');
  const index = tx.store.index('walletAddress');
  
  const snapshots = await index.getAll(walletAddress);
  let deletedCount = 0;
  
  for (const snapshot of snapshots) {
    if (snapshot.timestamp < cutoffTime && snapshot.id) {
      await tx.store.delete(snapshot.id);
      deletedCount++;
    }
  }
  
  await tx.done;
  return deletedCount;
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  totalSnapshots: number;
  wallets: string[];
  oldestSnapshot: number | null;
  newestSnapshot: number | null;
  sizeEstimate: number;
}> {
  const database = await initDB();
  const tx = database.transaction(STORE_NAME, 'readonly');
  const snapshots = await tx.store.getAll();
  
  const wallets = new Set<string>();
  let oldest: number | null = null;
  let newest: number | null = null;
  let sizeEstimate = 0;
  
  snapshots.forEach(snapshot => {
    wallets.add(snapshot.walletAddress);
    
    if (!oldest || snapshot.timestamp < oldest) {
      oldest = snapshot.timestamp;
    }
    if (!newest || snapshot.timestamp > newest) {
      newest = snapshot.timestamp;
    }
    
    // Rough size estimate
    sizeEstimate += JSON.stringify(snapshot).length;
  });
  
  return {
    totalSnapshots: snapshots.length,
    wallets: Array.from(wallets),
    oldestSnapshot: oldest,
    newestSnapshot: newest,
    sizeEstimate,
  };
}

/**
 * Clear all data for a wallet
 */
export async function clearWalletData(walletAddress: Address): Promise<void> {
  const database = await initDB();
  const tx = database.transaction(STORE_NAME, 'readwrite');
  const index = tx.store.index('walletAddress');
  
  const snapshots = await index.getAll(walletAddress);
  
  for (const snapshot of snapshots) {
    if (snapshot.id) {
      await tx.store.delete(snapshot.id);
    }
  }
  
  await tx.done;
}

/**
 * Clear entire database
 */
export async function clearAllData(): Promise<void> {
  const database = await initDB();
  await database.clear(STORE_NAME);
}