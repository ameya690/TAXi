import React, { useState } from 'react'
import tokens from '../styles/designTokens'

export default function Navigation({ activeTab, onTabChange }) {
  const [legacyMenuOpen, setLegacyMenuOpen] = useState(false)

  const mainTabs = [
    { id: 'assistant', label: 'Assistant', icon: '🤖' },
    { id: 'workflows', label: 'Workflows', icon: '⚙️' },
    { id: 'vault', label: 'Vault', icon: '🗄️' },
    { id: 'knowledge', label: 'Knowledge', icon: '📚' }
  ]

  const legacyItems = [
    { id: 'eligibility', label: 'EITC Calculator', icon: '✅' },
    { id: 'notice', label: 'Tax Notice Explainer', icon: '📄' }
  ]

  const styles = {
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      padding: `0 ${tokens.spacing.lg}`,
      background: tokens.colors.surface0,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      height: '48px',
      overflowX: 'auto',
      overflowY: 'hidden'
    },
    navButton: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      background: 'transparent',
      border: 'none',
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.neutral[700],
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      whiteSpace: 'nowrap',
      outline: 'none'
    },
    navButtonActive: {
      background: tokens.colors.primary[600],
      color: '#ffffff',
      fontWeight: tokens.typography.fontWeight.semibold
    },
    legacyDropdown: {
      position: 'relative'
    },
    legacyButton: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      background: 'transparent',
      border: 'none',
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.neutral[600],
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      whiteSpace: 'nowrap',
      outline: 'none'
    },
    legacyMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: tokens.spacing.xs,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.md,
      boxShadow: tokens.shadows.sm,
      minWidth: '200px',
      zIndex: 100,
      overflow: 'hidden'
    },
    legacyMenuItem: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      background: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left',
      fontSize: tokens.typography.fontSize.base,
      color: tokens.colors.neutral[700],
      cursor: 'pointer',
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`
    },
    legacyMenuItemLast: {
      borderBottom: 'none'
    },
    divider: {
      width: '1px',
      height: '20px',
      background: tokens.borders.divider,
      margin: `0 ${tokens.spacing.xs}`
    },
    adminButton: {
      marginLeft: 'auto',
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      background: 'transparent',
      border: 'none',
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.neutral[600],
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      whiteSpace: 'nowrap',
      outline: 'none'
    }
  }

  return (
    <nav style={styles.nav}>
      {/* Main Navigation Tabs */}
      {mainTabs.map(tab => (
        <button
          key={tab.id}
          style={{
            ...styles.navButton,
            ...(activeTab === tab.id ? styles.navButtonActive : {})
          }}
          onClick={() => onTabChange(tab.id)}
          onMouseOver={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = tokens.colors.neutral[100]
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== tab.id) {
              e.currentTarget.style.background = 'transparent'
            }
          }}
        >
          <span style={{ fontSize: tokens.iconSize.inline }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}

      {/* Divider */}
      <div style={styles.divider} />

      {/* Legacy Dropdown */}
      <div style={styles.legacyDropdown}>
        <button
          style={styles.legacyButton}
          onClick={() => setLegacyMenuOpen(!legacyMenuOpen)}
          onMouseOver={(e) => {
            e.currentTarget.style.background = tokens.colors.neutral[100]
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <span>Legacy</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </button>

        {legacyMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99
              }}
              onClick={() => setLegacyMenuOpen(false)}
            />
            
            {/* Menu */}
            <div style={styles.legacyMenu}>
              {legacyItems.map((item, index) => (
                <button
                  key={item.id}
                  style={{
                    ...styles.legacyMenuItem,
                    ...(index === legacyItems.length - 1 ? styles.legacyMenuItemLast : {})
                  }}
                  onClick={() => {
                    onTabChange(item.id)
                    setLegacyMenuOpen(false)
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = tokens.colors.neutral[50]
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span style={{ fontSize: tokens.iconSize.inline }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Admin (right-aligned) */}
      <button
        style={{
          ...styles.adminButton,
          ...(activeTab === 'admin' ? { ...styles.navButtonActive, marginLeft: 'auto' } : {})
        }}
        onClick={() => onTabChange('admin')}
        onMouseOver={(e) => {
          if (activeTab !== 'admin') {
            e.currentTarget.style.background = tokens.colors.neutral[100]
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== 'admin') {
            e.currentTarget.style.background = 'transparent'
          }
        }}
      >
        <span style={{ fontSize: tokens.iconSize.inline }}>🛠️</span>
        <span>Admin</span>
      </button>
    </nav>
  )
}
