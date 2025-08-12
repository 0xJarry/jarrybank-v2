"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import { formatCurrency, formatNumber, truncateAddress } from "@/lib/utils";
import { RefreshCw, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/**
 * Portfolio overview component displaying token balances and total value
 * Shows aggregated portfolio information with refresh functionality
 */
export function PortfolioOverview() {
  const { totalValue, lastUpdated } = usePortfolioStore();
  const [timeAgo, setTimeAgo] = useState<string>("");

  // Update time ago display
  useEffect(() => {
    if (lastUpdated) {
      const updateTimeAgo = () => {
        const seconds = Math.floor((Date.now() - lastUpdated) / 1000);
        if (seconds < 60) {
          setTimeAgo(`${seconds}s ago`);
        } else if (seconds < 3600) {
          setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
        } else {
          setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
        }
      };

      updateTimeAgo();
      const interval = setInterval(updateTimeAgo, 1000);
      return () => clearInterval(interval);
    }
  }, [lastUpdated]);

  // Mock data for development - replace with real data fetching
  const mockTokens = [
    {
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      symbol: "WAVAX",
      name: "Wrapped AVAX",
      decimals: 18,
      balance: "1000000000000000000",
      price: 25.5,
      value: 25.5,
      logoURI: "/tokens/avalanche-avax-logo.png",
      chainId: 43114,
    },
    {
      address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      symbol: "WETH.e",
      name: "Wrapped Ether",
      decimals: 18,
      balance: "500000000000000000",
      price: 3200.0,
      value: 1600.0,
      logoURI: "/tokens/ethereum-eth-logo.png",
      chainId: 43114,
    },
  ];

  const handleRefresh = () => {
    // TODO: Implement real data refresh
    console.log("Refreshing portfolio data...");
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <Card className="bg-white bg-opacity-80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-700">
                Total Value
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 mb-2">
              {formatCurrency(totalValue || 1625.5)}
            </div>
            <div className="flex items-center text-sm text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+2.5% today</span>
            </div>
          </CardContent>
        </Card>

        {/* Token Count */}
        <Card className="bg-white bg-opacity-80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-700">Tokens</CardTitle>
              <span className="text-2xl font-bold text-slate-800">
                {mockTokens.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600">
              Across {mockTokens.length} different assets
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <Card className="bg-white bg-opacity-80 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-700">
                Last Updated
              </CardTitle>
              <RefreshCw className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 mb-2">
              {timeAgo || "Just now"}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="text-sm text-blue-500 hover:text-blue-400 p-0 h-auto"
            >
              Refresh now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Token Balances Table */}
      <Card className="bg-white bg-opacity-80 backdrop-blur-sm border-slate-200 overflow-hidden shadow-lg">
        <CardHeader className="px-6 py-4 border-b border-slate-200">
          <CardTitle className="text-lg text-slate-800">
            Token Balances
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 bg-opacity-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockTokens.map((token, index) => (
                  <tr
                    key={token.address}
                    className="hover:bg-slate-100 hover:bg-opacity-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                          {token.logoURI ? (
                            <Image
                              src={token.logoURI}
                              alt={token.symbol}
                              width={24}
                              height={24}
                              className="h-6 w-6 rounded-full"
                              priority
                            />
                          ) : (
                            <span className="text-xs text-slate-500">
                              {token.symbol[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            {token.symbol}
                          </div>
                          <div className="text-sm text-slate-600">
                            {token.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800">
                        {formatNumber(
                          parseFloat(token.balance) /
                            Math.pow(10, token.decimals),
                          4
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {truncateAddress(token.address)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {formatCurrency(token.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {formatCurrency(token.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        {index % 2 === 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={
                            index % 2 === 0 ? "text-green-500" : "text-red-500"
                          }
                        >
                          {index % 2 === 0 ? "+1.2%" : "-0.8%"}
                        </span>
                      </div>
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
