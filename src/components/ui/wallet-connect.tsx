"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

/**
 * Custom wallet connection component with consistent theming
 * Handles wallet connection states: loading, disconnected, connected, and wrong network
 */
export function WalletConnect() {
  return (
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
              // Loading state - shows skeleton loader
              if (!ready) {
                return (
                  <div className="h-9 w-20 rounded-lg bg-muted border border-border animate-pulse" />
                );
              }

              // Disconnected state - shows connect button
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    size="sm"
                    className="px-6 py-2 h-8"
                  >
                    Connect
                  </Button>
                );
              }

              // Wrong network state - shows network switch button
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    size="sm"
                    className="px-6 py-2 h-8"
                  >
                    Wrong network
                  </Button>
                );
              }

              // Connected state - shows network and account buttons
              return (
                <div className="flex items-center space-x-2">
                  {/* Network selector button */}
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="sm"
                    className="px-4 py-2 h-8 flex items-center"
                  >
                    <div className="h-3 w-3 rounded-full bg-primary mr-2 flex-shrink-0" />
                    <span className="truncate max-w-24">{chain.name}</span>
                  </Button>

                  {/* Account button */}
                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    size="sm"
                    className="px-4 py-2 h-8"
                  >
                    <span className="truncate max-w-32">
                      {account.displayName}
                    </span>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
