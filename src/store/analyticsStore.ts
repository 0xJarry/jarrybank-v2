/**
 * Analytics Store
 * State management for portfolio analytics, historical data, and user preferences
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Address } from 'viem';
import { type DiscoveredToken } from '@/lib/tokenDiscovery';
import { type PortfolioSnapshot } from '@/lib/historicalData';
import { type TokenPerformance, type PortfolioStats, type TimePeriod, type AllocationData } from '@/lib/analytics';

/**
 * Analytics preferences
 */
interface AnalyticsPreferences {
  defaultPeriod: TimePeriod;
  autoSnapshot: boolean;
  snapshotInterval: number; // minutes
  maxHistoricalDays: number;
  showTrendingTokens: boolean;
  performanceMetric: 'change' | 'changePercent' | 'roi';
  chartTheme: 'auto' | 'light' | 'dark';
}

/**
 * Analytics state
 */
interface AnalyticsState {
  // Preferences
  preferences: AnalyticsPreferences;
  
  // Current data
  currentTokens: DiscoveredToken[];
  currentSnapshot: PortfolioSnapshot | null;
  
  // Analytics data
  performance: Record<TimePeriod, TokenPerformance[]>;
  portfolioStats: Record<TimePeriod, PortfolioStats | null>;
  allocation: AllocationData[];
  historicalValues: Record<TimePeriod, { timestamps: number[]; values: number[] }>;
  
  // UI state
  loading: {
    performance: boolean;
    stats: boolean;
    historical: boolean;
    snapshot: boolean;
  };
  
  // Last updated timestamps
  lastUpdated: {
    performance: Record<TimePeriod, number>;
    stats: Record<TimePeriod, number>;
    historical: Record<TimePeriod, number>;
    snapshot: number;
  };
  
  // Actions
  setPreferences: (preferences: Partial<AnalyticsPreferences>) => void;
  setCurrentTokens: (tokens: DiscoveredToken[]) => void;
  setCurrentSnapshot: (snapshot: PortfolioSnapshot | null) => void;
  setPerformance: (period: TimePeriod, performance: TokenPerformance[]) => void;
  setPortfolioStats: (period: TimePeriod, stats: PortfolioStats | null) => void;
  setAllocation: (allocation: AllocationData[]) => void;
  setHistoricalValues: (period: TimePeriod, data: { timestamps: number[]; values: number[] }) => void;
  setLoading: (key: keyof AnalyticsState['loading'], loading: boolean) => void;
  
  // Utility actions
  clearCache: () => void;
  isDataFresh: (type: 'performance' | 'stats' | 'historical', period: TimePeriod) => boolean;
  shouldRefresh: (type: 'performance' | 'stats' | 'historical', period: TimePeriod) => boolean;
}

/**
 * Default preferences
 */
const defaultPreferences: AnalyticsPreferences = {
  defaultPeriod: '7d',
  autoSnapshot: true,
  snapshotInterval: 60, // 1 hour
  maxHistoricalDays: 90,
  showTrendingTokens: true,
  performanceMetric: 'changePercent',
  chartTheme: 'auto',
};

/**
 * Cache duration for different data types (in milliseconds)
 */
const CACHE_DURATION = {
  performance: 5 * 60 * 1000, // 5 minutes
  stats: 5 * 60 * 1000, // 5 minutes
  historical: 10 * 60 * 1000, // 10 minutes
};

/**
 * Analytics store
 */
