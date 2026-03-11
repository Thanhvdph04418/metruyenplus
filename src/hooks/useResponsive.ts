import { useMediaQuery } from 'react-responsive'

/**
 * Breakpoints (aligned with Tailwind CSS defaults):
 *   mobile:      < 640px   (sm)
 *   tablet:      640–1023px (sm → lg)
 *   desktop:     ≥ 1024px  (lg+)
 */

/** Individual breakpoint hooks */
export const useIsMobile = () => useMediaQuery({ maxWidth: 639 })
export const useIsTablet = () => useMediaQuery({ minWidth: 640, maxWidth: 1023 })
export const useIsDesktop = () => useMediaQuery({ minWidth: 1024 })

/** Convenience composite hook */
export const useResponsive = () => {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
  return { isMobile, isTablet, isDesktop }
}
