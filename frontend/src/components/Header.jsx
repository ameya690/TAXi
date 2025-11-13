import React, { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useThemedTokens } from '../hooks/useThemedTokens'
import '../styles/fonts.css'

export default function Header({ 
  lang, 
  setLang, 
  breadcrumbs = ['TAXi'], 
  onSearch,
  isLoading = false,
  region = 'US',
  user = null,
  onLogout
}) {
  const { isDarkMode, toggleTheme } = useTheme()
  const tokens = useThemedTokens()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Global search keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  const styles = {
    header: {
      // e1 surface with slim divider
      background: tokens.elevation.e1.background,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: `1px solid ${tokens.colors.border.subtle}`,
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${tokens.spacing.lg}`,
      gap: tokens.spacing.lg,
      position: 'relative',
      zIndex: 100,
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard}`
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.md,
      minWidth: '200px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      fontSize: tokens.typography.fontSize.h2,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.fg.primary,
      textDecoration: 'none',
      cursor: 'pointer'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 'normal',
      letterSpacing: '0.05em'
    },
    breadcrumbs: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[600]
    },
    breadcrumbItem: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    breadcrumbLink: {
      color: tokens.colors.neutral[600],
      textDecoration: 'none',
      cursor: 'pointer',
      transition: `color ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    breadcrumbSeparator: {
      color: tokens.colors.neutral[400]
    },
    center: {
      flex: 1,
      maxWidth: '600px',
      margin: '0 auto'
    },
    searchContainer: {
      position: 'relative',
      width: '100%'
    },
    searchInput: {
      width: '100%',
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      paddingLeft: '36px',
      background: tokens.colors.neutral[50],
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.base,
      color: tokens.colors.neutral[900],
      outline: 'none',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`
    },
    searchIcon: {
      position: 'absolute',
      left: tokens.spacing.sm,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: tokens.iconSize.inline,
      color: tokens.colors.neutral[500],
      pointerEvents: 'none'
    },
    searchShortcut: {
      position: 'absolute',
      right: tokens.spacing.sm,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500],
      padding: '2px 6px',
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: '4px',
      pointerEvents: 'none'
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm
    },
    themeToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      background: tokens.elevation.e1.background,
      border: `1px solid ${tokens.colors.border.subtle}`,
      borderRadius: tokens.borderRadius.sm,
      cursor: 'pointer',
      outline: 'none',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`,
      color: tokens.colors.fg.secondary
    },
    regionBadge: {
      padding: `4px ${tokens.spacing.xs}`,
      background: tokens.colors.bg.raised,
      border: `1px solid ${tokens.colors.border.subtle}`,
      borderRadius: '4px',
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.fg.secondary
    },
    langSelect: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      background: tokens.elevation.e1.background,
      border: `1px solid ${tokens.colors.border.subtle}`,
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.fg.primary,
      fontWeight: tokens.typography.fontWeight.medium,
      cursor: 'pointer',
      outline: 'none',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.standard}`
    },
    userMenu: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700],
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`
    },
    logoutButton: {
      ...tokens.components.button.secondary,
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      fontSize: tokens.typography.fontSize.small
    },
    progressBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2px',
      background: tokens.colors.neutral[100],
      overflow: 'hidden'
    },
    progressBarFill: {
      height: '100%',
      background: tokens.colors.primary[600],
      animation: 'progress 1.5s ease-in-out infinite',
      transformOrigin: 'left'
    },
    searchModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: searchOpen ? 'flex' : 'none',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '100px 20px',
      zIndex: 1000
    },
    searchModalContent: {
      background: tokens.colors.surface1,
      borderRadius: tokens.borderRadius.lg,
      boxShadow: tokens.shadows.md,
      width: '100%',
      maxWidth: '600px',
      overflow: 'hidden'
    },
    searchModalInput: {
      width: '100%',
      padding: tokens.spacing.md,
      border: 'none',
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      fontSize: tokens.typography.fontSize.h3,
      outline: 'none',
      background: 'transparent'
    },
    searchResults: {
      padding: tokens.spacing.md,
      maxHeight: '400px',
      overflowY: 'auto'
    },
    searchResultItem: {
      padding: tokens.spacing.sm,
      borderRadius: tokens.borderRadius.sm,
      cursor: 'pointer',
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    }
  }

  return (
    <>
      <header style={styles.header}>
        {/* Left: Logo */}
        <div style={styles.left}>
          <div style={styles.logo}>
            <span style={{ fontSize: '20px' }}>  </span>
            <span className="taxi-logo" style={styles.logoText}>  TAXi</span>
          </div>
        </div>

        {/* Center: Global Search */}
        <div style={styles.center}>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search docs, matters, workflows…"
              style={styles.searchInput}
              onClick={() => setSearchOpen(true)}
              onFocus={(e) => {
                e.target.style.borderColor = tokens.colors.primary[600]
                e.target.style.background = tokens.colors.surface1
              }}
              onBlur={(e) => {
                e.target.style.borderColor = tokens.borders.color
                e.target.style.background = tokens.colors.neutral[50]
              }}
              readOnly
            />
            <span style={styles.searchShortcut}>
              {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
            </span>
          </div>
        </div>

        {/* Right: Dark Mode, Region, Language, User, Logout */}
        <div style={styles.right}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            style={styles.themeToggle}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onMouseOver={(e) => {
              e.currentTarget.style.background = tokens.colors.bg.raised
              e.currentTarget.style.borderColor = tokens.colors.border.strong
              e.currentTarget.style.color = tokens.colors.fg.primary
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = tokens.elevation.e1.background
              e.currentTarget.style.borderColor = tokens.colors.border.subtle
              e.currentTarget.style.color = tokens.colors.fg.secondary
            }}
          >
            <span style={{ fontSize: '18px' }}>
              {isDarkMode ? '☀️' : '🌙'}
            </span>
          </button>

          <div style={styles.regionBadge}>{region}</div>
          
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={styles.langSelect}
            onMouseOver={(e) => {
              e.target.style.background = tokens.colors.bg.raised
              e.target.style.borderColor = tokens.colors.border.strong
            }}
            onMouseOut={(e) => {
              e.target.style.background = tokens.elevation.e1.background
              e.target.style.borderColor = tokens.colors.border.subtle
            }}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>

          {user && (
            <div
              style={styles.userMenu}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.neutral[50]
                e.currentTarget.style.borderColor = tokens.colors.neutral[300]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = tokens.colors.surface1
                e.currentTarget.style.borderColor = tokens.borders.color
              }}
            >
              <span style={{ fontSize: tokens.iconSize.inline }}>👤</span>
              <span>{user.name || 'User'}</span>
            </div>
          )}

          {onLogout && (
            <button
              style={styles.logoutButton}
              onClick={onLogout}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.neutral[50]
                e.currentTarget.style.borderColor = tokens.colors.neutral[300]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = tokens.colors.surface1
                e.currentTarget.style.borderColor = tokens.borders.color
              }}
            >
              Logout
            </button>
          )}
        </div>

        {/* Loading Progress Bar */}
        {isLoading && (
          <div style={styles.progressBar}>
            <div style={styles.progressBarFill} />
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchOpen && (
        <div style={styles.searchModal} onClick={() => setSearchOpen(false)}>
          <div style={styles.searchModalContent} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search docs, matters, workflows…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchModalInput}
                autoFocus
              />
            </form>
            <div style={styles.searchResults}>
              {searchQuery ? (
                <div style={{ padding: tokens.spacing.md, textAlign: 'center', color: tokens.colors.neutral[600] }}>
                  <div style={{ fontSize: tokens.iconSize.large, marginBottom: tokens.spacing.sm }}>🔍</div>
                  <div style={{ fontSize: tokens.typography.fontSize.small }}>
                    Press Enter to search for "{searchQuery}"
                  </div>
                </div>
              ) : (
                <div style={{ padding: tokens.spacing.md, color: tokens.colors.neutral[600] }}>
                  <div style={{ fontSize: tokens.typography.fontSize.small, marginBottom: tokens.spacing.sm }}>
                    Quick actions:
                  </div>
                  <div
                    style={styles.searchResultItem}
                    onMouseOver={(e) => e.currentTarget.style.background = tokens.colors.neutral[50]}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    📄 Search documents
                  </div>
                  <div
                    style={styles.searchResultItem}
                    onMouseOver={(e) => e.currentTarget.style.background = tokens.colors.neutral[50]}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    📁 Search matters
                  </div>
                  <div
                    style={styles.searchResultItem}
                    onMouseOver={(e) => e.currentTarget.style.background = tokens.colors.neutral[50]}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    ⚙️ Search workflows
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%) scaleX(0.5);
          }
          50% {
            transform: translateX(0%) scaleX(1);
          }
          100% {
            transform: translateX(100%) scaleX(0.5);
          }
        }
      `}</style>
    </>
  )
}
