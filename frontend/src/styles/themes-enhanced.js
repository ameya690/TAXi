/**
 * Enhanced Theme System
 * Complete light and dark themes with elevation, semantic colors, and accessibility
 */

export const lightTheme = {
  colors: {
    // Neutrals (for backward compatibility)
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    },
    
    // Foreground (text) colors
    fg: {
      primary: '#171717',      // Main text - 4.5:1+ contrast
      secondary: '#525252',    // Secondary text - 4.5:1+ contrast
      tertiary: '#737373',     // Tertiary text
      muted: '#a3a3a3',        // Muted/placeholder text
      inverse: '#ffffff',      // Text on dark backgrounds
      disabled: '#d4d4d4'      // Disabled text
    },
    
    // Background colors
    bg: {
      page: '#fafafa',         // e0 - Page background
      surface: '#ffffff',      // e1 - Surface/card background
      raised: '#ffffff',       // e2 - Raised elements
      overlay: '#ffffff'       // e3 - Modals/drawers
    },
    
    // Border colors
    border: {
      subtle: '#e5e5e5',       // Subtle borders (1px)
      strong: '#d4d4d4',       // Strong borders
      divider: '#e5e5e5',      // Dividers
      focus: '#4f46e5'         // Focus rings
    },
    
    // Accent colors (primary actions)
    accent: {
      solid: '#4f46e5',        // Solid accent (buttons, links)
      on: '#ffffff',           // Text on accent
      subtle: '#eef2ff',       // Subtle accent background (10% opacity)
      hover: '#4338ca',        // Hover state
      active: '#3730a3'        // Active/pressed state
    },
    
    // Danger/error colors
    danger: {
      solid: '#dc2626',        // Error text/icons
      on: '#ffffff',           // Text on danger
      subtle: '#fef2f2',       // Subtle error background
      hover: '#b91c1c',        // Hover state
      border: '#fca5a5'        // Error borders
    },
    
    // Success colors
    success: {
      solid: '#16a34a',        // Success text/icons
      on: '#ffffff',           // Text on success
      subtle: '#f0fdf4',       // Subtle success background
      hover: '#15803d',        // Hover state
      border: '#86efac'        // Success borders
    },
    
    // Warning colors
    warning: {
      solid: '#ca8a04',        // Warning text/icons
      on: '#ffffff',           // Text on warning
      subtle: '#fefce8',       // Subtle warning background
      hover: '#a16207',        // Hover state
      border: '#fde047'        // Warning borders
    },
    
    // Info colors
    info: {
      solid: '#0284c7',        // Info text/icons
      on: '#ffffff',           // Text on info
      subtle: '#f0f9ff',       // Subtle info background
      hover: '#0369a1',        // Hover state
      border: '#7dd3fc'        // Info borders
    },
    
    // Focus ring
    focus: {
      ring: '#4f46e5',         // Focus ring color
      offset: '#ffffff'        // Focus ring offset/background
    },
    
    // Overlays & scrims
    overlay: {
      scrim: 'rgba(0, 0, 0, 0.5)',      // Modal backdrop
      tooltip: 'rgba(0, 0, 0, 0.9)'     // Tooltip background
    },
    
    // Redline colors (Draft editor)
    redline: {
      insertion: {
        text: '#16a34a',                 // Green text
        bg: 'rgba(220, 252, 231, 0.5)'   // Light green bg (#dcfce7 at 50%)
      },
      deletion: {
        text: '#dc2626',                 // Red text
        bg: 'rgba(254, 242, 242, 0.5)'   // Light red bg (#fef2f2 at 50%)
      }
    },
    
    // Chart colors
    chart: {
      primary: '#4f46e5',
      secondary: '#737373',
      tertiary: '#a3a3a3',
      grid: '#e5e5e5',
      axis: '#525252'
    },
    
    // Backward compatibility aliases
    background: '#fafafa',
    surface0: '#ffffff',
    surface1: '#ffffff',
    primary: {
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3'
    }
  },
  
  // Elevation system
  elevation: {
    e0: {
      // Page level - no shadow
      background: '#fafafa',
      border: 'none',
      shadow: 'none'
    },
    e1: {
      // Surface level - subtle border
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      shadow: 'none'
    },
    e2: {
      // Raised level - border + subtle shadow
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)'
    },
    e3: {
      // Modal/drawer level - raised + scrim
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
      scrim: 'rgba(0, 0, 0, 0.5)'
    }
  }
}

