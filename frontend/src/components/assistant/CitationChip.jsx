import React, { useState } from 'react'

export default function CitationChip({ 
  citationId, 
  number, 
  quote, 
  source, 
  location,
  isHighlighted,
  onClick 
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  const styles = {
    chip: {
      display: 'inline-block',
      background: isHighlighted ? '#fef3c7' : '#dbeafe',
      color: '#1e40af',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
      cursor: 'pointer',
      marginLeft: '2px',
      marginRight: '2px',
      position: 'relative',
      transition: 'all 0.2s',
      border: isHighlighted ? '2px solid #f59e0b' : '1px solid #93c5fd',
      verticalAlign: 'super',
      lineHeight: '1'
    },
    tooltip: {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '8px',
      background: '#1e293b',
      color: 'white',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      minWidth: '300px',
      maxWidth: '400px',
      fontSize: '13px',
      lineHeight: '1.5',
      pointerEvents: 'none'
    },
    tooltipQuote: {
      fontStyle: 'italic',
      marginBottom: '8px',
      paddingLeft: '8px',
      borderLeft: '3px solid #60a5fa',
      color: '#e0e7ff'
    },
    tooltipSource: {
      fontSize: '12px',
      color: '#94a3b8',
      fontWeight: '600'
    },
    tooltipArrow: {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid #1e293b'
    }
  }

  return (
    <span
      style={styles.chip}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => onClick && onClick(citationId)}
      onMouseOver={(e) => {
        if (!isHighlighted) {
          e.currentTarget.style.background = '#bfdbfe'
        }
      }}
      onMouseOut={(e) => {
        if (!isHighlighted) {
          e.currentTarget.style.background = '#dbeafe'
        }
      }}
    >
      [{number}]
      {showTooltip && (
        <div style={styles.tooltip}>
          <div style={styles.tooltipQuote}>
            "{quote}"
          </div>
          <div style={styles.tooltipSource}>
            {source} {location && `§${location}`}
          </div>
          <div style={styles.tooltipArrow} />
        </div>
      )}
    </span>
  )
}
