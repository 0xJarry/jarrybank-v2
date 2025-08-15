import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, avalanche } from "wagmi/chains";

/**
 * Get RPC URLs with fallback support
 * Priority: Custom URL -> Public RPC
 */
const getRpcUrls = () => {
  const urls = [];
  
  // Add custom RPC if provided
  if (process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL) {
    urls.push(process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL);
  }
  
  // Add fallback RPC if provided
  if (process.env.NEXT_PUBLIC_AVALANCHE_RPC_FALLBACK) {
    urls.push(process.env.NEXT_PUBLIC_AVALANCHE_RPC_FALLBACK);
  }
  
  // Always include public RPC as final fallback
  urls.push("https://api.avax.network/ext/bc/C/rpc");
  
  return urls;
};

/**
 * Wagmi configuration for Web3 integration
 * Supports Avalanche C-Chain with automatic RPC fallback
 */
export const config = getDefaultConfig({
  appName: "JarryBank",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [
    {
      ...avalanche,
      name: "Avalanche C-Chain",
      rpcUrls: {
        default: {
          http: getRpcUrls(),
        },
        public: {
          http: ["https://api.avax.network/ext/bc/C/rpc"],
        },
      },
    },
    mainnet,
  ],
  ssr: true,
});

export default config;
