/**
 * Sunset theme - Warm orange and pink color scheme
 * Cozy and energetic appearance
 */

export const sunsetTheme = {
  name: 'Sunset',
  id: 'sunset',
  cssContent: `
:root {
  --background: hsl(30 50% 98%);
  --foreground: hsl(30 30% 15%);
  --card: hsl(30 50% 100%);
  --card-foreground: hsl(30 30% 15%);
  --popover: hsl(30 50% 100%);
  --popover-foreground: hsl(30 30% 15%);
  --primary: hsl(20 90% 55%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(340 70% 55%);
  --secondary-foreground: hsl(0 0% 100%);
  --muted: hsl(30 30% 95%);
  --muted-foreground: hsl(30 30% 35%);
  --accent: hsl(45 90% 60%);
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 70% 60%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(30 30% 85%);
  --input: hsl(30 30% 85%);
  --ring: hsl(20 90% 55%);
  --chart-1: hsl(20 90% 55%);
  --chart-2: hsl(340 70% 55%);
  --chart-3: hsl(45 90% 60%);
  --chart-4: hsl(60 80% 50%);
  --chart-5: hsl(15 80% 60%);
  --sidebar: hsl(30 30% 95%);
  --sidebar-foreground: hsl(30 30% 15%);
  --sidebar-primary: hsl(20 90% 55%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(45 90% 60%);
  --sidebar-accent-foreground: hsl(0 0% 100%);
  --sidebar-border: hsl(30 30% 85%);
  --sidebar-ring: hsl(20 90% 55%);
  --font-sans: DM Sans, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: Space Mono, monospace;
  --radius: 12px;
  --shadow-2xs: 0px 1px 2px 0px hsl(30 50% 8% / 0.05);
  --shadow-xs: 0px 1px 3px 0px hsl(30 50% 8% / 0.1);
  --shadow-sm: 0px 1px 2px 0px hsl(30 50% 8% / 0.06), 0px 1px 3px 1px hsl(30 50% 8% / 0.1);
  --shadow: 0px 1px 3px 0px hsl(30 50% 8% / 0.1), 0px 1px 2px 1px hsl(30 50% 8% / 0.06);
  --shadow-md: 0px 4px 6px -1px hsl(30 50% 8% / 0.1), 0px 2px 4px -1px hsl(30 50% 8% / 0.06);
  --shadow-lg: 0px 10px 15px -3px hsl(30 50% 8% / 0.1), 0px 4px 6px -2px hsl(30 50% 8% / 0.05);
  --shadow-xl: 0px 20px 25px -5px hsl(30 50% 8% / 0.1), 0px 10px 10px -5px hsl(30 50% 8% / 0.04);
  --shadow-2xl: 0px 25px 50px -12px hsl(30 50% 8% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: hsl(30 50% 8%);
  --foreground: hsl(30 20% 90%);
  --card: hsl(30 50% 12%);
  --card-foreground: hsl(30 20% 90%);
  --popover: hsl(30 50% 12%);
  --popover-foreground: hsl(30 20% 90%);
  --primary: hsl(20 90% 65%);
  --primary-foreground: hsl(0 0% 0%);
  --secondary: hsl(340 70% 65%);
  --secondary-foreground: hsl(0 0% 0%);
  --muted: hsl(30 50% 15%);
  --muted-foreground: hsl(30 20% 70%);
  --accent: hsl(45 90% 70%);
  --accent-foreground: hsl(0 0% 0%);
  --destructive: hsl(0 70% 70%);
  --destructive-foreground: hsl(0 0% 0%);
  --border: hsl(30 50% 20%);
  --input: hsl(30 50% 20%);
  --ring: hsl(20 90% 65%);
  --chart-1: hsl(20 90% 65%);
  --chart-2: hsl(340 70% 65%);
  --chart-3: hsl(45 90% 70%);
  --chart-4: hsl(60 80% 60%);
  --chart-5: hsl(15 80% 70%);
  --sidebar: hsl(30 50% 10%);
  --sidebar-foreground: hsl(30 20% 90%);
  --sidebar-primary: hsl(20 90% 65%);
  --sidebar-primary-foreground: hsl(0 0% 0%);
  --sidebar-accent: hsl(45 90% 70%);
  --sidebar-accent-foreground: hsl(0 0% 0%);
  --sidebar-border: hsl(30 50% 20%);
  --sidebar-ring: hsl(20 90% 65%);
  --font-sans: DM Sans, sans-serif;
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: Space Mono, monospace;
  --radius: 12px;
  --shadow-2xs: 0px 1px 2px 0px hsl(30 50% 8% / 0.05);
  --shadow-xs: 0px 1px 3px 0px hsl(30 50% 8% / 0.1);
  --shadow-sm: 0px 1px 2px 0px hsl(30 50% 8% / 0.06), 0px 1px 3px 1px hsl(30 50% 8% / 0.1);
  --shadow: 0px 1px 3px 0px hsl(30 50% 8% / 0.1), 0px 1px 2px 1px hsl(30 50% 8% / 0.06);
  --shadow-md: 0px 4px 6px -1px hsl(30 50% 8% / 0.1), 0px 2px 4px -1px hsl(30 50% 8% / 0.06);
  --shadow-lg: 0px 10px 15px -3px hsl(30 50% 8% / 0.1), 0px 4px 6px -2px hsl(30 50% 8% / 0.05);
  --shadow-xl: 0px 20px 25px -5px hsl(30 50% 8% / 0.1), 0px 10px 10px -5px hsl(30 50% 8% / 0.04);
  --shadow-2xl: 0px 25px 50px -12px hsl(30 50% 8% / 0.25);
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
