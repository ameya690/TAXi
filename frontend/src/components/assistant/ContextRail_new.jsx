import React, { useState } from 'react'
import tokens from '../../styles/designTokens'

export default function ContextRail({ 
  selectedMatter, 
  setSelectedMatter, 
  knowledgeSources, 
  setKnowledgeSources,
  docsInScope,
  onAddDocs
}) {
  const [matterExpanded, setMatterExpanded] = useState(false)

  const toggleKnowledgeSource = (source) => {
    setKnowledgeSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }))
  }

  const knowledgeSourcesList = [
    { id: 'irs_pubs', label: 'IRS Publications', count: 12 },
    { id: 'tax_code', label: 'Tax Code', count: 8 },
    { id: 'case_law', label: 'Case Law', count: 24 },
    { id: 'regulations', label: 'Regulations', count: 15 }
  ]

  const styles = {
    rail: {
      width: '280px',
      background: tokens.colors.surface1,
      borderRight: `${tokens.borders.width} solid ${tokens.borders.color}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden'
    },
    scrollContainer: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    section: {
      padding: tokens.spacing.md,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`
    },
    sectionTitle: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[600],
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: tokens.spacing.sm
    },
    matterRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    matterContent: {
      flex: 1,
      minWidth: 0
    },
    matterTitle: {
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.neutral[900],
      marginBottom: '2px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    matterDesc: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[600],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    chevron: {
      fontSize: '12px',
      color: tokens.colors.neutral[500],
      transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      marginLeft: tokens.spacing.xs
    },
    checkboxRow: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      padding: `${tokens.spacing.xs} 0`,
      cursor: 'pointer',
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      borderRadius: '4px',
      marginLeft: `-${tokens.spacing.xs}`,
      paddingLeft: tokens.spacing.xs
    },
    checkbox: {
      width: '16px',
      height: '16px',
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    checkboxChecked: {
      background: tokens.colors.primary[600],
      borderColor: tokens.colors.primary[600]
    },
    checkmark: {
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: tokens.typography.fontWeight.bold
    },
    checkboxLabel: {
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700],
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    checkboxCount: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500],
      marginLeft: 'auto',
      paddingLeft: tokens.spacing.xs
    },
    docsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, 40px)',
      gap: tokens.spacing.xs,
      marginTop: tokens.spacing.xs
    },
    docIcon: {
      width: '40px',
      height: '40px',
      borderRadius: tokens.borderRadius.sm,
      background: tokens.colors.neutral[100],
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    addButton: {
      width: '40px',
      height: '40px',
      borderRadius: tokens.borderRadius.sm,
      background: 'transparent',
      border: `${tokens.borders.width} dashed ${tokens.borders.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      color: tokens.colors.neutral[500],
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    emptyState: {
      padding: tokens.spacing.md,
      border: `${tokens.borders.width} dashed ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      textAlign: 'center',
      marginTop: tokens.spacing.xs
    },
    emptyStateText: {
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[600],
      marginBottom: tokens.spacing.xs
    }
  }

  return (
    <div style={styles.rail}>
      <div style={styles.scrollContainer}>
        {/* Matter Selector */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Matter</div>
          <div
            style={styles.matterRow}
            onClick={() => setMatterExpanded(!matterExpanded)}
            onMouseOver={(e) => {
              e.currentTarget.style.background = tokens.colors.neutral[50]
              e.currentTarget.style.borderColor = tokens.colors.neutral[300]
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = tokens.colors.surface1
              e.currentTarget.style.borderColor = tokens.borders.color
            }}
          >
            <div style={styles.matterContent}>
              <div style={styles.matterTitle}>
                {selectedMatter || 'Select Matter'}
              </div>
              <div style={styles.matterDesc}>
                {selectedMatter ? 'Tax Return 2024' : 'Choose a matter to work on'}
              </div>
            </div>
            <div style={{
              ...styles.chevron,
              transform: matterExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▼
            </div>
          </div>
        </div>

        {/* Knowledge Sources */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Knowledge Sources</div>
          {knowledgeSourcesList.map(source => (
            <div
              key={source.id}
              style={styles.checkboxRow}
              onClick={() => toggleKnowledgeSource(source.id)}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.neutral[50]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <div style={{
                ...styles.checkbox,
                ...(knowledgeSources[source.id] ? styles.checkboxChecked : {})
              }}>
                {knowledgeSources[source.id] && (
                  <span style={styles.checkmark}>✓</span>
                )}
              </div>
              <span style={styles.checkboxLabel}>{source.label}</span>
              <span style={styles.checkboxCount}>· {source.count}</span>
            </div>
          ))}
        </div>

        {/* Docs in Scope */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Docs in Scope</div>
          {docsInScope && docsInScope.length > 0 ? (
            <div style={styles.docsGrid}>
              {docsInScope.map((doc, index) => (
                <div
                  key={index}
                  style={styles.docIcon}
                  title={doc.name}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = tokens.colors.neutral[200]
                    e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = tokens.colors.neutral[100]
                    e.currentTarget.style.borderColor = tokens.borders.color
                  }}
                >
                  {doc.type === 'pdf' ? '📄' : doc.type === 'doc' ? '📝' : '📎'}
                </div>
              ))}
              <div
                style={styles.addButton}
                onClick={onAddDocs}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[50]
                  e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                  e.currentTarget.style.color = tokens.colors.neutral[700]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = tokens.borders.color
                  e.currentTarget.style.color = tokens.colors.neutral[500]
                }}
              >
                +
              </div>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateText}>
                No documents in scope
              </div>
              <button
                style={{
                  ...tokens.components.button.ghost,
                  padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                  fontSize: tokens.typography.fontSize.small
                }}
                onClick={onAddDocs}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[100]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                + Add Documents
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
