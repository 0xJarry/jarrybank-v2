# Product Requirements Document

## Web3 Portfolio Tracker & DeFi Interaction Platform

**Version:** 1.0  
**Date:** August 2025  
**Status:** Draft

---

## Executive Summary

This PRD outlines the development of a comprehensive Web3 portfolio tracking and DeFi interaction platform that combines the information density of vfat.io with the user experience of DeBank. The platform will enable users to track multi-chain portfolios, monitor DeFi positions, and interact directly with protocols through an intuitive interface, starting with Avalanche as the primary supported blockchain.

## Product Vision

### Mission Statement

To create the most efficient and user-friendly DeFi portfolio management platform that empowers users to track, analyze, and optimize their crypto holdings across multiple chains with seamless protocol interactions.

### Key Differentiators

- **Information Density First**: Prioritizing data visibility over aesthetic design
- **No Authentication On Initial Version**: Immediate value without sign-up friction
- **Efficient RPC Usage**: Optimized multicall strategies for minimal network requests
- **Modular Architecture**: Extensible design for rapid protocol and chain integration
- **Mobile-First Responsive**: Full functionality across all device types

## Technical Architecture

### Frontend Stack

#### Core Technologies

- **Framework**: Latest Next.js with App Router
  - Server-side rendering for SEO and performance
  - API routes for backend functionality
  - Static generation for marketing pages
- **Styling System**:
  - Tailwind CSS for utility-first styling
  - shadcn/ui component library for consistent UI elements
  - CSS modules for component-specific styles
- **Web3 Integration**:
  - Wagmi v2 for React hooks and wallet management
  - Viem for type-safe Ethereum interactions
  - RainbowKit for wallet connection UI
  - Ethers.js v6 for additional utilities

#### State Management

- **Client State**: Zustand for lightweight state management
- **Server State**: TanStack Query for caching and synchronization
- **Persistent State**: LocalStorage for user preferences

### Backend Infrastructure

#### API Architecture

```
/api
├── /v1
│   ├── /portfolio
│   │   ├── /balance     # Get token balances
│   │   ├── /positions    # Get DeFi positions
│   │   └── /value        # Calculate portfolio value
│   ├── /prices
│   │   ├── /token        # Individual token prices
│   │   └── /batch        # Batch price fetching
│   ├── /protocols
│   │   ├── /list         # Supported protocols
│   │   └── /[protocol]   # Protocol-specific endpoints
│   └── /transactions
│       ├── /prepare      # Prepare transaction data
│       └── /estimate     # Gas estimation
```

#### Caching Strategy

- **Provider**: Upstash Redis
- **TTL Configuration**:
  - Token prices: 5 minutes (reduced from 30 seconds for cost efficiency)
  - Token balances: 5 minutes (reduced from 60 seconds)
  - Protocol metadata: 24 hours
  - Chain configuration: 7 days
- **Cache Warming**: Vercel Cron Jobs every 15 minutes (reduced from 5 minutes)
- **Cost Consideration**: Conservative caching to minimize API costs

#### Future Database (Phase 3)

- **Provider**: Supabase (PostgreSQL)
- **Schema Design**:
  - Users table (authentication)
  - Portfolios (saved configurations)
  - Watchlists (tracked tokens)
  - Historical snapshots (portfolio tracking)

### Web3 Infrastructure

#### RPC Provider Strategy

```pseudo
RPC_PROVIDER_CONFIG = {
  PRIMARY_PROVIDER: "QuickNode"
  FALLBACK_PROVIDERS: ["Alchemy", "Infura"]

  RETRY_STRATEGY: {
    MAX_ATTEMPTS: 3
    BACKOFF_TYPE: "exponential"
    MAX_DELAY_MS: 5000
    TIMEOUT_MS: 10000
  }

  FAILOVER_LOGIC: {
    HEALTH_CHECK_INTERVAL: 60 seconds  # Reduced from 30 seconds
    UNHEALTHY_THRESHOLD: 3 consecutive failures
    AUTO_SWITCH_ON_FAILURE: true
  }

  RATE_LIMITING: {
    PRIMARY: "1000 requests/minute"
    FALLBACK: "300 requests/second"
  }
}
```

#### Multicall Implementation

- **Contract**: Multicall3 (0xcA11bde05977b3631167028862bE2a173976CA11)
- **Batch Size**: 50 calls per request (reduced from 100 for reliability)
- **Error Handling**: Individual call failure isolation
- **Gas Optimization**: Dynamic batch sizing based on network conditions

#### Chain Support Roadmap

