import React from 'react'

export default function KnowledgeBaseList({ knowledgeBases, onToggle, onEdit, onIndexNow }) {
  const formatDate = (date) => {
    if (!date) return 'Never'
    const d = new Date(date)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString()
  }

  const getSourceBadge = (source) => {
    const badges = {
      vault: { label: 'Vault', color: '#667eea', bg: '#eff6ff' },
      external: { label: 'External', color: '#10b981', bg: '#d1fae5' },
      custom: { label: 'Custom', color: '#8b5cf6', bg: '#f3e8ff' }
    }
    return badges[source] || badges.custom
  }

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    stats: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      flex: 1,
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#667eea',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#64748b'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      transition: 'all 0.3s'
    },
    cardDisabled: {
      opacity: 0.6
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    cardDescription: {
      fontSize: '14px',
      color: '#64748b',
      lineHeight: '1.5',
      marginBottom: '16px'
    },
    toggle: {
      position: 'relative',
      width: '48px',
      height: '24px',
      background: '#cbd5e1',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    toggleActive: {
      background: '#667eea'
    },
    toggleKnob: {
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '20px',
      height: '20px',
      background: 'white',
      borderRadius: '50%',
      transition: 'all 0.3s'
    },
    toggleKnobActive: {
      left: '26px'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    metadata: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '16px',
      padding: '12px',
      background: '#f8fafc',
      borderRadius: '8px'
    },
    metadataRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px'
    },
    metadataLabel: {
      color: '#64748b'
    },
    metadataValue: {
      fontWeight: '600',
      color: '#1e293b'
    },
    actions: {
      display: 'flex',
      gap: '8px'
    },
    button: {
      flex: 1,
      padding: '10px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    indexButton: {
      background: '#667eea',
      color: 'white'
    },
    editButton: {
      background: '#f1f5f9',
      color: '#475569'
    },
    placeholderBadge: {
      padding: '6px 12px',
      background: '#fef3c7',
      color: '#92400e',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '12px',
      display: 'inline-block'
    }
  }

  const enabledCount = knowledgeBases.filter(kb => kb.enabled).length
  const totalDocs = knowledgeBases.reduce((sum, kb) => sum + (kb.enabled ? kb.docCount : 0), 0)

  return (
    <div style={styles.container}>
      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{knowledgeBases.length}</div>
          <div style={styles.statLabel}>Total Knowledge Bases</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{enabledCount}</div>
          <div style={styles.statLabel}>Enabled</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalDocs.toLocaleString()}</div>
          <div style={styles.statLabel}>Indexed Documents</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {knowledgeBases.filter(kb => kb.autoSync).length}
          </div>
          <div style={styles.statLabel}>Auto-Sync Enabled</div>
        </div>
      </div>

      {/* Knowledge Base Cards */}
      <div style={styles.grid}>
        {knowledgeBases.map(kb => {
          const sourceBadge = getSourceBadge(kb.source)
          
          return (
            <div
              key={kb.id}
              style={{
                ...styles.card,
                ...(!kb.enabled ? styles.cardDisabled : {})
              }}
              onMouseOver={(e) => {
                if (kb.enabled) {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>
                    {kb.name}
                    {kb.external && <span style={{ fontSize: '16px' }}>🌐</span>}
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      background: sourceBadge.bg,
                      color: sourceBadge.color
                    }}
                  >
                    {sourceBadge.label}
                  </span>
                </div>
                <div
                  style={{
                    ...styles.toggle,
                    ...(kb.enabled ? styles.toggleActive : {})
                  }}
                  onClick={() => onToggle(kb.id)}
                >
                  <div
                    style={{
                      ...styles.toggleKnob,
                      ...(kb.enabled ? styles.toggleKnobActive : {})
                    }}
                  />
                </div>
              </div>

              {kb.placeholder && (
                <div style={styles.placeholderBadge}>
                  ⚠️ Placeholder - Integration Required
                </div>
              )}

              <div style={styles.cardDescription}>{kb.description}</div>

              <div style={styles.metadata}>
                <div style={styles.metadataRow}>
                  <span style={styles.metadataLabel}>Documents:</span>
                  <span style={styles.metadataValue}>
                    {kb.docCount.toLocaleString()}
                  </span>
                </div>
                <div style={styles.metadataRow}>
                  <span style={styles.metadataLabel}>Last Indexed:</span>
                  <span style={styles.metadataValue}>
                    {formatDate(kb.lastIndexed)}
                  </span>
                </div>
                <div style={styles.metadataRow}>
                  <span style={styles.metadataLabel}>Auto-Sync:</span>
                  <span style={styles.metadataValue}>
                    {kb.autoSync ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={{...styles.button, ...styles.indexButton}}
                  onClick={() => onIndexNow(kb.id)}
                  disabled={!kb.enabled || kb.placeholder}
                  onMouseOver={(e) => {
                    if (kb.enabled && !kb.placeholder) {
                      e.currentTarget.style.background = '#5568d3'
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#667eea'
                  }}
                >
                  🔄 Index Now
                </button>
                <button
                  style={{...styles.button, ...styles.editButton}}
                  onClick={() => onEdit(kb)}
                  onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                  ⚙️ Manage
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
