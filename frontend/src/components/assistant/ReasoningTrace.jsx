import React, { useState } from 'react'
import tokens from '../../styles/designTokens'

export default function ReasoningTrace({ trace = [] }) {
  const [expandedGroups, setExpandedGroups] = useState({
    retrieve: false,
    analyze: false,
    synthesize: false
  })
  const [expandedSteps, setExpandedSteps] = useState({})

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }))
  }

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }))
  }

  // Group steps by phase
  const groupedSteps = {
    retrieve: trace.filter(s => s.phase === 'retrieve'),
    analyze: trace.filter(s => s.phase === 'analyze'),
    synthesize: trace.filter(s => s.phase === 'synthesize')
  }

  const getPhaseIcon = (phase) => {
    const icons = {
      retrieve: '🔍',
      analyze: '⚙️',
      synthesize: '✨'
    }
    return icons[phase] || '•'
  }

  const getPhaseLabel = (phase) => {
    const labels = {
      retrieve: 'Retrieve',
      analyze: 'Analyze',
      synthesize: 'Synthesize'
    }
    return labels[phase] || phase
  }

  const getStepIcon = (type) => {
    const icons = {
      search: '🔎',
      query: '❓',
      fetch: '📥',
      parse: '📄',
      extract: '✂️',
      compare: '⚖️',
      calculate: '🧮',
      validate: '✅',
      filter: '🔽',
      rank: '📊',
      combine: '🔗',
      format: '📝',
      generate: '✍️',
      review: '👁️'
    }
    return icons[type] || '▸'
  }

  const formatDuration = (ms) => {
    if (!ms) return ''
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.sm
    },
    phaseGroup: {
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.md,
      overflow: 'hidden'
    },
    phaseHeader: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      background: tokens.colors.neutral[50],
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    phaseTitle: {
      fontSize: tokens.typography.fontSize.small,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[900],
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    phaseCount: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[600],
      marginLeft: tokens.spacing.xs
    },
    chevron: {
      fontSize: '10px',
      color: tokens.colors.neutral[500],
      transition: `transform ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    phaseContent: {
      background: tokens.colors.surface1
    },
    stepLine: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      fontSize: tokens.typography.fontSize.small,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      cursor: 'pointer',
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      fontFamily: tokens.typography.fontFamily.mono
    },
    stepLineExpanded: {
      background: tokens.colors.neutral[50]
    },
    stepIcon: {
      fontSize: '14px',
      flexShrink: 0,
      width: '16px',
      textAlign: 'center'
    },
    stepVerb: {
      color: tokens.colors.neutral[800],
      fontWeight: tokens.typography.fontWeight.medium,
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    stepDuration: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500],
      fontWeight: tokens.typography.fontWeight.normal,
      minWidth: '45px',
      textAlign: 'right'
    },
    stepTool: {
      padding: '2px 6px',
      background: tokens.colors.primary[100],
      color: tokens.colors.primary[700],
      borderRadius: tokens.borderRadius.sm,
      fontSize: '10px',
      fontWeight: tokens.typography.fontWeight.semibold,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontFamily: tokens.typography.fontFamily.base
    },
    stepDetails: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      paddingLeft: `calc(${tokens.spacing.md} + 16px + ${tokens.spacing.xs})`,
      background: tokens.colors.neutral[50],
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`
    },
    bulletList: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.xs
    },
    bulletItem: {
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700],
      lineHeight: tokens.typography.lineHeight.small,
      display: 'flex',
      alignItems: 'flex-start',
      gap: tokens.spacing.xs
    },
    bulletDot: {
      color: tokens.colors.neutral[400],
      fontSize: '8px',
      marginTop: '6px',
      flexShrink: 0
    },
    emptyState: {
      padding: tokens.spacing.md,
      textAlign: 'center',
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[500],
      fontStyle: 'italic'
    }
  }

  const renderPhaseGroup = (phase) => {
    const steps = groupedSteps[phase]
    if (steps.length === 0) return null

    const isExpanded = expandedGroups[phase]

    return (
      <div key={phase} style={styles.phaseGroup}>
        <div
          style={styles.phaseHeader}
          onClick={() => toggleGroup(phase)}
          onMouseOver={(e) => {
            e.currentTarget.style.background = tokens.colors.neutral[100]
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = tokens.colors.neutral[50]
          }}
        >
          <div style={styles.phaseTitle}>
            <span>{getPhaseIcon(phase)}</span>
            <span>{getPhaseLabel(phase)}</span>
            <span style={styles.phaseCount}>({steps.length})</span>
          </div>
          <div style={{
            ...styles.chevron,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            ▼
          </div>
        </div>

        {isExpanded && (
          <div style={styles.phaseContent}>
            {steps.map((step, index) => {
              const stepId = `${phase}-${index}`
              const isStepExpanded = expandedSteps[stepId]

              return (
                <React.Fragment key={stepId}>
                  <div
                    style={{
                      ...styles.stepLine,
                      ...(isStepExpanded ? styles.stepLineExpanded : {})
                    }}
                    onClick={() => step.details && toggleStep(stepId)}
                    onMouseOver={(e) => {
                      if (!isStepExpanded) {
                        e.currentTarget.style.background = tokens.colors.neutral[50]
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isStepExpanded) {
                        e.currentTarget.style.background = tokens.colors.surface1
                      }
                    }}
                  >
                    <span style={styles.stepIcon}>
                      {getStepIcon(step.type)}
                    </span>
                    <span style={styles.stepVerb}>
                      {step.action}
                    </span>
                    <span style={styles.stepDuration}>
                      {formatDuration(step.duration)}
                    </span>
                    {step.tool && (
                      <span style={styles.stepTool}>
                        {step.tool}
                      </span>
                    )}
                  </div>

                  {isStepExpanded && step.details && (
                    <div style={styles.stepDetails}>
                      <ul style={styles.bulletList}>
                        {step.details.map((detail, i) => (
                          <li key={i} style={styles.bulletItem}>
                            <span style={styles.bulletDot}>●</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (trace.length === 0) {
    return (
      <div style={styles.emptyState}>
        No reasoning trace available
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {renderPhaseGroup('retrieve')}
      {renderPhaseGroup('analyze')}
      {renderPhaseGroup('synthesize')}
    </div>
  )
}
