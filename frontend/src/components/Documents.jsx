import React, { useState, useRef } from 'react'

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const fileInputRef = useRef(null)

  const extractDocumentFacts = (file) => {
    // Extract basic facts based on document type
    const type = getDocType(file.name)
    const facts = []
    
    // For demo purposes, generate example facts based on document type
    // In production, this would use OCR or PDF parsing
    if (type === 'W-2') {
      facts.push('W-2 Form for 2024')
      facts.push('Box 1 (Wages): $52,340')
      facts.push('Box 2 (Federal tax withheld): $6,280')
      facts.push('Employer: ABC Company')
    } else if (type === '1099') {
      facts.push('1099 Form for 2024')
      facts.push('Non-employee compensation: $18,500')
      facts.push('Payer: XYZ Services')
    } else if (type === 'IRS Notice') {
      facts.push('IRS Notice received')
      facts.push('Notice type: CP2000 (Income discrepancy)')
      facts.push('Dated: March 2024')
      facts.push('Proposed adjustment: $2,400')
    } else if (file.name.toLowerCase().includes('payroll') || file.name.toLowerCase().includes('paystub')) {
      facts.push('Payroll/Paystub document')
      facts.push('Gross pay: $4,195 (monthly)')
      facts.push('Net pay: $3,156')
      facts.push('YTD earnings: $50,340')
      facts.push('Federal tax withheld YTD: $6,280')
    } else {
      facts.push(`Document: ${file.name}`)
      facts.push('Tax-related document uploaded')
    }
    
    return facts
  }

  const handleFileUpload = (files) => {
    const newDocs = Array.from(files).map(file => {
      const facts = extractDocumentFacts(file)
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        type: getDocType(file.name),
        addedOn: new Date().toLocaleDateString(),
        usedIn: [],
        file: file,
        size: formatFileSize(file.size),
        facts: facts // Store extracted facts
      }
    })
    setDocuments(prev => [...prev, ...newDocs])
    
    // Save to localStorage for persistence
    const allDocs = [...documents, ...newDocs].map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      addedOn: doc.addedOn,
      usedIn: doc.usedIn,
      size: doc.size,
      facts: doc.facts
    }))
    localStorage.setItem('userDocuments', JSON.stringify(allDocs))
  }

  const getDocType = (filename) => {
    const lower = filename.toLowerCase()
    if (lower.includes('w-2') || lower.includes('w2')) return 'W-2'
    if (lower.includes('1099')) return '1099'
    if (lower.includes('notice') || lower.includes('cp')) return 'IRS Notice'
    if (lower.includes('1040')) return 'Tax Return'
    return 'Other'
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleView = (doc) => {
    // Create a blob URL and open in new tab
    if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      window.open(url, '_blank')
    } else {
      alert('File preview not available')
    }
  }

  const handleDownload = (doc) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.name
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleDelete = (docId) => {
    if (confirm('Are you sure you want to delete this document?')) {
      const updated = documents.filter(d => d.id !== docId)
      setDocuments(updated)
      localStorage.setItem('userDocuments', JSON.stringify(updated.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        addedOn: doc.addedOn,
        usedIn: doc.usedIn,
        size: doc.size
      }))))
    }
  }

  // Load documents from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('userDocuments')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setDocuments(parsed)
      } catch (e) {
        console.error('Failed to load documents', e)
      }
    }
  }, [])

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fafbfc'
    },
    header: {
      padding: '24px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0
    },
    toolbar: {
      padding: '16px 24px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    uploadButton: {
      padding: '10px 20px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    viewToggle: {
      display: 'flex',
      gap: '8px'
    },
    viewButton: {
      padding: '8px 12px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    viewButtonActive: {
      background: '#eff6ff',
      borderColor: '#2563eb',
      color: '#2563eb'
    },
    content: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 24px',
      color: '#64748b'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '16px'
    },
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px'
    },
    emptyText: {
      fontSize: '14px',
      marginBottom: '24px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px'
    },
    card: {
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    cardIcon: {
      fontSize: '32px',
      marginBottom: '12px'
    },
    cardName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px',
      wordBreak: 'break-word'
    },
    cardMeta: {
      fontSize: '12px',
      color: '#64748b',
      marginBottom: '4px'
    },
    cardActions: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid #f1f5f9'
    },
    actionButton: {
      padding: '6px 12px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      flex: 1
    },
    deleteButton: {
      color: '#dc2626'
    },
    list: {
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    listHeader: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
      padding: '12px 16px',
      background: '#f8fafc',
      borderBottom: '1px solid #e2e8f0',
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b'
    },
    listRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
      padding: '12px 16px',
      borderBottom: '1px solid #f1f5f9',
      alignItems: 'center',
      fontSize: '14px'
    },
    badge: {
      display: 'inline-block',
      padding: '2px 8px',
      background: '#eff6ff',
      color: '#2563eb',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500'
    }
  }

  return (
    <div style={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={(e) => {
          handleFileUpload(e.target.files)
          e.target.value = ''
        }}
      />

      <div style={styles.header}>
        <h1 style={styles.title}>Documents</h1>
        <p style={styles.subtitle}>
          Your uploaded tax documents are stored locally and used to personalize answers
        </p>
      </div>

      <div style={styles.toolbar}>
        <button
          style={styles.uploadButton}
          onClick={() => fileInputRef.current?.click()}
        >
          📤 Upload Documents
        </button>
        
        <div style={styles.viewToggle}>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === 'grid' ? styles.viewButtonActive : {})
            }}
            onClick={() => setViewMode('grid')}
          >
            ⊞ Grid
          </button>
          <button
            style={{
              ...styles.viewButton,
              ...(viewMode === 'list' ? styles.viewButtonActive : {})
            }}
            onClick={() => setViewMode('list')}
          >
            ☰ List
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {documents.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📄</div>
            <div style={styles.emptyTitle}>No documents yet</div>
            <div style={styles.emptyText}>
              Add W-2s, 1099s, or IRS letters here to get better answers.
            </div>
            <button
              style={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
            >
              📤 Upload Your First Document
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div style={styles.grid}>
            {documents.map(doc => (
              <div
                key={doc.id}
                style={styles.card}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={styles.cardIcon}>📄</div>
                <div style={styles.cardName}>{doc.name}</div>
                <div style={styles.cardMeta}>
                  <span style={styles.badge}>{doc.type}</span>
                </div>
                <div style={styles.cardMeta}>Added: {doc.addedOn}</div>
                <div style={styles.cardMeta}>Size: {doc.size}</div>
                {doc.usedIn.length > 0 && (
                  <div style={styles.cardMeta}>Used in: {doc.usedIn.join(', ')}</div>
                )}
                <div style={styles.cardActions}>
                  <button
                    style={styles.actionButton}
                    onClick={() => handleView(doc)}
                  >
                    👁 View
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() => handleDownload(doc)}
                  >
                    ⬇ Download
                  </button>
                  <button
                    style={{...styles.actionButton, ...styles.deleteButton}}
                    onClick={() => handleDelete(doc.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.list}>
            <div style={styles.listHeader}>
              <div>Name</div>
              <div>Type</div>
              <div>Added On</div>
              <div>Used In</div>
              <div>Actions</div>
            </div>
            {documents.map(doc => (
              <div key={doc.id} style={styles.listRow}>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{doc.name}</div>
                <div><span style={styles.badge}>{doc.type}</span></div>
                <div style={{ color: '#64748b' }}>{doc.addedOn}</div>
                <div style={{ color: '#64748b', fontSize: '12px' }}>
                  {doc.usedIn.length > 0 ? doc.usedIn.join(', ') : '—'}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{ ...styles.actionButton, padding: '4px 8px' }}
                    onClick={() => handleView(doc)}
                    title="View"
                  >
                    👁
                  </button>
                  <button
                    style={{ ...styles.actionButton, padding: '4px 8px' }}
                    onClick={() => handleDownload(doc)}
                    title="Download"
                  >
                    ⬇
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton, padding: '4px 8px' }}
                    onClick={() => handleDelete(doc.id)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
