import React, { useState } from 'react'
import Chat from './components/Chat.jsx'
import EligibilityCalculator from './components/EligibilityCalculator.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import TaxNoticeExplainer from './components/TaxNoticeExplainer.jsx'
import en from './locales/en.json'
import es from './locales/es.json'

const dicts = { en, es }

export default function App() {
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('chat')

  const t = (k) => dicts[lang][k] || k

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    card: {
      width: '100%',
      maxWidth: '1200px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      marginTop: '20px'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: {
      fontSize: '14px',
      opacity: 0.9,
      marginTop: '8px',
      fontWeight: '400'
    },
    langSelect: {
      padding: '10px 16px',
      borderRadius: '8px',
      border: '2px solid rgba(255,255,255,0.3)',
      background: 'rgba(255,255,255,0.15)',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      outline: 'none',
      transition: 'all 0.2s'
    },
    nav: {
      display: 'flex',
      gap: '8px',
      padding: '20px 32px',
      background: '#f7fafc',
      borderBottom: '1px solid #e2e8f0',
      flexWrap: 'wrap'
    },
    navButton: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'white',
      color: '#4a5568',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    navButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    main: {
      padding: '32px',
      minHeight: '500px'
    },
    footer: {
      padding: '24px 32px',
      background: '#f7fafc',
      borderTop: '1px solid #e2e8f0',
      fontSize: '13px',
      color: '#718096',
      textAlign: 'center'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <span style={{ fontSize: '36px' }}>🚕</span>
              TAX Intelligence Bot
            </h1>
            <div style={styles.subtitle}>Intelligent Tax Assistance • EITC Information & Eligibility</div>
          </div>
          <select 
            value={lang} 
            onChange={e => setLang(e.target.value)}
            style={styles.langSelect}
          >
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
          </select>
        </header>

        <nav style={styles.nav}>
          <button 
            onClick={() => setTab('chat')} 
            style={{...styles.navButton, ...(tab === 'chat' ? styles.navButtonActive : {})}}
          >
            💬 {t('tab_chat')}
          </button>
          <button 
            onClick={() => setTab('eligibility')} 
            style={{...styles.navButton, ...(tab === 'eligibility' ? styles.navButtonActive : {})}}
          >
            ✅ {t('tab_eligibility')}
          </button>
          <button 
            onClick={() => setTab('notice')} 
            style={{...styles.navButton, ...(tab === 'notice' ? styles.navButtonActive : {})}}
          >
            📄 {t('tab_notice')}
          </button>
          <button 
            onClick={() => setTab('admin')} 
            style={{...styles.navButton, ...(tab === 'admin' ? styles.navButtonActive : {})}}
          >
            🛠️ {t('tab_admin')}
          </button>
        </nav>

        <main style={styles.main}>
          {tab === 'chat' && <Chat lang={lang} t={t} />}
          {tab === 'eligibility' && <EligibilityCalculator lang={lang} t={t} />}
          {tab === 'notice' && <TaxNoticeExplainer lang={lang} t={t} />}
          {tab === 'admin' && <AdminPanel t={t} />}
        </main>

        <footer style={styles.footer}>
          ⚖️ {t('disclaimer')}
        </footer>
      </div>
    </div>
  )
}
