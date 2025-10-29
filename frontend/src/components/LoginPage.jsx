import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { loginWithGoogle, loginWithMicrosoft, loginWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmailLogin, setShowEmailLogin] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (error) {
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMicrosoftLogin = async () => {
    setLoading(true)
    try {
      await loginWithMicrosoft()
    } catch (error) {
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }
    setLoading(true)
    try {
      await loginWithEmail(email, password)
    } catch (error) {
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '450px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      animation: 'slideUp 0.5s ease-out'
    },
    logo: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#718096',
      fontSize: '14px'
    },
    ssoButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      background: 'white',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '12px',
      transition: 'all 0.3s',
      color: '#2d3748'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      margin: '25px 0',
      color: '#cbd5e0',
      fontSize: '14px'
    },
    line: {
      flex: 1,
      height: '1px',
      background: '#e2e8f0'
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '10px',
      border: '2px solid #e2e8f0',
      fontSize: '15px',
      marginBottom: '12px',
      outline: 'none',
      transition: 'border 0.3s'
    },
    submitButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'transform 0.2s'
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '12px',
      color: '#718096'
    }
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🤖</div>
          <h1 style={styles.title}>TAX Intelligence Bot</h1>
          <p style={styles.subtitle}>Sign in to access your EITC assistant</p>
        </div>

        {!showEmailLogin ? (
          <>
            <button
              style={styles.ssoButton}
              onClick={handleGoogleLogin}
              disabled={loading}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              style={{...styles.ssoButton, borderColor: '#0078d4', color: '#0078d4'}}
              onClick={handleMicrosoftLogin}
              disabled={loading}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <svg width="20" height="20" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Continue with Microsoft
            </button>

            <div style={styles.divider}>
              <div style={styles.line}></div>
              <span>OR</span>
              <div style={styles.line}></div>
            </div>

            <button
              style={{...styles.ssoButton, background: '#f7fafc'}}
              onClick={() => setShowEmailLogin(true)}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ✉️ Continue with Email
            </button>
          </>
        ) : (
          <form onSubmit={handleEmailLogin}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              {loading ? '🔄 Signing in...' : 'Sign In'}
            </button>
            <button
              type="button"
              style={{...styles.ssoButton, marginTop: '12px', background: '#f7fafc'}}
              onClick={() => setShowEmailLogin(false)}
            >
              ← Back to SSO options
            </button>
          </form>
        )}

        <div style={styles.footer}>
          <p>🔒 Secure authentication powered by OAuth 2.0</p>
          <p style={{ marginTop: '8px' }}>By continuing, you agree to our Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
