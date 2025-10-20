import React, { createContext, useContext } from 'react'
import { trackWindowScroll, ScrollPosition } from 'react-lazy-load-image-component'

// Props interface for components that will use trackWindowScroll
export interface WithScrollPositionProps {
  scrollPosition: ScrollPosition
}

// Context for passing scroll position down to nested components
const ScrollPositionContext = createContext<ScrollPosition | null>(null)

// Hook to use scroll position in nested components
export const useScrollPosition = (): ScrollPosition | undefined => {
  return useContext(ScrollPositionContext) || undefined
}

/**
 * Enhanced trackWindowScroll HOC with optimized configuration
 * This should wrap gallery/grid components to improve performance
 * by avoiding multiple scroll listeners
 */
export const withOptimizedScrollTracking = <P extends {}>(
  Component: React.ComponentType<P & WithScrollPositionProps>
) => {
  // Apply trackWindowScroll HOC with optimized configuration
  const WrappedComponent = trackWindowScroll(Component)

  // Return a component that maintains the original component name for debugging
  const OptimizedComponent = (props: Omit<P, 'scrollPosition'>) => (
    <WrappedComponent {...(props as any)} />
  )
  OptimizedComponent.displayName = `OptimizedScrollTracking(${
    Component.displayName || Component.name
  })`

  return OptimizedComponent
}

/**
 * Pre-configured gallery wrapper for comic grids
 * Use this for pages with multiple comic cards/thumbnails
 */
export const OptimizedComicGrid = withOptimizedScrollTracking(
  ({
    children,
    scrollPosition,
    className = ''
  }: {
    children: React.ReactNode
    scrollPosition: ScrollPosition
    className?: string
  }) => (
    <ScrollPositionContext.Provider value={scrollPosition}>
      <ul className={`optimized-comic-grid ${className}`}>{children}</ul>
    </ScrollPositionContext.Provider>
  )
)

/**
 * Optimized grid for search results and listings
 */
export const OptimizedSearchGrid = withOptimizedScrollTracking(
  ({
    children,
    scrollPosition,
    className = ''
  }: {
    children: React.ReactNode
    scrollPosition: ScrollPosition
    className?: string
  }) => (
    <ScrollPositionContext.Provider value={scrollPosition}>
      <ul
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 ${className}`}
      >
        {children}
      </ul>
    </ScrollPositionContext.Provider>
  )
)

/**
 * Optimized horizontal slider for featured content
 */
export const OptimizedHorizontalSlider = withOptimizedScrollTracking(
  ({
    children,
    scrollPosition,
    className = ''
  }: {
    children: React.ReactNode
    scrollPosition: ScrollPosition
    className?: string
  }) => (
    <ScrollPositionContext.Provider value={scrollPosition}>
      <div className={`flex gap-4 overflow-x-auto scrollbar-hide ${className}`}>{children}</div>
    </ScrollPositionContext.Provider>
  )
)

export default OptimizedComicGrid