1. **Phase 1**: Avalanche C-Chain only
2. **Phase 2**: Ethereum Mainnet
3. **Phase 3**: Arbitrum, Optimism
4. **Phase 4**: Base, Polygon, BNB Chain

### Data Architecture

#### Price Provider System

```pseudo
PRICE_PROVIDER_INTERFACE = {
  NAME: string
  PRIORITY: number (1 = highest, 3 = lowest)  # Reduced from 4 providers
  HEALTH_STATUS: boolean

  METHODS:
    GET_SINGLE_PRICE(token_symbol) → PriceData
    GET_BATCH_PRICES(token_list) → Map<token, PriceData>
    CHECK_HEALTH() → boolean
}

PRICE_AGGREGATOR = {
  PROVIDERS: [
    MoralisProvider (Priority 1)
    DexScreenerProvider (Priority 2)
    DexQueryProvider (Priority 3)  # Removed OneInch for simplicity
  ]

  PRICE_FETCHING_STRATEGY: "Waterfall with Fallback"

  GET_PRICE(token) → PriceData:
    1. Try Priority 1 provider
    2. If fails → try Priority 2 provider
    3. If fails → try Priority 3 provider
    4. If all fail → return error

  BATCH_PRICE_FETCHING:
    - Split large token lists across providers
    - Aggregate results from multiple sources
    - Handle partial failures gracefully
}

PRICE_DATA_STRUCTURE = {
  TOKEN_SYMBOL: string
  CURRENT_PRICE: decimal
  PRICE_CHANGE_24H: decimal
  LAST_UPDATED: timestamp
  SOURCE_PROVIDER: string
  CONFIDENCE_SCORE: number (0-100)
}
```

#### Token Balance Architecture

```pseudo
BALANCE_FETCHER_INTERFACE = {
  FETCH_BALANCES(wallet_address, token_list) → BalanceMap:
    1. CREATE_MULTICALL_BATCH:
       - Get native token balance (ETH/AVAX)
       - Get ERC20 token balances for all tokens
       - Get ERC721/ERC1155 NFT balances

    2. EXECUTE_MULTICALL:
       - Send batch request to blockchain
       - Handle RPC rate limiting
       - Retry on failure with exponential backoff

    3. PROCESS_RESULTS:
       - Parse balance data
       - Convert to human-readable format
       - Cache results for performance

    4. RETURN_BALANCE_MAP:
       - Token symbol → balance amount
       - Token symbol → USD value
       - Last updated timestamp
}

MULTICALL_STRATEGY = {
  BATCH_SIZE: 50 tokens per call  # Reduced from 100
  MAX_RETRIES: 3
  TIMEOUT: 30 seconds
  FALLBACK: Individual calls if batch fails
}

BALANCE_CACHING = {
  CACHE_DURATION: 5 minutes
  INVALIDATION_TRIGGERS:
    - New transaction detected
    - Manual refresh requested
    - Cache expired
  STORAGE: LocalStorage for simplicity (IndexedDB moved to Phase 2)
}
```

## Core Features (MVP)

### 1. Portfolio Overview

#### Multi-Wallet Management

- **Add Wallet**:
  - Manual address input with ENS support
  - Connect wallet button for auto-detection
  - QR code scanner for mobile
- **Wallet List**:
  - Nickname assignment for easy identification
  - Quick switch between wallets
  - Aggregate view option
- **Storage**: LocalStorage with encryption for addresses

#### Portfolio Display

```
┌─────────────────────────────────────┐
│ Total Portfolio Value               │
│ $125,432.67 ▲ 5.2% (24h)           │
├─────────────────────────────────────┤
│ Chain Breakdown                     │
│ • Avalanche: $89,234.12            │
├─────────────────────────────────────┤
│ Top Holdings                        │
│ 1. AVAX    1,234.56  $45,678.90   │
│ 2. JOE       890.12  $23,456.78   │
│ 3. USDC    15,000.00 $15,000.00   │
└─────────────────────────────────────┘
```

#### Token Balance Features

- **Real-time Updates**: Manual refresh with loading indicator
- **Price Changes**: 24h change display only (simplified from 7d, 30d)
- **Sorting Options**: Value, change %, alphabetical
- **Filtering**: Hide small balances (<$1), hide zero balances
- **Token Info**: Click for expanded view with basic info

### 2. DeFi Position Tracking

#### Supported Position Types

- **Liquidity Pools**:
  - Token pair display
  - Pool share percentage
  - Basic APR display (if available)
- **Yield Farming**:
  - Staked amount
  - Pending rewards
  - Basic lock period info
- **Lending/Borrowing**:
  - Supply balance
  - Borrow balance
  - Health factor (if available)

#### Protocol Integration (Avalanche)

