"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePortfolioStore } from "@/store/portfolioStore";
import { TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Main header component with navigation and wallet connection
 * Features wallet connect button and portfolio overview
 */
export function Header() {
  const { isConnected, totalValue } = usePortfolioStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white bg-opacity-95 backdrop-blur supports-[backdrop-filter]:bg-white bg-opacity-75 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">
                JarryBank
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              <a
                href="#portfolio"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Portfolio
              </a>
              <a
                href="#defi"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                DeFi Positions
              </a>
              <a
                href="#transactions"
                className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                Transactions
              </a>
            </nav>
          </div>

          {/* Right side - Portfolio Value and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Portfolio Value Display */}
            {isConnected && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 border border-slate-200">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-slate-700">
                  {totalValue > 0
                    ? `$${totalValue.toLocaleString()}`
                    : "Loading..."}
                </span>
              </div>
            )}

            {/* Wallet Connection */}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div className="flex items-center space-x-2">
                    {(() => {
                      if (!ready) {
                        return (
                          <div className="h-9 w-20 rounded-lg bg-slate-200 animate-pulse" />
                        );
                      }

                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-md"
                          >
                            <span>Connect</span>
                          </Button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <Button
                            onClick={openChainModal}
                            variant="destructive"
                          >
                            <span>Wrong network</span>
                          </Button>
                        );
                      }

                      return (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openChainModal}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 border-slate-200"
                          >
                            <div className="h-4 w-4 rounded-full bg-green-500 mr-2" />
                            <span>{chain.name}</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openAccountModal}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-800 border-slate-200"
                          >
                            <span>{account.displayName}</span>
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </header>
  );
}
