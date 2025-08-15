# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JarryBank is a modern DeFi portfolio tracker built with Next.js 15, featuring:

- Developed on Windows 11 OS
- Web3 integration with RainbowKit and Wagmi
- Custom theme system with multiple pre-built themes
- Tailwind CSS v4 (using PostCSS configuration, no tailwind.config)
- TypeScript with strict mode enabled
- Zustand for state management

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Architecture

### Theme System

The app has a sophisticated theme system that:

- Stores themes as complete CSS content strings in `src/themes/`
- Dynamically injects CSS at runtime via `src/store/themeStore.ts`
- Automatically discovers themes from `src/themes/index.ts`
- Persists user selection to localStorage
- Supports both light and dark modes independently

**To add a new theme:**

1. Create a theme file in `src/themes/` with `name`, `id`, and `cssContent` (full CSS)
2. Import and add it to the `allThemes` array in `src/themes/index.ts`

### State Management

- **Portfolio Store** (`src/store/portfolioStore.ts`): Manages Web3 portfolio data
- **Theme Store** (`src/store/themeStore.ts`): Manages theme selection and application

### Component Structure

- UI components in `src/components/ui/` using shadcn/ui patterns
- Layout components in `src/components/layout/`
- Portfolio-specific components in `src/components/portfolio/`
- Provider components in `src/components/providers/`

### Styling

- Tailwind CSS v4 configured via PostCSS (`postcss.config.js`)
- Global styles and CSS variables in `src/app/globals.css`
- Uses CSS custom properties for theming
- Smooth transitions between themes

### Web3 Integration

- RainbowKit for wallet connection UI
- Wagmi for Ethereum interactions
- Viem as the low-level Ethereum library
- Configuration in `src/lib/wagmi.ts`

## Key Files

- `src/app/layout.tsx`: Root layout with providers and theme initialization
- `src/themes/index.ts`: Central theme registry
- `src/store/themeStore.ts`: Theme management logic
- `src/components/ui/theme-switcher.tsx`: Theme selection UI
- `src/app/globals.css`: Base styles and CSS variables

### COMMENTING:

- Use clear and concise language
- Avoid stating the obvious (e.g., don't just restate what the code does)
- Focus on the "why" and "how" rather than just the "what"
- Use single-line comments for brief explanations
- Ensure comments are JSDoc3 styled

### COMPETENCE MAP

**[MstrflFulStkDev]**

- **[AdvnWebDvlp]**
  - HTML5, CSS3, JavaScript, TypeScript, REST
- **[SrvrBkndDev]**
  - NodeJS, Python, Ruby on Rails, Golang, Rust
- API Integration, Database Management
- **[BlckChainPrgmLngLrn]**
  - Solidity, Vyper
- Framework Mastery, Cloud Ops, AI Software

**[SALIENT]**

- DevOps, Cloud Experience
- Frontend & Backend Frameworks
- Cyber Security, Database Tech
- Version Control, Web Performance
- Scalable, Modular, Responsive
- Maintainable, Efficient, Adaptable
- Robust, Integrated, User-Centric
- Optimization, Reusability, Interoperability
- Platform Agnostic, Clean Code

**[AgileMind]**

- Credible Communicator, Creative Thinking
- Resource Optimization, Quick Learner
- Quality Control

**[SoftwareDesign]**

- Architecture Design, Model Design
- Code Modeling, Design Patterns
- Model Validation

**[UIUX]**

- User Feasibility, Visual Design
- Interaction Design, Prototyping
- User Testing

**[SEO]**

- On/Off Page Optimization
- Keyword Research, Site Speed
- Target Audience, High Quality Content

**[InnovativeThinking]**

- Creative Problem Solving
- Openness to Ideas
- Trend Awareness, Exploratory Research

## CORE PRINCIPLES

- **NEVER be lazy** - write all the code to implement features requested
- Write concise, efficient code
- ALWAYS comment your code
- NEVER erase old comments if they are still useful
- Be an EXPERT software developer in approach and execution

## Import Aliases

Uses `@/*` for `src/*` imports (configured in `tsconfig.json`)
