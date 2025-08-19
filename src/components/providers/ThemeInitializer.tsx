'use client'

import { useEffect } from 'react'
import { initializeTheme } from '@/store/themeStore'

/**
 * Theme Initializer - Runs synchronously to prevent flash of default theme
 * This component initializes themes before any other components render
 */
export function ThemeInitializer() {
  useEffect(() => {
    // Initialize theme immediately when this component mounts
    // This runs before any other components render, preventing theme flash
    initializeTheme()
  }, [])

  // This component doesn't render anything, it just initializes themes
  return null
}
