# MeTruyen+ Design System Specification

## Overview

This document defines the comprehensive design system for MeTruyen+'s UI/UX upgrade, establishing visual standards, component patterns, and implementation guidelines for creating an exceptional text novel reading platform.

## Design Philosophy

### Core Principles
- **Literature-First Aesthetics**: Visual design inspired by classic book layouts, typography, and elegant reading experiences
- **Progressive Disclosure**: Layer information to reduce cognitive load while maintaining access to advanced features
- **Emotional Design**: Create delightful micro-interactions that enhance the reading experience
- **Accessibility by Design**: Ensure inclusive design that works for all users
- **Performance-Conscious**: Visual enhancements must not compromise load times or responsiveness

### Visual Identity
- **Modern Minimalism**: Clean layouts with purposeful use of visual elements
- **Dynamic Gradients**: Anime-inspired color transitions and atmospheric effects
- **Glass Morphism**: Translucent elements with backdrop blur for depth
- **Organic Shapes**: Soft, rounded corners inspired by manga speech bubbles

## Color System

### Primary Palette

#### Brand Colors
```css
:root {
  /* Primary Gradient */
  --primary-50: #fef7ee;
  --primary-100: #feeace;
  --primary-200: #fdd192;
  --primary-300: #fbb955;
  --primary-400: #f99b2a;
  --primary-500: #f97316;  /* Main brand color */
  --primary-600: #ea580c;
  --primary-700: #c2410c;
  --primary-800: #9a3412;
  --primary-900: #7c2d12;
}
```

#### Secondary Palette
```css
:root {
  /* Purple/Pink Manga Accent */
  --secondary-50: #fdf4ff;
  --secondary-100: #fae8ff;
  --secondary-200: #f5d0fe;
  --secondary-300: #f0abfc;
  --secondary-400: #e879f9;
  --secondary-500: #d946ef;  /* Secondary brand */
  --secondary-600: #c026d3;
  --secondary-700: #a21caf;
  --secondary-800: #86198f;
  --secondary-900: #701a75;
}
```

### Semantic Colors

#### Success States
```css
:root {
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-200: #bbf7d0;
  --success-300: #86efac;
  --success-400: #4ade80;
  --success-500: #22c55e;  /* Success primary */
  --success-600: #16a34a;
  --success-700: #15803d;
  --success-800: #166534;
  --success-900: #14532d;
}
```

#### Warning States
```css
:root {
  --warning-50: #fffbeb;
  --warning-100: #fef3c7;
  --warning-200: #fde68a;
  --warning-300: #fcd34d;
  --warning-400: #fbbf24;
  --warning-500: #f59e0b;  /* Warning primary */
  --warning-600: #d97706;
  --warning-700: #b45309;
  --warning-800: #92400e;
  --warning-900: #78350f;
}
```

#### Error States
```css
:root {
  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-200: #fecaca;
  --error-300: #fca5a5;
  --error-400: #f87171;
  --error-500: #ef4444;  /* Error primary */
  --error-600: #dc2626;
  --error-700: #b91c1c;
  --error-800: #991b1b;
  --error-900: #7f1d1d;
}
```

### Neutral System

#### Light Theme
```css
:root {
  --gray-50: #f8fafc;
  --gray-100: #f1f5f9;
  --gray-200: #e2e8f0;
  --gray-300: #cbd5e1;
  --gray-400: #94a3b8;
  --gray-500: #64748b;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1e293b;
  --gray-900: #0f172a;
}
```

#### Dark Theme
```css
:root {
  --dark-50: #1e293b;
  --dark-100: #334155;
  --dark-200: #475569;
  --dark-300: #64748b;
  --dark-400: #94a3b8;
  --dark-500: #cbd5e1;
  --dark-600: #e2e8f0;
  --dark-700: #f1f5f9;
  --dark-800: #f8fafc;
  --dark-900: #ffffff;
}
```

### Glass Morphism System
```css
:root {
  /* Glass backgrounds */
  --glass-white: rgba(255, 255, 255, 0.1);
  --glass-black: rgba(0, 0, 0, 0.1);
  --glass-primary: rgba(249, 115, 22, 0.1);
  --glass-secondary: rgba(217, 70, 239, 0.1);
  
  /* Glass borders */
  --glass-border-light: rgba(255, 255, 255, 0.2);
  --glass-border-dark: rgba(255, 255, 255, 0.1);
}
```

## Typography System

### Font Families

