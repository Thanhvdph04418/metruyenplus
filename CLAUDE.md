# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MeTruyen+ is a React-based text novel reading website built with TypeScript, TailwindCSS, and Vite. The application provides a responsive interface for browsing, reading, and managing novel collections with features like user authentication, reading history, commenting, and PDF downloads.

**Live URL**: https://MeTruyen+.vercel.app/  
**Backend API**: https://github.com/pth-1641/NComics

## Development Commands

### Essential Commands
```bash
# Install dependencies
yarn

# Development server (port 3000 or PORT env variable)
yarn dev

# Production build
yarn build

# Preview production build
yarn preview
```

### Code Quality
```bash
# Lint TypeScript/TSX files
yarn lint

# Auto-fix linting issues
yarn lint:fix

# Check code formatting
yarn prettier

# Auto-format code
yarn prettier:fix
```

### Utilities
```bash
# Generate sitemap (requires running backend API)
yarn generate-sitemap
```

## Architecture Overview

### Core Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom design system
- **State Management**: React Query for server state, React Context for auth
- **Routing**: React Router DOM v6 with lazy loading
- **HTTP Client**: Axios with custom interceptors
- **Authentication**: JWT + Google OAuth integration

### Project Structure

```
src/
├── apis/           # API clients and HTTP configurations
├── components/     # Reusable UI components
├── context/        # React contexts (AuthContext)
├── hooks/          # Custom React hooks
├── layouts/        # Page layout components
├── pages/          # Route components (lazy loaded)
├── routes/         # Route protection and configuration
├── types/          # TypeScript type definitions
├── utils/          # Utility functions and helpers
```

### Key Architecture Patterns

#### Authentication System
- **Token Storage**: JWT tokens stored in localStorage
- **Auth Context**: Centralized authentication state management
- **Protected Routes**: Route-level authentication guards
- **API Integration**: Automatic token injection in API requests

#### API Layer
- **Centralized Client**: `axiosClients.ts` with request/response interceptors
- **Authentication Headers**: Custom `x-request-id` generation with encryption
- **Type Safety**: Full TypeScript coverage for API responses
- **Error Handling**: Centralized error processing with proper status codes

#### State Management
- **Server State**: React Query for caching, synchronization, and background updates
- **Client State**: React useState/useReducer for component-level state
- **Global State**: Context API for cross-cutting concerns (auth, theme)

#### Component Organization
- **Atomic Design**: Components organized by complexity and reusability
- **Lazy Loading**: Route-level code splitting for performance
- **Shared Components**: Common UI elements in components/index.ts

### Styling System

#### TailwindCSS Configuration
- **Custom Colors**: Brand colors (`primary`, `secondary`, dark/light themes)
- **Typography**: Custom font families (`Nunito`, `Comic Neue`, `Bangers`)
- **Animations**: Custom keyframes (`shimmer`, `fadeIn`, `scale`)
- **Responsive**: Mobile-first approach with custom breakpoints

#### Theme Implementation
- **Dark/Light Mode**: CSS class-based theming with localStorage persistence
- **Color System**: Semantic color tokens for consistent theming
- **Component Utilities**: Custom Tailwind components for common patterns

### Performance Optimizations

#### Build Optimization
- **Code Splitting**: Manual chunks for vendor libraries
- **Asset Optimization**: Image compression and lazy loading
- **Bundle Analysis**: Chunk size warnings and optimization

#### Runtime Performance
- **Lazy Loading**: React.lazy for route components
- **React Query**: Intelligent caching and background refetching
- **Image Optimization**: Lazy loading with react-lazy-load-image-component

### Authentication Integration

#### Google OAuth Flow
- **Provider Setup**: @react-oauth/google integration
- **Callback Handling**: Dedicated route for OAuth callbacks
- **Token Management**: Automatic token refresh and validation

#### Local Storage Strategy
- **Token Persistence**: auth_token for API authentication
- **User Data**: customerInfo cached for offline access
- **Reading History**: Local IndexedDB integration for reading progress

### Internationalization
- **URL Structure**: Vietnamese path segments for SEO (`/truyen-tranh`, `/the-loai`)
- **Content**: Mixed Vietnamese/English content support
- **Path Mapping**: Dual path constants for frontend/API compatibility

## Development Guidelines

### Component Development
When creating new components, follow the established patterns:
- Place shared components in `src/components/` with index.ts exports
- Use TypeScript interfaces defined in `src/types/data.ts`
- Follow TailwindCSS conventions from `tailwind.config.js`
- Implement responsive design with mobile-first approach

### API Integration
When adding new API endpoints:
- Add types to `src/types/data.ts`
- Implement in `src/apis/comicApis.ts` following existing patterns
- Use authentication headers for protected endpoints
- Handle errors consistently with existing error patterns

### Routing
For new routes:
- Add path constants to `src/utils/path.ts`
- Configure in `App.tsx` with appropriate layout
- Implement lazy loading for performance
- Add protection wrapper if authentication required

### State Management
- Use React Query for server state and caching
- Implement custom hooks in `src/hooks/` for reusable logic
- Use Context sparingly, primarily for global application state
- Prefer component-level state for isolated concerns

## Environment Variables

Required for development:
```
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_COMIC_SECRET_KEY=encryption_key_for_api_requests
VITE_COMIC_CLIENT_NAME=client_identifier_for_api
```

## Database Integration

### Local Storage
- **Reading History**: IndexedDB via `src/utils/history.ts`
- **User Preferences**: localStorage for theme, settings
- **Authentication**: JWT token persistence

### API Integration
- **Base URL**: Configured in axios clients
- **Authentication**: Bearer token + custom request signing
- **Error Handling**: Consistent error response format

## Testing Strategy

Currently using manual testing. When implementing automated tests:
- Focus on critical user flows (auth, reading, search)
- Test API integration with proper mocking
- Validate responsive behavior across breakpoints
- Ensure accessibility compliance

## Cursor Rules Integration

The project includes cursor rules for component generation:
- Components should use TypeScript and TailwindCSS
- Follow existing component patterns in the codebase
- Consider responsive design and accessibility
- Generate detailed prompts for complex components