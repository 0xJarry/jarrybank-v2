'use client'

import { formatCurrency } from '@/lib/utils'
import { TrendingUp, CheckCircle, ChefHat, BarChart3, Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * DeFi positions component displaying protocol positions and rewards
 * Shows aggregated DeFi exposure across different protocols
 */
export function DeFiPositions() {
  // Mock data for development - matches image exactly
  const mockProtocols = [
    {
      name: 'Trader Joe',
      positions: 1,
      totalValue: 1250.0,
      rewards: 188.75,
      icon: '🦅',
      color: 'text-destructive',
    },
    {
      name: 'GMX',
      positions: 1,
      totalValue: 1600.0,
      rewards: 45.0,
      icon: '📈',
      color: 'text-primary',
    },
    {
      name: 'Benqi',
      positions: 1,
      totalValue: 51.0,
      rewards: 18.75,
      icon: '🏦',
      color: 'text-muted-foreground',
    },
  ]

  const mockPositions = [
    {
      protocol: 'Trader Joe',
      type: 'liquidity',
      symbol: 'WAVAX-USDC 1.0000',
      value: 1250.0,
      health: 'healthy',
      rewards: [
        { token: 'JOE', amount: '500.00', value: 125.0 },
        { token: 'WAVAX', amount: '2.50', value: 63.75 },
      ],
    },
    {
      protocol: 'GMX',
      type: 'trading',
      symbol: 'WETH.e Long',
      value: 1600.0,
      health: 'healthy',
      rewards: [{ token: 'GMX', amount: '18.00', value: 45.0 }],
    },
    {
      protocol: 'Benqi',
      type: 'lending',
      symbol: 'WAVAX-USDC',
      value: 51.0,
      health: 'healthy',
      rewards: [{ token: 'BENQI', amount: '75.00', value: 18.75 }],
    },
  ]

  const totalDeFiValue = mockProtocols.reduce((sum, protocol) => sum + protocol.totalValue, 0)

  const getProtocolIcon = (protocolName: string) => {
    switch (protocolName) {
      case 'Trader Joe':
        return <ChefHat className="text-destructive h-5 w-5" />
      case 'GMX':
        return <BarChart3 className="text-primary h-5 w-5" />
      case 'Benqi':
        return <Building className="text-muted-foreground h-5 w-5" />
      default:
        return (
          <span className="text-2xl">
            {mockProtocols.find((p) => p.name === protocolName)?.icon}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Protocol Summary Cards - matches image layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Individual Protocol Cards */}
        {mockProtocols.map((protocol) => (
          <Card
            key={protocol.name}
            className="bg-card border-border hover:bg-muted transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-card-foreground text-lg">{protocol.name}</CardTitle>
                {getProtocolIcon(protocol.name)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-card-foreground mb-2 text-3xl font-bold">
                {formatCurrency(protocol.totalValue)}
              </div>
              <div className="text-muted-foreground mb-1 text-sm">
                {protocol.positions} position
                {protocol.positions !== 1 ? 's' : ''}
              </div>
              <div className="text-primary text-sm font-medium">
                +{formatCurrency(protocol.rewards)} rewards
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Total DeFi Value Card - matches image exactly */}
        <Card className="bg-card border-border hover:bg-muted transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground text-lg">Total DeFi</CardTitle>
              <TrendingUp className="text-card-foreground h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-card-foreground mb-2 text-3xl font-bold">
              {formatCurrency(totalDeFiValue)}
            </div>
            <div className="text-card-foreground/80 text-sm">Across all protocols</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions Table - matches image exactly */}
      <div className="space-y-4">
        <h3 className="text-foreground text-xl font-semibold">Active Positions</h3>

        {/* Table Header */}
        <div className="bg-card border-border overflow-hidden rounded-xl border">
          <div className="bg-muted/50 border-border text-muted-foreground grid grid-cols-6 gap-4 border-b p-4 text-sm font-medium">
            <div>PROTOCOL</div>
            <div>POSITION</div>
            <div>VALUE</div>
            <div>HEALTH</div>
            <div>REWARDS</div>
            <div>ACTIONS</div>
          </div>

          {/* Table Rows */}
          {mockPositions.map((position, index) => (
            <div
              key={index}
              className="border-border hover:bg-muted grid grid-cols-6 gap-4 border-b p-4 transition-colors last:border-b-0"
            >
              {/* Protocol Column */}
              <div className="flex items-center space-x-3">
                {getProtocolIcon(position.protocol)}
                <div className="text-card-foreground font-medium">{position.protocol}</div>
              </div>

              {/* Position Column */}
              <div className="flex items-center">
                <div className="text-card-foreground font-medium">{position.symbol}</div>
              </div>

              {/* Value Column */}
              <div className="flex items-center">
                <div className="text-card-foreground font-medium">
                  {formatCurrency(position.value)}
                </div>
              </div>

              {/* Health Column */}
              <div className="flex items-center">
                <div className="text-primary bg-primary/10 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  <span>healthy</span>
                </div>
              </div>

              {/* Rewards Column */}
              <div className="flex items-center">
                <div className="text-card-foreground text-sm">
                  {position.rewards.map((reward, rewardIndex) => (
                    <div key={rewardIndex} className="mb-1 last:mb-0">
                      {reward.token} {formatCurrency(reward.value)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Column */}
              <div className="flex items-center">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/70 text-primary-foreground"
                >
                  Claim
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
