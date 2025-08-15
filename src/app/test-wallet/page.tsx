"use client";

import { useWalletSync } from "@/hooks/useWalletSync";
import { usePortfolioStore } from "@/store/portfolioStore";
import { formatUnits } from "viem";

/**
 * Test page to verify wallet connection and token fetching
 */
export default function TestWalletPage() {
  const walletSync = useWalletSync();
  const { isConnected, address, tokens, totalValue } = usePortfolioStore();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Wallet Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Connection Status</h2>
          <p>Connected: {isConnected ? "✅ Yes" : "❌ No"}</p>
          <p>Address: {address || "Not connected"}</p>
          <p>Loading: {walletSync.isLoading ? "⏳ Loading..." : "✅ Ready"}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Portfolio Value</h2>
          <p>Total Value: ${totalValue.toFixed(2)}</p>
          <p>Token Count: {tokens.length}</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Token Balances</h2>
          {tokens.length === 0 ? (
            <p>No tokens found or wallet not connected</p>
          ) : (
            <ul className="space-y-2">
              {tokens.map((token) => (
                <li key={token.address} className="flex justify-between">
                  <span>{token.symbol}</span>
                  <span>
                    {parseFloat(
                      formatUnits(BigInt(token.balance), token.decimals)
                    ).toFixed(4)}{" "}
                    (${token.value.toFixed(2)})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}