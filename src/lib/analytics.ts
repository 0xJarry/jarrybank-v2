/**
 * Analytics Engine
 * Calculate ROI, gains/losses
 * Identify top performers
 * Generate allocation breakdowns
 */

import { type Address } from 'viem';
import { type DiscoveredToken } from './tokenDiscovery';
import { type PortfolioSnapshot, type TokenSnapshot } from './historicalData';
import { getSnapshots, getLatestSnapshot, getSnapshotAtTime } from './historicalData';

/**
 * Token performance data
 */
export interface TokenPerformance {
  address: Address;
  symbol: string;
  name: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  roi: number;
  allocation: number;
}

/**
 * Portfolio allocation data
 */
export interface AllocationData {
  token: string;
  symbol: string;
  value: number;
  percentage: number;
  color?: string;
}

/**
 * Portfolio statistics
 */
export interface PortfolioStats {
  totalValue: number;
  totalGains: number;
  totalGainsPercent: number;
  bestPerformer: TokenPerformance | null;
  worstPerformer: TokenPerformance | null;
  tokenCount: number;
  averageROI: number;
  volatility: number;
}

/**
 * Time period for analysis
 */
export type TimePeriod = '24h' | '7d' | '30d' | '90d' | '1y' | 'all';

/**
 * Convert time period to milliseconds
 */
function periodToMs(period: TimePeriod): number {
  switch (period) {
    case '24h':
      return 24 * 60 * 60 * 1000;
    case '7d':
      return 7 * 24 * 60 * 60 * 1000;
    case '30d':
      return 30 * 24 * 60 * 60 * 1000;
    case '90d':
      return 90 * 24 * 60 * 60 * 1000;
    case '1y':
      return 365 * 24 * 60 * 60 * 1000;
    case 'all':
      return Date.now(); // Maximum time
  }
}

/**
 * Calculate ROI for a token
 */
export function calculateROI(
  currentValue: number,
  previousValue: number
): number {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
}

/**
 * Calculate token performance
 */
export async function calculateTokenPerformance(
  walletAddress: Address,
  currentTokens: DiscoveredToken[],
  period: TimePeriod = '7d'
): Promise<TokenPerformance[]> {
  const currentSnapshot = await getLatestSnapshot(walletAddress);
  const targetTime = Date.now() - periodToMs(period);
  const previousSnapshot = await getSnapshotAtTime(walletAddress, targetTime);
  
  const performances: TokenPerformance[] = [];
  
  for (const token of currentTokens) {
    const currentToken = currentSnapshot?.tokens.find(
      t => t.address.toLowerCase() === token.address.toLowerCase()
    );
    const previousToken = previousSnapshot?.tokens.find(
      t => t.address.toLowerCase() === token.address.toLowerCase()
    );
    
    const currentValue = currentToken?.value || token.value || 0;
    const previousValue = previousToken?.value || 0;
    const change = currentValue - previousValue;
    const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;
    const roi = calculateROI(currentValue, previousValue);
    const allocation = currentSnapshot?.totalValue 
      ? (currentValue / currentSnapshot.totalValue) * 100 
      : 0;
    
    performances.push({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      currentValue,
      previousValue,
      change,
      changePercent,
      roi,
      allocation,
    });
  }
  
  return performances;
}

/**
 * Get top performers
 */
export async function getTopPerformers(
  walletAddress: Address,
  currentTokens: DiscoveredToken[],
  period: TimePeriod = '7d',
  limit: number = 5
): Promise<TokenPerformance[]> {
  const performances = await calculateTokenPerformance(walletAddress, currentTokens, period);
  
  // Sort by change percent descending
  performances.sort((a, b) => b.changePercent - a.changePercent);
  
  return performances.slice(0, limit);
}

/**
 * Get worst performers
 */
