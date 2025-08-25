'use client'

import { useEffect, useState } from 'react'
import { initializeTheme } from '@/store/themeStore'

/**
 * Theme Initializer - Runs synchronously to prevent flash of default theme
 * This component initializes themes before any other components render
 */
export function ThemeInitializer() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Ensure we're client-side before initializing
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      // Initialize theme only after client-side mount is confirmed
      initializeTheme()
    }
  }, [isMounted])

  // This component doesn't render anything, it just initializes themes
  return null
}
