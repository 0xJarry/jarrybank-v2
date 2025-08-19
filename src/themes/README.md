# Theme System

This directory contains the theme system for JarryBank. Each theme is a separate file that defines colors, shadows, and other design tokens.

## Current Themes

- **Neo Brutalism** (`neo_brutalism.ts`) - Default theme with red primary and yellow secondary
- **Ocean** (`ocean.ts`) - Deep blue and teal color scheme
- **Sunset** (`sunset.ts`) - Warm orange and pink color scheme
- **Twitter** (`twitter.ts`) - Twitter-inspired blue theme
- **Claude** (`claude.ts`) - Claude-inspired warm theme

## How to Add a New Theme

**It's now super simple! Just 2 steps:**

1. **Create a new theme file** in this directory (e.g., `forest.ts`)
2. **Add it to the array** in `src/themes/index.ts`

That's it! The theme will automatically appear in the theme switcher.

### Step 1: Create Theme File

Create `src/themes/forest.ts` following this exact format:

```typescript
export const forestTheme = {
  name: 'Forest',
  id: 'forest',
  cssContent: `
@import "tailwindcss";

:root {
  --background: hsl(120 30% 98%);
  --foreground: hsl(120 30% 15%);
  --card: hsl(120 30% 100%);
  --card-foreground: hsl(120 30% 15%);
  --popover: hsl(120 30% 100%);
  --popover-foreground: hsl(120 30% 15%);
  --primary: hsl(120 80% 40%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(100 70% 45%);
  --secondary-foreground: hsl(0 0% 100%);
  --muted: hsl(120 30% 95%);
  --muted-foreground: hsl(120 30% 35%);
  --accent: hsl(140 90% 60%);
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 70% 60%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(120 30% 85%);
  --input: hsl(120 30% 85%);
  --ring: hsl(120 80% 40%);
  --chart-1: hsl(120 80% 40%);
  --chart-2: hsl(100 70% 45%);
  --chart-3: hsl(140 90% 60%);
  --chart-4: hsl(80 70% 50%);
  --chart-5: hsl(160 80% 60%);
  --sidebar: hsl(120 30% 95%);
  --sidebar-foreground: hsl(120 30% 15%);
  --sidebar-primary: hsl(120 80% 40%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(140 90% 60%);
  --sidebar-accent-foreground: hsl(0 0% 100%);
  --sidebar-border: hsl(120 30% 85%);
  --sidebar-ring: hsl(120 80% 40%);
  --font-sans: DM Sans, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: Space Mono, monospace;
  --radius: 8px;
  --shadow-2xs: 0px 1px 2px 0px hsl(120 30% 8% / 0.05);
  --shadow-xs: 0px 1px 3px 0px hsl(120 30% 8% / 0.1);
  --shadow-sm: 0px 1px 2px 0px hsl(120 30% 8% / 0.06), 0px 1px 3px 1px hsl(120 30% 8% / 0.1);
  --shadow: 0px 1px 3px 0px hsl(120 30% 8% / 0.1), 0px 1px 2px 1px hsl(120 30% 8% / 0.06);
  --shadow-md: 0px 4px 6px -1px hsl(120 30% 8% / 0.1), 0px 2px 4px -1px hsl(120 30% 8% / 0.06);
  --shadow-lg: 0px 10px 15px -3px hsl(120 30% 8% / 0.1), 0px 4px 6px -2px hsl(120 30% 8% / 0.05);
  --shadow-xl: 0px 20px 25px -5px hsl(120 30% 8% / 0.1), 0px 10px 10px -5px hsl(120 30% 8% / 0.04);
  --shadow-2xl: 0px 25px 50px -12px hsl(120 30% 8% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: hsl(120 30% 8%);
  --foreground: hsl(120 20% 90%);
  --card: hsl(120 30% 12%);
  --card-foreground: hsl(120 20% 90%);
  --popover: hsl(120 30% 12%);
  --popover-foreground: hsl(120 20% 90%);
  --primary: hsl(120 80% 50%);
  --primary-foreground: hsl(0 0% 0%);
  --secondary: hsl(100 70% 55%);
  --secondary-foreground: hsl(0 0% 0%);
  --muted: hsl(120 50% 15%);
  --muted-foreground: hsl(120 20% 70%);
  --accent: hsl(140 90% 70%);
  --accent-foreground: hsl(0 0% 0%);
  --destructive: hsl(0 70% 70%);
  --destructive-foreground: hsl(0 0% 0%);
  --border: hsl(120 50% 20%);
  --input: hsl(120 50% 20%);
  --ring: hsl(120 80% 50%);
  --chart-1: hsl(120 80% 50%);
  --chart-2: hsl(100 70% 55%);
  --chart-3: hsl(140 90% 70%);
  --chart-4: hsl(80 70% 60%);
  --chart-5: hsl(160 80% 70%);
  --sidebar: hsl(120 50% 10%);
  --sidebar-foreground: hsl(120 20% 90%);
  --sidebar-primary: hsl(120 80% 50%);
  --sidebar-primary-foreground: hsl(0 0% 0%);
  --sidebar-accent: hsl(140 90% 70%);
  --sidebar-accent-foreground: hsl(0 0% 0%);
  --sidebar-border: hsl(120 50% 20%);
  --sidebar-ring: hsl(120 80% 50%);
  --font-sans: DM Sans, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: Space Mono, monospace;
  --radius: 8px;
  --shadow-2xs: 0px 1px 2px 0px hsl(120 30% 8% / 0.05);
  --shadow-xs: 0px 1px 3px 0px hsl(120 30% 8% / 0.1);
  --shadow-sm: 0px 1px 2px 0px hsl(120 30% 8% / 0.06), 0px 1px 3px 1px hsl(120 30% 8% / 0.1);
  --shadow: 0px 1px 3px 0px hsl(120 30% 8% / 0.1), 0px 1px 2px 1px hsl(120 30% 8% / 0.06);
  --shadow-md: 0px 4px 6px -1px hsl(120 30% 8% / 0.1), 0px 2px 4px -1px hsl(120 30% 8% / 0.06);
  --shadow-lg: 0px 10px 15px -3px hsl(120 30% 8% / 0.1), 0px 4px 6px -2px hsl(120 30% 8% / 0.05);
  --shadow-xl: 0px 20px 25px -5px hsl(120 30% 8% / 0.1), 0px 10px 10px -5px hsl(120 30% 8% / 0.04);
  --shadow-2xl: 0px 25px 50px -12px hsl(120 30% 8% / 0.25);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

/* Base styles */
* {
  border-color: hsl(var(--color-border));
}

body {
  background-color: hsl(var(--color-background));
  color: hsl(var(--color-foreground));
}

/* Smooth transitions for theme switching */
* {
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Ensure theme switcher has smooth transitions */
.theme-switcher button,
.theme-switcher .absolute {
  transition: all 0.2s ease;
}
  `,
}
```

### Step 2: Add to Index

In `src/themes/index.ts`, just add the import and add it to the array:

```typescript
// Import themes
import { neoBrutalismTheme } from './neo_brutalism'
import { oceanTheme } from './ocean'
import { sunsetTheme } from './sunset'
import { forestTheme } from './forest' // ← Add this line

// Export themes
export { neoBrutalismTheme } from './neo_brutalism'
export { oceanTheme } from './ocean'
export { sunsetTheme } from './sunset'
export { forestTheme } from './forest' // ← Add this line

// Array of all available themes
export const allThemes: Theme[] = [
  neoBrutalismTheme,
  oceanTheme,
  sunsetTheme,
  forestTheme, // ← Add this line
]
```

**The theme store automatically discovers new themes from this array!**

## Theme Structure

Each theme must have:

- **`name`**: Display name for the UI
- **`id`**: Unique identifier (used in URLs and storage)
- **`cssContent`**: **EXACT COPY** of your `globals.css` with your custom colors

## How to Create a New Theme

1. **Copy your `globals.css`** file
2. **Change the color values** in the `:root` and `.dark` sections
3. **Keep the structure identical** - don't change variable names or CSS structure
4. **Wrap it in a template string** (`cssContent: \`...\``)
5. **Add it to the index** file

## Color Properties

The system expects these CSS custom properties (keep the exact names):

- `--background`, `--foreground` - Base colors
- `--card`, `--card-foreground` - Card backgrounds
- `--primary`, `--primary-foreground` - Primary brand colors
- `--secondary`, `--secondary-foreground` - Secondary brand colors
- `--muted`, `--muted-foreground` - Muted/subtle colors
- `--accent`, `--accent-foreground` - Accent colors
- `--destructive`, `--destructive-foreground` - Error/warning colors
- `--border`, `--input`, `--ring` - UI element colors
- `--chart-1` through `--chart-5` - Chart color palette
- `--sidebar*` - Sidebar-specific colors

## How It Works

1. **Theme Store** (`src/store/themeStore.ts`) automatically discovers themes from `allThemes`
2. **Theme Switcher** (`src/components/ui/theme-switcher.tsx`) provides the UI
3. **Theme Provider** (`src/components/providers/ThemeProvider.tsx`) initializes themes
4. Themes are applied by injecting the CSS content directly into the document
5. Light/dark mode still works independently via `next-themes`

## Benefits

- ✅ **Single point of entry** - themes only added in `index.ts`
- ✅ **No duplication** - store automatically discovers themes from index
- ✅ **Instant switching** - just inject CSS content
- ✅ **Smooth transitions** - CSS transitions between themes
- ✅ **Easy to add new themes** - just copy globals.css and change colors!
- ✅ **Automatic discovery** - themes appear in switcher automatically
- ✅ **Persistent** - themes saved to localStorage
- ✅ **Performance** - no CSS file loading/unloading
- ✅ **Exact format match** - works with your existing CSS structure

## Pro Tips

- **Copy-paste your `globals.css`** - don't rewrite it
- **Only change the color values** - keep everything else identical
- **Test light/dark mode** - make sure both variants look good
- **Use consistent color schemes** - primary, secondary, accent should work together
- **Keep shadows consistent** - they define the theme's "feel"
- **Only edit `index.ts`** - the store automatically picks up changes