- Pharaoh
- Blackhole
- Trader Joe V2
- GMX
- Benqi
- Yield Yak

### 3. Transaction Features

#### One-Click Claims

```pseudo
CLAIMABLE_REWARD_STRUCTURE = {
  PROTOCOL: string (e.g., "Trader Joe", "GMX")
  TOKEN_SYMBOL: string (e.g., "JOE", "AVAX")
  AMOUNT: BigNumber (raw token amount)
  USD_VALUE: decimal (estimated value)
  CLAIM_FUNCTION: string (contract function name)
  GAS_ESTIMATE: BigNumber (estimated gas cost)
  EXPIRY_DATE: timestamp (if applicable)
}

CLAIM_BUTTON_COMPONENT = {
  PROPS: reward_data, success_callback, error_callback
  STATES: idle, loading, success, error
  ACTIONS: click_to_claim, show_confirmation, execute_transaction
}
```

#### Transaction Management

- **Pre-flight Checks**:
  - Sufficient gas balance
  - Token approval status
  - Basic slippage tolerance (0.5% default)
- **Execution Flow**:
  1. Simulate transaction
  2. Display gas estimate
  3. User confirmation
  4. Send transaction
  5. Track status
  6. Show result notification

### 4. User Experience Design

#### Information Architecture

```
Home
├── Portfolio Overview
│   ├── Total Value
│   ├── Chain Breakdown
│   └── Token List
├── DeFi Positions
│   ├── Active Positions
│   ├── Claimable Rewards
│   └── Basic Position Info
├── Settings
│   ├── Wallet Management
│   └── Display Preferences
```

#### Mobile Optimization

- **Touch Targets**: Minimum 44x44px
- **Swipe Gestures**: Navigate between views
- **Bottom Navigation**: Thumb-friendly primary actions
- **Responsive Tables**: Horizontal scroll with fixed columns
- **Progressive Disclosure**: Expand/collapse for details

#### Loading States

```pseudo
LOADING_STATE_ENUM = {
  INITIAL: "Connecting to network..."
  FETCHING_BALANCES: "Loading token balances..."
  FETCHING_PRICES: "Updating prices..."
  FETCHING_POSITIONS: "Scanning DeFi positions..."
  COMPLETE: "Ready"
}
```

## Phase 2 Features (Weeks 9-16)

### 1. Advanced DeFi Interactions

#### Liquidity Management

- **Add Liquidity**:
  - Zap from single token
  - Optimal ratio calculation
  - Price impact warning
  - IL risk indicator
- **Remove Liquidity**:
  - Partial or full withdrawal
  - Single-sided exit options
  - Emergency withdrawal

#### Auto-Compound Engine

```pseudo
interface AutoCompoundStrategy {
  protocol: string;
  position: string;
  frequency: "daily" | "weekly" | "threshold";
  minReward: BigNumber;
  gasLimit: BigNumber;

  shouldCompound(): boolean;
  estimateGas(): Promise<BigNumber>;
  execute(): Promise<TransactionHash>;
}
```

### 2. User Account System

#### Authentication Flow

- **Options**:
  - Email/password (Supabase Auth)
  - Social login (Google, Discord)
  - Wallet signature (SIWE)
- **Progressive Enhancement**:
  - Anonymous usage by default
  - Prompt for account on advanced features
  - Data migration from local to cloud

#### Account Features

- **Portfolio Snapshots**: Daily value tracking
- **Custom Alerts**: Price movements, position health
- **Export Data**: CSV download of transactions
- **API Access**: Personal API keys for programmatic access

## Phase 3 Features (Weeks 17-24)

### 1. Real-time Updates

#### WebSocket Implementation

```pseudo
class PriceWebSocket {
  private ws: WebSocket;
  private subscriptions: Set<string>;

  subscribe(tokens: string[]) {
    this.ws.send({
      action: "subscribe",
      tokens: tokens
    });
  }

  onPriceUpdate(callback: (price: PriceUpdate) => void) {
    this.ws.on("price", callback);
  }
}
```

#### Update Strategies

- **Prices**: Real-time for watched tokens
- **Balances**: Poll every 5 minutes (reduced from 60 seconds)
- **Positions**: On-chain event listeners
- **Rewards**: Calculate locally, verify on-chain

### 2. Multi-Chain Support

- Avalanche C-Chain
- Ethereum Mainnet
- Arbitrum, Optimism
- Base, Polygon, BNB Chain

## Technical Requirements

### Performance Metrics

#### Load Time Targets

