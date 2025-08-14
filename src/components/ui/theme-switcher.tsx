/**
 * Theme Switcher Component
 * Dropdown to select between different color themes
 * Replaces the "Loading..." placeholder in the Header
 */

"use client";

import * as React from "react";
import { ChevronDown, Palette, Check, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useThemeStore, getThemePreviewColors } from "@/store/themeStore";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme: nextTheme } = useTheme();
  const {
    currentThemeId,
    themes,
    isThemeSwitcherOpen,
    toggleThemeSwitcher,
    closeThemeSwitcher,
    setTheme,
  } = useThemeStore();

  const currentTheme = themes.find((t) => t.id === currentThemeId) || themes[0];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".theme-switcher")) {
        closeThemeSwitcher();
      }
    };

    if (isThemeSwitcherOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isThemeSwitcherOpen, closeThemeSwitcher]);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    closeThemeSwitcher();
  };

  return (
    <div className="theme-switcher relative">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleThemeSwitcher}
        className="h-9 px-3 gap-2 bg-background border-border hover:bg-muted transition-colors"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline text-sm font-medium">
          {currentTheme.name}
        </span>
        {/* Show current light/dark mode indicator */}
        <div className="flex items-center gap-1">
          {nextTheme === "dark" ? (
            <Moon className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Sun className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isThemeSwitcherOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Theme Dropdown */}
      {isThemeSwitcherOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-popover-foreground">
                Choose Theme
              </h3>
              {/* Show current light/dark mode */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Mode:</span>
                {nextTheme === "dark" ? (
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
                const previewColors = getThemePreviewColors(theme);
                const isSelected = theme.id === currentThemeId;

                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`w-full p-3 rounded-lg border transition-all hover:shadow-md ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Theme Color Preview */}
                        <div className="flex gap-1">
                          <div
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: previewColors.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: previewColors.secondary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: previewColors.accent }}
                          />
                        </div>

                        {/* Theme Info */}
                        <div className="text-left">
                          <div className="font-medium text-popover-foreground">
                            {theme.name}
                          </div>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Themes work with both light and dark modes. Use the sun/moon
                toggle to switch modes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
