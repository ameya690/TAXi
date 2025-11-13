import React, { useState } from 'react'
import tokens from '../../styles/designTokens'

export default function SourcesRail({ 
  citations = [], 
  reasoningTrace = [], 
  suggestions = [], 
  onSuggestionClick, 
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

  // Group citations by source
  const groupedCitations = citations.reduce((acc, citation) => {
    const source = citation.source || 'Other'
    if (!acc[source]) acc[source] = []
    acc[source].push(citation)
    return acc
  }, {})

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
    emptyText: {
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[500],
      fontStyle: 'italic',
      padding: tokens.spacing.sm,
      textAlign: 'center'
    },
    citationGroup: {
      marginBottom: tokens.spacing.sm
    },
    citationSource: {
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[700],
      marginBottom: tokens.spacing.xs,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    citationItem: {
      padding: tokens.spacing.sm,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      marginBottom: tokens.spacing.xs,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    citationHighlighted: {
      borderColor: tokens.colors.primary[600],
      background: `${tokens.colors.primary[600]}10`
    },
    citationText: {
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700],
      lineHeight: tokens.typography.lineHeight.small,
      marginBottom: tokens.spacing.xs
    },
    citationMeta: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[600]
    },
    reasoningStep: {
      padding: tokens.spacing.sm,
      background: tokens.colors.neutral[50],
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      borderLeft: `3px solid ${tokens.colors.primary[600]}`
    },
    reasoningTitle: {
      fontSize: tokens.typography.fontSize.small,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[900],
      marginBottom: tokens.spacing.xs
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
                Object.entries(groupedCitations).map(([source, cites]) => (
                  <div key={source} style={styles.citationGroup}>
                    <div style={styles.citationSource}>
                      <span>📄</span>
                      <span>{source}</span>
                      <span style={styles.sectionCount}>({cites.length})</span>
                    </div>
                    {cites.map((citation, index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.citationItem,
                          ...(highlightedCitation === citation.id ? styles.citationHighlighted : {})
                        }}
                        onClick={() => onCitationClick && onCitationClick(citation)}
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
                        <div style={styles.citationText}>{citation.text}</div>
                        <div style={styles.citationMeta}>
                          {citation.section || 'Section N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
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
              <span>Reasoning</span>
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
            <div style={styles.sectionContent}>
              {reasoningTrace.length === 0 ? (
                <div style={styles.emptyText}>No reasoning steps yet</div>
              ) : (
                reasoningTrace.map((step, index) => (
                  <div key={index} style={styles.reasoningStep}>
                    <div style={styles.reasoningTitle}>
                      Step {index + 1}: {step.title}
                    </div>
                    <div style={styles.reasoningText}>{step.description}</div>
                  </div>
                ))
              )}
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
                    onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
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
