"use client";

import { formatCurrency } from "@/lib/utils";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * DeFi positions component displaying protocol positions and rewards
 * Shows aggregated DeFi exposure across different protocols
 */
export function DeFiPositions() {
  // Mock data for development - replace with real data fetching
  const mockProtocols = [
    {
      name: "Trader Joe",
      positions: 1,
      totalValue: 1250.0,
      rewards: 188.75,
      icon: "🦅",
    },
    {
      name: "GMX",
      positions: 1,
      totalValue: 1600.0,
      rewards: 45.0,
      icon: "📈",
    },
    {
      name: "Benqi",
      positions: 1,
      totalValue: 51.0,
      rewards: 18.75,
      icon: "🏦",
    },
  ];

  const mockPositions = [
    {
      protocol: "Trader Joe",
      type: "liquidity",
      symbol: "WAVAX-USDC",
      balance: "1.0000",
      value: 1250.0,
      health: "healthy",
      rewards: [
        { token: "JOE", amount: "500.00", value: 125.0 },
        { token: "WAVAX", amount: "2.50", value: 63.75 },
      ],
    },
    {
      protocol: "GMX",
      type: "trading",
      symbol: "WETH.e Long",
      balance: "0.5000",
      value: 1600.0,
      health: "warning",
      rewards: [{ token: "GMX", amount: "18.00", value: 45.0 }],
    },
    {
      protocol: "Benqi",
      type: "lending",
      symbol: "WAVAX Supply",
      balance: "2.0000",
      value: 51.0,
      health: "healthy",
      rewards: [{ token: "QI", amount: "75.00", value: 18.75 }],
    },
  ];

  const totalDeFiValue = mockProtocols.reduce(
    (sum, protocol) => sum + protocol.totalValue,
    0
  );

  const getHealthIcon = (health: string) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "danger":
        return "text-red-600 bg-red-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Protocol Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {mockProtocols.map((protocol) => (
          <Card
            key={protocol.name}
            className="bg-white bg-opacity-80 backdrop-blur-sm border-slate-200 shadow-lg"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{protocol.icon}</span>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {protocol.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {protocol.positions} positions
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {formatCurrency(protocol.totalValue)}
              </div>
              <div className="text-sm text-green-600 font-medium">
                +{formatCurrency(protocol.rewards)} rewards
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Total DeFi Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Total DeFi</h4>
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(totalDeFiValue)}
            </div>
            <div className="text-sm text-blue-100">Across all protocols</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions Table */}
      <Card className="bg-white bg-opacity-80 backdrop-blur-sm border-slate-200 overflow-hidden shadow-lg">
        <CardHeader className="px-6 py-4 border-b border-slate-200">
          <CardTitle className="text-lg text-slate-800">
            Active Positions
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 bg-opacity-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Health
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Rewards
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockPositions.map((position) => (
                  <tr
                    key={`${position.protocol}-${position.symbol}`}
                    className="hover:bg-slate-100 hover:bg-opacity-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-slate-200 flex items-center justify-center mr-3">
                          <span className="text-sm">📊</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            {position.protocol}
                          </div>
                          <div className="text-sm text-slate-600">
                            {position.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">
                        {position.symbol}
                      </div>
                      <div className="text-sm text-slate-600">
                        {position.balance}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {formatCurrency(position.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getHealthIcon(position.health)}
                        <span
                          className={`ml-2 text-xs px-2 py-1 rounded-full ${getHealthColor(position.health)}`}
                        >
                          {position.health}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {position.rewards.map((reward, index) => (
                          <div key={index} className="text-sm">
                            <span className="text-slate-800">
                              {reward.token}
                            </span>
                            <span className="text-slate-600 ml-1">
                              {formatCurrency(reward.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        disabled={position.health === "warning"}
                        className="px-3 py-1 h-auto"
                      >
                        Claim
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
