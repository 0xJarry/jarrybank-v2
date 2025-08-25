/**
 * Export Data Service
 * Export portfolio data to CSV format
 * Export to JSON format
 * Generate PDF reports (optional)
 */

import { format } from 'date-fns';
import { type Address } from 'viem';
import { type DiscoveredToken } from './tokenDiscovery';
import { type PortfolioSnapshot } from './historicalData';
import { type TokenPerformance, type AllocationData } from './analytics';
import { getSnapshots, getLatestSnapshot } from './historicalData';
import { calculateTokenPerformance, generateAllocationBreakdown } from './analytics';

/**
 * Export format types
 */
export type ExportFormat = 'csv' | 'json';

/**
 * Export data structure
 */
export interface ExportData {
  exportDate: string;
  walletAddress: string;
  summary: {
    totalValue: number;
    tokenCount: number;
    exportTimestamp: number;
  };
  tokens: DiscoveredToken[];
  performance?: TokenPerformance[];
  allocation?: AllocationData[];
  historical?: PortfolioSnapshot[];
}

/**
 * Download a file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Convert array to CSV string
 */
function arrayToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';
  
  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.map(h => `"${h}"`).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '""';
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return `"${value}"`;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Export current portfolio to CSV
 */
export async function exportPortfolioCSV(
  walletAddress: Address,
  tokens: DiscoveredToken[],
  includePerformance: boolean = true
): Promise<void> {
  try {
    // Prepare token data
    const tokenData = tokens.map(token => ({
      Symbol: token.symbol,
      Name: token.name,
      Address: token.address,
      Balance: token.balanceFormatted,
      Price: token.price || 0,
      Value: token.value || 0,
      Chain: token.chain,
      LastUpdated: format(token.lastUpdated || Date.now(), 'yyyy-MM-dd HH:mm:ss'),
    }));
    
    let csvContent = 'JARRYBANK PORTFOLIO EXPORT\n';
    csvContent += `Export Date: ${format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}\n`;
    csvContent += `Wallet Address: ${walletAddress}\n`;
    csvContent += `Total Tokens: ${tokens.length}\n`;
    csvContent += `Total Value: $${tokens.reduce((sum, t) => sum + (t.value || 0), 0).toFixed(2)}\n\n`;
    
    // Add token holdings
    csvContent += 'TOKEN HOLDINGS\n';
    csvContent += arrayToCSV(tokenData);
    csvContent += '\n\n';
    
    // Add performance data if requested
    if (includePerformance) {
      try {
        const performance = await calculateTokenPerformance(walletAddress, tokens, '7d');
        const performanceData = performance.map(perf => ({
          Symbol: perf.symbol,
          Name: perf.name,
          'Current Value': perf.currentValue,
          'Previous Value': perf.previousValue,
          'Change ($)': perf.change,
          'Change (%)': perf.changePercent.toFixed(2),
          'ROI (%)': perf.roi.toFixed(2),
          'Allocation (%)': perf.allocation.toFixed(2),
        }));
        
        csvContent += 'PERFORMANCE (7 DAYS)\n';
        csvContent += arrayToCSV(performanceData);
        csvContent += '\n\n';
      } catch (error) {
        console.warn('Failed to include performance data:', error);
      }
    }
    
    // Add allocation data
    const allocation = generateAllocationBreakdown(tokens);
    const allocationData = allocation.map(alloc => ({
      Token: alloc.token,
      Symbol: alloc.symbol,
      'Value ($)': alloc.value.toFixed(2),
      'Percentage (%)': alloc.percentage.toFixed(2),
    }));
    
    csvContent += 'ALLOCATION BREAKDOWN\n';
    csvContent += arrayToCSV(allocationData);
    
    // Download file
    const filename = `jarrybank_portfolio_${format(Date.now(), 'yyyy-MM-dd_HHmm')}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
    
  } catch (error) {
    console.error('Failed to export portfolio CSV:', error);
    throw new Error('Export failed. Please try again.');
  }
}

/**
 * Export portfolio to JSON
 */
export async function exportPortfolioJSON(
  walletAddress: Address,
  tokens: DiscoveredToken[],
  includeHistorical: boolean = true,
  maxHistoricalDays: number = 30
): Promise<void> {
  try {
    const exportData: ExportData = {
      exportDate: format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
      walletAddress,
      summary: {
        totalValue: tokens.reduce((sum, t) => sum + (t.value || 0), 0),
        tokenCount: tokens.length,
        exportTimestamp: Date.now(),
      },
      tokens,
    };
    
    // Add performance data
    try {
      exportData.performance = await calculateTokenPerformance(walletAddress, tokens, '7d');
    } catch (error) {
      console.warn('Failed to include performance data:', error);
    }
    
    // Add allocation data
    exportData.allocation = generateAllocationBreakdown(tokens);
    
    // Add historical data if requested
    if (includeHistorical) {
      try {
        const cutoffTime = Date.now() - (maxHistoricalDays * 24 * 60 * 60 * 1000);
        const allSnapshots = await getSnapshots(walletAddress);
        exportData.historical = allSnapshots.filter(s => s.timestamp >= cutoffTime);
      } catch (error) {
        console.warn('Failed to include historical data:', error);
      }
    }
    
    // Download file
    const filename = `jarrybank_portfolio_${format(Date.now(), 'yyyy-MM-dd_HHmm')}.json`;
    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, filename, 'application/json');
    
  } catch (error) {
    console.error('Failed to export portfolio JSON:', error);
    throw new Error('Export failed. Please try again.');
  }
}

/**
 * Export historical data only
 */
export async function exportHistoricalDataCSV(
  walletAddress: Address,
  maxDays: number = 90
): Promise<void> {
  try {
    const cutoffTime = Date.now() - (maxDays * 24 * 60 * 60 * 1000);
    const snapshots = await getSnapshots(walletAddress);
    const filtered = snapshots.filter(s => s.timestamp >= cutoffTime);
    
    if (filtered.length === 0) {
      throw new Error('No historical data available for export');
    }
    
    // Prepare historical data
    const historicalData = filtered.map(snapshot => ({
      Date: format(snapshot.timestamp, 'yyyy-MM-dd'),
      Time: format(snapshot.timestamp, 'HH:mm:ss'),
      'Total Value': snapshot.totalValue.toFixed(2),
      'Token Count': snapshot.tokenCount,
      Chain: snapshot.chainId,
      Timestamp: snapshot.timestamp,
    }));
    
    let csvContent = 'JARRYBANK HISTORICAL DATA EXPORT\n';
    csvContent += `Export Date: ${format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}\n`;
    csvContent += `Wallet Address: ${walletAddress}\n`;
    csvContent += `Records: ${filtered.length}\n`;
    csvContent += `Period: ${format(filtered[filtered.length - 1].timestamp, 'yyyy-MM-dd')} to ${format(filtered[0].timestamp, 'yyyy-MM-dd')}\n\n`;
    
    csvContent += 'HISTORICAL DATA\n';
    csvContent += arrayToCSV(historicalData);
    
    // Download file
    const filename = `jarrybank_historical_${format(Date.now(), 'yyyy-MM-dd_HHmm')}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
    
  } catch (error) {
    console.error('Failed to export historical data:', error);
    throw error;
  }
}

