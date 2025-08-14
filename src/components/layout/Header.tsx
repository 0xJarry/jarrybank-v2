"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Mountain } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Main header component with navigation and wallet connection
 * Features wallet connect button and portfolio overview
 */
export function Header() {
  const { isConnected, totalValue } = usePortfolioStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <Mountain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground transition-colors duration-200">
                JarryBank
              </span>
            </div>

            {/* Navigation Links - matches image */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Portfolio
              </a>
              <a
                href="#defi"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                DeFi Positions
              </a>
              <a
                href="/brand-colors"
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Brand Colors
              </a>
            </nav>
          </div>

          {/* Right side - Portfolio Value and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Portfolio Value Display - matches image */}
            {isConnected && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted border border-border transition-colors duration-200">
                <span className="text-sm font-medium text-muted-foreground">
                  {totalValue > 0
                    ? `$${totalValue.toLocaleString()}`
                    : "Loading..."}
                </span>
              </div>
            )}

            {/* Wallet Connection - matches image */}
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
                          <div className="h-9 w-20 rounded-lg bg-muted border border-border animate-pulse" />
                        );
                      }

                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 shadow-md"
                          >
                            <span>Connect</span>
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="px-6 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium rounded-lg transition-all duration-200"
                          >
                            <span>Wrong network</span>
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={openChainModal}
                            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg border border-border transition-all duration-200"
                          >
                            <div className="h-3 w-3 rounded-full bg-primary mr-2 inline-block" />
                            <span>{chain.name}</span>
                          </button>

                          <button
                            onClick={openAccountModal}
                            className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg border border-border transition-all duration-200"
                          >
                            <span>{account.displayName}</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
