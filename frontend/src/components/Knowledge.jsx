import React, { useState } from 'react'
import KnowledgeBaseList from './knowledge/KnowledgeBaseList'
import KnowledgeBaseEditor from './knowledge/KnowledgeBaseEditor'

export default function Knowledge({ lang = 'en', t = (k) => k }) {
  const [view, setView] = useState('list') // 'list' or 'edit'
  const [selectedKB, setSelectedKB] = useState(null)
  const [knowledgeBases, setKnowledgeBases] = useState([
    {
      id: 'kb-vault',
      name: 'Vault Documents',
      description: 'All documents uploaded to the Vault',
      source: 'vault',
      enabled: true,
      docCount: 247,
      lastIndexed: new Date('2024-11-10T14:30:00'),
      autoSync: true
    },
    {
      id: 'kb-irs-pubs',
      name: 'IRS Publications',
      description: 'Official IRS publications and guidance',
      source: 'external',
      enabled: true,
      docCount: 156,
      lastIndexed: new Date('2024-11-09T10:00:00'),
      autoSync: true,
      external: true
    },
    {
      id: 'kb-tax-code',
      name: 'Internal Revenue Code',
      description: 'US Tax Code sections and regulations',
      source: 'external',
      enabled: true,
      docCount: 892,
      lastIndexed: new Date('2024-11-08T08:00:00'),
      autoSync: false,
      external: true
    },
    {
      id: 'kb-case-law',
      name: 'Tax Case Law',
      description: 'Court decisions and precedents',
      source: 'external',
      enabled: false,
      docCount: 1543,
      lastIndexed: new Date('2024-11-05T12:00:00'),
      autoSync: false,
      external: true
    }
  ])

  const handleToggleKB = (kbId) => {
    setKnowledgeBases(prev =>
      prev.map(kb =>
        kb.id === kbId ? { ...kb, enabled: !kb.enabled } : kb
      )
    )
  }

  const handleEditKB = (kb) => {
    setSelectedKB(kb)
    setView('edit')
  }

  const handleCreateKB = () => {
    setSelectedKB({
      id: `kb-${Date.now()}`,
      name: 'New Knowledge Base',
      description: '',
      source: 'custom',
      enabled: false,
      docCount: 0,
      lastIndexed: null,
      autoSync: false,
      includedDocs: [],
      synonyms: {},
      dedupEnabled: true
    })
    setView('edit')
  }

  const handleSaveKB = (kb) => {
    setKnowledgeBases(prev => {
      const existing = prev.find(k => k.id === kb.id)
      if (existing) {
        return prev.map(k => k.id === kb.id ? kb : k)
      }
      return [...prev, kb]
    })
    setView('list')
    setSelectedKB(null)
  }

  const handleIndexNow = (kbId) => {
    console.log(`Indexing KB: ${kbId}`)
    alert('Indexing started! This is a stub - actual indexing will happen in the backend.')
    
    // Update last indexed time
    setKnowledgeBases(prev =>
      prev.map(kb =>
        kb.id === kbId ? { ...kb, lastIndexed: new Date() } : kb
      )
    )
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fafbfc'
    },
    header: {
      padding: '20px 24px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '4px'
    },
    actions: {
      display: 'flex',
      gap: '12px'
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    },
    secondaryButton: {
      background: 'white',
      color: '#667eea',
      border: '2px solid #667eea'
    },
    content: {
      flex: 1,
      overflow: 'auto'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>
            <span>📚</span>
            Knowledge Bases
          </div>
          <div style={styles.subtitle}>
            Manage document collections and search indexes
          </div>
        </div>
        <div style={styles.actions}>
          {view === 'edit' && (
            <button
              style={{...styles.button, ...styles.secondaryButton}}
              onClick={() => {
                setView('list')
                setSelectedKB(null)
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f0f4ff'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              ← Back to List
            </button>
          )}
          {view === 'list' && (
            <button
              style={{...styles.button, ...styles.primaryButton}}
              onClick={handleCreateKB}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              + Create Knowledge Base
            </button>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {view === 'list' && (
          <KnowledgeBaseList
            knowledgeBases={knowledgeBases}
            onToggle={handleToggleKB}
            onEdit={handleEditKB}
            onIndexNow={handleIndexNow}
          />
        )}
        {view === 'edit' && selectedKB && (
          <KnowledgeBaseEditor
            knowledgeBase={selectedKB}
            onSave={handleSaveKB}
            onCancel={() => {
              setView('list')
              setSelectedKB(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
