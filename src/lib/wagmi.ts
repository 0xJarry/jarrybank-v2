import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, avalanche } from "wagmi/chains";

/**
 * Wagmi configuration for Web3 integration
 * Supports Avalanche C-Chain as primary network with Ethereum mainnet as fallback
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
          http: [
            process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL ||
              "https://api.avax.network/ext/bc/C/rpc",
          ],
        },
        public: {
          http: [
            process.env.NEXT_PUBLIC_AVALANCHE_RPC_URL ||
              "https://api.avax.network/ext/bc/C/rpc",
          ],
        },
      },
    },
    mainnet,
  ],
  ssr: true,
});

export default config;
