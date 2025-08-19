'use client'

import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview'
import { DeFiPositions } from '@/components/portfolio/DeFiPositions'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { usePortfolioStore } from '@/store/portfolioStore'
import { TransactionHistory } from '@/components/portfolio/TransactionHistory'
import { useWalletSync } from '@/hooks/useWalletSync'

/**
 * Main page component for JarryBank portfolio tracker
 * Displays portfolio overview and DeFi positions
 * Includes demo mode for testing without wallet connection
 */
export default function HomePage() {
  const { address, chainId } = useAccount()
  const { setConnection, isConnected } = usePortfolioStore()
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Sync wallet data with portfolio store
  useWalletSync()

  // Sync wallet connection state with portfolio store
  useEffect(() => {
    if (address && chainId) {
      setConnection(address, chainId)
    } else if (!isDemoMode) {
      setConnection(null, null)
    }
  }, [address, chainId, setConnection, isDemoMode])

  // Handle demo mode activation
  const handleDemoMode = () => {
    setIsDemoMode(true)
    // Simulate a demo wallet connection
    setConnection('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 43114) // Avalanche C-Chain
  }

  // Check if we should show the portfolio (either real connection or demo mode)
  const shouldShowPortfolio = isConnected || isDemoMode

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      {!shouldShowPortfolio ? (
        <div className="py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12">
              {/* Main heading - using standard Tailwind colors */}
              <h1 className="from-primary to-primary mb-6 bg-gradient-to-r bg-clip-text text-6xl font-bold text-transparent">
                Welcome to JarryBank
              </h1>
              {/* Subtitle - using muted foreground for secondary text */}
              <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
                Track your DeFi portfolio, manage positions, and claim rewards across Avalanche
                protocols
              </p>
            </div>

            {/* Main card - using standard card classes */}
            <div className="bg-card hover:bg-accent/20 border-border mx-auto max-w-lg rounded-2xl border p-10 shadow-lg transition-all duration-200">
              <div className="mb-8">
                {/* Icon container - using primary colors */}
                <div className="from-primary to-primary/80 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
                  <svg
                    className="text-primary-foreground h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                {/* Description text - using foreground color */}
                <p className="text-foreground text-lg font-semibold">
                  Connect your wallet to get started
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                {/* Divider text - using muted foreground */}
                <div className="text-muted-foreground text-sm font-medium">or</div>
                {/* Demo button - using primary colors */}
                <button
                  onClick={handleDemoMode}
                  className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground transform rounded-xl border-0 bg-gradient-to-r px-10 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  🧪 Try Demo Mode
                </button>
              </div>

              {/* Demo mode indicator - using muted colors */}
              {isDemoMode && (
                <div className="bg-muted/50 border-border mt-8 rounded-xl border p-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    Demo mode active - showing sample portfolio data
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Demo Mode Banner - matches image layout */}
          {isDemoMode && (
            <div className="bg-accent/20 border-accent mb-8 rounded-xl border p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <span className="text-accent-foreground text-xl font-semibold">
                      Demo Mode Active
                    </span>
                    <div className="text-muted-foreground text-sm">
                      Sample data • Avalanche C-Chain
                    </div>
                  </div>
                </div>
                {/* Exit button - using accent theme */}
                <button
                  onClick={() => {
                    setIsDemoMode(false)
                    setConnection(null, null)
                  }}
                  className="text-accent-foreground border-accent bg-accent/20 hover:bg-accent/30 rounded-lg border px-6 py-3 text-sm font-medium transition-all duration-200"
                >
                  Exit Demo
                </button>
              </div>
            </div>
          )}

          {/* Portfolio Overview Section */}
          <section id="portfolio" className="mb-16">
            {/* Section heading - matches image */}
            <h2 className="text-foreground mb-10 flex items-center gap-4 text-4xl font-bold">
              {/* Icon container - using primary colors */}
              <div className="from-primary to-primary/80 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r shadow-lg">
                <svg
                  className="text-primary-foreground h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              Portfolio Overview
            </h2>
            <PortfolioOverview />
          </section>

          {/* DeFi Positions Section */}
          <section id="defi" className="mb-16">
            {/* Section heading - matches image */}
            <h2 className="text-foreground mb-10 flex items-center gap-4 text-4xl font-bold">
              {/* Icon container - using primary colors */}
              <div className="from-primary to-primary/80 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r shadow-lg">
                <svg
                  className="text-primary-foreground h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              DeFi Positions
            </h2>
            <DeFiPositions />
          </section>
          {/* DeFi Positions Section */}
          <section id="transactions" className="mb-16">
            {/* Section heading - matches image */}
            <h2 className="text-foreground mb-10 flex items-center gap-4 text-4xl font-bold">
              {/* Icon container - using primary colors */}
              <div className="from-primary to-primary/80 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r shadow-lg">
                <svg
                  className="text-primary-foreground h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              Transactions
            </h2>
            <TransactionHistory />
          </section>
        </>
      )}
    </main>
  )
}
