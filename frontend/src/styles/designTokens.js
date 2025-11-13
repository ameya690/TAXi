/**
 * Global Design Tokens
 * Flat design system with consistent spacing and typography
 */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const colors = {
  // Neutrals (grayscale)
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
  
  // Primary (indigo) - actions only
  primary: {
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3'
  },
  
  // Semantic colors (desaturated)
  success: '#16a34a',
  warning: '#ca8a04',
  error: '#dc2626',
  info: '#0284c7',
  
  // Surface colors
  background: '#fafafa', // neutral-50
  surface0: '#ffffff',   // page background, no shadow
  surface1: '#ffffff'    // cards/panels, 1px border + xs shadow
}

export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
    mono: '"SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", monospace'
  },
  
  fontSize: {
    base: '15px',
    h1: '22px',
    h2: '18px',
    h3: '16px',
    small: '13px',
    xs: '12px'
  },
  
  lineHeight: {
    base: '24px',
    h1: '30px',
    h2: '28px',
    h3: '26px',
    small: '20px',
    xs: '18px'
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
}

export const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
}

export const borderRadius = {
  sm: '10px',   // buttons
  md: '14px',   // cards
  lg: '16px',   // panels
  full: '9999px'
}

export const borders = {
  width: '1px',
  color: colors.neutral[200],
  divider: colors.neutral[100]
}

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
}

export const motion = {
  duration: {
    fast: prefersReducedMotion ? '0ms' : '150ms',
    normal: prefersReducedMotion ? '0ms' : '200ms',
    slow: prefersReducedMotion ? '0ms' : '250ms'
  },
  easing: {
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

export const layout = {
  maxReadingWidth: '760px',
  maxContentWidth: '1400px',
  sidebarWidth: '280px',
  headerHeight: '56px',
  navHeight: '48px'
}

export const iconSize = {
  inline: '16px',
  rail: '20px',
  large: '24px'
}

// Common component styles
export const components = {
  button: {
    primary: {
      background: colors.primary[600],
      color: '#ffffff',
      border: 'none',
      borderRadius: borderRadius.sm,
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: `all ${motion.duration.normal} ${motion.easing.out}`,
      ':hover': {
        background: colors.primary[700]
      },
      ':active': {
        background: colors.primary[800]
      }
    },
    secondary: {
      background: colors.surface1,
      color: colors.neutral[700],
      border: `${borders.width} solid ${borders.color}`,
      borderRadius: borderRadius.sm,
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: `all ${motion.duration.normal} ${motion.easing.out}`,
      ':hover': {
        background: colors.neutral[50],
        borderColor: colors.neutral[300]
      }
    },
    ghost: {
      background: 'transparent',
      color: colors.neutral[700],
      border: 'none',
      borderRadius: borderRadius.sm,
      padding: `${spacing.xs} ${spacing.md}`,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: `all ${motion.duration.normal} ${motion.easing.out}`,
      ':hover': {
        background: colors.neutral[100]
      }
    }
  },
  
  card: {
    background: colors.surface1,
    border: `${borders.width} solid ${borders.color}`,
    borderRadius: borderRadius.md,
    boxShadow: shadows.xs,
    padding: spacing.lg,
    transition: `all ${motion.duration.normal} ${motion.easing.out}`
  },
  
  panel: {
    background: colors.surface1,
    border: `${borders.width} solid ${borders.color}`,
    borderRadius: borderRadius.lg,
    boxShadow: shadows.xs,
    transition: `all ${motion.duration.slow} ${motion.easing.inOut}`
  },
  
  input: {
    background: colors.surface1,
    border: `${borders.width} solid ${borders.color}`,
    borderRadius: borderRadius.sm,
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    color: colors.neutral[900],
    transition: `all ${motion.duration.normal} ${motion.easing.out}`,
    ':focus': {
      outline: 'none',
      borderColor: colors.primary[600],
      boxShadow: `0 0 0 3px ${colors.primary[600]}20`
    }
  },
  
  divider: {
    horizontal: {
      height: borders.width,
      background: borders.divider,
      border: 'none',
      margin: `${spacing.md} 0`
    },
    vertical: {
      width: borders.width,
      background: borders.divider,
      border: 'none',
      margin: `0 ${spacing.md}`
    }
  }
}

// Helper function to create hover styles
export const hover = (styles) => ({
  transition: `all ${motion.duration.normal} ${motion.easing.out}`,
  ':hover': styles
})

// Helper function to create focus styles
export const focus = (styles) => ({
  transition: `all ${motion.duration.normal} ${motion.easing.out}`,
  ':focus': {
    outline: 'none',
    ...styles
  }
})

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  borders,
  shadows,
  motion,
  layout,
  iconSize,
  components,
  hover,
  focus
}
