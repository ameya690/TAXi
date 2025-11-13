import React, { useState } from 'react'
import Assistant from './components/Assistant.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import Workflows from './components/Workflows.jsx'
import Vault from './components/Vault.jsx'
import Knowledge from './components/Knowledge.jsx'
import EligibilityCalculator from './components/EligibilityCalculator.jsx'
import TaxNoticeExplainer from './components/TaxNoticeExplainer.jsx'
import Header from './components/Header.jsx'
import Navigation from './components/Navigation.jsx'
import en from './locales/en.json'
import es from './locales/es.json'
import tokens from './styles/designTokens'

const dicts = { en, es }

export default function App() {
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('assistant')
  const [isLoading, setIsLoading] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState(['TAXi'])

  const t = (k) => dicts[lang][k] || k

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
      color: tokens.colors.neutral[900]
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
      background: tokens.colors.surface0,
      borderTop: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      textAlign: 'center',
      fontSize: tokens.typography.fontSize.small,
      lineHeight: tokens.typography.lineHeight.small,
      color: tokens.colors.neutral[600]
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
        ⚖️ {t('disclaimer')}
      </footer>
    </div>
  )
}
