# Wallet Connection Setup Guide

## Quick Start

### 1. Get WalletConnect Project ID (Required)

1. Go to https://cloud.walletconnect.com
2. Sign up or sign in
3. Create a new project
4. Copy your Project ID

### 2. Create Environment File

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your WalletConnect Project ID:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

### 3. Run the Application

```bash
npm run dev
```

Visit http://localhost:3000

## Features Implemented

✅ **Wallet Connection**
- Connect button in header
- Supports MetaMask, WalletConnect, and other wallets via RainbowKit
- Automatic reconnection on page refresh

✅ **Real Token Balances**
- Fetches native AVAX balance
- Fetches major ERC20 tokens (WAVAX, USDC, USDT, WETH.e, WBTC.e)
- Only shows tokens with non-zero balances

✅ **Portfolio Display**
- Shows total portfolio value
- Lists all token balances
- Updates automatically when wallet connects/disconnects

✅ **Demo Mode**
- Try the app without connecting a wallet
- Shows sample portfolio data
- Useful for testing and development

## Testing

### Test Page
Visit http://localhost:3000/test-wallet to see:
- Connection status
- Raw token data
- Debug information

### Main Application
Visit http://localhost:3000 to see:
- Full portfolio interface
- Connect wallet or use demo mode
- View token balances (when connected)

## Optional: Better RPC Performance

For better performance, you can optionally add a custom RPC URL:

1. Get a free RPC endpoint from:
   - QuickNode: https://www.quicknode.com
   - Alchemy: https://www.alchemy.com
   - Infura: https://infura.io

2. Add to `.env.local`:
```env
NEXT_PUBLIC_AVALANCHE_RPC_URL=your_custom_rpc_url_here
```

If not provided, the app will use the public Avalanche RPC.

## Troubleshooting

### Wallet not connecting?
- Make sure you have the WalletConnect Project ID set
- Check that MetaMask or your wallet is installed
- Try refreshing the page

### No tokens showing?
- Make sure you're connected to Avalanche C-Chain
- The wallet needs to have token balances to display
- Check the test page at /test-wallet for debug info

### Wrong network?
- Click the network button when connected
- Switch to Avalanche C-Chain

## What's Next?

This implementation provides:
- ✅ Basic wallet connection
- ✅ Real token balance fetching
- ✅ Simple RPC fallback
- ✅ Demo mode for testing

Future improvements could include:
- Token price fetching from real APIs
- DeFi position tracking
- Transaction history
- More complex RPC rotation
- Caching layer