#### Primary Fonts
```css
:root {
  --font-manga: 'Comic Neue', 'Kalam', cursive;
  --font-title: 'Bangers', 'Fredoka One', cursive;
  --font-reading: 'Merriweather', 'Georgia', serif;
  --font-ui: 'Inter', 'system-ui', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

#### Font Loading Strategy
```css
/* Preload critical fonts */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/inter-var.woff2') format('woff2-variations');
}

@font-face {
  font-family: 'Comic Neue';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('/fonts/comic-neue.woff2') format('woff2');
}
```

### Type Scale

#### Desktop Scale (1.250 - Major Third)
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.563rem;  /* 25px */
  --text-3xl: 1.953rem;  /* 31px */
  --text-4xl: 2.441rem;  /* 39px */
  --text-5xl: 3.052rem;  /* 49px */
  --text-6xl: 3.815rem;  /* 61px */
}
```

#### Mobile Scale (1.200 - Minor Third)
```css
@media (max-width: 768px) {
  :root {
    --text-xs: 0.75rem;    /* 12px */
    --text-sm: 0.875rem;   /* 14px */
    --text-base: 1rem;     /* 16px */
    --text-lg: 1.1rem;     /* 17.6px */
    --text-xl: 1.2rem;     /* 19.2px */
    --text-2xl: 1.44rem;   /* 23px */
    --text-3xl: 1.728rem;  /* 28px */
    --text-4xl: 2.074rem;  /* 33px */
    --text-5xl: 2.488rem;  /* 40px */
    --text-6xl: 2.986rem;  /* 48px */
  }
}
```

### Typography Classes

#### Heading Styles
```css
.heading-1 {
  font-family: var(--font-title);
  font-size: var(--text-5xl);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.heading-2 {
  font-family: var(--font-manga);
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.heading-3 {
  font-family: var(--font-manga);
  font-size: var(--text-3xl);
  font-weight: 600;
  line-height: 1.3;
}

.heading-4 {
  font-family: var(--font-ui);
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: 1.4;
}
```

#### Body Text Styles
```css
.body-large {
  font-family: var(--font-ui);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: 1.6;
}

.body-base {
  font-family: var(--font-ui);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.6;
}

.body-small {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: 1.5;
}

.body-reading {
  font-family: var(--font-reading);
  font-size: var(--text-base);
  font-weight: 400;
  line-height: 1.7;
}
```

## Spacing System

### Base Unit: 8px Grid

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
  --space-32: 8rem;    /* 128px */
}
```

### Component Spacing

#### Container Spacing
```css
.container-spacing {
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 1024px) {
  .container-spacing {
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}
```

#### Section Spacing
```css
.section-spacing-sm { margin-bottom: var(--space-8); }
.section-spacing-md { margin-bottom: var(--space-12); }
.section-spacing-lg { margin-bottom: var(--space-16); }
.section-spacing-xl { margin-bottom: var(--space-24); }
```

## Elevation & Shadows

### Shadow System

```css
:root {
  /* Light theme shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Colored shadows for interactive elements */
  --shadow-primary: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
  --shadow-secondary: 0 10px 15px -3px rgba(217, 70, 239, 0.3);
}
```

### Dark Theme Shadows
```css
[data-theme="dark"] {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}
```

### Glass Morphism Effects
```css
.glass-effect {
  background: var(--glass-white);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border-light);
  box-shadow: var(--shadow-lg);
}

.glass-effect-dark {
  background: var(--glass-black);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border-dark);
  box-shadow: var(--shadow-lg);
}
```

## Border Radius System

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-base: 0.25rem;  /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;   /* Fully rounded */
  
  /* Manga-inspired organic shapes */
  --radius-bubble: 1rem 2rem 1rem 2rem;  /* Speech bubble effect */
  --radius-panel: 0.5rem 2rem 0.5rem 2rem;  /* Manga panel effect */
}
```

## Animation System

### Easing Functions

```css
:root {
  /* Standard easing */
  --ease-linear: cubic-bezier(0, 0, 1, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Custom manga-inspired easing */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-dramatic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
```

### Duration Scale
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
}
```

### Keyframe Animations

#### Fade and Slide Animations
```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounceGentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

#### Gradient Animations
```css
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background: linear-gradient(-45deg, 
    var(--primary-400), 
    var(--primary-500), 
    var(--secondary-400), 
    var(--secondary-500)
  );
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
}
```