- **Initial Load**: < 3 seconds (LCP) - relaxed from 2 seconds
- **Time to Interactive**: < 4 seconds (TTI) - relaxed from 3 seconds
- **First Contentful Paint**: < 1.5 seconds (FCP) - relaxed from 1 second
- **Cumulative Layout Shift**: < 0.1 (CLS)

#### Optimization Strategies

- **Code Splitting**: Route-based chunks
- **Image Optimization**: Next.js Image component
- **Font Loading**: FOUT prevention
- **Bundle Size**: < 300KB initial JS - relaxed from 200KB
- **Caching**: LocalStorage for offline support (Service worker moved to Phase 2)

### Scalability Design

#### Horizontal Scaling

```yaml
infrastructure:
  frontend:
    provider: Vercel
    regions: ['us-east-1'] # Single region for Phase 1
    scaling: automatic

  api:
    provider: Vercel Functions
    timeout: 30s
    memory: 1024MB

  cache:
    provider: Upstash Redis
    maxConnections: 100 # Reduced from 1000 for Phase 1
    evictionPolicy: LRU
```

#### Rate Limiting

```pseudo
const rateLimits = {
  anonymous: {
    requests: 50,  # Reduced from 100
    window: "1m"
  },
  authenticated: {
    requests: 500,  # Reduced from 1000
    window: "1m"
  },
  api: {
    requests: 5000,  # Reduced from 10000
    window: "1d"
  }
}
```

### Error Handling

#### Error Categories

1. **Network Errors**: RPC timeouts, API failures
2. **Validation Errors**: Invalid addresses, amounts
3. **Business Logic Errors**: Insufficient balance, slippage
4. **System Errors**: Database, cache failures

#### Recovery Strategies

```pseudo
class ErrorBoundary {
  static handlers = {
    RPC_ERROR: () => switchToFallbackProvider(),
    PRICE_ERROR: () => useCachedPrice(),
    TRANSACTION_ERROR: () => retryWithHigherGas(),
    UNKNOWN_ERROR: () => showUserMessage()
  }
}
```

### Security Requirements

#### Frontend Security

- **CSP Headers**: Basic content security policy
- **XSS Prevention**: Input sanitization
- **CORS**: Whitelist allowed origins
- **Secrets**: No API keys in client code

#### Backend Security

- **Input Validation**: Zod schemas for all endpoints
- **Rate Limiting**: Per-IP and per-wallet
- **SQL Injection**: Parameterized queries only
- **Authentication**: JWT with refresh tokens (Phase 2)

#### Smart Contract Interaction

- **Simulation**: All transactions simulated first
- **Approval Limits**: Exact amounts only
- **Reentrancy**: Check for guards
- **Audit Status**: Display protocol audit info

## Design System

### Visual Hierarchy

```
Typography Scale:
- H1: 32px - Portfolio Value
- H2: 24px - Section Headers
- H3: 20px - Card Headers
- Body: 16px - Standard Text
- Small: 14px - Labels
- Micro: 12px - Timestamps

Color Palette:
- Primary: #0052FF (Actions)
- Success: #00D395 (Profits)
- Danger: #FF3B30 (Losses)
- Warning: #FFB800 (Alerts)
- Neutral: #6B7280 (Text)
- Background: #0A0B0D (Dark)
```

### Component Library

#### Core Components

- **TokenRow**: Display token with balance and value
- **PositionCard**: DeFi position summary
- **TransactionModal**: Transaction confirmation UI
- **ChainSelector**: Network switching dropdown
- **AddressInput**: ENS-enabled address field
- **ValueDisplay**: Formatted USD values with change

#### Layout Components

- **PageContainer**: Consistent padding and max-width
- **Card**: Elevated content sections
- **Tabs**: View switching
- **Skeleton**: Loading placeholders
- **EmptyState**: No data messaging

### Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px) {
  /* Tablet */
}
@media (min-width: 1024px) {
  /* Desktop */
}
@media (min-width: 1440px) {
  /* Wide */
}
```

## Success Metrics

### Performance KPIs

- **Page Load Time**: < 3s for 50-token portfolio (P95) - relaxed from 2s
- **API Response Time**: < 1000ms (P95) - relaxed from 500ms
- **Cache Hit Rate**: > 70% - relaxed from 80%
- **Error Rate**: < 1% - relaxed from 0.1%

### User Engagement

- **Daily Active Users**: 5,000 within 3 months - reduced from 10,000
- **Mobile Usage**: > 30% of total traffic
- **Retention Rate**: > 30% weekly active - reduced from 40%
- **Transaction Success**: > 90% completion rate - reduced from 95%

### Technical Metrics

- **Uptime**: 99% availability - relaxed from 99.9%
- **RPC Efficiency**: < 10 calls per portfolio load - relaxed from 5
- **Protocol Coverage**: 5+ Avalanche protocols - reduced from 10+
- **Chain Support**: 1 chain within 3 months - reduced from 3+ chains

## Implementation Roadmap

### Phase 1: MVP (Weeks 1-8)

**Week 1-2**: Project setup and infrastructure

- Next.js boilerplate with TypeScript
- Tailwind + shadcn/ui configuration
- Web3 provider setup
- Redis cache initialization

**Week 3-4**: Core portfolio features

- Wallet connection flow
- Token balance fetching
- Price provider integration
- Portfolio value calculation

**Week 5-6**: DeFi position tracking

- Protocol adapters (Trader Joe, GMX)
- Position parsing logic
- Rewards calculation
- Read-only display

**Week 7-8**: Transaction features

- Claim functionality
- Gas estimation
- Transaction tracking
- Error handling

### Phase 2: Enhancement (Weeks 9-16)

**Week 9-10**: User accounts

- Supabase integration
- Authentication flow
- Data migration

**Week 11-12**: Advanced DeFi

- Liquidity management
- Auto-compound logic
- Zap functionality

**Week 13-14**: Real-time features

- WebSocket setup
- Live price updates
- Push notifications

**Week 15-16**: Multi-chain

- Ethereum support
- Chain abstraction layer
- Cross-chain portfolio

### Phase 3: Scale (Weeks 17-24)

- Additional chain integration
- Mobile app development
- Advanced analytics
- API marketplace

## Risk Assessment

### Technical Risks

| Risk                | Impact | Probability | Mitigation                           |
| ------------------- | ------ | ----------- | ------------------------------------ |
| RPC rate limits     | High   | Medium      | Multiple providers, caching          |
| Price API costs     | Medium | High        | Tiered providers, aggressive caching |
| Smart contract bugs | High   | Low         | Simulation, audit reviews            |
| Scalability issues  | High   | Medium      | Serverless architecture, CDN         |

### Business Risks

| Risk                | Impact   | Probability | Mitigation                     |
| ------------------- | -------- | ----------- | ------------------------------ |
| Low user adoption   | High     | Medium      | Marketing, partnerships        |
| Competitor features | Medium   | High        | Rapid iteration, user feedback |
| Regulatory changes  | High     | Low         | Compliance monitoring          |
| Security breach     | Critical | Low         | Security audits, bug bounty    |

## Deliverables

### Documentation

1. **Technical Specification**
   - API documentation (OpenAPI)
   - Database schema
   - Smart contract interfaces
   - Deployment guide

2. **Component Library**
   - Storybook documentation
   - Usage examples
   - Props documentation
   - Accessibility guidelines

3. **Developer Guide**
   - Local setup instructions
   - Contributing guidelines
   - Testing procedures
   - CI/CD pipeline

4. **User Guide**
   - Feature tutorials
   - FAQ section
   - Troubleshooting
   - Video walkthroughs

## Appendices

### A. Competitor Analysis

- **vfat.io**: Dense information, protocol coverage
- **DeBank**: User experience, social features
- **Zapper**: Transaction builder, NFT support
- **Zerion**: Mobile app, portfolio tracking

### B. Protocol Adapters

```pseudo
interface ProtocolAdapter {
  name: string;
  chain: Chain;

  getPositions(address: string): Promise<Position[]>;
  getRewards(address: string): Promise<Reward[]>;
  prepareClaimTx(rewards: Reward[]): TransactionRequest;
}
```

### C. API Response Formats

```pseudo
// Portfolio Value Response
{
  "address": "0x...",
  "totalValue": 125432.67,
  "chains": {
    "avalanche": {
      "value": 89234.12,
      "tokens": [...]
    }
  },
  "change24h": 5.2,
  "lastUpdated": "2025-08-12T10:00:00Z"
}
```

### D. Environment Variables

```env
# RPC Providers
QUICKNODE_URL=
ALCHEMY_API_KEY=

# Price Providers
MORALIS_API_KEY=
DEXSCREENER_API_KEY=
DEXQUERY_API_KEY=

# Infrastructure
UPSTASH_REDIS_URL=
SUPABASE_URL=  # Phase 2
SUPABASE_ANON_KEY=  # Phase 2

# Analytics
MIXPANEL_TOKEN=  # Phase 2
SENTRY_DSN=  # Phase 2
```

---

**Document Control**

- Author: Product Team
- Review: Engineering, Design, Business
- Approval: Product Owner
- Next Review: End of MVP Phase

**Note**: This PRD contains pseudo code examples that should be reviewed and implemented by the development team. The technical specifications are guidelines and may need adjustment based on actual implementation requirements and constraints.
