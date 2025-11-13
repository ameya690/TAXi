import React, { useState, useRef, useEffect } from 'react'
import tokens from '../../styles/designTokens'

export default function Composer({ 
  onSend, 
  selectedMatter, 
  docsInScope = [], 
  onDocumentsUploaded,
  isThinking = false 
}) {
  const [inputValue, setInputValue] = useState('')
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuFilter, setSlashMenuFilter] = useState('')
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0)
  const [rows, setRows] = useState(1)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  const slashCommands = [
    { 
      id: 'analyze', 
      label: 'Analyze Docs', 
      icon: '📊',
      description: 'Analyze uploaded documents',
      command: '/analyze'
    },
    { 
      id: 'draft', 
      label: 'Draft Letter', 
      icon: '✍️',
      description: 'Draft a formal letter or document',
      command: '/draft'
    },
    { 
      id: 'table', 
      label: 'Create Table', 
      icon: '📋',
      description: 'Create a structured table',
      command: '/table'
    },
    { 
      id: 'critique', 
      label: 'Critique Language', 
      icon: '🔍',
      description: 'Review and improve writing',
      command: '/critique'
    },
    { 
      id: 'eligibility', 
      label: 'Open Eligibility', 
      icon: '✅',
      description: 'EITC eligibility calculator (legacy)',
      command: '/eligibility',
      legacy: true
    }
  ]

  // Filter commands based on input
  const filteredCommands = slashCommands.filter(cmd => {
    if (!slashMenuFilter) return true
    const search = slashMenuFilter.toLowerCase()
    return (
      cmd.label.toLowerCase().includes(search) ||
      cmd.command.toLowerCase().includes(search) ||
      cmd.description.toLowerCase().includes(search)
    )
  })

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      const scrollHeight = inputRef.current.scrollHeight
      const lineHeight = 24 // 24px line height
      const newRows = Math.min(Math.max(Math.ceil(scrollHeight / lineHeight), 1), 6)
      setRows(newRows)
    }
  }, [inputValue])

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)

    // Check for slash command trigger
    const cursorPos = e.target.selectionStart
    const textBeforeCursor = value.substring(0, cursorPos)
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/')
    
    if (lastSlashIndex !== -1 && lastSlashIndex === textBeforeCursor.length - 1) {
      // Just typed /
      setShowSlashMenu(true)
      setSlashMenuFilter('')
      setSelectedCommandIndex(0)
    } else if (lastSlashIndex !== -1 && showSlashMenu) {
      // Typing after /
      const filter = textBeforeCursor.substring(lastSlashIndex + 1)
      setSlashMenuFilter(filter)
      setSelectedCommandIndex(0)
    } else if (!textBeforeCursor.includes('/')) {
      setShowSlashMenu(false)
    }
  }

  const handleKeyDown = (e) => {
    if (showSlashMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedCommandIndex(prev => 
          Math.min(prev + 1, filteredCommands.length - 1)
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedCommandIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filteredCommands.length > 0) {
        e.preventDefault()
        selectCommand(filteredCommands[selectedCommandIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setShowSlashMenu(false)
      }
      return
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectCommand = (command) => {
    // Replace /filter with /command
    const cursorPos = inputRef.current.selectionStart
    const textBeforeCursor = inputValue.substring(0, cursorPos)
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/')
    const textAfterCursor = inputValue.substring(cursorPos)
    
    const newValue = inputValue.substring(0, lastSlashIndex) + command.command + ' ' + textAfterCursor
    setInputValue(newValue)
    setShowSlashMenu(false)
    
    // Focus and set cursor position
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = lastSlashIndex + command.command.length + 1
        inputRef.current.focus()
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    onSend(inputValue)
    setInputValue('')
    setRows(1)
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const uploadedDocs = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('matter', selectedMatter || 'general')

        const response = await fetch('/api/assistant/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          uploadedDocs.push(data.document)
        }
      }

      if (onDocumentsUploaded && uploadedDocs.length > 0) {
        onDocumentsUploaded(uploadedDocs)
      }
      
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const styles = {
    container: {
      position: 'relative',
      background: tokens.colors.surface1,
      borderTop: `${tokens.borders.width} solid ${tokens.borders.divider}`
    },
    thinkingStrip: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      background: tokens.colors.primary[50],
      borderBottom: `${tokens.borders.width} solid ${tokens.colors.primary[200]}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.primary[700]
    },
    thinkingDots: {
      display: 'flex',
      gap: '4px'
    },
    thinkingDot: {
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: tokens.colors.primary[600],
      animation: 'pulse 1.4s infinite ease-in-out'
    },
    composerRow: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: tokens.spacing.sm,
      padding: tokens.spacing.md,
      position: 'relative'
    },
    scopeChips: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      flexShrink: 0
    },
    chip: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      background: tokens.colors.neutral[100],
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.full,
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[700],
      fontWeight: tokens.typography.fontWeight.medium,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap'
    },
    inputWrapper: {
      flex: 1,
      position: 'relative',
      minWidth: 0
    },
    textarea: {
      width: '100%',
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.md,
      fontSize: tokens.typography.fontSize.base,
      lineHeight: tokens.typography.lineHeight.base,
      fontFamily: tokens.typography.fontFamily.base,
      resize: 'none',
      outline: 'none',
      transition: `border-color ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      background: tokens.colors.surface1,
      color: tokens.colors.neutral[900],
      minHeight: '40px',
      maxHeight: '144px' // 6 lines
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      flexShrink: 0
    },
    iconButton: {
      width: '36px',
      height: '36px',
      borderRadius: tokens.borderRadius.sm,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      background: tokens.colors.surface1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      fontSize: '16px',
      color: tokens.colors.neutral[600],
      outline: 'none'
    },
    sendButton: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      background: tokens.colors.primary[600],
      color: '#ffffff',
      border: 'none',
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      outline: 'none'
    },
    sendButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    slashMenu: {
      position: 'absolute',
      bottom: '100%',
      left: 0,
      marginBottom: tokens.spacing.xs,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.md,
      boxShadow: tokens.shadows.lg,
      minWidth: '320px',
      maxHeight: '280px',
      overflowY: 'auto',
      zIndex: 100
    },
    menuHeader: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[600],
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    menuItem: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
      cursor: 'pointer',
      transition: `background ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      borderLeft: '3px solid transparent'
    },
    menuItemSelected: {
      background: tokens.colors.neutral[50],
      borderLeftColor: tokens.colors.primary[600]
    },
    menuItemIcon: {
      fontSize: '18px',
      marginRight: tokens.spacing.sm
    },
    menuItemLabel: {
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.neutral[900],
      marginBottom: '2px'
    },
    menuItemDesc: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[600]
    },
    menuItemCommand: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500],
      fontFamily: tokens.typography.fontFamily.mono,
      marginLeft: tokens.spacing.xs
    },
    legacyBadge: {
      padding: '2px 6px',
      background: tokens.colors.neutral[200],
      borderRadius: tokens.borderRadius.sm,
      fontSize: '10px',
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[600],
      textTransform: 'uppercase',
      marginLeft: tokens.spacing.xs
    }
  }

  return (
    <div style={styles.container}>
      {/* Thinking Status Strip */}
      {isThinking && (
        <div style={styles.thinkingStrip}>
          <div style={styles.thinkingDots}>
            <div style={{...styles.thinkingDot, animationDelay: '0s'}} />
            <div style={{...styles.thinkingDot, animationDelay: '0.2s'}} />
            <div style={{...styles.thinkingDot, animationDelay: '0.4s'}} />
          </div>
          <span>Model is thinking…</span>
        </div>
      )}

      {/* Composer Row */}
      <div style={styles.composerRow}>
        {/* Scope Chips (Prefix) */}
        <div style={styles.scopeChips}>
          {selectedMatter && (
            <div style={styles.chip}>
              <span>📁</span>
              <span>{selectedMatter}</span>
            </div>
          )}
          {docsInScope && docsInScope.length > 0 && (
            <div style={styles.chip}>
              <span>📄</span>
              <span>{docsInScope.length} {docsInScope.length === 1 ? 'doc' : 'docs'}</span>
            </div>
          )}
        </div>

        {/* Input Wrapper */}
        <div style={styles.inputWrapper}>
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type / for commands or ask a question..."
            style={styles.textarea}
            rows={rows}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = tokens.colors.primary[600]
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = tokens.borders.color
            }}
          />

          {/* Slash Command Menu */}
          {showSlashMenu && filteredCommands.length > 0 && (
            <div style={styles.slashMenu}>
              <div style={styles.menuHeader}>Commands</div>
              {filteredCommands.map((cmd, index) => (
                <div
                  key={cmd.id}
                  style={{
                    ...styles.menuItem,
                    ...(index === selectedCommandIndex ? styles.menuItemSelected : {})
                  }}
                  onClick={() => selectCommand(cmd)}
                  onMouseEnter={() => setSelectedCommandIndex(index)}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={styles.menuItemIcon}>{cmd.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={styles.menuItemLabel}>{cmd.label}</span>
                        <span style={styles.menuItemCommand}>{cmd.command}</span>
                        {cmd.legacy && (
                          <span style={styles.legacyBadge}>Legacy</span>
                        )}
                      </div>
                      <div style={styles.menuItemDesc}>{cmd.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions (Suffix) */}
        <div style={styles.actions}>
          {/* Attach Button */}
          <button
            style={styles.iconButton}
            onClick={handleAttachClick}
            title="Attach files"
            onMouseOver={(e) => {
              e.currentTarget.style.background = tokens.colors.neutral[50]
              e.currentTarget.style.borderColor = tokens.colors.neutral[300]
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = tokens.colors.surface1
              e.currentTarget.style.borderColor = tokens.borders.color
            }}
          >
            📎
          </button>

          {/* Tools Button */}
          <button
            style={styles.iconButton}
            onClick={() => {
              setInputValue('/')
              setShowSlashMenu(true)
              inputRef.current?.focus()
            }}
            title="Commands (/)"
            onMouseOver={(e) => {
              e.currentTarget.style.background = tokens.colors.neutral[50]
              e.currentTarget.style.borderColor = tokens.colors.neutral[300]
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = tokens.colors.surface1
              e.currentTarget.style.borderColor = tokens.borders.color
            }}
          >
            /
          </button>

          {/* Send Button */}
          <button
            style={{
              ...styles.sendButton,
              ...((!inputValue.trim() || isThinking) ? styles.sendButtonDisabled : {})
            }}
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking}
            onMouseOver={(e) => {
              if (inputValue.trim() && !isThinking) {
                e.currentTarget.style.background = tokens.colors.primary[700]
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = tokens.colors.primary[600]
            }}
          >
            <span>Send</span>
            <span>↵</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt"
      />

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
}
