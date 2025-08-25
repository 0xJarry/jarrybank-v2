/**
 * AllocationPie Component
 * Pie chart for asset allocation distribution
 */

'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { type DiscoveredToken } from '@/lib/tokenDiscovery';
import { generateAllocationBreakdown, type AllocationData } from '@/lib/analytics';
import { TokenLogo } from '@/components/portfolio/TokenLogo';
import { cn } from '@/lib/utils';

/**
 * Component props
 */
interface AllocationPieProps {
  tokens: DiscoveredToken[];
  size?: number;
  showLegend?: boolean;
  minPercentage?: number;
  className?: string;
}

/**
 * AllocationPie component
 */
export function AllocationPie({
  tokens,
  size = 300,
  showLegend = true,
  minPercentage = 1,
  className,
}: AllocationPieProps) {
  /**
   * Calculate allocation data
   */
  const allocationData = useMemo(() => {
    return generateAllocationBreakdown(tokens, minPercentage);
  }, [tokens, minPercentage]);

  /**
   * Total portfolio value
   */
  const totalValue = useMemo(() => {
    return tokens.reduce((sum, token) => sum + (token.value || 0), 0);
  }, [tokens]);

  /**
   * Custom tooltip
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as AllocationData;
      
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold">{data.token}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
          <p className="text-sm font-medium">
            {data.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    
    return null;
  };

  /**
   * Custom legend
   */
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="grid grid-cols-1 gap-2 text-sm">
        {payload.map((entry: any, index: number) => {
          const data = entry.payload as AllocationData;
          const token = tokens.find(t => t.symbol === data.symbol);
          
          return (
            <div key={index} className="flex items-center gap-2">
              {token && data.symbol !== 'OTHERS' && (
                <TokenLogo 
                  address={token.address} 
                  symbol={token.symbol}
                  size={16}
                />
              )}
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: data.color }}
              />
              <span className="flex-1 truncate">{data.token}</span>
              <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Empty state
   */
  if (allocationData.length === 0 || totalValue === 0) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height: size }}>
        <div className="text-center text-muted-foreground">
          <div className="text-lg mb-2">📊</div>
          <div className="text-sm">No allocation data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <ResponsiveContainer width={size} height={size}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                outerRadius={size * 0.35}
                innerRadius={size * 0.15}
                paddingAngle={2}
                dataKey="percentage"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="relative -mt-[calc(50%+20px)] text-center pointer-events-none">
            <div className="text-lg font-bold">
              ${totalValue.toLocaleString(undefined, { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
              })}
            </div>
            <div className="text-xs text-muted-foreground">Total Value</div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex-1 min-w-0">
            <h4 className="font-medium mb-3">Asset Allocation</h4>
            <CustomLegend payload={allocationData} />
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-semibold">{tokens.length}</div>
          <div className="text-xs text-muted-foreground">Assets</div>
        </div>
        <div>
          <div className="text-lg font-semibold">
            {allocationData.length > 0 
              ? allocationData[0].percentage.toFixed(1) + '%'
              : '0%'
            }
          </div>
          <div className="text-xs text-muted-foreground">Largest</div>
        </div>
        <div>
          <div className="text-lg font-semibold">
            {allocationData.filter(a => a.percentage >= 5).length}
          </div>
          <div className="text-xs text-muted-foreground">Major (&gt;5%)</div>
        </div>
      </div>
    </div>
  );
}