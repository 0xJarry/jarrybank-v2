# Feature Impact Matrix

> Last Updated: 2025-08-17 (20:07 UTC)
> This matrix tracks feature dependencies and impacts across the JarryBank codebase

## 🎯 Core Features & Their Dependencies

| Feature                 | Files/Components                                                        | Affects                                    | Depends On                         | Test Coverage | Status                  |
| ----------------------- | ----------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------- | ------------- | ----------------------- |
| **Wallet Connection**   | `Web3Provider.tsx`, `Header.tsx`, `wagmi.ts`                            | All portfolio features, TransactionHistory | RainbowKit, Wagmi, Viem            | ❌ None       | ✅ Complete             |
| **Theme System**        | `themeStore.ts`, `ThemeProvider.tsx`, `theme-switcher.tsx`, `/themes/*` | ALL UI components                          | Zustand, CSS injection             | ❌ None       | ✅ Complete             |
| **Portfolio Overview**  | `PortfolioOverview.tsx`, `portfolioStore.ts`                            | Dashboard display                          | Wallet Connection, Price Data      | ❌ None       | ✅ Complete             |
| **Price Caching**       | `cache.ts`, `prices.ts`                                                 | PortfolioOverview, DeFiPositions           | Redis (local), Coingecko API       | ❌ None       | ✅ Complete             |
| **Token Balances**      | `useTokenBalances.ts`, `useWalletSync.ts`                               | Portfolio value calculations               | Wallet Connection, Price Data      | ❌ None       | ✅ Complete             |
| **DeFi Positions**      | `DeFiPositions.tsx`                                                     | Portfolio totals                           | Wallet, Price Data, Protocols      | ❌ None       | 🚧 UI Ready (mock data) |
| **Transaction History** | `TransactionHistory.tsx`                                                | User activity view                         | Wallet Connection, Blockchain APIs | ❌ None       | 🚧 UI Ready (mock data) |
| **Performance Chart**   | `PortfolioPerformanceChart.tsx`                                         | Visual analytics                           | Historical data, Price Data        | ❌ None       | 🚧 UI Ready (mock data) |

## 🔗 Component Dependency Tree

```
App Root (layout.tsx)
├── Providers
│   ├── ThemeProvider (affects all UI)
│   ├── Web3Provider (affects all Web3 features)
│   └── ThemeInitializer (CSS injection)
├── Header
│   ├── WalletConnect (RainbowKit)
│   └── ThemeSwitcher
└── Pages
    ├── Portfolio Page
    │   ├── PortfolioOverview (needs wallet + prices)
    │   ├── DeFiPositions (needs protocols + prices)
    │   ├── TransactionHistory (needs wallet + indexer)
    │   └── PerformanceChart (needs historical data)
    └── Test Pages
        ├── test-wallet (development only)
        ├── test-prices (development only)
        └── test-cache (development only)
```

## 🚨 Critical Integration Points

### 1. **Wallet State Changes**

- **Triggers**: Connect/disconnect, network switch, account change
- **Must Update**:
  - PortfolioOverview balances
  - TransactionHistory queries
  - DeFi position fetches
  - Clear cached data for old address

### 2. **Theme Changes**

- **Triggers**: Theme selection, mode toggle
- **Must Update**:
  - ALL components (CSS variables)
  - Charts (color schemes)
  - Preserve theme in localStorage

### 3. **Price Updates**

- **Triggers**: Cache expiry (5 min), manual refresh, new token detected
- **Must Update**:
  - Portfolio total value
  - Individual token USD values
  - DeFi position values
  - Performance calculations

### 4. **Network Switch**

- **Triggers**: User changes chain in wallet
- **Must Update**:
  - Token list for new chain
  - Price feeds for chain tokens
  - Protocol integrations
  - Clear incompatible cache

## 📦 Store Dependencies

| Store              | Used By                          | Updates Trigger               | Side Effects                |
| ------------------ | -------------------------------- | ----------------------------- | --------------------------- |
| **portfolioStore** | PortfolioOverview, DeFiPositions | Wallet changes, Price updates | Recalculate totals          |
| **themeStore**     | ALL components                   | User selection                | CSS injection, localStorage |
| **wagmi state**    | All Web3 components              | Wallet events                 | Re-fetch blockchain data    |

## 🔄 Data Flow Patterns

### Price Data Flow

```
CoinGecko API → prices.ts → cache.ts (5min TTL) → useTokenBalances → PortfolioOverview
                                                 ↘ DeFiPositions
```

### Wallet Data Flow

```
User Wallet → RainbowKit → Wagmi → useAccount → useTokenBalances → portfolioStore → UI Components
                                  ↘ useWalletSync → Transaction fetching
```

### Theme Data Flow

```
User Selection → ThemeSwitcher → themeStore → localStorage
                                            ↘ CSS injection → ALL Components
```

## ⚠️ Known Coupling Issues

1. **Price Service Tightly Coupled**
   - `useTokenBalances` directly imports price service
   - Should use dependency injection or context

2. **Theme System Global Side Effects**
   - CSS injection affects entire app
   - No component-level theme overrides

3. **Wallet State Scattered**
   - Some components use wagmi directly
   - Others use portfolioStore
   - Need consistent pattern

## 🏗️ Planned Features Impact Analysis

### Adding DEX Integration

- **Will Affect**: DeFiPositions, PortfolioOverview totals
- **New Dependencies**: DEX protocols, LP token pricing
- **Must Update**: Price service for LP tokens

### Adding Multi-Chain Support

- **Will Affect**: ALL wallet-dependent features
- **New Dependencies**: Chain configs, cross-chain price aggregation
- **Must Update**: Cache strategy per chain

### Adding Historical Data

- **Will Affect**: PerformanceChart, new analytics
- **New Dependencies**: Time-series database, data indexer
- **Must Update**: Cache for historical data

## 📝 Current Implementation Status

### ✅ Fully Implemented

- Wallet connection (RainbowKit + Wagmi)
- Theme system (7 themes with dynamic switching)
- Price fetching with caching (5-minute TTL)
- Token balance fetching
- Basic portfolio overview

### 🚧 Partially Implemented (UI Ready, Mock Data)

- DeFi Positions component
- Transaction History component
- Performance Chart component

### ❌ Not Implemented

- Real DeFi protocol integrations
- Transaction indexer integration
- Historical data collection
- Multi-chain support (only Avalanche C-Chain)
- Test coverage (no tests written)
- TypeScript type checking script

### 📌 Technical Notes

- Using custom Tailwind components (NOT shadcn/ui despite components.json existing)
- Has Prettier formatting scripts

## 🛠️ Maintenance Notes

### When Adding New Features

1. Check this matrix for affected components
2. Update all dependent stores
3. Consider cache invalidation needs
4. Test wallet state changes
5. Verify theme compatibility

### When Modifying Existing Features

1. Find feature in matrix
2. Check "Affects" column
3. Update all listed components
4. Run integration tests
5. Update this matrix

### Regular Audits

- Weekly: Review coupling issues
- Per Sprint: Update dependency tree
- Per Release: Full matrix validation

---

**Note**: This is a living document. Update immediately when features are added or dependencies change.
