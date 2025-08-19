'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/themeStore'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

/**
 * Portfolio Performance Chart Component
 * Displays portfolio value over time with interactive time range selection
 * Uses Recharts for smooth area chart visualization
 * Dynamically adapts colors based on current theme
 */
export function PortfolioPerformanceChart() {
  // State for active time range selection
  const [activeTimeRange, setActiveTimeRange] = useState<'3m' | '30d' | '7d'>('30d')

  // State for chart colors that update with theme changes
  const [chartColors, setChartColors] = useState({
    primary: 'hsl(0 100% 60%)',
    secondary: 'hsl(60 100% 50%)',
  })

  // Get current theme to trigger re-renders when theme changes
  const { currentTheme } = useThemeStore()

  // Update chart colors when theme changes
  useEffect(() => {
    const updateChartColors = () => {
      const root = document.documentElement
      const primary =
        getComputedStyle(root).getPropertyValue('--chart-1').trim() || 'hsl(0 100% 60%)'
      const secondary =
        getComputedStyle(root).getPropertyValue('--chart-2').trim() || 'hsl(60 100% 50%)'

      setChartColors({ primary, secondary })
    }

    // Update colors immediately
    updateChartColors()

    // Set up a small delay to catch theme changes
    const timer = setTimeout(updateChartColors, 100)

    return () => clearTimeout(timer)
  }, [currentTheme])

  // Mock data for portfolio performance over time
  // Simulates realistic crypto portfolio fluctuations
  const mockData = [
    { date: 'May 31', totalValue: 1450, portfolioValue: 1200 },
    { date: 'Jun 2', totalValue: 1580, portfolioValue: 1320 },
    { date: 'Jun 4', totalValue: 1420, portfolioValue: 1180 },
    { date: 'Jun 6', totalValue: 1680, portfolioValue: 1450 },
    { date: 'Jun 8', totalValue: 1750, portfolioValue: 1520 },
    { date: 'Jun 10', totalValue: 1620, portfolioValue: 1380 },
    { date: 'Jun 12', totalValue: 1890, portfolioValue: 1650 },
    { date: 'Jun 14', totalValue: 1820, portfolioValue: 1580 },
    { date: 'Jun 16', totalValue: 2100, portfolioValue: 1850 },
    { date: 'Jun 18', totalValue: 1980, portfolioValue: 1720 },
    { date: 'Jun 20', totalValue: 1850, portfolioValue: 1600 },
    { date: 'Jun 22', totalValue: 1720, portfolioValue: 1480 },
    { date: 'Jun 24', totalValue: 1950, portfolioValue: 1700 },
    { date: 'Jun 26', totalValue: 1880, portfolioValue: 1630 },
    { date: 'Jun 28', totalValue: 1625, portfolioValue: 1400 },
    { date: 'Jun 29', totalValue: 1680, portfolioValue: 1450 },
  ]

  // Filter data based on selected time range
  const getFilteredData = () => {
    switch (activeTimeRange) {
      case '7d':
        return mockData.slice(-7)
      case '30d':
        return mockData
      case '3m':
        // For demo, we'll show the same data but could extend to 3 months
        return mockData
      default:
        return mockData
    }
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ value: number; name: string; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border-border rounded-lg border p-3 shadow-lg">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-primary">Total Value: ${payload[0].value.toLocaleString()}</p>
          <p className="text-secondary-foreground">
            Portfolio: ${payload[1].value.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-card border-border shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground text-xl font-semibold">
              Portfolio Performance
            </CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Performance over the last{' '}
              {activeTimeRange === '3m'
                ? '3 months'
                : activeTimeRange === '30d'
                  ? '30 days'
                  : '7 days'}
            </p>
          </div>

          {/* Time Range Selection Buttons */}
          <div className="flex space-x-2">
            <Button
              variant={activeTimeRange === '3m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTimeRange('3m')}
              className="h-8 px-3 py-1 text-xs"
            >
              Last 3 months
            </Button>
            <Button
              variant={activeTimeRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTimeRange('30d')}
              className="h-8 px-3 py-1 text-xs"
            >
              Last 30 days
            </Button>
            <Button
              variant={activeTimeRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTimeRange('7d')}
              className="h-8 px-3 py-1 text-xs"
            >
              Last 7 days
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={getFilteredData()}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              {/* Grid lines for better readability */}
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />

              {/* X-axis with dates */}
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />

              {/* Y-axis with values */}
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />

              {/* Custom tooltip */}
              <Tooltip content={<CustomTooltip />} />

              {/* Main portfolio area - uses dynamic theme colors */}
              <Area
                type="monotone"
                dataKey="totalValue"
                stackId="1"
                stroke={chartColors.primary}
                fill={chartColors.primary}
                fillOpacity={0.3}
                strokeWidth={2}
              />

              {/* Secondary portfolio area - uses dynamic theme colors */}
              <Area
                type="monotone"
                dataKey="portfolioValue"
                stackId="2"
                stroke={chartColors.secondary}
                fill={chartColors.secondary}
                fillOpacity={0.6}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: chartColors.primary,
                opacity: 0.3,
              }}
            ></div>
            <span className="text-muted-foreground">Total Portfolio Value</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: chartColors.secondary,
                opacity: 0.6,
              }}
            ></div>
            <span className="text-muted-foreground">Core Holdings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
