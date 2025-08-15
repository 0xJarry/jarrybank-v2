/**
 * Theme Store - Manages theme switching and state
 * Integrates with next-themes for light/dark mode and custom themes
 *
 * NEW THEMES ARE AUTOMATICALLY DISCOVERED - just add them to src/themes/index.ts
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { allThemes, type Theme } from "@/themes";

// Available themes - automatically populated from themes index
const availableThemes: Theme[] = allThemes;

interface ThemeState {
  /** Current custom theme ID */
  currentThemeId: string;
  /** All available themes */
  themes: Theme[];
  /** Current theme object */
  currentTheme: Theme;
  /** Whether theme switcher is open */
  isThemeSwitcherOpen: boolean;
}

interface ThemeActions {
  /** Set theme by ID */
  setTheme: (themeId: string) => void;
  /** Get theme by ID */
  getTheme: (themeId: string) => Theme | undefined;
  /** Toggle theme switcher */
  toggleThemeSwitcher: () => void;
  /** Close theme switcher */
  closeThemeSwitcher: () => void;
  /** Get all theme names for display */
  getThemeNames: () => Array<{ id: string; name: string }>;
  /** Refresh theme based on current light/dark mode */
  refreshTheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      // Initial state - automatically uses first theme as default
      currentThemeId: availableThemes[0]?.id || "neo-brutalism",
      themes: availableThemes,
      currentTheme:
        availableThemes[0] ||
        availableThemes.find((t) => t.id === "neo-brutalism") ||
        availableThemes[0],
      isThemeSwitcherOpen: false,

      // Actions
      setTheme: (themeId: string) => {
        const theme = get().themes.find((t) => themeId === t.id);
        if (theme) {
          set({
            currentThemeId: themeId,
            currentTheme: theme,
          });

          // Apply theme to CSS custom properties
          applyThemeToCSS(theme);
        }
      },

      getTheme: (themeId: string) => {
        return get().themes.find((t) => themeId === t.id);
      },

      toggleThemeSwitcher: () => {
        set((state) => ({ isThemeSwitcherOpen: !state.isThemeSwitcherOpen }));
      },

      closeThemeSwitcher: () => {
        set({ isThemeSwitcherOpen: false });
      },

      getThemeNames: () => {
        return get().themes.map((theme) => ({
          id: theme.id,
          name: theme.name,
        }));
      },

      refreshTheme: () => {
        // Re-apply current theme to respect light/dark mode changes
        const { currentTheme } = get();
        if (currentTheme) {
          applyThemeToCSS(currentTheme);
        }
      },
    }),
    {
      name: "jarrybank-theme-store",
      partialize: (state) => ({
        currentThemeId: state.currentThemeId,
      }),
    }
  )
);

/**
 * Apply theme CSS content directly to the document
 * This function replaces the entire CSS with the theme content
 */
function applyThemeToCSS(theme: Theme): void {
  if (typeof document === "undefined") return;

  // Remove existing theme styles
  const existingThemeStyle = document.getElementById("theme-styles");
  if (existingThemeStyle) {
    existingThemeStyle.remove();
  }

  // Create new style element with theme CSS
  const themeStyle = document.createElement("style");
  themeStyle.id = "theme-styles";

  // Apply the CSS content directly from the theme object
  themeStyle.textContent = theme.cssContent;
  document.head.appendChild(themeStyle);
}

/**
 * Initialize theme on app load
 * This should be called in the ThemeProvider
 */
export function initializeTheme(): void {
  // Check if we're in the browser
  if (typeof window === "undefined") return;

  // Check if we have a pre-loaded theme ID from the script tag
  let themeId = (window as { __INITIAL_THEME__?: string }).__INITIAL_THEME__;

  if (!themeId) {
    // Fallback to localStorage
    const storedThemeId = localStorage.getItem("jarrybank-theme-store");
    if (storedThemeId) {
      try {
        const parsed = JSON.parse(storedThemeId);
        if (parsed.state && parsed.state.currentThemeId) {
          themeId = parsed.state.currentThemeId;
        }
      } catch {
        console.warn("Failed to parse stored theme, using default");
      }
    }
  }

  // Use default if no theme found
  if (!themeId) {
    themeId = "neo-brutalism";
  }

  // Find the theme and apply it immediately
  const { themes } = useThemeStore.getState();
  const theme = themes.find((t) => t.id === themeId) || themes[0];

  if (theme) {
    // Apply theme immediately to prevent flash
    applyThemeToCSS(theme);

    // Update the store state to match
    useThemeStore.setState({
      currentThemeId: theme.id,
      currentTheme: theme,
    });

    // Clean up the global variable
    delete (window as { __INITIAL_THEME__?: string }).__INITIAL_THEME__;
  }
}

/**
 * Get theme preview colors for the switcher UI
 * Since we're using raw CSS, we'll use default preview colors
 */
export function getThemePreviewColors(theme: Theme) {
  // Default preview colors - you can customize these per theme
  const themeColors: Record<
    string,
    {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      foreground: string;
    }
  > = {
    "neo-brutalism": {
      primary: "hsl(0 100% 60%)",
      secondary: "hsl(60 100% 50%)",
      accent: "hsl(216 100% 50%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(0 0% 0%)",
    },
    ocean: {
      primary: "hsl(200 80% 50%)",
      secondary: "hsl(180 70% 45%)",
      accent: "hsl(220 90% 60%)",
      background: "hsl(200 50% 98%)",
      foreground: "hsl(200 30% 15%)",
    },
    sunset: {
      primary: "hsl(20 90% 55%)",
      secondary: "hsl(340 70% 55%)",
      accent: "hsl(45 90% 60%)",
      background: "hsl(30 50% 98%)",
      foreground: "hsl(30 30% 15%)",
    },
    twitter: {
      primary: "hsl(203 88% 53%)",
      secondary: "hsl(210 25% 8%)",
      accent: "hsl(211 51% 93%)",
      background: "hsl(0 0% 100%)",
      foreground: "hsl(210 25% 8%)",
    },
    claude: {
      primary: "hsl(15 56% 52%)",
      secondary: "hsl(46 23% 89%)",
      accent: "hsl(46 23% 89%)",
      background: "hsl(48 33% 97%)",
      foreground: "hsl(48 20% 20%)",
    },
  };

  return themeColors[theme.id] || themeColors["neo-brutalism"];
}
