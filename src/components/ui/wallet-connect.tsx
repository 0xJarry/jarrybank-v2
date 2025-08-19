'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button } from '@/components/ui/button'

/**
 * Custom wallet connection component with consistent theming
 * Handles wallet connection states: loading, disconnected, connected, and wrong network
 */
export function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div className="flex items-center space-x-2">
            {(() => {
              // Loading state - shows skeleton loader
              if (!ready) {
                return (
                  <div className="bg-muted border-border h-9 w-20 animate-pulse rounded-lg border" />
                )
              }

              // Disconnected state - shows connect button
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} size="sm" className="h-8 px-6 py-2">
                    Connect
                  </Button>
                )
              }

              // Wrong network state - shows network switch button
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="destructive"
                    size="sm"
                    className="h-8 px-6 py-2"
                  >
                    Wrong network
                  </Button>
                )
              }

              // Connected state - shows network and account buttons
              return (
                <div className="flex items-center space-x-2">
                  {/* Network selector button */}
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    size="sm"
                    className="flex h-8 items-center px-4 py-2"
                  >
                    <div className="bg-primary mr-2 h-3 w-3 flex-shrink-0 rounded-full" />
                    <span className="max-w-24 truncate">{chain.name}</span>
                  </Button>

                  {/* Account button */}
                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    size="sm"
                    className="h-8 px-4 py-2"
                  >
                    <span className="max-w-32 truncate">{account.displayName}</span>
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