#### Hover Animations
```css
.hover-lift {
  transition: all var(--duration-normal) var(--ease-out);
}

.hover-lift:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl);
}

.hover-glow {
  position: relative;
  transition: all var(--duration-normal) var(--ease-out);
}

.hover-glow:hover {
  box-shadow: 
    var(--shadow-lg),
    0 0 30px var(--primary-500);
  transform: translateY(-2px);
}
```

## Component Patterns

### Button System

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: var(--text-base);
  line-height: 1.5;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  box-shadow: var(--shadow-base);
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn-primary:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--primary-500);
  border: 2px solid var(--primary-500);
  padding: calc(var(--space-3) - 2px) calc(var(--space-6) - 2px);
  border-radius: var(--radius-lg);
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: var(--text-base);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.btn-ghost::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--primary-500);
  transition: left var(--duration-normal) var(--ease-out);
  z-index: -1;
}

.btn-ghost:hover::before {
  left: 0;
}

.btn-ghost:hover {
  color: white;
  transform: translateY(-2px);
}
```

### Card System

#### Basic Card
```css
.card {
  background: var(--gray-50);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: var(--shadow-2xl);
}

[data-theme="dark"] .card {
  background: var(--dark-100);
  border-color: var(--dark-300);
}
```

#### Glass Card
```css
.card-glass {
  background: var(--glass-white);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  border: 1px solid var(--glass-border-light);
  box-shadow: var(--shadow-lg);
  transition: all var(--duration-normal) var(--ease-out);
}

.card-glass:hover {
  background: var(--glass-white);
  box-shadow: var(--shadow-2xl);
  transform: translateY(-2px);
}
```

#### Manga Panel Card
```css
.card-manga {
  background: var(--gray-50);
  border-radius: var(--radius-panel);
  padding: var(--space-6);
  border: 3px solid var(--gray-900);
  box-shadow: 
    4px 4px 0 var(--primary-500),
    var(--shadow-md);
  position: relative;
  transition: all var(--duration-normal) var(--ease-bounce);
}

.card-manga:hover {
  transform: translate(-2px, -2px);
  box-shadow: 
    6px 6px 0 var(--primary-500),
    var(--shadow-lg);
}

.card-manga::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, transparent, var(--primary-200), transparent);
  z-index: -1;
  border-radius: var(--radius-panel);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.card-manga:hover::before {
  opacity: 1;
}
```

### Input System

#### Text Input
```css
.input {
  appearance: none;
  background: var(--gray-50);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-ui);
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--gray-900);
  transition: all var(--duration-normal) var(--ease-out);
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-500);
  background: white;
}

.input::placeholder {
  color: var(--gray-400);
}

[data-theme="dark"] .input {
  background: var(--dark-100);
  border-color: var(--dark-400);
  color: var(--dark-800);
}

[data-theme="dark"] .input:focus {
  background: var(--dark-50);
  border-color: var(--primary-400);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.3);
}
```

#### Search Input
```css
.search-input {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input input {
  padding-left: var(--space-12);
  background: var(--glass-white);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border-light);
}

.search-input::before {
  content: '🔍';
  position: absolute;
  left: var(--space-4);
  z-index: 10;
  color: var(--gray-400);
  pointer-events: none;
}
```

## Responsive Design

### Breakpoint System
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Mobile-First Media Queries
```css
/* Mobile first approach */
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-8);
  }
}
```

### Touch Target Guidelines
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (hover: none) and (pointer: coarse) {
  .touch-target {
    min-height: 48px;
    min-width: 48px;
  }
}
```

## Dark Mode Implementation

### CSS Custom Properties Approach
```css
:root {
  --bg-primary: var(--gray-50);
  --bg-secondary: var(--gray-100);
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --border-primary: var(--gray-300);
}

[data-theme="dark"] {
  --bg-primary: var(--dark-100);
  --bg-secondary: var(--dark-200);
  --text-primary: var(--dark-800);
  --text-secondary: var(--dark-600);
  --border-primary: var(--dark-400);
}

.themed-component {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}
```

### Theme Toggle Animation
```css
.theme-toggle {
  position: relative;
  width: 60px;
  height: 30px;
  background: var(--gray-300);
  border-radius: var(--radius-full);
  transition: background var(--duration-normal) var(--ease-out);
  cursor: pointer;
}

.theme-toggle::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  background: white;
  border-radius: var(--radius-full);
  transition: transform var(--duration-normal) var(--ease-bounce);
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .theme-toggle {
  background: var(--primary-500);
}

[data-theme="dark"] .theme-toggle::before {
  transform: translateX(30px);
}
```

## Accessibility Standards