/**
 * Export performance report
 */
export async function exportPerformanceReport(
  walletAddress: Address,
  tokens: DiscoveredToken[],
  period: '24h' | '7d' | '30d' | '90d' = '30d'
): Promise<void> {
  try {
    const performance = await calculateTokenPerformance(walletAddress, tokens, period);
    
    // Sort by performance
    const sortedByGains = [...performance].sort((a, b) => b.changePercent - a.changePercent);
    const gainers = sortedByGains.filter(p => p.changePercent > 0);
    const losers = sortedByGains.filter(p => p.changePercent < 0);
    
    let csvContent = 'JARRYBANK PERFORMANCE REPORT\n';
    csvContent += `Export Date: ${format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}\n`;
    csvContent += `Wallet Address: ${walletAddress}\n`;
    csvContent += `Period: ${period}\n`;
    csvContent += `Total Tokens: ${performance.length}\n`;
    csvContent += `Gainers: ${gainers.length}\n`;
    csvContent += `Losers: ${losers.length}\n\n`;
    
    // Top gainers
    if (gainers.length > 0) {
      csvContent += 'TOP GAINERS\n';
      const gainerData = gainers.slice(0, 10).map(p => ({
        Symbol: p.symbol,
        Name: p.name,
        'Change (%)': p.changePercent.toFixed(2),
        'Change ($)': p.change.toFixed(2),
        'Current Value': p.currentValue.toFixed(2),
        'Allocation (%)': p.allocation.toFixed(2),
      }));
      csvContent += arrayToCSV(gainerData);
      csvContent += '\n\n';
    }
    
    // Top losers
    if (losers.length > 0) {
      csvContent += 'TOP LOSERS\n';
      const loserData = losers.slice(-10).map(p => ({
        Symbol: p.symbol,
        Name: p.name,
        'Change (%)': p.changePercent.toFixed(2),
        'Change ($)': p.change.toFixed(2),
        'Current Value': p.currentValue.toFixed(2),
        'Allocation (%)': p.allocation.toFixed(2),
      }));
      csvContent += arrayToCSV(loserData);
      csvContent += '\n\n';
    }
    
    // All performance data
    csvContent += 'ALL TOKENS PERFORMANCE\n';
    const allPerformanceData = performance.map(p => ({
      Symbol: p.symbol,
      Name: p.name,
      'Current Value': p.currentValue.toFixed(2),
      'Previous Value': p.previousValue.toFixed(2),
      'Change ($)': p.change.toFixed(2),
      'Change (%)': p.changePercent.toFixed(2),
      'ROI (%)': p.roi.toFixed(2),
      'Allocation (%)': p.allocation.toFixed(2),
    }));
    csvContent += arrayToCSV(allPerformanceData);
    
    // Download file
    const filename = `jarrybank_performance_${period}_${format(Date.now(), 'yyyy-MM-dd_HHmm')}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
    
  } catch (error) {
    console.error('Failed to export performance report:', error);
    throw new Error('Failed to generate performance report. Please try again.');
  }
}

/**
 * Export allocation report
 */
export function exportAllocationReport(
  walletAddress: Address,
  tokens: DiscoveredToken[]
): void {
  try {
    const allocation = generateAllocationBreakdown(tokens);
    const totalValue = tokens.reduce((sum, t) => sum + (t.value || 0), 0);
    
    let csvContent = 'JARRYBANK ALLOCATION REPORT\n';
    csvContent += `Export Date: ${format(Date.now(), 'yyyy-MM-dd HH:mm:ss')}\n`;
    csvContent += `Wallet Address: ${walletAddress}\n`;
    csvContent += `Total Value: $${totalValue.toFixed(2)}\n`;
    csvContent += `Total Tokens: ${tokens.length}\n\n`;
    
    const allocationData = allocation.map(alloc => ({
      Token: alloc.token,
      Symbol: alloc.symbol,
      'Value ($)': alloc.value.toFixed(2),
      'Percentage (%)': alloc.percentage.toFixed(2),
    }));
    
    csvContent += 'ALLOCATION BREAKDOWN\n';
    csvContent += arrayToCSV(allocationData);
    
    // Download file
    const filename = `jarrybank_allocation_${format(Date.now(), 'yyyy-MM-dd_HHmm')}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
    
  } catch (error) {
    console.error('Failed to export allocation report:', error);
    throw new Error('Failed to generate allocation report. Please try again.');
  }
}