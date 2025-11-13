/**
 * Theme Tokens - Light and Dark Mode
 */

export const lightTheme = {
  colors: {
    // Neutrals
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
    
    // Primary (indigo)
    primary: {
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3'
    },
    
    // Semantic colors
    success: {
      100: '#dcfce7',
      600: '#16a34a',
      700: '#15803d'
    },
    warning: {
      100: '#fef3c7',
      600: '#ca8a04',
      700: '#a16207'
    },
    error: {
      100: '#fee2e2',
      600: '#dc2626',
      700: '#b91c1c'
    },
    info: {
      100: '#dbeafe',
      600: '#0284c7',
      700: '#0369a1'
    },
    
    // Surface colors
    background: '#fafafa',
    surface0: '#ffffff',
    surface1: '#ffffff',
    
    // Text colors
    text: {
      primary: '#171717',
      secondary: '#525252',
      tertiary: '#737373',
      inverse: '#ffffff'
    },
    
    // Border colors
    border: {
      color: '#e5e5e5',
      divider: '#e5e5e5',
      focus: '#4f46e5'
    }
  }
}

export const darkTheme = {
  colors: {
    // Neutrals (inverted)
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
    
    // Primary (brighter for dark mode)
    primary: {
      100: '#312e81',
      200: '#3730a3',
      300: '#4338ca',
      400: '#4f46e5',
      500: '#6366f1',
      600: '#818cf8',
      700: '#a5b4fc',
      800: '#c7d2fe'
    },
    
    // Semantic colors (adjusted for dark mode)
    success: {
      100: '#14532d',
      600: '#22c55e',
      700: '#4ade80'
    },
    warning: {
      100: '#713f12',
      600: '#eab308',
      700: '#facc15'
    },
    error: {
      100: '#7f1d1d',
      600: '#ef4444',
      700: '#f87171'
    },
    info: {
      100: '#0c4a6e',
      600: '#0ea5e9',
      700: '#38bdf8'
    },
    
    // Surface colors
    background: '#0a0a0a',
    surface0: '#171717',
    surface1: '#262626',
    
    // Text colors
    text: {
      primary: '#fafafa',
      secondary: '#d4d4d4',
      tertiary: '#a3a3a3',
      inverse: '#171717'
    },
    
    // Border colors
    border: {
      color: '#404040',
      divider: '#404040',
      focus: '#818cf8'
    }
  }
}

// Helper function to get theme
export function getTheme(isDarkMode) {
  return isDarkMode ? darkTheme : lightTheme
}
