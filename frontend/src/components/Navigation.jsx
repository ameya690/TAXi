import React from 'react'
import tokens from '../styles/designTokens'

export default function Navigation({ activeTab, onTabChange }) {
  const mainTabs = [
    { id: 'assistant', label: 'Assistant', icon: '🤖' },
    { id: 'workflows', label: 'Workflows', icon: '⚙️' },
    { id: 'vault', label: 'Vault', icon: '🗄️' },
    { id: 'knowledge', label: 'Knowledge', icon: '📚' }
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
