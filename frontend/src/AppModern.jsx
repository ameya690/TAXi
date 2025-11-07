import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './components/LoginPage'
import Chat from './components/Chat.jsx'
import EligibilityCalculator from './components/EligibilityCalculator.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import TaxNoticeExplainer from './components/TaxNoticeExplainer.jsx'
import en from './locales/en.json'
import es from './locales/es.json'

const dicts = { en, es }

function MainApp() {
  const { user, logout, isAuthenticated } = useAuth()
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('chat')
  const [menuOpen, setMenuOpen] = useState(false)

  const t = (k) => dicts[lang][k] || k

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0'
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

  const globalStyles = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .mobile-menu-btn { display: block !important; }
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
    }
  `

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>
      
      <div style={styles.innerContainer}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🤖</span>
            <div>
              <div style={styles.logoText}>TAX Intelligence Bot</div>
              <div style={styles.logoSubtext}>Your EITC Assistant</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={styles.nav} className="hide-mobile">
            <button 
              onClick={() => setTab('chat')} 
              style={{...styles.navButton, ...(tab === 'chat' ? styles.navButtonActive : {})}}
              onMouseOver={(e) => !tab === 'chat' && (e.target.style.background = '#f7fafc')}
              onMouseOut={(e) => !tab === 'chat' && (e.target.style.background = 'transparent')}
            >
              💬 Chat
            </button>
            <button 
              onClick={() => setTab('eligibility')} 
              style={{...styles.navButton, ...(tab === 'eligibility' ? styles.navButtonActive : {})}}
              onMouseOver={(e) => !tab === 'eligibility' && (e.target.style.background = '#f7fafc')}
              onMouseOut={(e) => !tab === 'eligibility' && (e.target.style.background = 'transparent')}
            >
              ✅ Eligibility
            </button>
            <button 
              onClick={() => setTab('notice')} 
              style={{...styles.navButton, ...(tab === 'notice' ? styles.navButtonActive : {})}}
              onMouseOver={(e) => !tab === 'notice' && (e.target.style.background = '#f7fafc')}
              onMouseOut={(e) => !tab === 'notice' && (e.target.style.background = 'transparent')}
            >
              📄 {t('tab_notice')}
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
              <button onClick={() => { setTab('chat'); setMenuOpen(false); }} style={{...styles.navButton, justifyContent: 'flex-start', padding: '15px'}}>
                💬 Chat
              </button>
              <button onClick={() => { setTab('eligibility'); setMenuOpen(false); }} style={{...styles.navButton, justifyContent: 'flex-start', padding: '15px'}}>
                ✅ Eligibility Calculator
              </button>
              <button onClick={() => { setTab('notice'); setMenuOpen(false); }} style={{...styles.navButton, justifyContent: 'flex-start', padding: '15px'}}>
                📄 {t('tab_notice')}
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
            {tab === 'chat' && <Chat lang={lang} t={t} />}
            {tab === 'eligibility' && <EligibilityCalculator lang={lang} t={t} />}
            {tab === 'notice' && <TaxNoticeExplainer lang={lang} t={t} />}
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
