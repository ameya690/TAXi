import React, { useState, useRef, useEffect } from 'react'
import AssistantLayout from './AssistantLayout'
import ChatTab from './assistant/ChatTab'
import DraftTab from './assistant/DraftTab'
import TableTab from './assistant/TableTab'
import ConversionDialog from './assistant/ConversionDialog'
import { markdownToHtml } from '../utils/markdownToHtml'
import { saveAssistantState, loadAssistantState, clearAssistantState } from '../utils/assistantStorage'
import tokens from '../styles/designTokens'

export default function Assistant({ lang = 'en', t = (k) => k }) {
  console.log('===== ASSISTANT COMPONENT RENDERING =====')
  console.log('Props:', { lang, t })
  
  const [activeTab, setActiveTab] = useState('chat')
  const [isStateLoaded, setIsStateLoaded] = useState(false)
  const [messages, setMessages] = useState([])
  const [draftContent, setDraftContent] = useState('')
  const [tableData, setTableData] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMatter, setSelectedMatter] = useState(null)
  const [knowledgeSources, setKnowledgeSources] = useState({
    irs_publications: true,
    case_law: false,
    regulations: true
  })
  const [docsInScope, setDocsInScope] = useState([])
  const [citations, setCitations] = useState([])
  const [reasoningTrace, setReasoningTrace] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [highlightedCitation, setHighlightedCitation] = useState(null)
  const [showConversionDialog, setShowConversionDialog] = useState(null) // 'draft' or 'table' or null
  const [pendingContent, setPendingContent] = useState(null) // Store content/data for dialog

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadAssistantState()
    if (savedState) {
      setMessages(savedState.messages)
      setDraftContent(savedState.draftContent)
      setTableData(savedState.tableData)
      setSelectedMatter(savedState.selectedMatter)
      setDocsInScope(savedState.docsInScope)
      setCitations(savedState.citations)
      setReasoningTrace(savedState.reasoningTrace)
      setSuggestions(savedState.suggestions)
      setKnowledgeSources(savedState.knowledgeSources)
    }
    setIsStateLoaded(true)
  }, [])

  // Save state whenever it changes
  useEffect(() => {
    if (!isStateLoaded) return // Don't save until initial load is complete
    
    const state = {
      messages,
      draftContent,
      tableData,
      selectedMatter,
      docsInScope,
      citations,
      reasoningTrace,
      suggestions,
      knowledgeSources
    }
    
    saveAssistantState(state)
  }, [messages, draftContent, tableData, selectedMatter, docsInScope, citations, reasoningTrace, suggestions, knowledgeSources, isStateLoaded])

  // Fetch documents when matter changes
  useEffect(() => {
    if (selectedMatter) {
      fetchDocuments(selectedMatter)
    } else {
      setDocsInScope([])
    }
  }, [selectedMatter])

  const fetchDocuments = async (matter) => {
    try {
      const response = await fetch(`/api/assistant/documents?matter=${encodeURIComponent(matter)}`)
      if (response.ok) {
        const data = await response.json()
        setDocsInScope(data.documents || [])
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    }
  }

  const handleDocumentsUploaded = (uploadedDocs) => {
    // Add newly uploaded docs to the scope
    setDocsInScope(prev => [...prev, ...uploadedDocs])
  }

  const handleSend = async (message) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          matter: selectedMatter,
          docs: docsInScope,
          knowledge: knowledgeSources,
          lang: lang || 'en'
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()

      let assistantMessage
      if (data.type === 'answer') {
        assistantMessage = {
          id: Date.now() + 1,
          type: 'answer',
          role: 'assistant',
          content: data.content,
          citations: data.citations || [],
          timestamp: new Date()
        }
      } else if (data.type === 'draft') {
        assistantMessage = {
          id: Date.now() + 1,
          type: 'draft',
          role: 'assistant',
          content: data.content,
          timestamp: new Date()
        }
        // Convert markdown to HTML for rich editor
        const htmlContent = markdownToHtml(data.content)
        setDraftContent(htmlContent)
        // Show dialog instead of auto-switching
        setPendingContent({ type: 'draft', content: htmlContent })
        setShowConversionDialog('draft')
      } else if (data.type === 'table') {
        assistantMessage = {
          id: Date.now() + 1,
          type: 'table',
          role: 'assistant',
          data: data.tableData,
          timestamp: new Date()
        }
        setTableData(data.tableData)
        // Show dialog instead of auto-switching
        setPendingContent({ type: 'table', data: data.tableData })
        setShowConversionDialog('table')
      }

      setMessages(prev => [...prev, assistantMessage])
      setCitations(data.citations || [])
      setReasoningTrace(data.reasoning || [])
      setSuggestions(data.suggestions || [])

    } catch (err) {
      console.error('Assistant chat error:', err)
      setError(err.message)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenInDraft = (content) => {
    // Convert markdown to HTML for rich editor
    const htmlContent = markdownToHtml(content)
    setDraftContent(htmlContent)
    setActiveTab('draft')
  }

  const handleOpenInTable = (data) => {
    setTableData(data)
    setActiveTab('table')
  }

  const handleConvertToDraft = (content) => {
    // Convert markdown to HTML for rich editor
    const htmlContent = markdownToHtml(content)
    setDraftContent(htmlContent)
    setActiveTab('draft')
  }

  const handleCitationClick = (citationId) => {
    // Toggle highlight or set new highlight
    setHighlightedCitation(prev => prev === citationId ? null : citationId)
  }

  const handleDialogContinueChat = () => {
    // User wants to stay in chat
    setShowConversionDialog(null)
    setPendingContent(null)
  }

  const handleDialogSwitchTab = () => {
    // User wants to switch to draft/table tab
    if (showConversionDialog === 'draft') {
      setActiveTab('draft')
    } else if (showConversionDialog === 'table') {
      setActiveTab('table')
    }
    setShowConversionDialog(null)
    setPendingContent(null)
  }

  const handleDialogCancel = () => {
    // User cancelled - just close dialog
    setShowConversionDialog(null)
    setPendingContent(null)
  }

  const handleCreateDraftFromTable = (content) => {
    // Convert markdown table to HTML
    const htmlContent = markdownToHtml(content)
    setDraftContent(htmlContent)
    setActiveTab('draft')
  }

  const handleAskTable = async (query, tableData, filteredData) => {
    // Send query to backend with table context
    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Regarding this table data: ${query}`,
          matter: selectedMatter,
          lang: lang,
          tableContext: {
            columns: tableData.columns,
            rows: filteredData.slice(0, 100) // Send first 100 rows for context
          }
        })
      })

      if (!response.ok) throw new Error('Failed to query table')

      const data = await response.json()
      return {
        content: data.content,
        type: data.type
      }
    } catch (error) {
      return {
        error: error.message
      }
    }
  }

  const styles = {
    container: {
      display: 'flex',
      width: '100%',
      gap: '16px',
      minHeight: '600px',
      height: '100%'
    },
    centerPane: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden'
    },
    tabs: {
      display: 'flex',
      gap: '4px',
      padding: '12px 16px 0',
      borderBottom: '1px solid #e2e8f0',
      background: '#fafbfc'
    },
    tab: {
      padding: '10px 20px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      borderRadius: '8px 8px 0 0',
      transition: 'all 0.2s'
    },
    tabActive: {
      background: 'white',
      color: '#667eea',
      borderBottom: '2px solid #667eea'
    },
    errorToast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#fee2e2',
      color: '#991b1b',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    }
  }

  const tabStyles = {
    tabs: {
      display: 'flex',
      gap: tokens.spacing.lg,
      padding: `0 ${tokens.spacing.md}`,
      background: tokens.colors.surface1,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    tab: {
      background: 'transparent',
      border: 'none',
      padding: `${tokens.spacing.sm} 0`,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.neutral[600],
      cursor: 'pointer',
      position: 'relative',
      transition: `color ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      borderBottom: '2px solid transparent',
      marginBottom: '-1px',
      outline: 'none'
    },
    tabActive: {
      color: tokens.colors.neutral[900],
      fontWeight: tokens.typography.fontWeight.semibold,
      borderBottom: `2px solid ${tokens.colors.primary[600]}`
    },
    clearButton: {
      background: 'transparent',
      border: 'none',
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      fontSize: tokens.typography.fontSize.small,
      color: tokens.colors.neutral[500],
      cursor: 'pointer',
      borderRadius: tokens.borderRadius.sm,
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      marginLeft: 'auto',
      outline: 'none'
    }
  }

  // Don't render until state is loaded
  if (!isStateLoaded) {
    console.log('===== WAITING FOR STATE TO LOAD =====')
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: tokens.colors.neutral[600]
      }}>
        Loading Assistant...
      </div>
    )
  }

  console.log('===== RENDERING ASSISTANT LAYOUT =====')
  console.log('State:', { messages: messages.length, isLoading, selectedMatter, docsInScope: docsInScope.length })

  return (
    <AssistantLayout 
      lang={lang} 
      t={t}
      onSend={handleSend}
      isLoading={isLoading}
      selectedMatter={selectedMatter}
      docsInScope={docsInScope}
      onDocumentsUploaded={handleDocumentsUploaded}
    >
      {error && (
        <div style={{
          position: 'fixed',
          top: tokens.spacing.lg,
          right: tokens.spacing.lg,
          background: tokens.colors.error,
          color: '#ffffff',
          padding: tokens.spacing.md,
          borderRadius: tokens.borderRadius.sm,
          boxShadow: tokens.shadows.md,
          zIndex: 1000
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Tabs */}
      <div style={tabStyles.tabs}>
        <button
          style={{...tabStyles.tab, ...(activeTab === 'chat' ? tabStyles.tabActive : {})}}
          onClick={() => setActiveTab('chat')}
          onMouseOver={(e) => {
            if (activeTab !== 'chat') {
              e.currentTarget.style.color = tokens.colors.neutral[900]
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'chat') {
              e.currentTarget.style.color = tokens.colors.neutral[600]
            }
          }}
        >
          💬 Chat
        </button>
        <button
          style={{...tabStyles.tab, ...(activeTab === 'draft' ? tabStyles.tabActive : {})}}
          onClick={() => setActiveTab('draft')}
          onMouseOver={(e) => {
            if (activeTab !== 'draft') {
              e.currentTarget.style.color = tokens.colors.neutral[900]
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'draft') {
              e.currentTarget.style.color = tokens.colors.neutral[600]
            }
          }}
        >
          ✍️ Draft
        </button>
        <button
          style={{...tabStyles.tab, ...(activeTab === 'table' ? tabStyles.tabActive : {})}}
          onClick={() => setActiveTab('table')}
          onMouseOver={(e) => {
            if (activeTab !== 'table') {
              e.currentTarget.style.color = tokens.colors.neutral[900]
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== 'table') {
              e.currentTarget.style.color = tokens.colors.neutral[600]
            }
          }}
        >
          📋 Table Review
        </button>
        <div style={{ flex: 1 }} />
        <button
          style={tabStyles.clearButton}
          onClick={() => {
            if (confirm('Clear all chat history, drafts, and tables? This cannot be undone.')) {
              clearAssistantState()
              setMessages([])
              setDraftContent('')
              setTableData(null)
              setDocsInScope([])
              setCitations([])
              setReasoningTrace([])
              setSuggestions([])
              setActiveTab('chat')
            }
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = tokens.colors.error + '20'
            e.currentTarget.style.color = tokens.colors.error
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = tokens.colors.neutral[600]
          }}
        >
          🗑️ Clear Session
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' && (
        <ChatTab
          messages={messages}
          isLoading={isLoading}
          onSend={handleSend}
          onOpenInDraft={handleOpenInDraft}
          onOpenInTable={handleOpenInTable}
          onConvertToDraft={handleConvertToDraft}
          selectedMatter={selectedMatter}
          docsInScope={docsInScope}
          onDocumentsUploaded={handleDocumentsUploaded}
          highlightedCitation={highlightedCitation}
          onCitationClick={handleCitationClick}
        />
      )}

      {activeTab === 'draft' && (
        <DraftTab 
          draftContent={draftContent} 
          setDraftContent={setDraftContent}
          matter={selectedMatter}
        />
      )}

      {activeTab === 'table' && (
        <TableTab 
          tableData={tableData}
          onCreateDraft={handleCreateDraftFromTable}
          onAskTable={handleAskTable}
        />
      )}

      {/* Conversion Dialog */}
      {showConversionDialog && (
        <ConversionDialog
          type={showConversionDialog}
          onContinueChat={handleDialogContinueChat}
          onSwitchTab={handleDialogSwitchTab}
          onCancel={handleDialogCancel}
        />
      )}
    </AssistantLayout>
  )
}
