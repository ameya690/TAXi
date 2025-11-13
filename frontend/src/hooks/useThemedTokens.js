import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { getTheme, motion, getFocusRing, getButtonTokens } from '../styles/themes-enhanced'
import tokens from '../styles/designTokens'

/**
 * Hook to get design tokens with theme support
 * Returns tokens object with colors, elevation, and motion adjusted for current theme
 */
export function useThemedTokens() {
  const { isDarkMode } = useTheme()
  
  return useMemo(() => {
    const theme = getTheme(isDarkMode)
    
    console.log('useThemedTokens - isDarkMode:', isDarkMode)
    console.log('useThemedTokens - theme.colors:', theme.colors)
    console.log('useThemedTokens - theme.colors.neutral:', theme.colors?.neutral)
    
    return {
      ...tokens,
      colors: theme.colors,
      elevation: theme.elevation,
      motion,
      isDarkMode,
      // Helper functions
      getFocusRing: () => getFocusRing(theme),
      getButtonTokens: (variant) => getButtonTokens(variant, theme)
    }
  }, [isDarkMode])
}
