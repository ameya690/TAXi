import React, { useState } from 'react'
import { groupCitationsBySource } from '../../utils/citationParser'

export default function SourcesRail({ citations, reasoningTrace, suggestions, onSuggestionClick, onCitationClick, highlightedCitation }) {
  const styles = {
    rail: {
      width: '320px',
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
    emptyText: {
      fontSize: '12px',
      color: '#94a3b8',
      fontStyle: 'italic',
      padding: '8px'
    },
    citationGroup: {
      marginBottom: '12px'
    },
    citationSource: {
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#475569',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    citationItem: {
      padding: '8px 12px',
      background: 'white',
      borderRadius: '6px',
      fontSize: '12px',
      marginBottom: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: '1px solid #e2e8f0'
    },
    citationId: {
      fontWeight: '600',
      color: '#667eea',
      marginBottom: '4px'
    },
    citationPreview: {
      color: '#64748b',
      lineHeight: '1.5'
    },
    suggestionChip: {
      padding: '10px 14px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      lineHeight: '1.4'
    }
  }

  // Group citations by source
  const groupedCitations = groupCitationsBySource(citations)

  return (
    <div style={styles.rail}>
      {/* Citations */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Citations</div>
        {citations.length === 0 ? (
          <div style={styles.emptyText}>
            No citations yet
          </div>
        ) : (
          <div>
            {Object.entries(groupedCitations).map(([source, items]) => (
              <div key={source} style={styles.citationGroup}>
                <div style={styles.citationSource}>
                  📚 {source}
                </div>
                {items.map((citation) => (
                  <div
                    key={citation.citationId}
                    style={{
                      ...styles.citationItem,
                      background: highlightedCitation === citation.citationId ? '#fef3c7' : 'white',
                      borderColor: highlightedCitation === citation.citationId ? '#f59e0b' : '#e2e8f0',
                      borderWidth: highlightedCitation === citation.citationId ? '2px' : '1px'
                    }}
                    onClick={() => onCitationClick && onCitationClick(citation.citationId)}
                    onMouseOver={(e) => {
                      if (highlightedCitation !== citation.citationId) {
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.borderColor = '#667eea'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (highlightedCitation !== citation.citationId) {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                      }
                    }}
                  >
                    <div style={styles.citationId}>[{citation.number}]</div>
                    <div style={styles.citationPreview}>
                      "{citation.quote || citation.text}"
                    </div>
                    {citation.location && (
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                        §{citation.location}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reasoning Trace */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Reasoning Trace</div>
        <ReasoningAccordion steps={reasoningTrace} />
      </div>

      {/* Suggestions */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Suggestions</div>
        {suggestions.length === 0 ? (
          <div style={styles.emptyText}>
            No suggestions available
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                style={styles.suggestionChip}
                onClick={() => onSuggestionClick(suggestion)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8fafc'
                  e.currentTarget.style.borderColor = '#667eea'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }}
              >
                💡 {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReasoningAccordion({ steps }) {
  const [expandedSteps, setExpandedSteps] = useState(new Set())

  const toggleStep = (idx) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(idx)) {
        newSet.delete(idx)
      } else {
        newSet.add(idx)
      }
      return newSet
    })
  }

  const styles = {
    accordion: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    accordionItem: {
      background: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0'
    },
    accordionHeader: {
      padding: '10px 12px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: '600',
      fontSize: '13px',
      color: '#334155',
      transition: 'background 0.2s'
    },
    accordionContent: {
      padding: '12px',
      borderTop: '1px solid #e2e8f0',
      fontSize: '12px',
      lineHeight: '1.6',
      color: '#64748b'
    },
    emptyText: {
      fontSize: '12px',
      color: '#94a3b8',
      fontStyle: 'italic',
      padding: '8px'
    },
    stepIcon: {
      marginRight: '8px'
    }
  }

  if (!steps || steps.length === 0) {
    return <div style={styles.emptyText}>No reasoning steps available</div>
  }

  const stepIcons = {
    retrieve: '🔍',
    analyze: '📊',
    draft: '✍️',
    synthesize: '🧩',
    verify: '✅'
  }

  return (
    <div style={styles.accordion}>
      {steps.map((step, idx) => {
        const isExpanded = expandedSteps.has(idx)
        const icon = stepIcons[step.type] || '📌'

        return (
          <div key={idx} style={styles.accordionItem}>
            <div
              style={styles.accordionHeader}
              onClick={() => toggleStep(idx)}
              onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <span>
                <span style={styles.stepIcon}>{icon}</span>
                {step.title}
              </span>
              <span style={{ fontSize: '10px' }}>
                {isExpanded ? '▼' : '▶'}
              </span>
            </div>
            {isExpanded && (
              <div style={styles.accordionContent}>
                {step.description}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
