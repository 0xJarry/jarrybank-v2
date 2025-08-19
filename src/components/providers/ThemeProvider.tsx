'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { useThemeStore } from '@/store/themeStore'

interface ThemeProviderProps {
  /** Child components that will have access to theme context */
  children: React.ReactNode
  /** Optional initial theme mode (overrides stored preference) */
  initialTheme?: 'light' | 'dark' | 'system'
  /** Whether to enable system theme detection (default: true) */
  enableSystemTheme?: boolean
}

/**
 * Inner component that listens for theme changes
 */
function ThemeSync() {
  const { theme: nextTheme } = useTheme()
  const { refreshTheme } = useThemeStore()

  // Listen for light/dark mode changes and refresh custom theme
  React.useEffect(() => {
    if (nextTheme) {
      // Small delay to ensure DOM has updated with the new class
      const timer = setTimeout(() => {
        refreshTheme()
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [nextTheme, refreshTheme])

  return null
}

export function ThemeProvider({
  children,
  initialTheme,
  enableSystemTheme = true,
}: ThemeProviderProps) {
  // Theme initialization is now handled by ThemeInitializer in layout.tsx
  // This prevents the flash of default theme on page refresh

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={initialTheme || 'system'}
      enableSystem={enableSystemTheme}
      disableTransitionOnChange
      storageKey="jarrybank-theme"
    >
      <ThemeSync />
      {children}
    </NextThemesProvider>
  )
}

export default ThemeProvider
