import React, { useState, useRef } from 'react'
import tokens from '../../styles/designTokens'

export default function Composer({ onSend, selectedMatter, docsInScope, onDocumentsUploaded }) {
  const [inputValue, setInputValue] = useState('')
  const [showToolsMenu, setShowToolsMenu] = useState(false)
  const [attachedDocs, setAttachedDocs] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  const tools = [
    { id: 'analyze', label: 'Analyze Docs', icon: '📊' },
    { id: 'draft', label: 'Draft Clause', icon: '✍️' },
    { id: 'table', label: 'Create Table', icon: '📋' },
    { id: 'critique', label: 'Critique Language', icon: '🔍' }
  ]

  const quickTools = [
    { id: 'eligibility', label: 'EITC Eligibility', icon: '✅', workflow: 'eitc-eligibility' },
    { id: 'notice', label: 'IRS Notice Reply', icon: '📮', template: 'irs-notice-reply' }
  ]

  const handleToolSelect = (tool) => {
    setInputValue(`/${tool.id} `)
    setShowToolsMenu(false)
    inputRef.current?.focus()
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    onSend(inputValue)
    setInputValue('')
    setAttachedDocs([])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    if (e.key === '/' && inputValue === '') {
      e.preventDefault()
      setShowToolsMenu(true)
    }
    if (e.key === 'Escape') {
      setShowToolsMenu(false)
    }
  }

  const handleFileSelect = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

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

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const data = await response.json()
        uploadedDocs.push(data.document)
      }

      // Notify parent component about uploaded documents
      if (onDocumentsUploaded) {
        onDocumentsUploaded(uploadedDocs)
      }

      alert(`Successfully uploaded ${uploadedDocs.length} document(s)!`)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const styles = {
    container: {
      padding: tokens.spacing.md,
      borderTop: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      background: tokens.colors.surface1
    },
    composer: {
      display: 'flex',
      flexDirection: 'column',
      gap: tokens.spacing.sm
    },
    scopeChips: {
      display: 'flex',
      gap: tokens.spacing.xs,
      flexWrap: 'wrap'
    },
    chip: {
      padding: `4px ${tokens.spacing.sm}`,
      background: tokens.colors.neutral[100],
      color: tokens.colors.neutral[700],
      borderRadius: tokens.borderRadius.full,
      fontSize: tokens.typography.fontSize.xs,
      fontWeight: tokens.typography.fontWeight.semibold,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    chipClose: {
      cursor: 'pointer',
      fontWeight: '700'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      ...tokens.components.input,
      width: '100%',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: tokens.typography.fontFamily.base
    },
    toolsMenu: {
      position: 'absolute',
      bottom: '100%',
      left: 0,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.md,
      boxShadow: tokens.shadows.sm,
      marginBottom: tokens.spacing.xs,
      minWidth: '200px',
      zIndex: 10
    },
    toolItem: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      fontSize: tokens.typography.fontSize.base,
      transition: `background ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
      color: tokens.colors.neutral[700]
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    attachButton: {
      ...tokens.components.button.secondary,
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      fontSize: tokens.typography.fontSize.small,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    sendButton: {
      ...tokens.components.button.primary,
      padding: `${tokens.spacing.xs} ${tokens.spacing.lg}`
    },
    sendButtonDisabled: {
      background: tokens.colors.neutral[300],
      cursor: 'not-allowed',
      color: tokens.colors.neutral[500]
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.composer}>
        {/* Scope Chips */}
        {(selectedMatter || attachedDocs.length > 0) && (
          <div style={styles.scopeChips}>
            {selectedMatter && (
              <div style={styles.chip}>
                📁 {selectedMatter}
              </div>
            )}
            {attachedDocs.map((doc, idx) => (
              <div key={idx} style={styles.chip}>
                📄 {doc.name}
                <span 
                  style={styles.chipClose}
                  onClick={() => setAttachedDocs(prev => prev.filter((_, i) => i !== idx))}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={styles.inputWrapper}>
          {showToolsMenu && (
            <div style={styles.toolsMenu}>
              {tools.map(tool => (
                <div
                  key={tool.id}
                  style={styles.toolItem}
                  onClick={() => handleToolSelect(tool)}
                  onMouseOver={(e) => e.currentTarget.style.background = tokens.colors.neutral[50]}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{tool.icon}</span>
                  <span>{tool.label}</span>
                </div>
              ))}
            </div>
          )}
          <textarea
            ref={inputRef}
            style={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              e.target.style.borderColor = tokens.colors.primary[600]
              e.target.style.boxShadow = `0 0 0 3px ${tokens.colors.primary[600]}20`
            }}
            onBlur={(e) => {
              e.target.style.borderColor = tokens.borders.color
              e.target.style.boxShadow = 'none'
            }}
            placeholder="Ask a question or type / for tools..."
          />
        </div>

        {/* Quick Tools */}
        <div style={{ display: 'flex', gap: tokens.spacing.xs, flexWrap: 'wrap' }}>
          {quickTools.map(tool => (
            <button
              key={tool.id}
              style={{
                ...tokens.components.button.secondary,
                padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                fontSize: tokens.typography.fontSize.xs,
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.xs
              }}
              onClick={() => {
                if (tool.workflow) {
                  // Open workflow in Workflows tab
                  alert(`Opening ${tool.label} workflow...`)
                  window.dispatchEvent(new CustomEvent('openWorkflow', { detail: { workflowId: tool.workflow } }))
                } else if (tool.template) {
                  // Load template in Draft tab
                  alert(`Loading ${tool.label} template...`)
                  window.dispatchEvent(new CustomEvent('loadTemplate', { detail: { templateId: tool.template } }))
                }
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.neutral[50]
                e.currentTarget.style.borderColor = tokens.colors.neutral[300]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = tokens.colors.surface1
                e.currentTarget.style.borderColor = tokens.borders.color
              }}
            >
              <span>{tool.icon}</span>
              <span>{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button 
            style={styles.attachButton}
            onClick={handleAttachClick}
            disabled={isUploading}
            onMouseOver={(e) => !isUploading && (e.target.style.background = tokens.colors.neutral[50])}
            onMouseOut={(e) => !isUploading && (e.target.style.background = tokens.colors.surface1)}
          >
            {isUploading ? '⏳ Uploading...' : '📎 Attach Docs'}
          </button>
          <button
            style={{
              ...styles.sendButton,
              ...(inputValue.trim() ? {} : styles.sendButtonDisabled)
            }}
            onClick={handleSend}
            disabled={!inputValue.trim()}
            onMouseOver={(e) => inputValue.trim() && (e.target.style.background = tokens.colors.primary[700])}
            onMouseOut={(e) => inputValue.trim() && (e.target.style.background = tokens.colors.primary[600])}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
