# MeTruyen+ Component Enhancement Guide

## Overview

This document provides detailed component-by-component enhancement guidelines for upgrading MeTruyen+'s existing React components to align with the new design system and deliver an exceptional text novel reading experience.

## Enhancement Strategy

### Core Principles
- **Progressive Enhancement**: Maintain existing functionality while adding new features
- **Design System Compliance**: Ensure all components follow the established design system
- **Performance Optimization**: Improve loading and runtime performance
- **Accessibility First**: Implement comprehensive accessibility features
- **Mobile-Native Feel**: Prioritize mobile experience with touch-optimized interactions

### Component Classification
- **🔴 Critical**: Core user experience components requiring immediate attention
- **🟡 High**: Important components affecting major user flows  
- **🟢 Medium**: Secondary components enhancing overall experience
- **🔵 Low**: Nice-to-have improvements with minimal impact

## Core Component Enhancements

### 1. Header.tsx 🔴 Critical
**Current State**: 768-line complex header with mobile navigation
**Enhancement Priority**: Phase 1 (Week 1)

#### Current Analysis
```typescript
// Existing structure
- Complex mobile menu with overlay
- Theme toggle functionality
- User authentication integration  
- Search bar integration
- Heavy hover effects impacting performance
```

#### Proposed Enhancements

##### Visual Design Updates
```typescript
// New glass morphism header
const EnhancedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Glass morphism with scroll-based opacity
  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isScrolled 
      ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg' 
      : 'bg-transparent'
    }
  `
  
  // Scroll detection for dynamic background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}