### Focus States
```css
.focusable {
  transition: all var(--duration-fast) var(--ease-out);
}

.focusable:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: var(--radius-base);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .focusable:focus-visible {
    outline: 3px solid var(--primary-600);
    outline-offset: 3px;
  }
}
```

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Color Contrast
```css
/* Ensure minimum 4.5:1 contrast ratio */
.high-contrast-text {
  color: var(--gray-900);
  background: var(--gray-50);
}

[data-theme="dark"] .high-contrast-text {
  color: var(--dark-900);
  background: var(--dark-50);
}

/* Enhanced contrast for better readability */
@media (prefers-contrast: high) {
  .high-contrast-text {
    color: #000000;
    background: #ffffff;
    border: 2px solid #000000;
  }
  
  [data-theme="dark"] .high-contrast-text {
    color: #ffffff;
    background: #000000;
    border: 2px solid #ffffff;
  }
}
```

## Implementation Guidelines

### TailwindCSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          500: '#f97316',
          900: '#7c2d12',
        },
        secondary: {
          50: '#fdf4ff',
          500: '#d946ef',
          900: '#701a75',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          black: 'rgba(0, 0, 0, 0.1)',
        }
      },
      fontFamily: {
        'manga': ['Comic Neue', 'cursive'],
        'title': ['Bangers', 'cursive'],
        'reading': ['Merriweather', 'serif'],
        'ui': ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'bubble': '1rem 2rem 1rem 2rem',
        'panel': '0.5rem 2rem 0.5rem 2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'colored-primary': '0 10px 15px -3px rgba(249, 115, 22, 0.3)',
        'colored-secondary': '0 10px 15px -3px rgba(217, 70, 239, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### CSS-in-JS Integration (if needed)

```typescript
// styles/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#fef7ee',
      500: '#f97316',
      900: '#7c2d12',
    },
    // ... rest of colors
  },
  space: {
    1: '0.25rem',
    2: '0.5rem',
    // ... rest of spacing
  },
  // ... other design tokens
}

// Component usage
const StyledButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
  padding: ${theme.space[3]} ${theme.space[6]};
  border-radius: ${theme.radii.lg};
  transition: all 300ms cubic-bezier(0, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
  }
`
```

## Quality Assurance

### Design System Testing

#### Visual Regression Testing
```javascript
// Use Percy, Chromatic, or similar for visual testing
describe('Design System Components', () => {
  it('renders button variants correctly', () => {
    cy.visit('/storybook/button')
    cy.percySnapshot('Button Variants')
  })
  
  it('handles dark mode toggle', () => {
    cy.visit('/storybook/button')
    cy.get('[data-theme-toggle]').click()
    cy.percySnapshot('Button Variants - Dark Mode')
  })
})
```

#### Accessibility Testing
```javascript
describe('Accessibility Standards', () => {
  it('meets color contrast requirements', () => {
    cy.injectAxe()
    cy.visit('/components/button')
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    })
  })
  
  it('supports keyboard navigation', () => {
    cy.visit('/components/form')
    cy.tab()
    cy.focused().should('have.class', 'input')
    cy.tab()
    cy.focused().should('have.class', 'btn-primary')
  })
})
```

### Performance Considerations

#### CSS Bundle Optimization
- Use PurgeCSS/UnCSS to remove unused styles
- Implement critical CSS loading
- Compress fonts and use font-display: swap
- Optimize images with WebP format

#### Animation Performance
- Use `transform` and `opacity` for animations
- Avoid animating layout properties
- Use `will-change` sparingly and remove after animation
- Implement reduced motion preferences

## Migration Strategy

### Phase 1: Foundation (Week 1)
1. Update TailwindCSS configuration
2. Add CSS custom properties for theming
3. Implement basic color and typography system
4. Create utility classes for spacing and layout

### Phase 2: Components (Week 2-3)
1. Migrate existing components to new design system
2. Create new component patterns (cards, buttons, inputs)
3. Implement responsive design patterns
4. Add dark mode support

### Phase 3: Enhancement (Week 4-5)
1. Add animation system and micro-interactions
2. Implement glass morphism and advanced effects
3. Create manga-inspired design elements
4. Add accessibility enhancements

### Phase 4: Testing & Optimization (Week 6)
1. Conduct visual regression testing
2. Perform accessibility audits
3. Optimize performance and bundle size
4. Document usage patterns and guidelines

This design system specification provides the foundation for MeTruyen+'s visual transformation while maintaining consistency, accessibility, and performance standards throughout the implementation process.