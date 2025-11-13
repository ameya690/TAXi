import React, { useState } from 'react'

export default function WorkflowHome({ workflows, onEdit, onRun, onCreate }) {
  const [filterTag, setFilterTag] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const allTags = ['all', ...new Set(workflows.flatMap(w => w.tags))]

  const filteredWorkflows = workflows.filter(w => {
    const matchesTag = filterTag === 'all' || w.tags.includes(filterTag)
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         w.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesSearch
  })

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    filters: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchBox: {
      flex: 1,
      minWidth: '300px',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    tagFilters: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    tagButton: {
      padding: '8px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '20px',
      background: 'white',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    tagButtonActive: {
      background: '#667eea',
      color: 'white',
      borderColor: '#667eea'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s',
      cursor: 'pointer',
      position: 'relative'
    },
    cardHeader: {
      marginBottom: '12px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px'
    },
    cardDescription: {
      fontSize: '14px',
      color: '#64748b',
      lineHeight: '1.5',
      marginBottom: '16px'
    },
    tags: {
      display: 'flex',
      gap: '6px',
      flexWrap: 'wrap',
      marginBottom: '16px'
    },
    tag: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    tagResearch: {
      background: '#dbeafe',
      color: '#1e40af'
    },
    tagReview: {
      background: '#fef3c7',
      color: '#92400e'
    },
    tagFiling: {
      background: '#dcfce7',
      color: '#166534'
    },
    tagAdvisory: {
      background: '#f3e8ff',
      color: '#6b21a8'
    },
    metadata: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#94a3b8',
      marginBottom: '16px',
      paddingTop: '12px',
      borderTop: '1px solid #f1f5f9'
    },
    actions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      flex: 1,
      padding: '10px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    runButton: {
      background: '#667eea',
      color: 'white'
    },
    editButton: {
      background: '#f1f5f9',
      color: '#475569'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#94a3b8'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '16px'
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#64748b',
      marginBottom: '8px'
    },
    emptyText: {
      fontSize: '14px',
      marginBottom: '24px'
    },
    createButton: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      background: '#667eea',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  }

  const getTagStyle = (tag) => {
    const tagMap = {
      'Research': styles.tagResearch,
      'Review': styles.tagReview,
      'Filing': styles.tagFiling,
      'Advisory': styles.tagAdvisory
    }
    return { ...styles.tag, ...(tagMap[tag] || styles.tagResearch) }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div style={styles.container}>
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Search workflows..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBox}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        <div style={styles.tagFilters}>
          {allTags.map(tag => (
            <button
              key={tag}
              style={{
                ...styles.tagButton,
                ...(filterTag === tag ? styles.tagButtonActive : {})
              }}
              onClick={() => setFilterTag(tag)}
              onMouseOver={(e) => {
                if (filterTag !== tag) {
                  e.currentTarget.style.background = '#f8fafc'
                }
              }}
              onMouseOut={(e) => {
                if (filterTag !== tag) {
                  e.currentTarget.style.background = 'white'
                }
              }}
            >
              {tag === 'all' ? 'All' : tag}
            </button>
          ))}
        </div>
      </div>

      {filteredWorkflows.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>⚙️</div>
          <div style={styles.emptyTitle}>No workflows found</div>
          <div style={styles.emptyText}>
            {searchQuery || filterTag !== 'all' 
              ? 'Try adjusting your filters or search query'
              : 'Get started by creating your first workflow'}
          </div>
          {!searchQuery && filterTag === 'all' && (
            <button style={styles.createButton} onClick={onCreate}>
              + Create Workflow
            </button>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredWorkflows.map(workflow => (
            <div
              key={workflow.id}
              style={styles.card}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardTitle}>{workflow.name}</div>
                <div style={styles.cardDescription}>{workflow.description}</div>
              </div>

              <div style={styles.tags}>
                {workflow.tags.map(tag => (
                  <span key={tag} style={getTagStyle(tag)}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={styles.metadata}>
                <span>📊 {workflow.usageCount} runs</span>
                <span>📅 {formatDate(workflow.lastEdited)}</span>
              </div>

              <div style={styles.actions}>
                <button
                  style={{...styles.actionButton, ...styles.runButton}}
                  onClick={(e) => {
                    e.stopPropagation()
                    onRun(workflow)
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
                >
                  ▶ Run
                </button>
                <button
                  style={{...styles.actionButton, ...styles.editButton}}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(workflow)
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                  ✏️ Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
