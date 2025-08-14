"use client";

import { useEffect, useState } from "react";

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
      name: string;
      lightValue: string;
      darkValue: string;
    }>
  >([]);

  useEffect(() => {
    // Fetch CSS variables from API
    const fetchCSSVariables = async () => {
      try {
        const response = await fetch('/api/css-variables');
        if (response.ok) {
          const variables = await response.json();
          setCssVariables(variables);
        }
      } catch (error) {
        console.error('Failed to fetch CSS variables:', error);
      }
    };

    fetchCSSVariables();
  }, []);

  // Use dynamically detected variables, or show loading state
  const displayVariables = cssVariables.length > 0 ? cssVariables : [];

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xl p-8 overflow-x-auto">
      <h2 className="text-3xl font-bold text-card-foreground mb-6">
        🎨 Complete Color System (Dynamic)
      </h2>

      <div className="min-w-max">
        {/* Header Row */}
        <div className="grid grid-cols-[200px_1fr_1fr] gap-4 mb-4 border-b border-border pb-3">
          <div className="font-semibold text-card-foreground">
            Variable Name
          </div>
          <div className="font-semibold text-card-foreground text-center">
            ☀️ Light Theme
          </div>
          <div className="font-semibold text-card-foreground text-center">
            🌙 Dark Theme
          </div>
        </div>

        {/* Color Rows */}
        {displayVariables.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-muted-foreground">
            Loading CSS variables...
          </div>
        ) : (
          displayVariables.map((variable, index) => (
          <div
            key={index}
            className="grid grid-cols-[200px_1fr_1fr] gap-4 py-3 border-b border-border/30"
          >
            {/* Variable Name */}
            <div className="font-mono text-sm text-primary font-medium">
              {variable.name}
            </div>

            {/* Light Theme Color */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg border border-border shadow-sm"
                  style={{ 
                    backgroundColor: variable.lightValue || 'transparent',
                    opacity: variable.lightValue ? 1 : 0.3
                  }}
                ></div>
                <div className="text-sm text-muted-foreground">
                  {variable.lightValue || 'Not defined'}
                </div>
              </div>
            </div>

            {/* Dark Theme Color */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-lg border border-border shadow-sm"
                  style={{ 
                    backgroundColor: variable.darkValue || 'transparent',
                    opacity: variable.darkValue ? 1 : 0.3
                  }}
                ></div>
                <div className="text-sm text-muted-foreground">
                  {variable.darkValue || 'Not defined'}
                </div>
              </div>
            </div>
          </div>
        ))
        )}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground text-center">
          💡 <strong>{displayVariables.length}</strong> CSS variables
          automatically displayed. Add or remove variables in your{" "}
          <code className="bg-background px-1 rounded">globals.css</code> and
          they'll appear here!
        </p>
      </div>
    </div>
  );
}
