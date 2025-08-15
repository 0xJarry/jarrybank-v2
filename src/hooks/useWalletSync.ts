"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useTokenBalances, useTokenPrices } from "./useTokenBalances";

/**
 * Hook to sync wallet connection state with portfolio store
 * Automatically fetches token balances when wallet connects
 * Clears data when wallet disconnects
 */
export function useWalletSync() {
  const { address, chainId, isConnected } = useAccount();
  const {
    setConnection,
    setTokens,
    setLoading,
    clearPortfolio,
  } = usePortfolioStore();
  
  // Fetch token balances
  const { tokens, isLoading: balancesLoading } = useTokenBalances();
  
  // Fetch token prices and calculate values
  const { tokens: tokensWithPrices, isLoading: pricesLoading } = useTokenPrices(tokens);

  // Sync wallet connection state
  useEffect(() => {
    if (isConnected && address && chainId) {
      setConnection(address, chainId);
    } else {
      setConnection(null, null);
      clearPortfolio();
    }
  }, [isConnected, address, chainId, setConnection, clearPortfolio]);

  // Update tokens in store when data changes
  useEffect(() => {
    if (tokensWithPrices.length > 0) {
      setTokens(tokensWithPrices);
    }
  }, [tokensWithPrices, setTokens]);

  // Update loading state
  useEffect(() => {
    setLoading(balancesLoading || pricesLoading);
  }, [balancesLoading, pricesLoading, setLoading]);

  return {
    isConnected,
    address,
    chainId,
    tokens: tokensWithPrices,
    isLoading: balancesLoading || pricesLoading,
  };
}