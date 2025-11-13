// Quick test to verify theme exports
import { getTheme, lightTheme, darkTheme } from './styles/themes-enhanced'

console.log('=== THEME TEST ===')
console.log('lightTheme:', lightTheme)
console.log('lightTheme.colors:', lightTheme.colors)
console.log('lightTheme.colors.neutral:', lightTheme.colors.neutral)
console.log('lightTheme.colors.neutral[500]:', lightTheme.colors.neutral[500])

console.log('\ndarkTheme:', darkTheme)
console.log('darkTheme.colors:', darkTheme.colors)
console.log('darkTheme.colors.neutral:', darkTheme.colors.neutral)
console.log('darkTheme.colors.neutral[500]:', darkTheme.colors.neutral[500])

const theme = getTheme(false)
console.log('\ngetTheme(false):', theme)
console.log('theme.colors.neutral:', theme.colors.neutral)
console.log('theme.colors.neutral[500]:', theme.colors.neutral[500])

console.log('=== TEST COMPLETE ===')
