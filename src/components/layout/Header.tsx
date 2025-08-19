'use client'

import { Mountain } from 'lucide-react'
import { ThemeToggle, ThemeSwitcher, WalletConnect } from '@/components/ui'
import Link from 'next/link'

/**
 * Main header component with navigation and wallet connection
 * Features wallet connect button, portfolio overview, and theme switcher
 */
export function Header() {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-sm transition-colors duration-200 supports-backdrop-filter:shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="from-primary to-primary/80 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-md">
                <Mountain className="text-primary-foreground h-5 w-5" />
              </div>
              <span className="text-foreground text-xl font-bold transition-colors duration-200">
                JarryBank
              </span>
            </div>

            {/* Navigation Links - matches image */}
            <nav className="ml-8 hidden items-center space-x-6 md:flex">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Portfolio
              </Link>
              <a
                href="#defi"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                DeFi Positions
              </a>
              <Link
                href="/brand-colors"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Brand Colors
              </Link>
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
  )
}
