import React, { useState, useRef, useEffect } from 'react'
import tokens from '../../styles/designTokens'

export default function DraftTab({ 
  draftContent = '', 
  setDraftContent,
  originalDoc = null,
  onInsertPrecedent
}) {
  const [title, setTitle] = useState('Untitled Draft')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [redlineEnabled, setRedlineEnabled] = useState(false)
  const [lastSaved, setLastSaved] = useState(new Date())
  const [isSaving, setIsSaving] = useState(false)
  const [compareWidth, setCompareWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  
  const titleInputRef = useRef(null)
  const editorRef = useRef(null)
  const autosaveTimer = useRef(null)

  // Auto-save functionality
  useEffect(() => {
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current)
    }
    
    autosaveTimer.current = setTimeout(() => {
      handleAutoSave()
    }, 2000)
    
    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current)
      }
    }
  }, [draftContent, title])

  const handleAutoSave = () => {
    setIsSaving(true)
    // Simulate save
    setTimeout(() => {
      setLastSaved(new Date())
      setIsSaving(false)
    }, 500)
  }

  const handleTitleClick = () => {
    setIsEditingTitle(true)
    setTimeout(() => {
      titleInputRef.current?.focus()
      titleInputRef.current?.select()
    }, 0)
  }

  const handleTitleBlur = () => {
    setIsEditingTitle(false)
    if (!title.trim()) {
      setTitle('Untitled Draft')
    }
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleBlur()
    }
    if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }

  const applyFormat = (format) => {
    document.execCommand(format, false, null)
    editorRef.current?.focus()
  }

  const insertHeading = () => {
    document.execCommand('formatBlock', false, '<h2>')
    editorRef.current?.focus()
  }

  const insertTable = () => {
    const table = `
      <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 1</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 2</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 3</td>
          <td style="border: 1px solid #ddd; padding: 8px;">Cell 4</td>
        </tr>
      </table>
    `
    document.execCommand('insertHTML', false, table)
    editorRef.current?.focus()
  }

  const insertQuote = () => {
    document.execCommand('formatBlock', false, '<blockquote>')
    editorRef.current?.focus()
  }

  const getWordCount = () => {
    const text = draftContent.replace(/<[^>]*>/g, '').trim()
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  const getCitationCount = () => {
    const matches = draftContent.match(/\[\d+\]/g)
    return matches ? matches.length : 0
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  // Generate diff for redline view
  const generateRedline = () => {
    if (!originalDoc || !originalDoc.content) return draftContent
    
    const original = originalDoc.content.replace(/<[^>]*>/g, '')
    const current = draftContent.replace(/<[^>]*>/g, '')
    
    // Simple word-by-word diff
    const originalWords = original.split(/\s+/)
    const currentWords = current.split(/\s+/)
    
    let result = []
    let i = 0, j = 0
    
    while (i < originalWords.length || j < currentWords.length) {
      if (i >= originalWords.length) {
        // Insertion
        result.push(`<span style="background: ${tokens.colors.success[100]}; padding: 2px 4px; border-radius: 3px;">${currentWords[j]}</span>`)
        j++
      } else if (j >= currentWords.length) {
        // Deletion
        result.push(`<span style="background: ${tokens.colors.error[100]}; padding: 2px 4px; border-radius: 3px; text-decoration: line-through;">${originalWords[i]}</span>`)
        i++
      } else if (originalWords[i] === currentWords[j]) {
        // No change
        result.push(currentWords[j])
        i++
        j++
      } else {
        // Changed word
        result.push(`<span style="background: ${tokens.colors.error[100]}; padding: 2px 4px; border-radius: 3px; text-decoration: line-through;">${originalWords[i]}</span>`)
        result.push(`<span style="background: ${tokens.colors.success[100]}; padding: 2px 4px; border-radius: 3px;">${currentWords[j]}</span>`)
        i++
        j++
      }
    }
    
    return result.join(' ')
  }

  const handleMouseDownResize = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = (e) => {
    if (isResizing) {
      const container = document.getElementById('draft-container')
      if (container) {
        const containerRect = container.getBoundingClientRect()
        const newWidth = containerRect.right - e.clientX
        if (newWidth >= 280 && newWidth <= 600) {
          setCompareWidth(newWidth)
        }
      }
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isResizing])

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: tokens.colors.surface0,
      position: 'relative',
      userSelect: isResizing ? 'none' : 'auto'
    },
    mainContent: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      position: 'relative'
    },
    editorSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: '400px'
    },
    header: {
      padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      background: tokens.colors.surface1
    },
    titleContainer: {
      marginBottom: tokens.spacing.sm
    },
    title: {
      fontSize: tokens.typography.fontSize.h1,
      lineHeight: tokens.typography.lineHeight.h1,
      fontWeight: tokens.typography.fontWeight.bold,
      color: tokens.colors.neutral[900],
      border: 'none',
      background: 'transparent',
      padding: `${tokens.spacing.xs} 0`,
      width: '100%',
      outline: 'none',
      cursor: isEditingTitle ? 'text' : 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    titleEditing: {
      borderBottom: `2px solid ${tokens.colors.primary[600]}`,
      cursor: 'text'
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      background: tokens.colors.surface1,
      flexWrap: 'wrap'
    },
    toolbarGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      padding: `0 ${tokens.spacing.xs}`,
      borderRight: `${tokens.borders.width} solid ${tokens.borders.divider}`
    },
    toolbarButton: {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `${tokens.borders.width} solid transparent`,
      borderRadius: tokens.borderRadius.sm,
      background: 'transparent',
      cursor: 'pointer',
      fontSize: tokens.typography.fontSize.base,
      color: tokens.colors.neutral[700],
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      fontWeight: tokens.typography.fontWeight.semibold,
      outline: 'none'
    },
    toolbarDropdown: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      background: tokens.colors.surface1,
      cursor: 'pointer',
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700],
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      outline: 'none'
    },
    editorWrapper: {
      flex: 1,
      overflow: 'auto',
      padding: `${tokens.spacing.xl} ${tokens.spacing.xl}`,
      background: tokens.colors.surface1
    },
    editor: {
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '500px',
      fontSize: tokens.typography.fontSize.base,
      lineHeight: tokens.typography.lineHeight.base,
      color: tokens.colors.neutral[900],
      outline: 'none',
      padding: tokens.spacing.md,
      border: `${tokens.borders.width} solid transparent`,
      borderRadius: tokens.borderRadius.sm,
      transition: `border-color ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    resizer: {
      width: '4px',
      background: 'transparent',
      cursor: 'col-resize',
      flexShrink: 0,
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      position: 'relative',
      zIndex: 10
    },
    resizerActive: {
      background: tokens.colors.primary[600]
    },
    comparePanel: {
      width: `${compareWidth}px`,
      background: tokens.colors.surface1,
      borderLeft: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden'
    },
    compareHeader: {
      padding: tokens.spacing.md,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: tokens.colors.neutral[50]
    },
    compareTitle: {
      fontSize: tokens.typography.fontSize.small,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[900]
    },
    redlineToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[700]
    },
    toggleSwitch: {
      width: '40px',
      height: '20px',
      background: redlineEnabled ? tokens.colors.primary[600] : tokens.colors.neutral[300],
      borderRadius: '10px',
      position: 'relative',
      cursor: 'pointer',
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`
    },
    toggleKnob: {
      width: '16px',
      height: '16px',
      background: '#ffffff',
      borderRadius: '50%',
      position: 'absolute',
      top: '2px',
      left: redlineEnabled ? '22px' : '2px',
      transition: `left ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      boxShadow: tokens.shadows.xs
    },
    compareContent: {
      flex: 1,
      overflow: 'auto',
      padding: tokens.spacing.md,
      fontSize: tokens.typography.fontSize.small,
      lineHeight: tokens.typography.lineHeight.base,
      color: tokens.colors.neutral[700]
    },
    footer: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
      borderTop: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      background: tokens.colors.surface1,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.lg,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[600]
    },
    footerItem: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    saveStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      fontWeight: tokens.typography.fontWeight.medium,
      color: isSaving ? tokens.colors.neutral[500] : tokens.colors.success[700]
    },
    saveDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: isSaving ? tokens.colors.neutral[400] : tokens.colors.success[600]
    },
    compareButton: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      background: showCompare ? tokens.colors.primary[600] : tokens.colors.surface1,
      color: showCompare ? '#ffffff' : tokens.colors.neutral[700],
      border: `${tokens.borders.width} solid ${showCompare ? tokens.colors.primary[600] : tokens.borders.color}`,
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.small,
      fontWeight: tokens.typography.fontWeight.medium,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      marginLeft: 'auto',
      outline: 'none'
    },
    legend: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.md,
      padding: tokens.spacing.sm,
      background: tokens.colors.neutral[50],
      borderRadius: tokens.borderRadius.sm,
      marginBottom: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.xs
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    legendSwatch: {
      width: '16px',
      height: '16px',
      borderRadius: '3px'
    }
  }

  return (
    <div id="draft-container" style={styles.container}>
      <div style={styles.mainContent}>
        {/* Editor Section */}
        <div style={styles.editorSection}>
          {/* Header with Title */}
          <div style={styles.header}>
            <div style={styles.titleContainer}>
              {isEditingTitle ? (
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={handleTitleKeyDown}
                  style={{...styles.title, ...styles.titleEditing}}
                  placeholder="Enter title..."
                />
              ) : (
                <div
                  style={styles.title}
                  onClick={handleTitleClick}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = tokens.colors.primary[600]
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = tokens.colors.neutral[900]
                  }}
                >
                  {title}
                </div>
              )}
            </div>
          </div>

          {/* Minimal Toolbar */}
          <div style={styles.toolbar}>
            <div style={styles.toolbarGroup}>
              <button
                style={styles.toolbarButton}
                onClick={() => applyFormat('bold')}
                title="Bold (Ctrl+B)"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[100]
                  e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <strong>B</strong>
              </button>
              <button
                style={styles.toolbarButton}
                onClick={() => applyFormat('italic')}
                title="Italic (Ctrl+I)"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[100]
                  e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <em>I</em>
              </button>
            </div>

            <div style={styles.toolbarGroup}>
              <button
                style={styles.toolbarButton}
                onClick={insertHeading}
                title="Heading"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[100]
                  e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                H
              </button>
            </div>

            <div style={styles.toolbarGroup}>
              <button
                style={styles.toolbarButton}
                onClick={() => applyFormat('insertUnorderedList')}
                title="Bullet List"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[100]
                  e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                ≡
              </button>
            </div>

            <div style={styles.toolbarGroup}>
              <button
                style={styles.toolbarButton}
                onClick={insertTable}
                title="Insert Table"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[100]
                  e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                ⊞
              </button>
              <button
                style={styles.toolbarButton}
                onClick={insertQuote}
                title="Quote"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[100]
                  e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                "
              </button>
            </div>

            <div style={styles.toolbarGroup}>
              <button
                style={styles.toolbarDropdown}
                onClick={() => onInsertPrecedent && onInsertPrecedent()}
                title="Insert Precedent"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.neutral[50]
                  e.currentTarget.style.borderColor = tokens.colors.neutral[300]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = tokens.colors.surface1
                  e.currentTarget.style.borderColor = tokens.borders.color
                }}
              >
                <span>Insert</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>
            </div>
          </div>

          {/* Editor */}
          <div style={styles.editorWrapper}>
            <div
              ref={editorRef}
              contentEditable
              style={styles.editor}
              dangerouslySetInnerHTML={{ __html: draftContent }}
              onInput={(e) => setDraftContent(e.currentTarget.innerHTML)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = tokens.colors.primary[600]
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
              }}
            />
          </div>
        </div>

        {/* Resizer */}
        {showCompare && (
          <div
            style={{
              ...styles.resizer,
              ...(isResizing ? styles.resizerActive : {})
            }}
            onMouseDown={handleMouseDownResize}
            onMouseOver={(e) => {
              if (!isResizing) {
                e.currentTarget.style.background = tokens.colors.neutral[300]
              }
            }}
            onMouseOut={(e) => {
              if (!isResizing) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          />
        )}

        {/* Compare Panel */}
        {showCompare && (
          <div style={styles.comparePanel}>
            <div style={styles.compareHeader}>
              <div style={styles.compareTitle}>Compare</div>
              <div style={styles.redlineToggle}>
                <span>Redline</span>
                <div
                  style={styles.toggleSwitch}
                  onClick={() => setRedlineEnabled(!redlineEnabled)}
                >
                  <div style={styles.toggleKnob} />
                </div>
              </div>
            </div>

            {redlineEnabled && (
              <div style={styles.legend}>
                <div style={styles.legendItem}>
                  <div style={{
                    ...styles.legendSwatch,
                    background: tokens.colors.success[100]
                  }} />
                  <span>Inserted</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{
                    ...styles.legendSwatch,
                    background: tokens.colors.error[100]
                  }} />
                  <span>Deleted</span>
                </div>
              </div>
            )}

            <div style={styles.compareContent}>
              {redlineEnabled ? (
                <div dangerouslySetInnerHTML={{ __html: generateRedline() }} />
              ) : (
                <div dangerouslySetInnerHTML={{ 
                  __html: originalDoc?.content || '<em>No original document</em>' 
                }} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.saveStatus}>
          <div style={styles.saveDot} />
          <span>{isSaving ? 'Saving...' : `Saved • ${formatTime(lastSaved)}`}</span>
        </div>
        <div style={styles.footerItem}>
          <span>{getWordCount()} words</span>
        </div>
        <div style={styles.footerItem}>
          <span>{getCitationCount()} citations</span>
        </div>
        <button
          style={styles.compareButton}
          onClick={() => setShowCompare(!showCompare)}
          onMouseOver={(e) => {
            if (!showCompare) {
              e.currentTarget.style.background = tokens.colors.neutral[50]
            }
          }}
          onMouseOut={(e) => {
            if (!showCompare) {
              e.currentTarget.style.background = tokens.colors.surface1
            }
          }}
        >
          {showCompare ? 'Hide' : 'Show'} Compare
        </button>
      </div>
    </div>
  )
}
