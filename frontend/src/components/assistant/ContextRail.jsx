import React from 'react'

export default function ContextRail({ 
  selectedMatter, 
  setSelectedMatter, 
  knowledgeSources, 
  setKnowledgeSources,
  docsInScope 
}) {
  const toggleKnowledgeSource = (source) => {
    setKnowledgeSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }))
  }

  const styles = {
    rail: {
      width: '280px',
      background: '#f8fafc',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflowY: 'auto',
      maxHeight: '100%'
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: '700',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    matterSelector: {
      width: '100%',
      padding: '10px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      background: 'white',
      cursor: 'pointer',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    knowledgeToggle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      background: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    toggleLabel: {
      fontSize: '13px',
      fontWeight: '500',
      color: '#334155'
    },
    toggle: {
      width: '40px',
      height: '22px',
      background: '#cbd5e1',
      borderRadius: '11px',
      position: 'relative',
      transition: 'background 0.2s'
    },
    toggleActive: {
      background: '#667eea'
    },
    toggleKnob: {
      width: '18px',
      height: '18px',
      background: 'white',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: '2px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    },
    toggleKnobActive: {
      left: '20px'
    },
    docsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    docItem: {
      padding: '8px 12px',
      background: 'white',
      borderRadius: '6px',
      fontSize: '13px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '1px solid #e2e8f0'
    },
    emptyText: {
      fontSize: '12px',
      color: '#94a3b8',
      fontStyle: 'italic',
      padding: '8px'
    },
    badge: {
      fontSize: '11px',
      color: '#64748b',
      background: '#f1f5f9',
      padding: '2px 6px',
      borderRadius: '4px'
    }
  }

  return (
    <div style={styles.rail}>
      {/* Matter Selector */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Matter</div>
        <select 
          style={styles.matterSelector}
          value={selectedMatter || ''}
          onChange={(e) => setSelectedMatter(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        >
          <option value="">Select a matter...</option>
          <option value="Smith Tax Case 2024">Smith Tax Case 2024</option>
          <option value="Johnson EITC Review">Johnson EITC Review</option>
          <option value="Williams Audit Defense">Williams Audit Defense</option>
          <option value="Davis Tax Planning">Davis Tax Planning</option>
        </select>
      </div>

      {/* Knowledge Sources */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Knowledge Sources</div>
        <div style={styles.docsList}>
          {Object.entries(knowledgeSources).map(([key, enabled]) => (
            <div 
              key={key}
              style={styles.knowledgeToggle}
              onClick={() => toggleKnowledgeSource(key)}
              onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <span style={styles.toggleLabel}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <div style={{...styles.toggle, ...(enabled ? styles.toggleActive : {})}}>
                <div style={{...styles.toggleKnob, ...(enabled ? styles.toggleKnobActive : {})}} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Docs in Scope */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          Docs in Scope ({docsInScope.length})
        </div>
        {docsInScope.length === 0 ? (
          <div>
            <div style={styles.emptyText}>
              No documents selected
            </div>
            <div style={{
              fontSize: '11px',
              color: '#64748b',
              marginTop: '8px',
              padding: '8px',
              background: '#fef3c7',
              borderRadius: '6px',
              lineHeight: '1.4'
            }}>
              💡 <strong>Tip:</strong> Upload your PDF or text documents using the "📎 Attach Docs" button below. 
              The Assistant will extract and analyze the content to answer your questions.
            </div>
          </div>
        ) : (
          <div style={styles.docsList}>
            {docsInScope.map((doc, idx) => (
              <div 
                key={idx} 
                style={styles.docItem}
                onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                <span>📄 {doc.name}</span>
                <span style={styles.badge}>{doc.pages}p</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
