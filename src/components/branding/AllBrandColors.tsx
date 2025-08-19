'use client'

import { useEffect, useState } from 'react'

/**
 * AllBrandColors Component
 *
 * A smart, dynamic component that automatically displays all CSS variables
 * from your theme system. Shows light vs dark theme comparisons with
 * visual color swatches and HSL values.
 *
 * Features:
 * - Automatically reads CSS variables from :root and .dark
 * - Displays all colors from --background to --chart-5
 * - Visual color swatches for each theme
 * - Future-proof: add/remove variables in globals.css automatically appear here
 */
export function AllBrandColors() {
  const [cssVariables, setCssVariables] = useState<
    Array<{
      name: string
      lightValue: string
      darkValue: string
    }>
  >([])

  useEffect(() => {
    // Fetch CSS variables from API
    const fetchCSSVariables = async () => {
      try {
        const response = await fetch('/api/css-variables')
        if (response.ok) {
          const variables = await response.json()
          setCssVariables(variables)
        }
      } catch (error) {
        console.error('Failed to fetch CSS variables:', error)
      }
    }

    fetchCSSVariables()
  }, [])

  // Use dynamically detected variables, or show loading state
  const displayVariables = cssVariables.length > 0 ? cssVariables : []

  return (
    <div className="bg-card border-border overflow-x-auto rounded-2xl border p-8 shadow-xl">
      <h2 className="text-card-foreground mb-6 text-3xl font-bold">
        🎨 Complete Color System (Dynamic)
      </h2>

      <div className="min-w-max">
        {/* Header Row */}
        <div className="border-border mb-4 grid grid-cols-[200px_1fr_1fr] gap-4 border-b pb-3">
          <div className="text-card-foreground font-semibold">Variable Name</div>
          <div className="text-card-foreground text-center font-semibold">☀️ Light Theme</div>
          <div className="text-card-foreground text-center font-semibold">🌙 Dark Theme</div>
        </div>

        {/* Color Rows */}
        {displayVariables.length === 0 ? (
          <div className="text-muted-foreground col-span-3 py-8 text-center">
            Loading CSS variables...
          </div>
        ) : (
          displayVariables.map((variable, index) => (
            <div
              key={index}
              className="border-border/30 grid grid-cols-[200px_1fr_1fr] gap-4 border-b py-3"
            >
              {/* Variable Name */}
              <div className="text-primary font-mono text-sm font-medium">{variable.name}</div>

              {/* Light Theme Color */}
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <div
                    className="border-border h-12 w-12 rounded-lg border shadow-sm"
                    style={{
                      backgroundColor: variable.lightValue || 'transparent',
                      opacity: variable.lightValue ? 1 : 0.3,
                    }}
                  ></div>
                  <div className="text-muted-foreground text-sm">
                    {variable.lightValue || 'Not defined'}
                  </div>
                </div>
              </div>

              {/* Dark Theme Color */}
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  <div
                    className="border-border h-12 w-12 rounded-lg border shadow-sm"
                    style={{
                      backgroundColor: variable.darkValue || 'transparent',
                      opacity: variable.darkValue ? 1 : 0.3,
                    }}
                  ></div>
                  <div className="text-muted-foreground text-sm">
                    {variable.darkValue || 'Not defined'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-muted/50 border-border mt-6 rounded-lg border p-4">
        <p className="text-muted-foreground text-center text-sm">
          💡 <strong>{displayVariables.length}</strong> CSS variables automatically displayed. Add
          or remove variables in your{' '}
          <code className="bg-background rounded px-1">globals.css</code> and they&apos;ll appear
          here!
        </p>
      </div>
    </div>
  )
}
