"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { RefreshCw, TrendingUp, DollarSign, TrendingDown } from "lucide-react";
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

  // Mock data for development - matches image exactly
  const mockTokens = [
    {
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      symbol: "WAVAX",
      name: "Wrapped AVAX",
      decimals: 18,
      balance: "1000000000000000000",
      price: 25.5,
      value: 25.5,
      change: 1.2,
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
      change: -0.8,
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
      {/* Portfolio Summary Cards - matches image layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <Card className="bg-card border-border hover:bg-accent/45 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-card-foreground font-semibold">
                Total Value
              </CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground mb-2">
              {formatCurrency(totalValue || 1625.5)}
            </div>
            <div className="flex items-center text-sm text-primary">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+2.5% today</span>
            </div>
          </CardContent>
        </Card>

        {/* Token Count */}
        <Card className="bg-card border-border hover:bg-accent/45 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-card-foreground font-semibold">
                Tokens
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground mb-2">
              {mockTokens.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Across {mockTokens.length} different assets
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <Card className="bg-card border-border hover:bg-accent/45 transition-all duration-300 shadow-sm hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-card-foreground font-semibold">
                Last Updated
              </CardTitle>
              <RefreshCw className="h-5 w-5 text-primary hover:text-primary/80 cursor-pointer transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-card-foreground mb-2">
              {timeAgo || "14m ago"}
            </div>
            <div className="text-sm text-primary cursor-pointer hover:underline">
              Refresh now
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Balances Table - matches image exactly */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">
          Token Balances
        </h3>

        {/* Table Header */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 border-b border-border font-medium text-sm text-muted-foreground">
            <div>TOKEN</div>
            <div>BALANCE</div>
            <div>PRICE</div>
            <div>VALUE</div>
            <div>CHANGE</div>
          </div>

          {/* Table Rows */}
          {mockTokens.map((token) => (
            <div
              key={token.address}
              className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-b-0 hover:bg-accent/45 transition-colors"
            >
              {/* Token Column */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-muted/50 border border-border flex items-center justify-center">
                  <Image
                    src={token.logoURI}
                    alt={token.symbol}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">
                    {token.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {token.address.slice(0, 6)}...{token.address.slice(-4)}
                  </div>
                </div>
              </div>

              {/* Balance Column */}
              <div className="flex items-center">
                <div className="text-card-foreground font-medium">
                  {formatNumber(
                    parseFloat(token.balance) / Math.pow(10, token.decimals),
                    4
                  )}
                </div>
              </div>

              {/* Price Column */}
              <div className="flex items-center">
                <div className="text-card-foreground font-medium">
                  {formatCurrency(token.price)}
                </div>
              </div>

              {/* Value Column */}
              <div className="flex items-center">
                <div className="text-card-foreground font-medium">
                  {formatCurrency(token.value)}
                </div>
              </div>

              {/* Change Column */}
              <div className="flex items-center">
                <div
                  className={`flex items-center text-sm font-medium ${
                    token.change >= 0 ? "text-primary" : "text-destructive"
                  }`}
                >
                  {token.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {token.change >= 0 ? "+" : ""}
                    {token.change}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
