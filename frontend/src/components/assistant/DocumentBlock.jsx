import React, { useState, useEffect, useRef } from 'react'
import tokens from '../../styles/designTokens'
import { parseMarkdownWithCitations } from '../../utils/markdown'

export default function DocumentBlock({
  title,
  content,
  timestamp,
  artifactType,
  citations = [],
  onCitationHover,
  onCitationClick,
  onInsertAction,
  isUser = false
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [showInsertMenu, setShowInsertMenu] = useState(false)
  const contentRef = useRef(null)

  // Parse markdown content with citations
  const { html } = parseMarkdownWithCitations(content, citations)

  // Add click handlers to citation elements after render
  useEffect(() => {
    if (!contentRef.current) return
    
    const citationElements = contentRef.current.querySelectorAll('.citation')
    citationElements.forEach(el => {
      const citationNum = el.getAttribute('data-citation')
      const citation = citations[parseInt(citationNum) - 1]
      
      el.addEventListener('mouseenter', () => onCitationHover && onCitationHover(citation))
      el.addEventListener('mouseleave', () => onCitationHover && onCitationHover(null))
      el.addEventListener('click', () => onCitationClick && onCitationClick(citation))
    })
    
    return () => {
      citationElements.forEach(el => {
        el.removeEventListener('mouseenter', () => {})
        el.removeEventListener('mouseleave', () => {})
        el.removeEventListener('click', () => {})
      })
    }
  }, [html, citations, onCitationHover, onCitationClick])

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

  const styles = {
    blockContainer: {
      position: 'relative',
      marginBottom: tokens.spacing.lg
    },
    block: {
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.md,
      padding: tokens.spacing.lg,
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      maxWidth: isUser ? '100%' : '100%'
    },
    blockHovered: {
      borderColor: tokens.colors.neutral[300],
      boxShadow: tokens.shadows.xs
    },
    dragHandle: {
      position: 'absolute',
      left: `-${tokens.spacing.lg}`,
      top: tokens.spacing.lg,
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'grab',
      opacity: isHovered ? 1 : 0,
      transition: `opacity ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      color: tokens.colors.neutral[400]
    },
    dragDots: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 3px)',
      gridTemplateRows: 'repeat(3, 3px)',
      gap: '2px'
    },
    dot: {
      width: '3px',
      height: '3px',
      background: 'currentColor',
      borderRadius: '50%'
    },
    header: {
      marginBottom: tokens.spacing.sm
    },
    title: {
      fontSize: tokens.typography.fontSize.h3,
      lineHeight: tokens.typography.lineHeight.h3,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[900],
      margin: 0,
      marginBottom: tokens.spacing.xs
    },
    meta: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500],
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    metaSeparator: {
      color: tokens.colors.neutral[400]
    },
    content: {
      fontSize: tokens.typography.fontSize.base,
      lineHeight: tokens.typography.lineHeight.base,
      color: tokens.colors.neutral[700],
      maxWidth: '72ch',
      wordWrap: 'break-word'
    },
    citation: {
      color: tokens.colors.primary[600],
      cursor: 'pointer',
      fontWeight: tokens.typography.fontWeight.semibold,
      fontSize: '0.85em',
      transition: `color ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      textDecoration: 'none',
      ':hover': {
        color: tokens.colors.primary[700],
        textDecoration: 'underline'
      }
    },
    insertButton: {
      position: 'absolute',
      left: '50%',
      bottom: `-${tokens.spacing.md}`,
      transform: 'translateX(-50%)',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      opacity: isHovered ? 1 : 0,
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      fontSize: '14px',
      color: tokens.colors.neutral[600],
      zIndex: 1
    },
    insertMenu: {
      position: 'absolute',
      left: '50%',
      bottom: `-${tokens.spacing.md}`,
      transform: 'translate(-50%, 100%)',
      marginTop: tokens.spacing.xs,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      boxShadow: tokens.shadows.md,
      padding: tokens.spacing.xs,
      minWidth: '180px',
      zIndex: 10
    },
    menuItem: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700],
      cursor: 'pointer',
      borderRadius: tokens.borderRadius.sm,
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      background: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left'
    },
    userBlock: {
      background: tokens.colors.neutral[50],
      borderColor: tokens.colors.neutral[200]
    }
  }

  return (
    <div style={styles.blockContainer}>
      <div
        style={{
          ...styles.block,
          ...(isHovered ? styles.blockHovered : {}),
          ...(isUser ? styles.userBlock : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setShowInsertMenu(false)
        }}
      >
        {/* Drag Handle */}
        {!isUser && (
          <div style={styles.dragHandle}>
            <div style={styles.dragDots}>
              <div style={styles.dot} />
              <div style={styles.dot} />
              <div style={styles.dot} />
              <div style={styles.dot} />
              <div style={styles.dot} />
              <div style={styles.dot} />
            </div>
          </div>
        )}

        {/* Header */}
        {(title || timestamp || artifactType) && (
          <div style={styles.header}>
            {title && <h3 style={styles.title}>{title}</h3>}
            {(timestamp || artifactType) && (
              <div style={styles.meta}>
                {timestamp && <span>{formatTimestamp(timestamp)}</span>}
                {timestamp && artifactType && (
                  <span style={styles.metaSeparator}>•</span>
                )}
                {artifactType && <span>{artifactType}</span>}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div 
          ref={contentRef}
          style={styles.content}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Insert Action Button */}
      {!isUser && (
        <>
          <button
            style={styles.insertButton}
            onClick={() => setShowInsertMenu(!showInsertMenu)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tokens.colors.neutral[50]
              e.currentTarget.style.borderColor = tokens.colors.neutral[300]
              e.currentTarget.style.color = tokens.colors.neutral[900]
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = tokens.colors.surface1
              e.currentTarget.style.borderColor = tokens.borders.color
              e.currentTarget.style.color = tokens.colors.neutral[600]
            }}
          >
            +
          </button>

          {/* Insert Menu */}
          {showInsertMenu && (
            <div style={styles.insertMenu}>
              <button
                style={styles.menuItem}
                onClick={() => {
                  onInsertAction && onInsertAction('follow-up')
                  setShowInsertMenu(false)
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[50]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span>💬</span>
                <span>Ask follow-up</span>
              </button>
              <button
                style={styles.menuItem}
                onClick={() => {
                  onInsertAction && onInsertAction('draft')
                  setShowInsertMenu(false)
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[50]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span>✍️</span>
                <span>Create draft</span>
              </button>
              <button
                style={styles.menuItem}
                onClick={() => {
                  onInsertAction && onInsertAction('table')
                  setShowInsertMenu(false)
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[50]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <span>📋</span>
                <span>Create table</span>
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Markdown Styles */}
      <style>{`
        .citation {
          color: ${tokens.colors.primary[600]};
          cursor: pointer;
          font-weight: ${tokens.typography.fontWeight.semibold};
          font-size: 0.85em;
          text-decoration: none;
          transition: color ${tokens.motion.duration.fast} ${tokens.motion.easing.out};
        }
        .citation:hover {
          color: ${tokens.colors.primary[700]};
          text-decoration: underline;
        }
        
        /* Markdown element styles */
        .content h1, .content h2, .content h3, .content h4 {
          margin: ${tokens.spacing.md} 0 ${tokens.spacing.sm} 0;
          font-weight: ${tokens.typography.fontWeight.semibold};
          color: ${tokens.colors.neutral[900]};
          line-height: 1.3;
        }
        .content h1 { font-size: ${tokens.typography.fontSize.h1}; }
        .content h2 { font-size: ${tokens.typography.fontSize.h2}; }
        .content h3 { font-size: ${tokens.typography.fontSize.h3}; }
        .content h4 { font-size: ${tokens.typography.fontSize.base}; }
        
        .content p {
          margin: ${tokens.spacing.sm} 0;
          line-height: ${tokens.typography.lineHeight.base};
        }
        
        .content strong {
          font-weight: ${tokens.typography.fontWeight.semibold};
          color: ${tokens.colors.neutral[900]};
        }
        
        .content em {
          font-style: italic;
        }
        
        .content code {
          background: ${tokens.colors.neutral[100]};
          padding: 2px 6px;
          border-radius: 3px;
          font-family: ${tokens.typography.fontFamily.mono};
          font-size: 0.9em;
          color: ${tokens.colors.neutral[800]};
        }
        
        .content pre {
          background: ${tokens.colors.neutral[50]};
          border: 1px solid ${tokens.colors.neutral[200]};
          border-radius: ${tokens.borderRadius.sm};
          padding: ${tokens.spacing.md};
          overflow-x: auto;
          margin: ${tokens.spacing.md} 0;
        }
        
        .content pre code {
          background: none;
          padding: 0;
          font-size: ${tokens.typography.fontSize.small};
        }
        
        .content ul, .content ol {
          margin: ${tokens.spacing.sm} 0;
          padding-left: ${tokens.spacing.lg};
        }
        
        .content li {
          margin: ${tokens.spacing.xs} 0;
          line-height: ${tokens.typography.lineHeight.base};
        }
        
        .content blockquote {
          border-left: 3px solid ${tokens.colors.neutral[300]};
          padding-left: ${tokens.spacing.md};
          margin: ${tokens.spacing.md} 0;
          color: ${tokens.colors.neutral[600]};
          font-style: italic;
        }
        
        .content hr {
          border: none;
          border-top: 1px solid ${tokens.colors.neutral[200]};
          margin: ${tokens.spacing.lg} 0;
        }
        
        .content a {
          color: ${tokens.colors.primary[600]};
          text-decoration: none;
          transition: color ${tokens.motion.duration.fast} ${tokens.motion.easing.out};
        }
        
        .content a:hover {
          color: ${tokens.colors.primary[700]};
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
