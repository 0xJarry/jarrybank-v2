import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '@/components/providers/Web3Provider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ThemeInitializer } from '@/components/providers/ThemeInitializer'
import { Header } from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JarryBank - Web3 Portfolio Tracker',
  description:
    'Track your DeFi portfolio, manage positions, and claim rewards across Avalanche protocols',
  keywords: 'DeFi, Portfolio, Avalanche, Web3, Crypto, Trader Joe, GMX, Benqi',
  authors: [{ name: 'JarryBank Team' }],
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize theme immediately when HTML loads (client-side only)
              if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                try {
                  const stored = localStorage.getItem('jarrybank-theme-store');
                  if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.state && parsed.state.currentThemeId) {
                      // Store the theme ID to be applied when React loads
                      window.__INITIAL_THEME__ = parsed.state.currentThemeId;
                    }
                  }
                } catch (e) {
                  // Silent fail during hydration
                }
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeInitializer />
        <ThemeProvider>
          <Web3Provider>
            <div className="bg-background min-h-screen">
              <Header />
              {children}
            </div>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
