/**
 * Theme Switcher Component
 * Dropdown to select between different color themes
 * Replaces the "Loading..." placeholder in the Header
 */

'use client'

import * as React from 'react'
import { ChevronDown, Palette, Check, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useThemeStore, getThemePreviewColors } from '@/store/themeStore'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher() {
  const { theme: nextTheme } = useTheme()
  const {
    currentThemeId,
    themes,
    isThemeSwitcherOpen,
    toggleThemeSwitcher,
    closeThemeSwitcher,
    setTheme,
  } = useThemeStore()

  const currentTheme = themes.find((t) => t.id === currentThemeId) || themes[0]

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.theme-switcher')) {
        closeThemeSwitcher()
      }
    }

    if (isThemeSwitcherOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isThemeSwitcherOpen, closeThemeSwitcher])

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId)
    closeThemeSwitcher()
  }

  return (
    <div className="theme-switcher relative">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleThemeSwitcher}
        className="bg-background border-border hover:bg-accent h-9 gap-2 px-3 transition-colors"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden text-sm font-medium sm:inline">{currentTheme.name}</span>
        {/* Show current light/dark mode indicator */}
        <div className="flex items-center gap-1">
          {nextTheme === 'dark' ? (
            <Moon className="text-muted-foreground h-3 w-3" />
          ) : (
            <Sun className="text-muted-foreground h-3 w-3" />
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isThemeSwitcherOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {/* Theme Dropdown */}
      {isThemeSwitcherOpen && (
        <div className="bg-popover border-border animate-in fade-in-0 zoom-in-95 absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border shadow-lg">
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-popover-foreground text-sm font-semibold">Choose Theme</h3>
              {/* Show current light/dark mode */}
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>Mode:</span>
                {nextTheme === 'dark' ? (
                  <div className="flex items-center gap-1">
                    <Moon className="h-3 w-3" />
                    <span>Dark</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Sun className="h-3 w-3" />
                    <span>Light</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {themes.map((theme) => {
                const previewColors = getThemePreviewColors(theme)
                const isSelected = theme.id === currentThemeId

                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`w-full rounded-lg border p-3 transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Theme Color Preview */}
                        <div className="flex gap-1">
                          <div
                            className="border-border h-4 w-4 rounded-full border"
                            style={{ backgroundColor: previewColors.primary }}
                          />
                          <div
                            className="border-border h-4 w-4 rounded-full border"
                            style={{ backgroundColor: previewColors.secondary }}
                          />
                          <div
                            className="border-border h-4 w-4 rounded-full border"
                            style={{ backgroundColor: previewColors.accent }}
                          />
                        </div>

                        {/* Theme Info */}
                        <div className="text-left">
                          <div className="text-popover-foreground font-medium">{theme.name}</div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && <Check className="text-primary h-4 w-4" />}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="border-border mt-4 border-t pt-3">
              <p className="text-muted-foreground text-center text-xs">
                Themes work with both light and dark modes. Use the sun/moon toggle to switch modes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
