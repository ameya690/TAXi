import React, { useState } from 'react'

export default function KnowledgeBaseEditor({ knowledgeBase, onSave, onCancel }) {
  const [editedKB, setEditedKB] = useState(knowledgeBase)
  const [activeTab, setActiveTab] = useState('general')

  const handleUpdate = (field, value) => {
    setEditedKB(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSynonym = () => {
    const term = prompt('Enter term:')
    const synonyms = prompt('Enter synonyms (comma-separated):')
    if (term && synonyms) {
      setEditedKB(prev => ({
        ...prev,
        synonyms: {
          ...prev.synonyms,
          [term]: synonyms.split(',').map(s => s.trim())
        }
      }))
    }
  }

  const handleRemoveSynonym = (term) => {
    setEditedKB(prev => {
      const newSynonyms = { ...prev.synonyms }
      delete newSynonyms[term]
      return { ...prev, synonyms: newSynonyms }
    })
  }

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1000px',
      margin: '0 auto'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    },
    tabs: {
      display: 'flex',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px'
    },
    tab: {
      padding: '16px 24px',
      border: 'none',
      background: 'transparent',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      marginBottom: '-1px',
      transition: 'all 0.2s'
    },
    tabActive: {
      color: '#667eea',
      borderBottomColor: '#667eea'
    },
    content: {
      padding: '24px'
    },
    section: {
      marginBottom: '24px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: '#f8fafc',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    checkboxInput: {
      width: '20px',
      height: '20px',
      cursor: 'pointer'
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#1e293b',
      cursor: 'pointer'
    },
    docList: {
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      maxHeight: '300px',
      overflowY: 'auto'
    },
    docItem: {
      padding: '12px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    synonymList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    synonymItem: {
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    synonymTerm: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px'
    },
    synonymValues: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap'
    },
    synonymChip: {
      padding: '4px 12px',
      background: '#eff6ff',
      color: '#667eea',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    addButton: {
      width: '100%',
      padding: '12px',
      border: '2px dashed #cbd5e1',
      borderRadius: '8px',
      background: 'transparent',
      color: '#667eea',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    actions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '24px'
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    saveButton: {
      background: '#667eea',
      color: 'white'
    },
    cancelButton: {
      background: '#f1f5f9',
      color: '#475569'
    },
    stub: {
      padding: '40px',
      textAlign: 'center',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '2px dashed #cbd5e1'
    },
    stubIcon: {
      fontSize: '48px',
      marginBottom: '12px'
    },
    stubText: {
      fontSize: '14px',
      color: '#64748b'
    },
    removeButton: {
      padding: '4px 8px',
      background: '#fee2e2',
      color: '#dc2626',
      border: 'none',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  }

  const mockDocs = [
    { id: 1, title: 'IRS Publication 17', selected: true },
    { id: 2, title: 'IRS Publication 463', selected: true },
    { id: 3, title: 'IRS Publication 596', selected: false },
    { id: 4, title: 'Tax Code Section 162', selected: true }
  ]

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.tabs}>
          {['general', 'documents', 'synonyms', 'settings'].map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.content}>
          {activeTab === 'general' && (
            <>
              <div style={styles.section}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  value={editedKB.name}
                  onChange={(e) => handleUpdate('name', e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={styles.section}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={editedKB.description}
                  onChange={(e) => handleUpdate('description', e.target.value)}
                  style={styles.textarea}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={styles.section}>
                <label style={styles.label}>Source Type</label>
                <select
                  value={editedKB.source}
                  onChange={(e) => handleUpdate('source', e.target.value)}
                  style={styles.input}
                >
                  <option value="vault">Vault</option>
                  <option value="external">External</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'documents' && (
            <>
              <div style={styles.section}>
                <label style={styles.label}>Included Documents</label>
                <div style={styles.docList}>
                  {mockDocs.map(doc => (
                    <div key={doc.id} style={styles.docItem}>
                      <input
                        type="checkbox"
                        checked={doc.selected}
                        style={styles.checkboxInput}
                      />
                      <span>{doc.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.stub}>
                <div style={styles.stubIcon}>📄</div>
                <div style={styles.stubText}>
                  Document selection and filtering will be available here
                </div>
              </div>
            </>
          )}

          {activeTab === 'synonyms' && (
            <>
              <div style={styles.section}>
                <label style={styles.label}>Term Synonyms</label>
                <div style={styles.synonymList}>
                  {Object.entries(editedKB.synonyms || {}).map(([term, synonyms]) => (
                    <div key={term} style={styles.synonymItem}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={styles.synonymTerm}>{term}</div>
                        <button
                          style={styles.removeButton}
                          onClick={() => handleRemoveSynonym(term)}
                        >
                          Remove
                        </button>
                      </div>
                      <div style={styles.synonymValues}>
                        {synonyms.map((syn, idx) => (
                          <span key={idx} style={styles.synonymChip}>{syn}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  style={styles.addButton}
                  onClick={handleAddSynonym}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#667eea'
                    e.currentTarget.style.background = '#f0f4ff'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  + Add Synonym
                </button>
              </div>

              <div style={{...styles.section, marginTop: '20px'}}>
                <div style={styles.stub}>
                  <div style={styles.stubIcon}>🔤</div>
                  <div style={styles.stubText}>
                    Advanced synonym management and NLP features coming soon
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <div style={styles.section}>
                <label
                  style={styles.checkbox}
                  onClick={() => handleUpdate('autoSync', !editedKB.autoSync)}
                >
                  <input
                    type="checkbox"
                    checked={editedKB.autoSync || false}
                    onChange={() => {}}
                    style={styles.checkboxInput}
                  />
                  <div>
                    <div style={styles.checkboxLabel}>Enable Auto-Sync</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Automatically index new documents as they're added
                    </div>
                  </div>
                </label>
              </div>

              <div style={styles.section}>
                <label
                  style={styles.checkbox}
                  onClick={() => handleUpdate('dedupEnabled', !editedKB.dedupEnabled)}
                >
                  <input
                    type="checkbox"
                    checked={editedKB.dedupEnabled !== false}
                    onChange={() => {}}
                    style={styles.checkboxInput}
                  />
                  <div>
                    <div style={styles.checkboxLabel}>Enable Deduplication</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Remove duplicate content during indexing
                    </div>
                  </div>
                </label>
              </div>

              <div style={styles.section}>
                <label
                  style={styles.checkbox}
                  onClick={() => handleUpdate('enabled', !editedKB.enabled)}
                >
                  <input
                    type="checkbox"
                    checked={editedKB.enabled || false}
                    onChange={() => {}}
                    style={styles.checkboxInput}
                  />
                  <div>
                    <div style={styles.checkboxLabel}>Enable Knowledge Base</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Make this knowledge base available for search
                    </div>
                  </div>
                </label>
              </div>

              <div style={styles.stub}>
                <div style={styles.stubIcon}>⚙️</div>
                <div style={styles.stubText}>
                  Advanced indexing settings and configuration options
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={styles.actions}>
        <button
          style={{...styles.button, ...styles.cancelButton}}
          onClick={onCancel}
          onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
        >
          Cancel
        </button>
        <button
          style={{...styles.button, ...styles.saveButton}}
          onClick={() => onSave(editedKB)}
          onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
          onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
