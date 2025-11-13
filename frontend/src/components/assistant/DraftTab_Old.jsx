import React from 'react'

export default function DraftTab({ draftContent, setDraftContent }) {
  const styles = {
    container: {
      padding: '20px',
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b'
    },
    actions: {
      display: 'flex',
      gap: '8px'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      background: '#667eea',
      color: 'white',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    editor: {
      flex: 1,
      background: '#fafbfc',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '14px',
      lineHeight: '1.8',
      fontFamily: 'inherit',
      resize: 'none',
      outline: 'none'
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      color: '#94a3b8',
      padding: '40px'
    }
  }

  const handleExport = () => {
    const blob = new Blob([draftContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `draft-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!draftContent) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px' }}>✍️</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#64748b' }}>
            No draft yet
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
            Use the /draft command in chat to generate long-form documents.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Draft Document</h3>
        <div style={styles.actions}>
          <button
            style={styles.button}
            onClick={handleExport}
            onMouseOver={(e) => e.target.style.background = '#5568d3'}
            onMouseOut={(e) => e.target.style.background = '#667eea'}
          >
            📥 Export
          </button>
          <button
            style={{...styles.button, background: '#10b981'}}
            onMouseOver={(e) => e.target.style.background = '#059669'}
            onMouseOut={(e) => e.target.style.background = '#10b981'}
          >
            ✨ Continue Drafting
          </button>
        </div>
      </div>
      <textarea
        style={styles.editor}
        value={draftContent}
        onChange={(e) => setDraftContent(e.target.value)}
        placeholder="Your draft will appear here..."
      />
    </div>
  )
}