export const darkTheme = {
  colors: {
    // Neutrals (for backward compatibility - inverted)
    neutral: {
      50: '#171717',
      100: '#262626',
      200: '#404040',
      300: '#525252',
      400: '#737373',
      500: '#a3a3a3',
      600: '#d4d4d4',
      700: '#e5e5e5',
      800: '#f5f5f5',
      900: '#fafafa'
    },
    
    // Foreground (text) colors
    fg: {
      primary: '#fafafa',      // Main text - 4.5:1+ contrast
      secondary: '#d4d4d4',    // Secondary text - 4.5:1+ contrast
      tertiary: '#a3a3a3',     // Tertiary text
      muted: '#737373',        // Muted/placeholder text
      inverse: '#171717',      // Text on light backgrounds
      disabled: '#525252'      // Disabled text
    },
    
    // Background colors
    bg: {
      page: '#0a0a0a',         // e0 - Page background
      surface: '#171717',      // e1 - Surface/card background
      raised: '#262626',       // e2 - Raised elements
      overlay: '#2a2a2a'       // e3 - Modals/drawers
    },
    
    // Border colors
    border: {
      subtle: '#404040',       // Subtle borders (1px)
      strong: '#525252',       // Strong borders
      divider: '#404040',      // Dividers
      focus: '#818cf8'         // Focus rings (brighter in dark)
    },
    
    // Accent colors (brighter in dark mode)
    accent: {
      solid: '#818cf8',        // Solid accent (buttons, links)
      on: '#1e1b4b',           // Text on accent (dark for contrast)
      subtle: 'rgba(129, 140, 248, 0.15)',  // Subtle accent background (15% opacity)
      hover: '#a5b4fc',        // Hover state
      active: '#c7d2fe'        // Active/pressed state
    },
    
    // Danger/error colors (brighter in dark mode)
    danger: {
      solid: '#f87171',        // Error text/icons
      on: '#450a0a',           // Text on danger
      subtle: 'rgba(58, 12, 12, 0.24)',  // Subtle error background (#3A0C0C at 24%)
      hover: '#fca5a5',        // Hover state
      border: '#dc2626'        // Error borders
    },
    
    // Success colors (brighter in dark mode)
    success: {
      solid: '#4ade80',        // Success text/icons
      on: '#052e16',           // Text on success
      subtle: 'rgba(6, 62, 47, 0.24)',   // Subtle success background (#063E2F at 24%)
      hover: '#86efac',        // Hover state
      border: '#16a34a'        // Success borders
    },
    
    // Warning colors (brighter in dark mode)
    warning: {
      solid: '#fbbf24',        // Warning text/icons
      on: '#451a03',           // Text on warning
      subtle: 'rgba(113, 63, 18, 0.24)',  // Subtle warning background
      hover: '#fcd34d',        // Hover state
      border: '#ca8a04'        // Warning borders
    },
    
    // Info colors (brighter in dark mode)
    info: {
      solid: '#38bdf8',        // Info text/icons
      on: '#0c4a6e',           // Text on info
      subtle: 'rgba(12, 74, 110, 0.24)',  // Subtle info background
      hover: '#7dd3fc',        // Hover state
      border: '#0284c7'        // Info borders
    },
    
    // Focus ring
    focus: {
      ring: '#818cf8',         // Focus ring color (brighter)
      offset: '#171717'        // Focus ring offset/background
    },
    
    // Overlays & scrims
    overlay: {
      scrim: 'rgba(0, 0, 0, 0.7)',      // Modal backdrop (darker)
      tooltip: 'rgba(38, 38, 38, 0.95)' // Tooltip background
    },
    
    // Redline colors (Draft editor) - adjusted for dark mode
    redline: {
      insertion: {
        text: '#4ade80',                 // Bright green text
        bg: 'rgba(6, 62, 47, 0.24)'      // Dark green bg (#063E2F at 24%)
      },
      deletion: {
        text: '#f87171',                 // Bright red text
        bg: 'rgba(58, 12, 12, 0.24)'     // Dark red bg (#3A0C0C at 24%)
      }
    },
    
    // Chart colors (monochrome + accent for dark)
    chart: {
      primary: '#818cf8',
      secondary: '#a3a3a3',
      tertiary: '#737373',
      grid: '#404040',
      axis: '#d4d4d4'
    },
    
    // Backward compatibility aliases
    background: '#0a0a0a',
    surface0: '#171717',
    surface1: '#262626',
    primary: {
      600: '#818cf8',
      700: '#a5b4fc',
      800: '#c7d2fe'
    }
  },
  
  // Elevation system (dark mode uses less shadow, more borders)
  elevation: {
    e0: {
      // Page level - no shadow
      background: '#0a0a0a',
      border: 'none',
      shadow: 'none'
    },
    e1: {
      // Surface level - subtle border only
      background: '#171717',
      border: '1px solid #404040',
      shadow: 'none'
    },
    e2: {
      // Raised level - border + very subtle shadow
      background: '#262626',
      border: '1px solid #404040',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
    },
    e3: {
      // Modal/drawer level - raised + scrim
      background: '#2a2a2a',
      border: '1px solid #525252',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.3)',
      scrim: 'rgba(0, 0, 0, 0.7)'
    }
  }
}

// Helper function to get theme
export function getTheme(isDarkMode) {
  return isDarkMode ? darkTheme : lightTheme
}

// Motion tokens (shared across themes)
export const motion = {
  duration: {
    instant: '80ms',
    fast: '120ms',
    normal: '150ms',
    slow: '200ms',
    slower: '300ms'
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)'
  }
}

// Focus ring helper
export function getFocusRing(theme) {
  return {
    outline: `2px solid ${theme.colors.focus.ring}`,
    outlineOffset: '2px',
    transition: 'outline 120ms ease'
  }
}

// Component-specific token helpers
export function getButtonTokens(variant, theme) {
  switch (variant) {
    case 'primary':
      return {
        background: theme.colors.accent.solid,
        color: theme.colors.accent.on,
        border: 'none',
        hover: {
          background: theme.colors.accent.hover
        }
      }
    case 'secondary':
      return {
        background: 'transparent',
        color: theme.colors.fg.primary,
        border: `1px solid ${theme.colors.border.strong}`,
        hover: {
          background: theme.colors.bg.raised
        }
      }
    case 'danger':
      return {
        background: theme.colors.danger.solid,
        color: theme.colors.danger.on,
        border: 'none',
        hover: {
          background: theme.colors.danger.hover
        }
      }
    default:
      return getButtonTokens('secondary', theme)
  }
}
