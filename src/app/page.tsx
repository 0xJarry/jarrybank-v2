"use client";

import { Header } from "@/components/layout/Header";
import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview";
import { DeFiPositions } from "@/components/portfolio/DeFiPositions";
import { TransactionHistory } from "@/components/portfolio/TransactionHistory";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

/**
 * Main page component for JarryBank portfolio tracker
 * Displays portfolio overview, DeFi positions, and transaction history
 * Includes demo mode for testing without wallet connection
 */
export default function HomePage() {
  const { address, chainId } = useAccount();
  const { setConnection, isConnected } = usePortfolioStore();
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Sync wallet connection state with portfolio store
  useEffect(() => {
    if (address && chainId) {
      setConnection(address, chainId);
    } else if (!isDemoMode) {
      setConnection(null, null);
    }
  }, [address, chainId, setConnection, isDemoMode]);

  // Handle demo mode activation
  const handleDemoMode = () => {
    setIsDemoMode(true);
    // Simulate a demo wallet connection
    setConnection("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 43114); // Avalanche C-Chain
  };

  // Check if we should show the portfolio (either real connection or demo mode)
  const shouldShowPortfolio = isConnected || isDemoMode;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {!shouldShowPortfolio ? (
          <div className="text-center py-20">
            <div className="max-w-3xl mx-auto">
              <div className="mb-12">
                <h1 className="text-6xl font-bold bg-linear-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
                  Welcome to JarryBank
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Track your DeFi portfolio, manage positions, and claim rewards
                  across Avalanche protocols
                </p>
              </div>

              <div className="bg-white bg-opacity-80 backdrop-blur-sm border border-white border-opacity-40 rounded-2xl shadow-xl p-10 max-w-lg mx-auto hover:bg-white hover:bg-opacity-90 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
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
                  <p className="text-slate-700 font-semibold text-lg">
                    Connect your wallet to get started
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="text-slate-400 text-sm font-medium">or</div>
                  <button
                    onClick={handleDemoMode}
                    className="px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-0 text-lg"
                  >
                    🧪 Try Demo Mode
                  </button>
                </div>

                {isDemoMode && (
                  <div className="mt-8 p-4 bg-linear-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-xl">
                    <p className="text-amber-800 text-sm font-medium">
                      Demo mode active - showing sample portfolio data
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Demo Mode Banner */}
            {isDemoMode && (
              <div className="mb-8 p-6 bg-linear-to-r from-amber-100 to-orange-100 border border-amber-300 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">🧪</span>
                    <div>
                      <span className="text-amber-800 font-semibold text-xl">
                        Demo Mode Active
                      </span>
                      <div className="text-amber-700 text-sm">
                        Sample data • Avalanche C-Chain
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsDemoMode(false);
                      setConnection(null, null);
                    }}
                    className="px-6 py-3 text-amber-800 hover:text-amber-900 text-sm font-medium border border-amber-400 hover:border-amber-500 rounded-lg transition-colors bg-white bg-opacity-60 hover:bg-white hover:bg-opacity-80"
                  >
                    Exit Demo
                  </button>
                </div>
              </div>
            )}

            {/* Portfolio Overview Section */}
            <section id="portfolio" className="mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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
              <h2 className="text-4xl font-bold text-slate-800 mb-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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

            {/* Transaction History Section */}
            <section id="transactions" className="mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                Transaction History
              </h2>
              <TransactionHistory />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
