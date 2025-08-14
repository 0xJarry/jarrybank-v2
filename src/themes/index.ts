/**
 * Themes index - Export all available themes
 * Add new themes here to make them available in the theme switcher
 *
 */

// Import themes to populate the array
import { neoBrutalismTheme } from "./neo_brutalism";
import { oceanTheme } from "./ocean";
import { sunsetTheme } from "./sunset";
import { twitterTheme } from "./twitter";
import { claudeTheme } from "./claude";
import { midnightBloomTheme } from "./midnight-bloom";

// Export all themes
export { neoBrutalismTheme } from "./neo_brutalism";
export { oceanTheme } from "./ocean";
export { sunsetTheme } from "./sunset";
export { twitterTheme } from "./twitter";
export { claudeTheme } from "./claude";
export { midnightBloomTheme } from "./midnight-bloom";

// Theme type definition - matches the new cssContent format
export interface Theme {
  name: string;
  id: string;
  cssContent: string; // Raw CSS content from globals.css
}

// Array of all available themes - ADD NEW THEMES HERE
export const allThemes: Theme[] = [
  neoBrutalismTheme,
  oceanTheme,
  sunsetTheme,
  twitterTheme,
  claudeTheme,
  midnightBloomTheme,
  // Add new themes here - they will automatically appear in the switcher
];

// Helper function to get theme by ID
export function getThemeById(id: string): Theme | undefined {
  return allThemes.find((theme) => id === theme.id);
}

// Helper function to get theme names for display
export function getThemeNames(): Array<{
  id: string;
  name: string;
}> {
  return allThemes.map((theme) => ({
    id: theme.id,
    name: theme.name,
  }));
}

// Helper function to get the default theme (first in the array)
export function getDefaultTheme(): Theme {
  return allThemes[0];
}
