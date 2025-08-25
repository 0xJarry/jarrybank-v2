/**
 * HistoricalChart Component
 * Line chart for portfolio value over time
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { type Address } from 'viem';
import { getHistoricalValues, type TimePeriod } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Component props
 */
interface HistoricalChartProps {
  walletAddress: Address;
  period: TimePeriod;
  height?: number;
  className?: string;
}

/**
 * Chart data point
 */
interface ChartDataPoint {
  timestamp: number;
  value: number;
  formattedDate: string;
}

/**
 * Period options
 */
const PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: 'all', label: 'ALL' },
];

/**
 * HistoricalChart component
 */
export function HistoricalChart({
  walletAddress,
  period,
  height = 300,
  className,
}: HistoricalChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Format date based on period
   */
  const formatDate = useMemo(() => {
    return (timestamp: number) => {
      switch (period) {
        case '24h':
          return format(timestamp, 'HH:mm');
        case '7d':
          return format(timestamp, 'MMM dd');
        case '30d':
        case '90d':
          return format(timestamp, 'MMM dd');
        case 'all':
          return format(timestamp, 'MMM yyyy');
        default:
          return format(timestamp, 'MMM dd');
      }
    };
  }, [period]);

  /**
   * Load historical data
   */
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getHistoricalValues(walletAddress, period);
        
        const chartData: ChartDataPoint[] = result.timestamps.map((timestamp, index) => ({
          timestamp,
          value: result.values[index],
          formattedDate: formatDate(timestamp),
        }));
        
        setData(chartData);
      } catch (err) {
        console.error('Failed to load historical data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    }
    
    if (walletAddress) {
      loadData();
    }
  }, [walletAddress, period, formatDate]);

  /**
   * Calculate trend
   */
  const trend = useMemo(() => {
    if (data.length < 2) return 'neutral';
    
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    
    if (lastValue > firstValue) return 'positive';
    if (lastValue < firstValue) return 'negative';
    return 'neutral';
  }, [data]);

  /**
   * Custom tooltip
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const timestamp = payload[0].payload.timestamp;
      
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">
            {format(timestamp, 'MMM dd, yyyy HH:mm')}
          </p>
          <p className="text-sm font-semibold">
            ${value.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
        </div>
      );
    }
    
    return null;
  };

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        <div className="animate-pulse text-sm text-muted-foreground">Loading chart data...</div>
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
        <div className="text-sm text-muted-foreground">No historical data available</div>
      </div>
    );
  }

  /**
   * Get line color based on trend
   */
  const getLineColor = () => {
    switch (trend) {
      case 'positive':
        return '#10B981'; // green-500
      case 'negative':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="formattedDate"
            className="fill-muted-foreground text-xs"
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            className="fill-muted-foreground text-xs"
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={getLineColor()}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: getLineColor(), strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Chart info */}
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{data.length} data points</span>
        <span className={cn('capitalize', {
          'text-green-500': trend === 'positive',
          'text-red-500': trend === 'negative',
        })}>
          {trend} trend
        </span>
      </div>
    </div>
  );
}