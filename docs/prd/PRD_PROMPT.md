Create a comprehensive PRD for a web3 portfolio tracker and DeFi interaction platform with the following specifications:

PROJECT OVERVIEW:
A multi-chain portfolio tracker similar to vfat.io + DeBank with integrated DeFi interaction capabilities, starting with Avalanche as the primary chain.

TECHNICAL ARCHITECTURE:

Frontend Stack:

- Framework: latest Next.js with App Router
- Styling: Tailwind CSS with shadcn/ui components
- Web3 Integration: Wagmi v2, Viem, RainbowKit for wallet connections
- Responsive Design: Mobile-first approach with full responsive layouts

Backend Infrastructure:

- API Layer: Next.js API routes deployed on Vercel
- Caching: Upstash Redis for token prices, balances, and RPC responses
- Future Database: Supabase (PostgreSQL) for user data when auth is implemented
- Background Jobs: Vercel Cron Jobs for cache warming

Web3 Infrastructure:

- RPC Providers: QuickNode (primary), Alchemy (fallback), with configured fallback chains
- Batch RPC Strategy: Multicall3 for efficient token balance fetching (no individual calls per token)
- Chain Support: Avalanche (primary), then Ethereum, Arbitrum, Optimism

Data Architecture:

- Modular Price Provider System:
  - Interface-based design allowing multiple price sources
  - Primary: Moralis API
  - Fallbacks: DexScreener, 1inch Price API, DEX direct queries
  - Configurable provider priority and fallback chains
  - Cached with 30-second TTL in Redis

- Token Balance Fetching:
  - Single multicall for all ERC20 balances
  - Native token balance in same call
  - Support for custom token lists

CORE FEATURES (MVP):

1. Portfolio Overview:
   - Multi-wallet support (add multiple addresses)
   - Aggregated portfolio value in USD
   - Token balances with 24h change indicators
   - Chain-separated and aggregated views
   - Manual refresh button with loading states

2. DeFi Position Tracking:
   - LP positions (initially read-only display)
   - Yield farming positions
   - Lending/borrowing positions
   - Claimable rewards highlighting

3. Transaction Features:
   - One-click claim for common protocols (Trader Joe, GMX, etc.)
   - Batch claim functionality (multiple protocols in one transaction)
   - Gas estimation before execution
   - Transaction status tracking

4. User Experience:
   - No authentication required initially
   - Local storage for wallet preferences
   - Clean, dense information display (vfat.io-inspired)
   - Mobile-responsive design with touch-optimized interactions

PHASE 2 FEATURES:

1. Advanced DeFi Interactions:
   - Add liquidity to specific pools
   - Auto-compound rewards to LP positions
   - Zap-in functionality (single token to LP)

2. User Accounts (with Supabase):
   - Optional sign-in (not required for basic use)
   - Save portfolio configurations
   - Historical tracking
   - Custom watchlists

3. Real-time Updates:
   - WebSocket price feeds
   - Auto-refresh intervals (configurable)
   - Push notifications for large price movements

TECHNICAL REQUIREMENTS:

Performance:

- Initial load time < 2 seconds
- Subsequent navigation < 500ms
- Efficient RPC usage (< 5 RPC calls per full portfolio load)
- Implement progressive loading (show cached data first, then update)

Scalability:

- Modular API design for easy provider additions
- Horizontal scaling capability via serverless
- Chain-agnostic architecture for easy expansion

Error Handling:

- Graceful RPC provider fallbacks
- Cached data fallback when APIs unavailable
- User-friendly error messages
- Retry logic with exponential backoff

Security:

- No private keys stored
- All transactions through user's connected wallet
- Input validation on all API endpoints
- Rate limiting per IP

DESIGN PRINCIPLES:

- Information density over aesthetics (vfat.io approach)
- Minimal clicks to perform actions
- Clear visual hierarchy for important information
- Consistent experience across devices
- Accessibility compliant (WCAG 2.1 AA)

SUCCESS METRICS:

- Page load time < 2s for 50-token portfolio
- 95% uptime for price feeds
- Support for 10+ protocols on Avalanche
- Mobile usage > 30% of traffic

CONSTRAINTS:

- Start with Avalanche only, architecture must support multi-chain expansion
- No user authentication in MVP
- Must work with free or affordable API tiers
- Frontend and backend in single Next.js deployment initially

DELIVERABLES:

1. Technical specification document
2. API endpoint documentation
3. Component library documentation
4. Deployment and configuration guide
