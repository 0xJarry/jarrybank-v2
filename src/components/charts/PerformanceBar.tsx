/**
 * PerformanceBar Component
 * Bar chart for token performance comparison
 */

'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { type Address } from 'viem';
import { type DiscoveredToken } from '@/lib/tokenDiscovery';
import { calculateTokenPerformance, type TimePeriod, type TokenPerformance } from '@/lib/analytics';
import { TokenLogo } from '@/components/portfolio/TokenLogo';
import { cn } from '@/lib/utils';

/**
 * Component props
 */
interface PerformanceBarProps {
  walletAddress: Address;
  tokens: DiscoveredToken[];
  period: TimePeriod;
  metric: 'change' | 'changePercent' | 'roi';
  height?: number;
  maxBars?: number;
  className?: string;
}

/**
 * Chart data point
 */
interface ChartDataPoint extends TokenPerformance {
  color: string;
  displayValue: number;
}

/**
 * Metric configuration
 */
const METRIC_CONFIG = {
  change: {
    label: 'Absolute Change ($)',
    format: (value: number) => `$${value.toFixed(2)}`,
  },
  changePercent: {
    label: 'Percentage Change (%)',
    format: (value: number) => `${value.toFixed(1)}%`,
  },
  roi: {
    label: 'ROI (%)',
    format: (value: number) => `${value.toFixed(1)}%`,
  },
};

/**
 * PerformanceBar component
 */
export function PerformanceBar({
  walletAddress,
  tokens,
  period,
  metric,
  height = 400,
  maxBars = 10,
  className,
}: PerformanceBarProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load performance data
   */
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        const performances = await calculateTokenPerformance(walletAddress, tokens, period);
        
        // Sort by the selected metric
        const sorted = [...performances].sort((a, b) => {
          const aValue = a[metric];
          const bValue = b[metric];
          return Math.abs(bValue) - Math.abs(aValue); // Sort by absolute value for visual impact
        });
        
        // Take top performers
        const topPerformers = sorted.slice(0, maxBars);
        
        // Create chart data with colors
        const chartData: ChartDataPoint[] = topPerformers.map(perf => {
          const value = perf[metric];
          const color = value >= 0 ? '#10B981' : '#EF4444'; // green for positive, red for negative
          
          return {
            ...perf,
            color,
            displayValue: value,
          };
        });
        
        setData(chartData);
      } catch (err) {
        console.error('Failed to load performance data:', err);
        setError('Failed to load performance data');
      } finally {
        setLoading(false);
      }
    }
    
    if (walletAddress && tokens.length > 0) {
      loadData();
    }
  }, [walletAddress, tokens, period, metric, maxBars]);

  /**
   * Custom tooltip
   */
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataPoint }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TokenLogo 
              address={data.address}
              symbol={data.symbol}
              size={20}
            />
            <div>
              <p className="text-sm font-semibold">{data.symbol}</p>
              <p className="text-xs text-muted-foreground">{data.name}</p>
            </div>
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Current Value:</span>
              <span className="font-medium">${data.currentValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Previous Value:</span>
              <span>${data.previousValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Change:</span>
              <span className={cn('font-medium', {
                'text-green-500': data.change >= 0,
                'text-red-500': data.change < 0,
              })}>
                {METRIC_CONFIG[metric].format(data[metric])}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Allocation:</span>
              <span>{data.allocation.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Custom bar shape removed - using Cell components instead

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        <div className="animate-pulse text-sm text-muted-foreground">Loading performance data...</div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  /**
   * No data state
   */
  if (data.length === 0) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        <div className="text-center text-muted-foreground">
          <div className="text-lg mb-2">📊</div>
          <div className="text-sm">No performance data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Token Performance</h3>
        <p className="text-sm text-muted-foreground">
          {METRIC_CONFIG[metric].label} over {period}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="symbol"
            className="fill-muted-foreground text-xs"
            axisLine={false}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            className="fill-muted-foreground text-xs"
            axisLine={false}
            tickLine={false}
            tickFormatter={METRIC_CONFIG[metric].format}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="displayValue"
            radius={[2, 2, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Performance summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
        <div>
          <div className="font-semibold text-green-500">
            {data.filter(d => d.displayValue > 0).length}
          </div>
          <div className="text-muted-foreground">Gainers</div>
        </div>
        <div>
          <div className="font-semibold text-red-500">
            {data.filter(d => d.displayValue < 0).length}
          </div>
          <div className="text-muted-foreground">Losers</div>
        </div>
        <div>
          <div className="font-semibold">
            {data.length > 0 ? METRIC_CONFIG[metric].format(
              Math.max(...data.map(d => d.displayValue))
            ) : '0'}
          </div>
          <div className="text-muted-foreground">Best</div>
        </div>
        <div>
          <div className="font-semibold">
            {data.length > 0 ? METRIC_CONFIG[metric].format(
              Math.min(...data.map(d => d.displayValue))
            ) : '0'}
          </div>
          <div className="text-muted-foreground">Worst</div>
        </div>
      </div>
    </div>
  );
}