export async function getWorstPerformers(
  walletAddress: Address,
  currentTokens: DiscoveredToken[],
  period: TimePeriod = '7d',
  limit: number = 5
): Promise<TokenPerformance[]> {
  const performances = await calculateTokenPerformance(walletAddress, currentTokens, period);
  
  // Sort by change percent ascending
  performances.sort((a, b) => a.changePercent - b.changePercent);
  
  return performances.slice(0, limit);
}

/**
 * Generate allocation breakdown
 */
export function generateAllocationBreakdown(
  tokens: DiscoveredToken[],
  minPercentage: number = 1
): AllocationData[] {
  const totalValue = tokens.reduce((sum, token) => sum + (token.value || 0), 0);
  
  if (totalValue === 0) return [];
  
  const allocations: AllocationData[] = [];
  let othersValue = 0;
  
  // Color palette for charts
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#FD79A8', '#A29BFE', '#6C5CE7', '#00B894', '#FDCB6E',
  ];
  
  tokens.forEach((token, index) => {
    const value = token.value || 0;
    const percentage = (value / totalValue) * 100;
    
    if (percentage >= minPercentage) {
      allocations.push({
        token: token.name,
        symbol: token.symbol,
        value,
        percentage,
        color: colors[index % colors.length],
      });
    } else {
      othersValue += value;
    }
  });
  
  // Add "Others" category if needed
  if (othersValue > 0) {
    allocations.push({
      token: 'Others',
      symbol: 'OTHERS',
      value: othersValue,
      percentage: (othersValue / totalValue) * 100,
      color: '#95A5A6',
    });
  }
  
  // Sort by percentage descending
  allocations.sort((a, b) => b.percentage - a.percentage);
  
  return allocations;
}

/**
 * Calculate portfolio statistics
 */
export async function calculatePortfolioStats(
  walletAddress: Address,
  currentTokens: DiscoveredToken[],
  period: TimePeriod = '7d'
): Promise<PortfolioStats> {
  const performances = await calculateTokenPerformance(walletAddress, currentTokens, period);
  const snapshots = await getSnapshots(walletAddress, 30); // Get last 30 snapshots for volatility
  
  const totalValue = currentTokens.reduce((sum, token) => sum + (token.value || 0), 0);
  const totalPreviousValue = performances.reduce((sum, perf) => sum + perf.previousValue, 0);
  const totalGains = totalValue - totalPreviousValue;
  const totalGainsPercent = totalPreviousValue > 0 
    ? (totalGains / totalPreviousValue) * 100 
    : 0;
  
  // Find best and worst performers
  const sortedByChange = [...performances].sort((a, b) => b.changePercent - a.changePercent);
  const bestPerformer = sortedByChange[0] || null;
  const worstPerformer = sortedByChange[sortedByChange.length - 1] || null;
  
  // Calculate average ROI
  const averageROI = performances.length > 0
    ? performances.reduce((sum, perf) => sum + perf.roi, 0) / performances.length
    : 0;
  
  // Calculate volatility (standard deviation of portfolio values)
  const volatility = calculateVolatility(snapshots.map(s => s.totalValue));
  
  return {
    totalValue,
    totalGains,
    totalGainsPercent,
    bestPerformer,
    worstPerformer,
    tokenCount: currentTokens.length,
    averageROI,
    volatility,
  };
}

/**
 * Calculate volatility (standard deviation)
 */
function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  
  return Math.sqrt(variance);
}

/**
 * Get historical portfolio values for charting
 */
