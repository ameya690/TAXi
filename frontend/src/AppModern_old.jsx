import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
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
import tokens from './styles/designTokens'

const dicts = { en, es }

function MainApp() {
  const { user, logout, isAuthenticated } = useAuth()
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
      color: tokens.colors.neutral[900]
    },
    innerContainer: {
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      padding: '16px 24px',
      borderRadius: '0 0 20px 20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      animation: 'slideDown 0.5s ease-out'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer'
    },
    logoIcon: {
      fontSize: '32px',
      animation: 'bounce 2s infinite'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    logoSubtext: {
      fontSize: '11px',
      color: '#718096',
      fontWeight: '500'
    },
    nav: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    navButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '12px',
      background: 'transparent',
      color: '#4a5568',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    navButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
      transform: 'translateY(-2px)'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    langSelector: {
      padding: '8px 16px',
      borderRadius: '10px',
      border: '2px solid #e2e8f0',
      background: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 16px',
      borderRadius: '12px',
      background: '#f7fafc',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '2px solid #667eea'
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#2d3748'
    },
    logoutButton: {
      padding: '8px 16px',
      borderRadius: '10px',
      border: 'none',
      background: '#fed7d7',
      color: '#c53030',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    main: {
      flex: 1,
      padding: '24px',
      animation: 'fadeIn 0.5s ease-out'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '30px',
      minHeight: '600px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      animation: 'scaleIn 0.5s ease-out'
    },
    footer: {
      padding: '20px',
      textAlign: 'center',
      color: 'white',
      fontSize: '14px',
      opacity: 0.9
    },
    mobileMenuButton: {
      display: 'none',
      padding: '10px',
      background: 'transparent',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer'
    },
    mobileMenu: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 200,
      display: menuOpen ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center'
    },
    mobileMenuContent: {
      background: 'white',
      borderRadius: '20px',
      padding: '30px',
      width: '90%',
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto'
    }
  }

  const styles2 = {
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
        user={user}
        onLogout={logout}
      />

      <Navigation
        activeTab={tab}
        onTabChange={setTab}
      />

      <main style={styles2.main}>
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
          <div style={styles2.mainContent}>
            <EligibilityCalculator lang={lang} t={t} />
          </div>
        ) : tab === 'notice' ? (
          <div style={styles2.mainContent}>
            <TaxNoticeExplainer lang={lang} t={t} />
          </div>
        ) : (
          <div style={styles2.mainContent}>
            {tab === 'admin' && <AdminPanel t={t} />}
          </div>
        )}
      </main>

      <footer style={styles2.footer}>
        <p>⚖️ {t('disclaimer')}</p>
        <p style={{ fontSize: tokens.typography.fontSize.xs, marginTop: tokens.spacing.xs, color: tokens.colors.neutral[500] }}>
          © 2024 TAXi • Powered by AI
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
            <span style={styles.logoIcon}>🤖</span>
            <div>
              <div style={styles.logoText}>TAX Intelligence Bot</div>
              <div style={styles.logoSubtext}>Your EITC Assistant</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={styles.nav} className="hide-mobile">
            <button 
              onClick={() => setTab('assistant')} 
              style={{...styles.navButton, ...(tab === 'assistant' ? styles.navButtonActive : {})}}
              onMouseOver={(e) => !tab === 'assistant' && (e.target.style.background = '#f7fafc')}
              onMouseOut={(e) => !tab === 'assistant' && (e.target.style.background = 'transparent')}
            >
              🤖 Assistant
            </button>
            <button 
              onClick={() => setTab('workflows')} 
              style={{...styles.navButton, ...(tab === 'workflows' ? styles.navButtonActive : {})}}
              onMouseOver={(e) => !tab === 'workflows' && (e.target.style.background = '#f7fafc')}
              onMouseOut={(e) => !tab === 'workflows' && (e.target.style.background = 'transparent')}
            >
              ⚙️ Workflows
            </button>
            <button 
              onClick={() => setTab('vault')} 
              style={{...styles.navButton, ...(tab === 'vault' ? styles.navButtonActive : {})}}
              onMouseOver={(e) => !tab === 'vault' && (e.target.style.background = '#f7fafc')}
              onMouseOut={(e) => !tab === 'vault' && (e.target.style.background = 'transparent')}
            >
              🗄️ Vault
            </button>
            <button 
              onClick={() => setTab('knowledge')} 
              style={{...styles.navButton, ...(tab === 'knowledge' ? styles.navButtonActive : {})}}
              onMouseOver={(e) => !tab === 'knowledge' && (e.target.style.background = '#f7fafc')}
              onMouseOut={(e) => !tab === 'knowledge' && (e.target.style.background = 'transparent')}
            >
              📚 Knowledge
            </button>
            <button 
              onClick={() => setTab('admin')} 
              style={{...styles.navButton, ...(tab === 'admin' ? styles.navButtonActive : {})}}
              onMouseOver={(e) => !tab === 'admin' && (e.target.style.background = '#f7fafc')}
              onMouseOut={(e) => !tab === 'admin' && (e.target.style.background = 'transparent')}
            >
              🛠️ Admin
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            style={styles.mobileMenuButton}
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          {/* User Section */}
          <div style={styles.userSection} className="hide-mobile">
            <select 
              value={lang} 
              onChange={e => setLang(e.target.value)}
              style={styles.langSelector}
            >
              <option value="en">🇺🇸 EN</option>
              <option value="es">🇪🇸 ES</option>
            </select>
            
            <div style={styles.userInfo}>
              <img src={user?.picture} alt={user?.name} style={styles.avatar} />
              <span style={styles.userName}>{user?.name}</span>
            </div>

            <button 
              style={styles.logoutButton}
              onClick={logout}
              onMouseOver={(e) => e.target.style.background = '#fc8181'}
              onMouseOut={(e) => e.target.style.background = '#fed7d7'}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <div style={styles.mobileMenu} onClick={() => setMenuOpen(false)}>
          <div style={styles.mobileMenuContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={user?.picture} alt={user?.name} style={{...styles.avatar, width: '60px', height: '60px', margin: '0 auto 10px'}} />
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>{user?.name}</div>
              <div style={{ fontSize: '14px', color: '#718096' }}>{user?.email}</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => { setTab('assistant'); setMenuOpen(false); }} style={{...styles.navButton, justifyContent: 'flex-start', padding: '15px'}}>
                🤖 Assistant
              </button>
              <button onClick={() => { setTab('workflows'); setMenuOpen(false); }} style={{...styles.navButton, justifyContent: 'flex-start', padding: '15px'}}>
                ⚙️ Workflows
              </button>
              <button onClick={() => { setTab('vault'); setMenuOpen(false); }} style={{...styles.navButton, justifyContent: 'flex-start', padding: '15px'}}>
                🗄️ Vault
              </button>
              <button onClick={() => { setTab('knowledge'); setMenuOpen(false); }} style={{...styles.navButton, justifyContent: 'flex-start', padding: '15px'}}>
                📚 Knowledge
              </button>
              <button onClick={() => { setTab('admin'); setMenuOpen(false); }} style={{...styles.navButton, justifyContent: 'flex-start', padding: '15px'}}>
                🛠️ Admin Panel
              </button>
              
              <div style={{ borderTop: '1px solid #e2e8f0', margin: '10px 0' }}></div>
              
              <select 
                value={lang} 
                onChange={e => setLang(e.target.value)}
                style={{...styles.langSelector, width: '100%'}}
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
              </select>
              
              <button 
                style={{...styles.logoutButton, width: '100%', padding: '15px'}}
                onClick={() => { logout(); setMenuOpen(false); }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main style={styles.main}>
          <div style={styles.card}>
            {tab === 'assistant' && <Assistant lang={lang} t={t} />}
            {tab === 'workflows' && <Workflows lang={lang} t={t} />}
            {tab === 'vault' && <Vault lang={lang} t={t} />}
            {tab === 'knowledge' && <Knowledge lang={lang} t={t} />}
            {tab === 'admin' && <AdminPanel t={t} />}
          </div>
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>⚖️ {t('disclaimer')}</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            © 2024 TAX Intelligence Bot • Powered by AI • v2.0.0
          </p>
        </footer>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
