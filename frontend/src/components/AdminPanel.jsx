import React, { useEffect, useState } from 'react'

export default function AdminPanel({ t }) {
  const [health, setHealth] = useState(null)
  const [apiInfo, setApiInfo] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadHealth()
    loadApiInfo()
  }, [])

  const loadHealth = async () => {
    try {
      const res = await fetch('http://localhost:5000/health')
      const data = await res.json()
      setHealth(data)
    } catch (e) {
      setHealth({ error: 'Failed to connect' })
    }
  }

  const loadApiInfo = async () => {
    try {
      const res = await fetch('http://localhost:5000/')
      const data = await res.json()
      setApiInfo(data)
    } catch (e) {
      setApiInfo({ error: 'Failed to load' })
    }
  }

  const loadMetrics = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/metrics')
      const txt = await res.text()
      setMetrics(txt)
    } catch (e) {
      setMetrics('Metrics endpoint not available. Set ENABLE_METRICS=true in backend/.env')
    } finally {
      setLoading(false)
    }
  }

  const testAsk = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'What is EITC?', lang: 'en' })
      })
      const data = await res.json()
      alert('✅ API Test Successful!\n\nAnswer: ' + data.answer.substring(0, 100) + '...')
    } catch (e) {
      alert('❌ API Test Failed: ' + e.message)
    }
  }

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px',
      borderRadius: '12px',
      color: 'white',
      marginBottom: '20px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#2d3748',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    badge: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    badgeSuccess: {
      background: '#c6f6d5',
      color: '#22543d'
    },
    badgeError: {
      background: '#fed7d7',
      color: '#742a2a'
    },
    button: {
      padding: '10px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginRight: '10px',
      marginBottom: '10px'
    },
    pre: {
      background: '#f7fafc',
      padding: '15px',
      borderRadius: '8px',
      overflow: 'auto',
      fontSize: '13px',
      maxHeight: '300px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginTop: '15px'
    },
    stat: {
      padding: '15px',
      background: '#f7fafc',
      borderRadius: '8px',
      textAlign: 'center'
    },
    statLabel: {
      fontSize: '12px',
      color: '#718096',
      marginBottom: '5px'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#2d3748'
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={{ margin: 0, fontSize: '28px', marginBottom: '8px' }}>
          🛠️ System Administration
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          Monitor and manage TAX Intelligence Bot
        </p>
      </div>

      {/* Health Status */}
      <div style={styles.card}>
        <div style={styles.title}>
          💚 System Health
        </div>
        {health ? (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <span style={{
                ...styles.badge,
                ...(health.status === 'ok' ? styles.badgeSuccess : styles.badgeError)
              }}>
                {health.status === 'ok' ? '✅ HEALTHY' : '❌ ERROR'}
              </span>
            </div>
            <div style={styles.grid}>
              <div style={styles.stat}>
                <div style={styles.statLabel}>Service</div>
                <div style={{ ...styles.statValue, fontSize: '16px' }}>{health.service || 'N/A'}</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statLabel}>Version</div>
                <div style={styles.statValue}>{health.version || 'N/A'}</div>
              </div>
              <div style={styles.stat}>
                <div style={styles.statLabel}>Status</div>
                <div style={styles.statValue}>{health.status || 'unknown'}</div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      {/* API Information */}
      <div style={styles.card}>
        <div style={styles.title}>
          📡 API Endpoints
        </div>
        {apiInfo ? (
          <div>
            <div style={{ marginBottom: '15px', fontSize: '14px', color: '#4a5568' }}>
              <strong>Service:</strong> {apiInfo.service}<br />
              <strong>Version:</strong> {apiInfo.version}<br />
              <strong>Description:</strong> {apiInfo.description}
            </div>
            <div style={{ marginTop: '15px' }}>
              <strong style={{ fontSize: '14px', color: '#2d3748' }}>Available Endpoints:</strong>
              <div style={{ ...styles.pre, marginTop: '10px' }}>
                {apiInfo.endpoints ? Object.entries(apiInfo.endpoints).map(([key, endpoint]) => (
                  <div key={key} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0' }}>
                    <strong>{endpoint.method}</strong> {endpoint.url}<br />
                    <small style={{ color: '#718096' }}>{endpoint.description}</small>
                  </div>
                )) : 'No endpoints info'}
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      {/* Actions */}
      <div style={styles.card}>
        <div style={styles.title}>
          🎛️ Actions
        </div>
        <div>
          <button style={styles.button} onClick={testAsk}>
            🧪 Test Chat API
          </button>
          <button style={styles.button} onClick={loadMetrics} disabled={loading}>
            {loading ? '⏳ Loading...' : '📊 Load Metrics'}
          </button>
          <button style={styles.button} onClick={loadHealth}>
            🔄 Refresh Health
          </button>
          <button 
            style={styles.button} 
            onClick={() => window.open('http://localhost:5000/', '_blank')}
          >
            🌐 Open API Docs
          </button>
        </div>

        {metrics && (
          <div style={{ marginTop: '20px' }}>
            <strong style={{ fontSize: '14px', color: '#2d3748' }}>Metrics Output:</strong>
            <pre style={styles.pre}>{metrics}</pre>
          </div>
        )}
      </div>

      {/* System Info */}
      <div style={styles.card}>
        <div style={styles.title}>
          ℹ️ System Information
        </div>
        <div style={styles.grid}>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Backend URL</div>
            <div style={{ ...styles.statValue, fontSize: '14px' }}>
              localhost:5000
            </div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Frontend URL</div>
            <div style={{ ...styles.statValue, fontSize: '14px' }}>
              localhost:3000
            </div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Knowledge Base</div>
            <div style={{ ...styles.statValue, fontSize: '14px' }}>
              19 documents
            </div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>LLM Model</div>
            <div style={{ ...styles.statValue, fontSize: '14px' }}>
              FLAN-T5-base
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div style={styles.card}>
        <div style={styles.title}>
          🔗 Quick Links
        </div>
        <div style={{ display: 'grid', gap: '10px' }}>
          <a href="http://localhost:5000/health" target="_blank" rel="noopener noreferrer" 
             style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
            → Health Check Endpoint
          </a>
          <a href="http://localhost:5000/api/eligibility/schema" target="_blank" rel="noopener noreferrer" 
             style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
            → Eligibility Schema
          </a>
          <a href="http://localhost:5000/" target="_blank" rel="noopener noreferrer" 
             style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
            → API Documentation
          </a>
        </div>
      </div>
    </div>
  )
}
