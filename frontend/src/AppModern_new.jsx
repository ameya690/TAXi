import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './components/LoginPage'
import AdminPanel from './components/AdminPanel.jsx'
import Assistant from './components/Assistant.jsx'
import Workflows from './components/Workflows.jsx'
import Vault from './components/Vault.jsx'
import Knowledge from './components/Knowledge.jsx'
import en from './locales/en.json'
import es from './locales/es.json'
import tokens from './styles/designTokens'

const dicts = { en, es }

function MainApp() {
  const { user, logout, isAuthenticated } = useAuth()
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('assistant')
  const [menuOpen, setMenuOpen] = useState(false)

  const t = (k) => dicts[lang][k] || k

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: tokens.colors.background,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: tokens.typography.fontFamily.base,
      fontSize: tokens.typography.fontSize.base,
      lineHeight: tokens.typography.lineHeight.base,
      color: tokens.colors.neutral[900]
    },
    header: {
      background: tokens.colors.surface1,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.color}`,
      padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: tokens.layout.headerHeight,
      boxSizing: 'border-box'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm
    },
    logoText: {
      fontSize: tokens.typography.fontSize.h1,
      lineHeight: tokens.typography.lineHeight.h1,
      fontWeight: tokens.typography.fontWeight.semibold,
      margin: 0,
      color: tokens.colors.neutral[900]
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.md
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      background: tokens.colors.neutral[100],
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700]
    },
    nav: {
      display: 'flex',
      gap: tokens.spacing.xs,
      padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
      background: tokens.colors.surface0,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      flexWrap: 'wrap',
      overflowX: 'auto'
    },
    navButton: {
      ...tokens.components.button.ghost,
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      color: tokens.colors.neutral[700],
      whiteSpace: 'nowrap'
    },
    navButtonActive: {
      background: tokens.colors.primary[600],
      color: '#ffffff',
      fontWeight: tokens.typography.fontWeight.semibold
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    },
    card: {
      ...tokens.components.card,
      margin: tokens.spacing.lg,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    footer: {
      padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
      background: tokens.colors.surface0,
      borderTop: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      textAlign: 'center',
      fontSize: tokens.typography.fontSize.small,
      lineHeight: tokens.typography.lineHeight.small,
      color: tokens.colors.neutral[600]
    },
    mobileMenuButton: {
      display: 'none',
      ...tokens.components.button.ghost,
      padding: tokens.spacing.xs,
      fontSize: tokens.typography.fontSize.h2,
      '@media (max-width: 768px)': {
        display: 'flex'
      }
    },
    mobileMenu: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: menuOpen ? 'flex' : 'none',
      justifyContent: 'flex-end'
    },
    mobileMenuPanel: {
      ...tokens.components.panel,
      width: '280px',
      height: '100%',
      borderRadius: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: tokens.spacing.lg,
      overflowY: 'auto'
    }
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={{ fontSize: '24px' }}>🚕</span>
          <h1 style={styles.logoText}>TAXi</h1>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ ...styles.nav, display: window.innerWidth > 768 ? 'flex' : 'none', padding: 0, border: 'none' }}>
          <button 
            onClick={() => setTab('assistant')} 
            style={{...styles.navButton, ...(tab === 'assistant' ? styles.navButtonActive : {})}}
          >
            Assistant
          </button>
          <button 
            onClick={() => setTab('workflows')} 
            style={{...styles.navButton, ...(tab === 'workflows' ? styles.navButtonActive : {})}}
          >
            Workflows
          </button>
          <button 
            onClick={() => setTab('vault')} 
            style={{...styles.navButton, ...(tab === 'vault' ? styles.navButtonActive : {})}}
          >
            Vault
          </button>
          <button 
            onClick={() => setTab('knowledge')} 
            style={{...styles.navButton, ...(tab === 'knowledge' ? styles.navButtonActive : {})}}
          >
            Knowledge
          </button>
          <button 
            onClick={() => setTab('admin')} 
            style={{...styles.navButton, ...(tab === 'admin' ? styles.navButtonActive : {})}}
          >
            Admin
          </button>
        </nav>

        <div style={styles.headerActions}>
          <div style={styles.userInfo}>
            <span>👤</span>
            <span>{user?.name || 'User'}</span>
          </div>
          <select 
            value={lang} 
            onChange={e => setLang(e.target.value)}
            style={{
              ...tokens.components.button.secondary,
              padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
              fontSize: tokens.typography.fontSize.small
            }}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
          <button
            onClick={logout}
            style={{
              ...tokens.components.button.secondary,
              padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
              fontSize: tokens.typography.fontSize.small
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav style={styles.nav}>
        <button 
          onClick={() => setTab('assistant')} 
          style={{...styles.navButton, ...(tab === 'assistant' ? styles.navButtonActive : {})}}
        >
          Assistant
        </button>
        <button 
          onClick={() => setTab('workflows')} 
          style={{...styles.navButton, ...(tab === 'workflows' ? styles.navButtonActive : {})}}
        >
          Workflows
        </button>
        <button 
          onClick={() => setTab('vault')} 
          style={{...styles.navButton, ...(tab === 'vault' ? styles.navButtonActive : {})}}
        >
          Vault
        </button>
        <button 
          onClick={() => setTab('knowledge')} 
          style={{...styles.navButton, ...(tab === 'knowledge' ? styles.navButtonActive : {})}}
        >
          Knowledge
        </button>
        <button 
          onClick={() => setTab('admin')} 
          style={{...styles.navButton, ...(tab === 'admin' ? styles.navButtonActive : {})}}
        >
          Admin
        </button>
      </nav>

      <main style={styles.main}>
        <div style={styles.card}>
          {tab === 'assistant' && <Assistant lang={lang} t={t} />}
          {tab === 'workflows' && <Workflows lang={lang} t={t} />}
          {tab === 'vault' && <Vault lang={lang} t={t} />}
          {tab === 'knowledge' && <Knowledge lang={lang} t={t} />}
          {tab === 'admin' && <AdminPanel t={t} />}
        </div>
      </main>

      <footer style={styles.footer}>
        <p>⚖️ {t('disclaimer')}</p>
        <p style={{ fontSize: tokens.typography.fontSize.xs, marginTop: tokens.spacing.xs, color: tokens.colors.neutral[500] }}>
          © 2025 TAXi • Built with ❤️ by MS.CMPE & MS.AI students
        </p>
      </footer>
    </div>
  )
}

export default function AppModern() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
