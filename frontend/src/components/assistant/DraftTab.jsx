import React, { useState, useEffect, useRef, useCallback } from 'react'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import { diffWords } from 'diff'
import ResizablePanel from '../ResizablePanel'

export default function DraftTab({ 
  draftContent, 
  setDraftContent, 
  originalDoc = null,
  onConvertFromChat = null,
  matter = null 
}) {
  const [showTrackChanges, setShowTrackChanges] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [draftMetadata, setDraftMetadata] = useState({
    title: 'Untitled Draft',
    linkedDoc: originalDoc?.name || null,
    citationsCount: 0,
    createdAt: new Date(),
    modifiedAt: new Date()
  })
  const [showPrecedentPicker, setShowPrecedentPicker] = useState(false)
  const [showPlaybookPicker, setShowPlaybookPicker] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const quillRef = useRef(null)
  const autosaveTimerRef = useRef(null)

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'align': [] }],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'align'
  ]

  // Autosave functionality
  const autosave = useCallback(async (content) => {
    setIsSaving(true)
    try {
      // Simulate API call to save draft
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update metadata
      setDraftMetadata(prev => ({
        ...prev,
        modifiedAt: new Date()
      }))
      
      setLastSaved(new Date())
    } catch (error) {
      console.error('Autosave failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [])

  // Trigger autosave on content change
  useEffect(() => {
    if (draftContent) {
      // Clear existing timer
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
      
      // Set new timer for 2 seconds
      autosaveTimerRef.current = setTimeout(() => {
        autosave(draftContent)
      }, 2000)
    }
    
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current)
      }
    }
  }, [draftContent, autosave])

  // Handle text selection for "Ask Assistant" feature
  const handleTextSelection = () => {
    const quill = quillRef.current?.getEditor()
    if (quill) {
      const selection = quill.getSelection()
      if (selection && selection.length > 0) {
        const text = quill.getText(selection.index, selection.length)
        setSelectedText(text)
      }
    }
  }

  // Insert from precedent
  const handleInsertPrecedent = (precedentText) => {
    const quill = quillRef.current?.getEditor()
    if (quill) {
      const selection = quill.getSelection()
      const index = selection ? selection.index : quill.getLength()
      quill.insertText(index, precedentText)
    }
    setShowPrecedentPicker(false)
  }

  // Ask Assistant about selection
  const handleAskAboutSelection = async () => {
    if (!selectedText) return
    
    // This would trigger a chat message with context
    const contextualPrompt = `Regarding this text from my draft: "${selectedText}"\n\nPlease review and suggest improvements.`
    // Call parent component's chat function
    console.log('Ask Assistant:', contextualPrompt)
  }

  // Generate track changes view
  const renderTrackChanges = () => {
    if (!originalDoc || !originalDoc.content) {
      return <div style={styles.trackChangesNote}>No original document to compare</div>
    }

    const diff = diffWords(originalDoc.content, draftContent || '')
    
    return (
      <div style={styles.trackChangesContainer}>
        {diff.map((part, index) => {
          const style = part.added 
            ? styles.insertion 
            : part.removed 
            ? styles.deletion 
            : styles.unchanged
          
          return (
            <span key={index} style={style}>
              {part.value}
            </span>
          )
        })}
      </div>
    )
  }

  const formatTime = (date) => {
    if (!date) return ''
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const styles = {
    container: {
      display: 'flex',
      height: '100%',
      background: '#ffffff'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    toolbar: {
      padding: '12px 20px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#fafbfc'
    },
    toolbarLeft: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    toolbarRight: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center'
    },
    toolButton: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      background: 'white',
      color: '#475569',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    toggleButton: {
      padding: '6px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      background: 'white',
      color: '#475569',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    toggleButtonActive: {
      background: '#667eea',
      color: 'white',
      borderColor: '#667eea'
    },
    saveStatus: {
      fontSize: '12px',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    editorContainer: {
      flex: 1,
      overflow: 'auto',
      padding: '20px',
      background: '#ffffff'
    },
    quillEditor: {
      height: '100%',
      background: 'white'
    },
    trackChangesContainer: {
      padding: '20px',
      lineHeight: '1.8',
      fontSize: '14px',
      fontFamily: 'inherit',
      whiteSpace: 'pre-wrap'
    },
    insertion: {
      background: '#dcfce7',
      color: '#166534',
      textDecoration: 'underline',
      textDecorationColor: '#22c55e'
    },
    deletion: {
      background: '#fee2e2',
      color: '#991b1b',
      textDecoration: 'line-through',
      textDecorationColor: '#ef4444'
    },
    unchanged: {
      color: '#1e293b'
    },
    trackChangesNote: {
      padding: '20px',
      color: '#64748b',
      fontStyle: 'italic',
      textAlign: 'center'
    },
    sidebar: {
      height: '100%',
      borderLeft: '1px solid #e2e8f0',
      background: '#fafbfc',
      padding: '20px',
      overflowY: 'auto'
    },
    sidebarSection: {
      marginBottom: '24px'
    },
    sidebarTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '12px'
    },
    metadataItem: {
      marginBottom: '12px'
    },
    metadataLabel: {
      fontSize: '11px',
      color: '#94a3b8',
      marginBottom: '4px'
    },
    metadataValue: {
      fontSize: '13px',
      color: '#1e293b',
      fontWeight: '500'
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      color: '#94a3b8',
      padding: '40px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1e293b'
    },
    precedentItem: {
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  }

  if (!draftContent) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px' }}>✍️</div>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#64748b' }}>
            No draft yet
          </div>
          <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
            Use the /draft command in chat to generate documents, or click "Convert to Draft" from any chat response.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.toolbarLeft}>
            <button
              style={styles.toolButton}
              onClick={() => setShowPrecedentPicker(true)}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              📚 Insert from Precedent
            </button>
            <button
              style={styles.toolButton}
              onClick={() => setShowPlaybookPicker(true)}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              ✓ Run Playbook
            </button>
            {selectedText && (
              <button
                style={{...styles.toolButton, borderColor: '#667eea', color: '#667eea'}}
                onClick={handleAskAboutSelection}
                onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
              >
                💬 Ask Assistant
              </button>
            )}
          </div>
          <div style={styles.toolbarRight}>
            <button
              style={{
                ...styles.toggleButton,
                ...(showTrackChanges ? styles.toggleButtonActive : {})
              }}
              onClick={() => setShowTrackChanges(!showTrackChanges)}
            >
              {showTrackChanges ? '✓ ' : ''}Show Changes
            </button>
            <div style={styles.saveStatus}>
              {isSaving ? (
                <>⏳ Saving...</>
              ) : lastSaved ? (
                <>✓ Saved • {formatTime(lastSaved)}</>
              ) : (
                <>📝 Draft</>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div style={styles.editorContainer}>
          {showTrackChanges ? (
            renderTrackChanges()
          ) : (
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={draftContent}
              onChange={setDraftContent}
              onChangeSelection={handleTextSelection}
              modules={modules}
              formats={formats}
              style={{ height: 'calc(100% - 42px)' }}
            />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <ResizablePanel defaultWidth={300} minWidth={200} maxWidth={500} side="right">
        <div style={styles.sidebar}>
        <div style={styles.sidebarSection}>
          <div style={styles.sidebarTitle}>Draft Metadata</div>
          <div style={styles.metadataItem}>
            <div style={styles.metadataLabel}>Title</div>
            <input
              type="text"
              value={draftMetadata.title}
              onChange={(e) => setDraftMetadata({...draftMetadata, title: e.target.value})}
              style={{
                ...styles.metadataValue,
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '6px 8px',
                width: '100%'
              }}
            />
          </div>
          <div style={styles.metadataItem}>
            <div style={styles.metadataLabel}>Matter</div>
            <div style={styles.metadataValue}>{matter || 'None'}</div>
          </div>
          <div style={styles.metadataItem}>
            <div style={styles.metadataLabel}>Linked Document</div>
            <div style={styles.metadataValue}>
              {draftMetadata.linkedDoc || 'None'}
            </div>
          </div>
          <div style={styles.metadataItem}>
            <div style={styles.metadataLabel}>Citations</div>
            <div style={styles.metadataValue}>{draftMetadata.citationsCount}</div>
          </div>
          <div style={styles.metadataItem}>
            <div style={styles.metadataLabel}>Created</div>
            <div style={styles.metadataValue}>
              {draftMetadata.createdAt.toLocaleDateString()}
            </div>
          </div>
          <div style={styles.metadataItem}>
            <div style={styles.metadataLabel}>Modified</div>
            <div style={styles.metadataValue}>
              {draftMetadata.modifiedAt.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={styles.sidebarSection}>
          <div style={styles.sidebarTitle}>Actions</div>
          <button
            style={{...styles.toolButton, width: '100%', justifyContent: 'center', marginBottom: '8px'}}
            onClick={() => {
              const blob = new Blob([draftContent], { type: 'text/html' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${draftMetadata.title.replace(/\s+/g, '_')}.html`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            📥 Export HTML
          </button>
          <button
            style={{...styles.toolButton, width: '100%', justifyContent: 'center'}}
            onClick={() => {
              // Convert HTML to plain text for .docx export
              const tempDiv = document.createElement('div')
              tempDiv.innerHTML = draftContent
              const plainText = tempDiv.textContent || tempDiv.innerText
              const blob = new Blob([plainText], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${draftMetadata.title.replace(/\s+/g, '_')}.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            📄 Export Text
          </button>
        </div>
      </div>
      </ResizablePanel>

      {/* Precedent Picker Modal */}
      {showPrecedentPicker && (
        <div style={styles.modal} onClick={() => setShowPrecedentPicker(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Insert from Precedent</div>
            <div style={styles.precedentItem}
              onClick={() => handleInsertPrecedent('\n\nCONFIDENTIALITY CLAUSE\n\nThe parties agree to maintain confidentiality of all proprietary information...\n\n')}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{fontWeight: '600', marginBottom: '4px'}}>Confidentiality Clause</div>
              <div style={{fontSize: '12px', color: '#64748b'}}>Standard NDA language</div>
            </div>
            <div style={styles.precedentItem}
              onClick={() => handleInsertPrecedent('\n\nPAYMENT TERMS\n\nPayment shall be made within 30 days of invoice date...\n\n')}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{fontWeight: '600', marginBottom: '4px'}}>Payment Terms</div>
              <div style={{fontSize: '12px', color: '#64748b'}}>Standard 30-day payment terms</div>
            </div>
            <div style={styles.precedentItem}
              onClick={() => handleInsertPrecedent('\n\nTERMINATION CLAUSE\n\nEither party may terminate this agreement with 30 days written notice...\n\n')}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{fontWeight: '600', marginBottom: '4px'}}>Termination Clause</div>
              <div style={{fontSize: '12px', color: '#64748b'}}>30-day notice termination</div>
            </div>
            <button
              style={{...styles.toolButton, width: '100%', justifyContent: 'center', marginTop: '16px'}}
              onClick={() => setShowPrecedentPicker(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Playbook Picker Modal */}
      {showPlaybookPicker && (
        <div style={styles.modal} onClick={() => setShowPlaybookPicker(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Run Playbook</div>
            <div style={styles.precedentItem}
              onClick={() => {
                alert('Running Contract Review Checklist...')
                setShowPlaybookPicker(false)
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{fontWeight: '600', marginBottom: '4px'}}>✓ Contract Review</div>
              <div style={{fontSize: '12px', color: '#64748b'}}>15 point checklist</div>
            </div>
            <div style={styles.precedentItem}
              onClick={() => {
                alert('Running Tax Document Review...')
                setShowPlaybookPicker(false)
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{fontWeight: '600', marginBottom: '4px'}}>✓ Tax Document Review</div>
              <div style={{fontSize: '12px', color: '#64748b'}}>IRS compliance check</div>
            </div>
            <div style={styles.precedentItem}
              onClick={() => {
                alert('Running Engagement Letter Review...')
                setShowPlaybookPicker(false)
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              <div style={{fontWeight: '600', marginBottom: '4px'}}>✓ Engagement Letter</div>
              <div style={{fontSize: '12px', color: '#64748b'}}>Professional standards check</div>
            </div>
            <button
              style={{...styles.toolButton, width: '100%', justifyContent: 'center', marginTop: '16px'}}
              onClick={() => setShowPlaybookPicker(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
