import React, { useState } from 'react'
import tokens from '../../styles/designTokens'
import ReasoningTrace from './ReasoningTrace'

export default function SourcesRail({ 
  citations = [], 
  reasoningTrace = [], 
  suggestions = [], 
  onCitationClick,
  highlightedCitation 
}) {
  const [expandedSections, setExpandedSections] = useState({
    citations: true,
    reasoning: false,
    suggestions: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Citation type icons
  const getCitationIcon = (type) => {
    const icons = {
      'internal': '📄',      // Internal doc
      'irs_pub': '📘',       // IRS publication
      'case_law': '⚖️',      // Case law
      'regulation': '📜'     // Regulation
    }
    return icons[type] || '📄'
  }

  const getCitationTypeLabel = (type) => {
    const labels = {
      'internal': 'Internal Doc',
      'irs_pub': 'IRS Publication',
      'case_law': 'Case Law',
      'regulation': 'Regulation'
    }
    return labels[type] || 'Document'
  }

  // Group citations by source document
  const groupedCitations = citations.reduce((acc, citation, index) => {
    const source = citation.source || 'Unknown Source'
    if (!acc[source]) {
      acc[source] = {
        type: citation.type || 'internal',
        docType: citation.docType || 'PDF',
        items: []
      }
    }
    acc[source].items.push({
      ...citation,
      number: index + 1 // Citation number [1], [2], etc.
    })
    return acc
  }, {})

  const formatTimestamp = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const handleCitationClick = (citation) => {
    if (onCitationClick) {
      onCitationClick(citation)
    }
    
    // Scroll to citation anchor in center pane
    if (citation.anchorId) {
      const element = document.getElementById(citation.anchorId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Briefly highlight the sentence
        element.style.background = tokens.colors.primary[100]
        element.style.transition = `background ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`
        
        setTimeout(() => {
          element.style.background = 'transparent'
        }, 2000)
      }
    }
  }

  const styles = {
    rail: {
      width: '320px',
      background: tokens.colors.surface1,
      borderLeft: `${tokens.borders.width} solid ${tokens.borders.color}`,
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
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`
    },
    sectionHeader: {
      padding: tokens.spacing.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      background: tokens.colors.surface1,
      position: 'sticky',
      top: 0,
      zIndex: 1,
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    sectionTitle: {
      fontSize: tokens.typography.fontSize.small,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[900],
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    sectionCount: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[600],
      marginLeft: tokens.spacing.xs
    },
    chevron: {
      fontSize: '10px',
      color: tokens.colors.neutral[500],
      transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    sectionContent: {
      padding: `0 ${tokens.spacing.md} ${tokens.spacing.md}`,
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.sm
    },
    legend: {
      padding: tokens.spacing.sm,
      background: tokens.colors.neutral[50],
      borderRadius: tokens.borderRadius.sm,
      marginBottom: tokens.spacing.sm
    },
    legendTitle: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[700],
      marginBottom: tokens.spacing.xs
    },
    legendGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: tokens.spacing.xs,
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[600]
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    sourceGroup: {
      marginBottom: tokens.spacing.md
    },
    sourceHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      marginBottom: tokens.spacing.xs,
      padding: `${tokens.spacing.xs} 0`
    },
    sourceIcon: {
      fontSize: '16px',
      flexShrink: 0
    },
    sourceTitle: {
      fontSize: tokens.typography.fontSize.small,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[800],
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    sourceType: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500],
      marginLeft: '4px'
    },
    citationItem: {
      padding: tokens.spacing.sm,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      marginBottom: tokens.spacing.xs,
      position: 'relative'
    },
    citationHighlighted: {
      borderColor: tokens.colors.primary[600],
      background: `${tokens.colors.primary[600]}10`,
      boxShadow: `0 0 0 1px ${tokens.colors.primary[600]}20`
    },
    citationNumber: {
      position: 'absolute',
      top: tokens.spacing.xs,
      right: tokens.spacing.xs,
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: tokens.colors.primary[600],
      color: '#ffffff',
      fontSize: '11px',
      fontWeight: tokens.typography.fontWeight.bold,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    citationSnippet: {
      fontSize: tokens.typography.fontSize.small,
      lineHeight: tokens.typography.lineHeight.small,
      color: tokens.colors.neutral[700],
      marginBottom: tokens.spacing.xs,
      paddingRight: '28px', // Space for number badge
      position: 'relative'
    },
    citationHighlight: {
      background: `${tokens.colors.primary[200]}40`,
      padding: '2px 4px',
      borderRadius: '3px',
      fontWeight: tokens.typography.fontWeight.medium
    },
    citationMeta: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500],
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    reasoningStep: {
      padding: tokens.spacing.sm,
      background: tokens.colors.neutral[50],
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      borderLeft: `3px solid ${tokens.colors.primary[600]}`,
      marginBottom: tokens.spacing.xs,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    reasoningHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: tokens.spacing.xs
    },
    reasoningTitle: {
      fontSize: tokens.typography.fontSize.small,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[900],
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    reasoningTimestamp: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500]
    },
    reasoningText: {
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700],
      lineHeight: tokens.typography.lineHeight.small
    },
    suggestionItem: {
      padding: tokens.spacing.sm,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: tokens.spacing.xs
    },
    suggestionIcon: {
      fontSize: tokens.iconSize.inline,
      flexShrink: 0
    },
    suggestionText: {
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700],
      lineHeight: tokens.typography.lineHeight.small
    },
    emptyText: {
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[500],
      fontStyle: 'italic',
      padding: tokens.spacing.sm,
      textAlign: 'center'
    }
  }

  return (
    <div style={styles.rail}>
      <div style={styles.scrollContainer}>
        {/* Citations Section */}
        <div style={styles.section}>
          <div
            style={styles.sectionHeader}
            onClick={() => toggleSection('citations')}
            onMouseOver={(e) => {
              e.currentTarget.style.background = tokens.colors.neutral[50]
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = tokens.colors.surface1
            }}
          >
            <div style={styles.sectionTitle}>
              <span>📚</span>
              <span>Citations</span>
              {citations.length > 0 && (
                <span style={styles.sectionCount}>({citations.length})</span>
              )}
            </div>
            <div style={{
              ...styles.chevron,
              transform: expandedSections.citations ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▼
            </div>
          </div>
          
          {expandedSections.citations && (
            <div style={styles.sectionContent}>
              {citations.length === 0 ? (
                <div style={styles.emptyText}>No citations yet</div>
              ) : (
                <>
                  {/* Icon Legend */}
                  <div style={styles.legend}>
                    <div style={styles.legendTitle}>Citation Types</div>
                    <div style={styles.legendGrid}>
                      <div style={styles.legendItem}>
                        <span>📄</span>
                        <span>Internal Doc</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span>📘</span>
                        <span>IRS Pub</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span>⚖️</span>
                        <span>Case Law</span>
                      </div>
                      <div style={styles.legendItem}>
                        <span>📜</span>
                        <span>Regulation</span>
                      </div>
                    </div>
                  </div>

                  {/* Grouped Citations */}
                  {Object.entries(groupedCitations).map(([source, group]) => (
                    <div key={source} style={styles.sourceGroup}>
                      <div style={styles.sourceHeader}>
                        <span style={styles.sourceIcon}>
                          {getCitationIcon(group.type)}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={styles.sourceTitle}>{source}</span>
                          <span style={styles.sourceType}>• {group.docType}</span>
                        </div>
                      </div>
                      
                      {group.items.map((citation) => (
                        <div
                          key={citation.id || citation.number}
                          style={{
                            ...styles.citationItem,
                            ...(highlightedCitation === citation.id ? styles.citationHighlighted : {})
                          }}
                          onClick={() => handleCitationClick(citation)}
                          onMouseOver={(e) => {
                            if (highlightedCitation !== citation.id) {
                              e.currentTarget.style.background = tokens.colors.neutral[50]
                              e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                            }
                          }}
                          onMouseOut={(e) => {
                            if (highlightedCitation !== citation.id) {
                              e.currentTarget.style.background = tokens.colors.surface1
                              e.currentTarget.style.borderColor = tokens.borders.color
                            }
                          }}
                        >
                          {/* Citation Number Badge */}
                          <div style={styles.citationNumber}>{citation.number}</div>
                          
                          {/* Citation Snippet with Highlight */}
                          <div style={styles.citationSnippet}>
                            {citation.highlightedText ? (
                              <>
                                {citation.textBefore}
                                <span style={styles.citationHighlight}>
                                  {citation.highlightedText}
                                </span>
                                {citation.textAfter}
                              </>
                            ) : (
                              citation.text || citation.snippet
                            )}
                          </div>
                          
                          {/* Citation Metadata */}
                          <div style={styles.citationMeta}>
                            {citation.section && <span>{citation.section}</span>}
                            {citation.page && (
                              <>
                                <span>•</span>
                                <span>p. {citation.page}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Reasoning Trace Section */}
        <div style={styles.section}>
          <div
            style={styles.sectionHeader}
            onClick={() => toggleSection('reasoning')}
            onMouseOver={(e) => {
              e.currentTarget.style.background = tokens.colors.neutral[50]
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = tokens.colors.surface1
            }}
          >
            <div style={styles.sectionTitle}>
              <span>🧠</span>
              <span>Reasoning Trace</span>
              {reasoningTrace.length > 0 && (
                <span style={styles.sectionCount}>({reasoningTrace.length})</span>
              )}
            </div>
            <div style={{
              ...styles.chevron,
              transform: expandedSections.reasoning ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▼
            </div>
          </div>
          
          {expandedSections.reasoning && (
            <div style={{ padding: tokens.spacing.md }}>
              <ReasoningTrace trace={reasoningTrace} />
            </div>
          )}
        </div>

        {/* Suggestions Section */}
        <div style={styles.section}>
          <div
            style={styles.sectionHeader}
            onClick={() => toggleSection('suggestions')}
            onMouseOver={(e) => {
              e.currentTarget.style.background = tokens.colors.neutral[50]
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = tokens.colors.surface1
            }}
          >
            <div style={styles.sectionTitle}>
              <span>💡</span>
              <span>Suggestions</span>
              {suggestions.length > 0 && (
                <span style={styles.sectionCount}>({suggestions.length})</span>
              )}
            </div>
            <div style={{
              ...styles.chevron,
              transform: expandedSections.suggestions ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▼
            </div>
          </div>
          
          {expandedSections.suggestions && (
            <div style={styles.sectionContent}>
              {suggestions.length === 0 ? (
                <div style={styles.emptyText}>No suggestions available</div>
              ) : (
                suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={styles.suggestionItem}
                    onClick={() => suggestion.onClick && suggestion.onClick()}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = tokens.colors.neutral[50]
                      e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = tokens.colors.surface1
                      e.currentTarget.style.borderColor = tokens.borders.color
                    }}
                  >
                    <span style={styles.suggestionIcon}>→</span>
                    <div style={styles.suggestionText}>{suggestion.text}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
