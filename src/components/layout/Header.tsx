"use client";

import { usePortfolioStore } from "@/store/portfolioStore";
import { Mountain } from "lucide-react";
import { ThemeToggle, ThemeSwitcher, WalletConnect } from "@/components/ui";

/**
 * Main header component with navigation and wallet connection
 * Features wallet connect button, portfolio overview, and theme switcher
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

          {/* Right side - Theme Switcher, and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Theme Switcher - replaces the Loading placeholder */}
            <ThemeSwitcher />

            {/* Wallet Connection - matches image */}
            <WalletConnect />

            {/* Theme Toggle - Light/Dark mode */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
