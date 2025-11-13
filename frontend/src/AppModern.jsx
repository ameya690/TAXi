import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import LoginPage from './components/LoginPage'
import AdminPanel from './components/AdminPanel.jsx'
import Assistant from './components/Assistant.jsx'
import Workflows from './components/Workflows.jsx'
import Vault from './components/Vault.jsx'
import Knowledge from './components/Knowledge.jsx'
import EligibilityCalculator from './components/EligibilityCalculator.jsx'
import TaxNoticeExplainer from './components/TaxNoticeExplainer.jsx'
import Header from './components/Header.jsx'
import Navigation from './components/Navigation.jsx'
import en from './locales/en.json'
import es from './locales/es.json'
import { useThemedTokens } from './hooks/useThemedTokens'
import './styles/theme-transitions.css'

const dicts = { en, es }

function MainApp() {
  const { user, logout, isAuthenticated } = useAuth()
  const tokens = useThemedTokens()
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('assistant')
  const [isLoading, setIsLoading] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState(['TAXi'])

  const t = (k) => dicts[lang][k] || k

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const handleSearch = (query) => {
    console.log('Search:', query)
    // Implement search functionality
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
      color: tokens.colors.fg.primary
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    },
    mainContent: {
      padding: tokens.spacing.xl,
      flex: 1,
      maxWidth: tokens.layout.maxContentWidth,
      margin: '0 auto',
      width: '100%'
    },
    footer: {
      padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
      background: tokens.colors.bg.surface,
      borderTop: `1px solid ${tokens.colors.border.divider}`,
      textAlign: 'center',
      fontSize: tokens.typography.fontSize.small,
      lineHeight: tokens.typography.lineHeight.small,
      color: tokens.colors.fg.secondary
    }
  }

  return (
    <div style={styles.container}>
      <Header
        lang={lang}
        setLang={setLang}
        breadcrumbs={breadcrumbs}
        onSearch={handleSearch}
        isLoading={isLoading}
        region="US"
        user={user}
        onLogout={logout}
      />

      <Navigation
        activeTab={tab}
        onTabChange={setTab}
      />

      <main style={styles.main}>
        {tab === 'assistant' ? (
          <div style={{ padding: '20px', height: '100%' }}>
            <Assistant lang={lang} t={t} />
          </div>
        ) : tab === 'workflows' ? (
          <div style={{ height: '100%' }}>
            <Workflows lang={lang} t={t} />
          </div>
        ) : tab === 'vault' ? (
          <div style={{ height: '100%' }}>
            <Vault lang={lang} t={t} />
          </div>
        ) : tab === 'knowledge' ? (
          <div style={{ height: '100%' }}>
            <Knowledge lang={lang} t={t} />
          </div>
        ) : tab === 'eligibility' ? (
          <div style={styles.mainContent}>
            <EligibilityCalculator lang={lang} t={t} />
          </div>
        ) : tab === 'notice' ? (
          <div style={styles.mainContent}>
            <TaxNoticeExplainer lang={lang} t={t} />
          </div>
        ) : (
          <div style={styles.mainContent}>
            {tab === 'admin' && <AdminPanel t={t} />}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>⚖️ {t('disclaimer')}</p>
        <p style={{ fontSize: tokens.typography.fontSize.xs, marginTop: tokens.spacing.xs, color: tokens.colors.fg.tertiary }}>
          © 2025 TAXi • Built with ❤️ by MS.CMPE & MS.AI students
        </p>
      </footer>
    </div>
  )
}

export default function AppModern() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  )
}
