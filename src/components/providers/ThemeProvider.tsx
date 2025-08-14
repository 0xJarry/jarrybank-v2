"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  /** Child components that will have access to theme context */
  children: React.ReactNode;
  /** Optional initial theme mode (overrides stored preference) */
  initialTheme?: "light" | "dark" | "system";
  /** Whether to enable system theme detection (default: true) */
  enableSystemTheme?: boolean;
}

export function ThemeProvider({
  children,
  initialTheme,
  enableSystemTheme = true,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={initialTheme || "system"}
      enableSystem={enableSystemTheme}
      disableTransitionOnChange
      storageKey="jarrybank-theme"
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;
