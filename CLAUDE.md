# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 personal website built with TypeScript and Vite, configured for automatic deployment to GitHub Pages. The project follows modern Vue.js development patterns with Vue Router for navigation and Pinia for state management.

## Architecture Overview

### Technology Stack

- **Vue 3** (Composition API)
- **TypeScript** (strict mode enabled)
- **Vite 5.x** for build tooling
- **Vue Router 4** for routing
- **Pinia 3** for state management
- **SCSS** for styling with Tailwind-like utility classes
- **Prettier** for code formatting

### Project Structure

```
src/
├── App.vue              # Root component with navigation and layout
├── main.ts              # Application entry point
├── style.css            # Global styles
├── vite-env.d.ts        # TypeScript environment declarations
├── router/              # Vue Router configuration
│   └── index.ts         # Routes and navigation guards
├── stores/              # Pinia stores
│   └── index.ts         # App and user state management
├── components/          # Reusable components (currently empty)
├── views/               # Page components
│   ├── Home.vue         # Home page
│   ├── About.vue        # About page
│   ├── home-page/       # Future home page components
│   └── mapbox/          # Map-related components
└── assets/              # Static assets
    ├── icons/           # Icon files
    └── images/          # Image assets
        └── texture.png  # Background texture
```

## Development Workflow

## Development Commands

### Core Development

```bash
pnpm run dev          # Start development server with hot reload
pnpm run build        # TypeScript compilation + Vite production build
pnpm run preview      # Preview production build locally
```

### Code Quality

```bash
pnpm run format       # Format all files with Prettier
pnpm run format:check # Check code formatting without changes
```

### Package Management

- Use **pnpm** for all package operations (not npm or yarn)
- Dependencies are managed via `pnpm-lock.yaml`

## Architecture & Structure

### Vue Router Configuration (`src/router/index.ts`)

- **History mode**: Uses `createWebHistory()` for clean URLs
- **Lazy loading**: All route components use dynamic imports
- **Global guards**: Navigation guard sets page titles from route meta
- **Route patterns**:
  ```typescript
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' }
  }
  ```

### Pinia State Management (`src/stores/index.ts`)

- **App Store**: Global app state (loading, theme, sidebar)
- **User Store**: Authentication and user profile data
- **TypeScript**: Full type safety with state, getters, and actions
- **Usage pattern**:
  ```typescript
  import { useAppStore, useUserStore } from '@/stores'
  const appStore = useAppStore()
  const userStore = useUserStore()
  ```

### Component Structure

- **Composition API**: All components use `<script setup lang="ts">` syntax
- **Views**: Page components in `src/views/` (Home.vue, About.vue)
- **Layout**: Main layout in `App.vue` with header navigation, main content area, and footer
- **Styling**: SCSS with scoped styles, modern CSS features (backdrop-filter, gradients)

### Build Configuration

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Vite**: Optimized for production with code splitting
- **Assets**: Images in `src/assets/` with proper URL handling
- **Output**: Production builds go to `/dist` directory

## Development Patterns

### Adding New Routes

1. Create component in `src/views/`
2. Add route to `src/router/index.ts` following existing pattern
3. Include meta.title for automatic page title setting

### Adding New Stores

1. Create store in `src/stores/index.ts` or separate files
2. Use Pinia composition API with TypeScript types
3. Export from main store index for clean imports

### Styling Conventions

- Use SCSS with scoped styles in components
- Leverage existing gradient background and texture patterns
- Maintain responsive design patterns
- Use CSS custom properties for theming consistency

### GitHub Pages Deployment

- Automatic deployment via GitHub Actions workflow
- Builds and deploys to `gh-pages` branch
- Ensure build passes before commits to main branch

## Key Files to Understand

- `src/main.ts`: App initialization with router and Pinia
- `src/router/index.ts`: Route definitions and navigation logic
- `src/stores/index.ts`: Global state management
- `src/App.vue`: Main layout component with navigation
- `vite.config.ts`: Build tooling configuration
- `package.json`: Dependencies and development scripts