```

##### Mobile Navigation Enhancement
```typescript
// Bottom sheet pattern for mobile menu
const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden">
          <MenuIcon className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="rounded-t-2xl bg-white/95 backdrop-blur-md"
      >
        <div className="grid grid-cols-2 gap-4 py-6">
          {navigationItems.map((item) => (
            <MobileNavItem key={item.path} {...item} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

##### Performance Optimizations
```typescript
// Lazy load heavy components
const SearchBar = lazy(() => import('@/components/SearchBar'))
const UserMenu = lazy(() => import('@/components/UserMenu'))

// Debounced scroll handler
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  
  const updatePosition = useMemo(
    () => debounce(() => {
      setScrollPosition(window.pageYOffset)
    }, 10),
    []
  )
  
  useEffect(() => {
    window.addEventListener('scroll', updatePosition)
    return () => window.removeEventListener('scroll', updatePosition)
  }, [updatePosition])
  
  return scrollPosition
}
```

#### Implementation Checklist
- [ ] Add glass morphism background with scroll detection
- [ ] Implement bottom sheet mobile navigation
- [ ] Add micro-animations for menu interactions
- [ ] Optimize performance with lazy loading and debouncing
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Add keyboard navigation support
- [ ] Implement haptic feedback for mobile interactions

---

### 2. CardItem.tsx 🔴 Critical
**Current State**: 150-line comic card with hover effects
**Enhancement Priority**: Phase 1 (Week 1)

#### Current Analysis
```typescript
// Existing features
- Lazy loading with react-lazy-load-image-component
- Desktop hover preview functionality
- Basic responsive design
- Limited interaction feedback
```

#### Proposed Enhancements

##### Manga Panel-Inspired Design
```typescript
const EnhancedCardItem = ({ comic, variant = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const cardVariants = {
    default: "card-glass hover:card-manga-hover",
    manga: "card-manga",
    minimal: "card-minimal"
  }
  
  return (
    <motion.article 
      className={cn("group relative", cardVariants[variant])}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial="hidden"
      animate="visible"
      variants={cardAnimationVariants}
    >
      {/* Manga-style border effect */}
      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      
      {/* Image with advanced loading states */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <OptimizedImage
          src={comic.thumbnail}
          alt={comic.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          onLoadingComplete={() => setIsLoading(false)}
          placeholder="blur"
          blurDataURL={generateBlurDataURL(comic.thumbnail)}
        />
        
        {/* Loading skeleton */}
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        )}
        
        {/* Quick action buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute top-2 right-2 flex gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <QuickActionButton 
                icon={<HeartIcon />} 
                onClick={(e) => handleQuickFavorite(e, comic)}
                aria-label="Add to favorites"
              />
              <QuickActionButton 
                icon={<BookmarkIcon />} 
                onClick={(e) => handleQuickBookmark(e, comic)}
                aria-label="Bookmark this comic"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Content section with improved typography */}
      <div className="p-4 space-y-3">
        <h3 className="font-manga text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
          {comic.title}
        </h3>
        
        {/* Enhanced metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {formatRelativeTime(comic.updatedAt)}
          </span>
          <span className="flex items-center gap-1">
            <EyeIcon className="w-4 h-4" />
            {formatNumber(comic.views)}
          </span>
        </div>
        
        {/* Genre tags */}
        <div className="flex flex-wrap gap-1">
          {comic.genres?.slice(0, 3).map((genre) => (
            <Badge 
              key={genre} 
              variant="secondary" 
              className="text-xs px-2 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </motion.article>
  )
}
```

##### Advanced Image Optimization
```typescript
const OptimizedImage = ({ src, alt, onLoadingComplete, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(generateLowQualityImageURL(src))
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoaded(true)
      onLoadingComplete?.()
    }
  }, [src, onLoadingComplete])
  
  return (
    <div className="relative">
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          "transition-all duration-500",
          isLoaded ? "scale-100 blur-0" : "scale-105 blur-sm",
          props.className
        )}
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
      )}
    </div>
  )
}
```

#### Implementation Checklist
- [ ] Implement manga panel-inspired card design
- [ ] Add advanced image loading with blur placeholders
- [ ] Create quick action buttons with smooth animations
- [ ] Add touch-friendly interactions for mobile
- [ ] Implement accessible focus states and keyboard navigation
- [ ] Add haptic feedback for mobile devices
- [ ] Optimize performance with intersection observer

---

### 3. SearchBar.tsx 🔴 Critical
**Current State**: 262-line advanced search with autocomplete
**Enhancement Priority**: Phase 2 (Week 2)

#### Current Analysis
```typescript
// Existing features
- Autocomplete with API integration
- Search history in localStorage
- Mobile-responsive interface
- Real-time suggestions
```

#### Proposed Enhancements

##### Command Palette Style Interface
```typescript
const EnhancedSearchBar = () => {
  const [isCommandMode, setIsCommandMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  
  // Command palette keyboard shortcut
  useKeyboardShortcut(['cmd+k', 'ctrl+k'], () => {
    setIsCommandMode(true)
  })
  
  return (
    <>
      {/* Regular search bar */}
      <div className="relative">
        <div className="search-input-wrapper group">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search manga... (⌘K)"
            className="search-input glass-effect"
            onClick={() => setIsCommandMode(true)}
            readOnly
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </div>
      </div>
      
      {/* Command palette modal */}
      <CommandPalette 
        isOpen={isCommandMode}
        onClose={() => setIsCommandMode(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        suggestions={suggestions}
      />
    </>
  )
}

const CommandPalette = ({ isOpen, onClose, searchQuery, onSearchChange, suggestions }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Command palette */}
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl z-50 mx-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
          >
            {/* Search input */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search manga, authors, genres..."
                className="flex-1 bg-transparent text-lg placeholder-gray-400 outline-none"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
              />
              <kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded border">ESC</kbd>
            </div>
            
            {/* Search results */}
            <div className="max-h-96 overflow-y-auto">
              <SearchResults query={searchQuery} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

##### Visual Search Previews
```typescript
const SearchResultItem = ({ result, isSelected, onSelect }) => {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-4 p-3 cursor-pointer transition-all duration-200",
        isSelected ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
      )}
      onClick={() => onSelect(result)}
      whileHover={{ x: 4 }}
    >
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={result.thumbnail}
          alt={result.title}
          className="w-12 h-16 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
          {highlightSearchTerm(result.title, searchQuery)}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {result.author} • {result.status}
        </p>
        <div className="flex gap-1 mt-1">
          {result.genres?.slice(0, 2).map(genre => (
            <Badge key={genre} variant="outline" className="text-xs px-1 py-0">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" variant="ghost">
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
```

#### Implementation Checklist
- [ ] Implement command palette with ⌘K shortcut
- [ ] Add visual search result previews
- [ ] Create advanced filtering interface
- [ ] Implement voice search capability (optional)
- [ ] Add search analytics and suggestions
- [ ] Optimize search performance with debouncing
- [ ] Ensure keyboard navigation accessibility

---

### 4. HomeComicList.tsx 🟡 High
**Current State**: Basic comic list component
**Enhancement Priority**: Phase 2 (Week 2)

#### Proposed Enhancements

##### Infinite Scroll with Virtual Scrolling
```typescript
const EnhancedHomeComicList = ({ data, title, icon }) => {
  const [visibleItems, setVisibleItems] = useState(20)
  const { ref, inView } = useInView({ threshold: 0 })
  
  // Virtual scrolling for performance
  const rowVirtualizer = useVirtualizer({
    count: data?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280, // Estimated card height
    overscan: 5,
  })
  
  // Load more items when scrolling near bottom
  useEffect(() => {
    if (inView && visibleItems < data?.length) {
      setVisibleItems(prev => Math.min(prev + 20, data.length))
    }
  }, [inView, visibleItems, data?.length])
  
  return (
    <section className="space-y-6">
      {/* Enhanced section header */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={icon} alt="" className="w-8 h-8" />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur opacity-30 animate-pulse" />
        </div>
        <h2 className="text-2xl font-manga font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      
      {/* Grid with staggered animations */}
      <div 
        ref={parentRef}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem, index) => {
          const comic = data[virtualItem.index]
          return (
            <motion.div
              key={comic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
            >
              <CardItem comic={comic} variant="manga" />
            </motion.div>
          )
        })}
      </div>
      
      {/* Loading indicator */}
      <div ref={ref} className="flex justify-center p-4">
        {inView && visibleItems < data?.length && <LoadingSpinner />}
      </div>
    </section>
  )
}
```

#### Implementation Checklist
- [ ] Add virtual scrolling for performance
- [ ] Implement staggered card animations
- [ ] Add section header enhancements
- [ ] Create loading states and skeletons
- [ ] Add error boundaries and retry mechanisms

---

### 5. MainLayout.tsx 🟡 High
**Current State**: Basic layout wrapper
**Enhancement Priority**: Phase 3 (Week 3)

#### Proposed Enhancements

##### Adaptive Layout System
```typescript
const EnhancedMainLayout = ({ children }) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const layoutVariants = {
    mobile: "flex flex-col min-h-screen",
    tablet: "flex flex-col min-h-screen lg:flex-row",
    desktop: "flex min-h-screen"
  }
  
  const currentLayout = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  
  return (
    <div className={layoutVariants[currentLayout]}>
      {/* Adaptive header */}
      <EnhancedHeader />
      
      {/* Main content area */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isMobile ? "pt-16" : "pt-20",
        !isMobile && sidebarCollapsed && "ml-16",
        !isMobile && !sidebarCollapsed && "ml-64"
      )}>
        {/* Page transition wrapper */}
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      
      {/* Adaptive sidebar */}
      {!isMobile && (
        <EnhancedSidebar 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}
      
      {/* Mobile bottom navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  )
}

const PageTransition = ({ children }) => {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

#### Implementation Checklist
- [ ] Implement adaptive layout system
- [ ] Add page transition animations
- [ ] Create responsive sidebar
- [ ] Add mobile bottom navigation
- [ ] Implement keyboard navigation support

---

## Secondary Component Enhancements

### 6. Navbar.tsx 🟢 Medium
**Current State**: 358-line navigation with regular and top nav items
**Enhancement Priority**: Phase 2 (Week 2)

#### Proposed Enhancements
```typescript
const EnhancedNavbar = () => {
  const { pathname } = useLocation()
  const [activeItem, setActiveItem] = useState('')
  
  return (
    <nav className="relative">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg"
        layoutId="navbar-bg"
      />
      
      {/* Navigation items with active indicator */}
      <ul className="relative flex items-center gap-1 p-2">
        {navigationItems.map((item) => (
          <NavItem
            key={item.path}
            {...item}
            isActive={pathname === item.path}
            onHover={() => setActiveItem(item.path)}
            onLeave={() => setActiveItem('')}
          />
        ))}
        
        {/* Active indicator */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-primary-500 rounded-full"
          layoutId="active-indicator"
          initial={false}
          animate={{
            x: activeItem ? getItemPosition(activeItem) : 0,
            width: activeItem ? getItemWidth(activeItem) : 0,
          }}
        />
      </ul>
    </nav>
  )
}
```

### 7. HistoryHome.tsx 🟢 Medium
**Current State**: Basic reading history display
**Enhancement Priority**: Phase 4 (Week 4)

#### Proposed Enhancements
```typescript
const EnhancedHistoryHome = () => {
  const { data: history, isLoading } = useQuery('reading-history', getReadingHistory)
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-manga font-bold">Continue Reading</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/history">View All</Link>
        </Button>
      </div>
      
      {/* Horizontal scrollable history */}
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-2">
          {history?.slice(0, 10).map((item, index) => (
            <HistoryCard
              key={item.id}
              item={item}
              delay={index * 0.1}
            />
          ))}
        </div>
      </ScrollArea>
    </section>
  )
}

const HistoryCard = ({ item, delay }) => {
  const progressPercentage = (item.currentPage / item.totalPages) * 100
  
  return (
    <motion.div
      className="flex-shrink-0 w-32 group cursor-pointer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-40 object-cover rounded-lg"
        />
        
        {/* Progress overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 rounded-b-lg overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
          />
        </div>
        
        {/* Continue button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <Button size="sm" className="text-xs">
            Continue
          </Button>
        </div>
      </div>
      
      <h3 className="mt-2 text-sm font-semibold line-clamp-2">
        {item.title}
      </h3>
      <p className="text-xs text-gray-500">
        Chapter {item.currentChapter}
      </p>
    </motion.div>
  )
}
```

## Utility Component Enhancements

### 8. Loading Components
```typescript
// Enhanced loading skeletons
const ComicCardSkeleton = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
)

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  
  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-primary-500", sizes[size])} />
  )
}
```

### 9. Error Boundary Components
```typescript
const ErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundaryProvider
      fallback={({ error, reset }) => (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="text-6xl">😵</div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-gray-600 text-center max-w-md">
            We encountered an error while loading this content. Please try again.
          </p>
          <Button onClick={reset}>Try Again</Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundaryProvider>
  )
}
```

### 10. Accessibility Enhancements
```typescript
// Focus trap for modals
const FocusTrap = ({ children, enabled = true }) => {
  const trapRef = useRef(null)
  
  useEffect(() => {
    if (!enabled || !trapRef.current) return
    
    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }
    
    trapRef.current.addEventListener('keydown', handleTabKey)
    firstElement?.focus()
    
    return () => {
      trapRef.current?.removeEventListener('keydown', handleTabKey)
    }
  }, [enabled])
  
  return <div ref={trapRef}>{children}</div>
}

// Screen reader announcements
const useAnnouncement = () => {
  const announce = useCallback((message, priority = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])
  
  return announce
}
```

## Implementation Timeline

### Phase 1: Core Components (Week 1)
- ✅ Header.tsx enhancements
- ✅ CardItem.tsx redesign
- ✅ Basic loading components

### Phase 2: Content Discovery (Week 2)
- ✅ SearchBar.tsx command palette
- ✅ HomeComicList.tsx improvements
- ✅ Navbar.tsx animations

### Phase 3: Layout & Navigation (Week 3)
- ✅ MainLayout.tsx adaptive system
- ✅ Mobile navigation components
- ✅ Page transition system

### Phase 4: Secondary Features (Week 4)
- ✅ HistoryHome.tsx enhancements
- ✅ Error boundary implementations
- ✅ Accessibility improvements

### Phase 5: Polish & Optimization (Week 5)
- ✅ Performance optimizations
- ✅ Animation fine-tuning
- ✅ Final accessibility audit

### Phase 6: Testing & Deployment (Week 6)
- ✅ Component testing
- ✅ Visual regression testing
- ✅ Performance validation

## Testing Strategy

### Component Testing
```typescript
// Example test for enhanced components
describe('EnhancedCardItem', () => {
  it('renders with manga panel design', () => {
    render(<EnhancedCardItem comic={mockComic} variant="manga" />)
    expect(screen.getByRole('article')).toHaveClass('card-manga')
  })
  
  it('handles keyboard navigation', () => {
    render(<EnhancedCardItem comic={mockComic} />)
    const card = screen.getByRole('article')
    
    card.focus()
    fireEvent.keyDown(card, { key: 'Enter' })
    
    expect(mockNavigate).toHaveBeenCalledWith(`/comic/${mockComic.slug}`)
  })
  
  it('meets accessibility standards', async () => {
    const { container } = render(<EnhancedCardItem comic={mockComic} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Performance Testing
```typescript
// Performance benchmark tests
describe('Performance', () => {
  it('renders 100 cards within performance budget', () => {
    const start = performance.now()
    
    render(
      <HomeComicList data={generateMockComics(100)} title="Test" />
    )
    
    const end = performance.now()
    expect(end - start).toBeLessThan(100) // 100ms budget
  })
})
```

## Migration Guide

### Step 1: Backup Current Components
```bash
# Create backup directory
mkdir -p src/components/backup
cp -r src/components/*.tsx src/components/backup/
```

### Step 2: Install Required Dependencies
```bash
npm install framer-motion @radix-ui/react-dialog @radix-ui/react-scroll-area
npm install @tanstack/react-virtual use-intersection-observer
npm install @headlessui/react class-variance-authority
```

### Step 3: Update Components Gradually
1. Start with non-critical components
2. Test each component thoroughly
3. Roll back if issues are detected
4. Move to critical components last

### Step 4: Performance Monitoring
```typescript
// Add performance monitoring
const PerformanceMonitor = ({ children }) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`${entry.name}: ${entry.duration}ms`)
        })
      })
      
      observer.observe({ entryTypes: ['measure', 'navigation'] })
      
      return () => observer.disconnect()
    }
  }, [])
  
  return children
}
```

This comprehensive component enhancement guide provides the detailed roadmap for upgrading MeTruyen+'s React components to deliver an exceptional user experience while maintaining performance and accessibility standards.