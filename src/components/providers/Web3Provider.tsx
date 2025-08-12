"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import "@rainbow-me/rainbowkit/styles.css";

/**
 * Web3 Provider wrapper component
 * Provides Wagmi, RainbowKit, and React Query context to the application
 */
export function Web3Provider({ children }: { children: React.ReactNode }) {
  // Create a new QueryClient instance for React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - matches our caching strategy
        gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="en-US"
          showRecentTransactions={true}
          initialChain={config.chains[0]} // Default to Avalanche C-Chain
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