export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      // Initial state
      preferences: defaultPreferences,
      currentTokens: [],
      currentSnapshot: null,
      performance: {
        '24h': [],
        '7d': [],
        '30d': [],
        '90d': [],
        '1y': [],
        'all': [],
      },
      portfolioStats: {
        '24h': null,
        '7d': null,
        '30d': null,
        '90d': null,
        '1y': null,
        'all': null,
      },
      allocation: [],
      historicalValues: {
        '24h': { timestamps: [], values: [] },
        '7d': { timestamps: [], values: [] },
        '30d': { timestamps: [], values: [] },
        '90d': { timestamps: [], values: [] },
        '1y': { timestamps: [], values: [] },
        'all': { timestamps: [], values: [] },
      },
      loading: {
        performance: false,
        stats: false,
        historical: false,
        snapshot: false,
      },
      lastUpdated: {
        performance: {
          '24h': 0,
          '7d': 0,
          '30d': 0,
          '90d': 0,
          '1y': 0,
          'all': 0,
        },
        stats: {
          '24h': 0,
          '7d': 0,
          '30d': 0,
          '90d': 0,
          '1y': 0,
          'all': 0,
        },
        historical: {
          '24h': 0,
          '7d': 0,
          '30d': 0,
          '90d': 0,
          '1y': 0,
          'all': 0,
        },
        snapshot: 0,
      },

      // Actions
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),

      setCurrentTokens: (tokens) =>
        set({ currentTokens: tokens }),

      setCurrentSnapshot: (snapshot) =>
        set({ 
          currentSnapshot: snapshot,
          lastUpdated: {
            ...get().lastUpdated,
            snapshot: Date.now(),
          },
        }),

      setPerformance: (period, performance) =>
        set((state) => ({
          performance: { ...state.performance, [period]: performance },
          lastUpdated: {
            ...state.lastUpdated,
            performance: {
              ...state.lastUpdated.performance,
              [period]: Date.now(),
            },
          },
        })),

      setPortfolioStats: (period, stats) =>
        set((state) => ({
          portfolioStats: { ...state.portfolioStats, [period]: stats },
          lastUpdated: {
            ...state.lastUpdated,
            stats: {
              ...state.lastUpdated.stats,
              [period]: Date.now(),
            },
          },
        })),

      setAllocation: (allocation) =>
        set({ allocation }),

      setHistoricalValues: (period, data) =>
        set((state) => ({
          historicalValues: { ...state.historicalValues, [period]: data },
          lastUpdated: {
            ...state.lastUpdated,
            historical: {
              ...state.lastUpdated.historical,
              [period]: Date.now(),
            },
          },
        })),

      setLoading: (key, loading) =>
        set((state) => ({
          loading: { ...state.loading, [key]: loading },
        })),

      // Utility actions
      clearCache: () =>
        set({
          performance: {
            '24h': [],
            '7d': [],
            '30d': [],
            '90d': [],
            '1y': [],
            'all': [],
          },
          portfolioStats: {
            '24h': null,
            '7d': null,
            '30d': null,
            '90d': null,
            '1y': null,
            'all': null,
          },
          allocation: [],
          historicalValues: {
            '24h': { timestamps: [], values: [] },
            '7d': { timestamps: [], values: [] },
            '30d': { timestamps: [], values: [] },
            '90d': { timestamps: [], values: [] },
            '1y': { timestamps: [], values: [] },
            'all': { timestamps: [], values: [] },
          },
          lastUpdated: {
            performance: {
              '24h': 0,
              '7d': 0,
              '30d': 0,
              '90d': 0,
              '1y': 0,
              'all': 0,
            },
            stats: {
              '24h': 0,
              '7d': 0,
              '30d': 0,
              '90d': 0,
              '1y': 0,
              'all': 0,
            },
            historical: {
              '24h': 0,
              '7d': 0,
              '30d': 0,
              '90d': 0,
              '1y': 0,
              'all': 0,
            },
            snapshot: 0,
          },
        }),

      isDataFresh: (type, period) => {
        const state = get();
        const lastUpdate = state.lastUpdated[type][period];
        const now = Date.now();
        const cacheDuration = CACHE_DURATION[type];
        
        return now - lastUpdate < cacheDuration;
      },

      shouldRefresh: (type, period) => {
        const state = get();
        return !state.isDataFresh(type, period);
      },
    }),
    {
      name: 'analytics-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        // Don't persist data that should be refreshed
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);

/**
 * Computed selectors
 */

/**
 * Get performance data for a period (with freshness check)
 */
export const selectPerformance = (period: TimePeriod) => (state: AnalyticsState) => {
  return {
    data: state.performance[period],
    loading: state.loading.performance,
    lastUpdated: state.lastUpdated.performance[period],
    isFresh: state.isDataFresh('performance', period),
  };
};

/**
 * Get portfolio stats for a period (with freshness check)
 */
export const selectPortfolioStats = (period: TimePeriod) => (state: AnalyticsState) => {
  return {
    data: state.portfolioStats[period],
    loading: state.loading.stats,
    lastUpdated: state.lastUpdated.stats[period],
    isFresh: state.isDataFresh('stats', period),
  };
};

/**
 * Get historical values for a period (with freshness check)
 */
export const selectHistoricalValues = (period: TimePeriod) => (state: AnalyticsState) => {
  return {
    data: state.historicalValues[period],
    loading: state.loading.historical,
    lastUpdated: state.lastUpdated.historical[period],
    isFresh: state.isDataFresh('historical', period),
  };
};

/**
 * Get top performers from current performance data
 */
export const selectTopPerformers = (period: TimePeriod, limit: number = 5) => (state: AnalyticsState) => {
  const performance = state.performance[period];
  if (!performance || performance.length === 0) return [];
  
  return [...performance]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, limit);
};

/**
 * Get worst performers from current performance data
 */
export const selectWorstPerformers = (period: TimePeriod, limit: number = 5) => (state: AnalyticsState) => {
  const performance = state.performance[period];
  if (!performance || performance.length === 0) return [];
  
  return [...performance]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, limit);
};

/**
 * Get trending tokens (significant changes)
 */
export const selectTrendingTokens = (period: TimePeriod, threshold: number = 10) => (state: AnalyticsState) => {
  const performance = state.performance[period];
  if (!performance || performance.length === 0) return { rising: [], falling: [] };
  
  const rising = performance
    .filter(p => p.changePercent >= threshold)
    .sort((a, b) => b.changePercent - a.changePercent);
  
  const falling = performance
    .filter(p => p.changePercent <= -threshold)
    .sort((a, b) => a.changePercent - b.changePercent);
  
  return { rising, falling };
};