export async function getHistoricalValues(
  walletAddress: Address,
  period: TimePeriod = '7d',
  interval: 'hourly' | 'daily' | 'auto' = 'auto'
): Promise<{ timestamps: number[]; values: number[] }> {
  const targetTime = Date.now() - periodToMs(period);
  const snapshots = await getSnapshots(walletAddress);
  
  // Filter snapshots within period
  const filtered = snapshots.filter(s => s.timestamp >= targetTime);
  
  // Determine interval based on period if auto
  let targetInterval: number;
  if (interval === 'auto') {
    if (period === '24h') {
      targetInterval = 60 * 60 * 1000; // 1 hour
    } else if (period === '7d') {
      targetInterval = 4 * 60 * 60 * 1000; // 4 hours
    } else {
      targetInterval = 24 * 60 * 60 * 1000; // 1 day
    }
  } else {
    targetInterval = interval === 'hourly' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  }
  
  // Sample snapshots at intervals
  const sampled: PortfolioSnapshot[] = [];
  let lastTimestamp = 0;
  
  filtered.forEach(snapshot => {
    if (snapshot.timestamp - lastTimestamp >= targetInterval) {
      sampled.push(snapshot);
      lastTimestamp = snapshot.timestamp;
    }
  });
  
  return {
    timestamps: sampled.map(s => s.timestamp),
    values: sampled.map(s => s.totalValue),
  };
}

/**
 * Identify trending tokens (significant changes)
 */
export async function identifyTrendingTokens(
  walletAddress: Address,
  currentTokens: DiscoveredToken[],
  period: TimePeriod = '24h',
  threshold: number = 10 // Minimum % change to be considered trending
): Promise<{
  rising: TokenPerformance[];
  falling: TokenPerformance[];
}> {
  const performances = await calculateTokenPerformance(walletAddress, currentTokens, period);
  
  const rising = performances
    .filter(p => p.changePercent >= threshold)
    .sort((a, b) => b.changePercent - a.changePercent);
  
  const falling = performances
    .filter(p => p.changePercent <= -threshold)
    .sort((a, b) => a.changePercent - b.changePercent);
  
  return { rising, falling };
}

/**
 * Get portfolio diversification score (0-100)
 */
export function calculateDiversificationScore(tokens: DiscoveredToken[]): number {
  if (tokens.length === 0) return 0;
  if (tokens.length === 1) return 0;
  
  const totalValue = tokens.reduce((sum, token) => sum + (token.value || 0), 0);
  if (totalValue === 0) return 0;
  
  // Calculate Herfindahl-Hirschman Index (HHI)
  const hhi = tokens.reduce((sum, token) => {
    const share = (token.value || 0) / totalValue;
    return sum + Math.pow(share, 2);
  }, 0);
  
  // Convert HHI to a 0-100 score (lower HHI = better diversification)
  // HHI ranges from 1/n (perfect diversification) to 1 (no diversification)
  const minHHI = 1 / tokens.length;
  const normalizedHHI = (hhi - minHHI) / (1 - minHHI);
  
  return Math.round((1 - normalizedHHI) * 100);
}

/**
 * Get portfolio health metrics
 */
export async function getPortfolioHealth(
  walletAddress: Address,
  currentTokens: DiscoveredToken[]
): Promise<{
  diversificationScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}> {
  const diversificationScore = calculateDiversificationScore(currentTokens);
  const stats = await calculatePortfolioStats(walletAddress, currentTokens, '30d');
  
  // Determine risk level based on volatility and diversification
  let riskLevel: 'low' | 'medium' | 'high';
  if (stats.volatility < 1000 && diversificationScore > 70) {
    riskLevel = 'low';
  } else if (stats.volatility < 5000 && diversificationScore > 40) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (diversificationScore < 40) {
    recommendations.push('Consider diversifying your portfolio across more assets');
  }
  
  if (stats.volatility > 5000) {
    recommendations.push('Your portfolio shows high volatility. Consider adding stable assets');
  }
  
  const allocations = generateAllocationBreakdown(currentTokens);
  const topAllocation = allocations[0];
  if (topAllocation && topAllocation.percentage > 50) {
    recommendations.push(`${topAllocation.symbol} makes up ${topAllocation.percentage.toFixed(1)}% of your portfolio. Consider rebalancing`);
  }
  
  if (currentTokens.length < 3) {
    recommendations.push('Consider adding more tokens to improve diversification');
  }
  
  return {
    diversificationScore,
    riskLevel,
    recommendations,
  };
}