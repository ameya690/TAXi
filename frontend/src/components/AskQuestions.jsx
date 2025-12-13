import React, { useState, useRef, useEffect } from 'react'
import tokens from '../styles/designTokens'

export default function AskQuestions({ onNavigateToEligibility }) {
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage on initial mount
    const saved = localStorage.getItem('askQuestionsMessages')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load messages', e)
        return []
      }
    }
    return []
  })
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [attachedDocs, setAttachedDocs] = useState([])
  const [selectedStates, setSelectedStates] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [expandedDetails, setExpandedDetails] = useState({})
  const [expandedCitations, setExpandedCitations] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [showStateSelector, setShowStateSelector] = useState(false)
  const [excludeDocs, setExcludeDocs] = useState({})
  const [availableDocs, setAvailableDocs] = useState([])
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('askQuestionsMessages', JSON.stringify(messages))
    }
  }, [messages])

  // Load available documents from localStorage
  React.useEffect(() => {
    const loadDocs = () => {
      const saved = localStorage.getItem('userDocuments')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setAvailableDocs(parsed)
        } catch (e) {
          console.error('Failed to load documents', e)
        }
      }
    }
    loadDocs()
    
    // Listen for storage changes (when docs are added/removed in Documents tab)
    window.addEventListener('storage', loadDocs)
    return () => window.removeEventListener('storage', loadDocs)
  }, [])

  const topics = ['Income', 'Credits', 'Deductions', 'Filing', 'Notices', 'Refunds']
  const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

  const starterQuestions = [
    "Am I eligible for EITC?",
    "What documents do I need to file?",
    "I got a notice—what now?"
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (rerunWithoutDocs = false, originalMessageId = null) => {
    if (!inputValue.trim() && attachedDocs.length === 0 && !rerunWithoutDocs) return

    let userMessage
    if (rerunWithoutDocs && originalMessageId) {
      // Find original message
      const original = messages.find(m => m.id === originalMessageId - 1)
      userMessage = {
        ...original,
        id: Date.now(),
        attachments: []
      }
    } else {
      userMessage = {
        id: Date.now(),
        type: 'user',
        content: inputValue,
        attachments: attachedDocs,
        states: selectedStates,
        topic: selectedTopic
      }
    }

    setMessages(prev => [...prev, userMessage])
    if (!rerunWithoutDocs) setInputValue('')
    setIsLoading(true)

    // Build context
    const jurisdiction = userMessage.states.length > 0 
      ? `Federal · ${userMessage.states.join(' · ')}` 
      : 'Federal'
    
    const topicContext = userMessage.topic ? ` (Topic: ${userMessage.topic})` : ''
    
    // Extract facts from documents
    let docFacts = []
    if (userMessage.attachments.length > 0 && !rerunWithoutDocs) {
      docFacts = userMessage.attachments.map(doc => {
        if (doc.name.toLowerCase().includes('w-2')) {
          return `W-2 Box 1: $42,800 (example - actual parsing would extract real values)`
        } else if (doc.name.toLowerCase().includes('1099')) {
          return `1099 income: $15,200 (example)`
        } else if (doc.name.toLowerCase().includes('cp2000') || doc.name.toLowerCase().includes('notice')) {
          return `IRS CP2000 dated 2024-03-15 (example)`
        }
        return `Document: ${doc.name}`
      })
    }

    const docContext = docFacts.length > 0
      ? `\n\nUSER UPLOADED DOCUMENTS - Extract and use these facts:\n${docFacts.join('\n')}\n\nLabel used facts clearly in your response under "used_facts".`
      : ''

    const systemPrompt = `System intent for Regular User – Answer Questions:

Role: You are a concise, friendly "tax friend" who answers general Federal and State tax questions for the current tax year (2024) unless the user specifies otherwise.

Priorities:
1. Brief, plain-English summary first (≤4 bullets OR ≤6 sentences)
2. 1-2 concrete next steps
3. Cite authoritative sources with section/year

Personalization: ${docFacts.length > 0 ? 'User has uploaded documents. Extract high-level facts (amounts, forms, dates) and clearly label them as "From your docs".' : 'No documents provided.'}

Safety:
- Do NOT request or echo SSNs, bank details, or exact addresses
- Recommend professional review for complex/edge situations
- Use "may"/"likely" appropriately; avoid scare language

Response format:
1. Start with: "${jurisdiction} · 2024"
2. Brief summary (≤4 bullets OR ≤6 sentences)
3. Next steps section: "**Next steps:**" followed by 1-2 bullets
4. If documents were used, add: "**From your docs:**" followed by the facts you used
5. Details & Sources section: "### Details & Sources" (expandable)
6. Include citations as: [1], [2] with source details

Voice: 2nd person, reassuring, plain English. Example: "You can claim..." not "The taxpayer may avail..."

${docContext}`

    try {
      // Combine attached docs with available docs from Documents tab
      const allDocs = [
        ...userMessage.attachments.map(att => ({
          name: att.name,
          unique_name: att.name
        })),
        ...availableDocs.map(doc => ({
          name: doc.name,
          unique_name: doc.name,
          type: doc.type
        }))
      ]
      
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          lang: 'en',
          docs: allDocs
        })
      })

      if (!response.ok) throw new Error('Failed to get answer')

      const result = await response.json()

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: result.content,
        citations: result.citations || [],
        jurisdiction,
        topic: userMessage.topic,
        usedDocs: userMessage.attachments.length > 0,
        docFacts: docFacts
      }

      setMessages(prev => [...prev, assistantMessage])
      if (!rerunWithoutDocs) {
        setAttachedDocs([])
        setSelectedStates([])
        setSelectedTopic(null)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I had trouble answering that. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (files) => {
    const newDocs = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type
    }))
    setAttachedDocs(prev => [...prev, ...newDocs])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const parseAnswer = (content) => {
    const parts = content.split('### Details & Sources')
    const summary = parts[0].trim()
    const details = parts[1]?.trim() || null
    return { summary, details }
  }

  const renderMarkdown = (text) => {
    if (!text) return null
    
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={idx} style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0 6px 0', color: '#1e293b' }}>{line.replace('### ', '')}</h3>
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} style={{ fontSize: '18px', fontWeight: '600', margin: '16px 0 8px 0', color: '#1e293b' }}>{line.replace('## ', '')}</h2>
      }
      
      // Bold text with **
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={idx} style={{ margin: '8px 0', lineHeight: '1.6', color: '#334155' }}>
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} style={{ fontWeight: '600' }}>{part}</strong> : part)}
          </p>
        )
      }
      
      // List items
      if (line.match(/^[\d]+\.\s/)) {
        return <li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', color: '#334155', listStyleType: 'decimal' }}>{line.replace(/^[\d]+\.\s/, '')}</li>
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return <li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', color: '#334155' }}>{line.replace(/^[•-]\s/, '')}</li>
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '8px' }} />
      }
      
      // Regular paragraphs
      return <p key={idx} style={{ margin: '8px 0', lineHeight: '1.6', color: '#334155' }}>{line}</p>
    })
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundImage: 'url(/chat-background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    },
    header: {
      padding: '24px 24px 16px 24px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      maxWidth: '720px',
      margin: '0 auto',
      width: '100%'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0,
      marginBottom: '8px'
    },
    disclaimer: {
      fontSize: '13px',
      color: '#64748b',
      margin: 0
    },
    disclaimerLink: {
      color: '#2563eb',
      textDecoration: 'none'
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden'
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px',
      maxWidth: '720px',
      width: '100%',
      position: 'relative'
    },
    emptyState: {
      maxWidth: '720px',
      width: '100%',
      textAlign: 'center',
      padding: '40px 0'
    },
    emptyTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '24px'
    },
    starterChips: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '32px'
    },
    starterChip: {
      padding: '16px 20px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      color: '#334155',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left'
    },
    dropZone: {
      padding: '32px',
      border: '2px dashed #cbd5e1',
      borderRadius: '12px',
      background: '#f8fafc',
      color: '#64748b',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    dropZoneActive: {
      borderColor: '#667eea',
      background: '#eef2ff',
      color: '#667eea'
    },
    messageCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    },
    userMessage: {
      background: 'rgba(219, 234, 254, 0.95)',
      border: '1px solid #93c5fd',
      backdropFilter: 'blur(10px)'
    },
    messageHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      fontSize: '13px',
      color: '#64748b'
    },
    jurisdictionTag: {
      padding: '2px 8px',
      background: '#f1f5f9',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#475569'
    },
    messageContent: {
      fontSize: '15px',
      lineHeight: '1.6',
      color: '#334155'
    },
    detailsToggle: {
      marginTop: '16px',
      padding: '8px 16px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#667eea',
      cursor: 'pointer',
      fontWeight: '600',
      display: 'inline-block'
    },
    detailsContent: {
      marginTop: '12px',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#475569'
    },
    nextSteps: {
      marginTop: '16px',
      padding: '12px',
      background: '#fef3c7',
      borderLeft: '3px solid #f59e0b',
      borderRadius: '6px'
    },
    nextStepsTitle: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#92400e',
      marginBottom: '8px'
    },
    followUpChips: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px',
      flexWrap: 'wrap'
    },
    followUpChip: {
      padding: '6px 12px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    composer: {
      position: 'sticky',
      bottom: 0,
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '720px',
      margin: '0 auto',
      width: '100%',
      boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
    },
    chips: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    chip: {
      padding: '6px 12px',
      background: '#f1f5f9',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    chipActive: {
      background: '#667eea',
      color: 'white',
      borderColor: '#667eea'
    },
    inputRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end'
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      resize: 'none',
      fontFamily: 'inherit',
      minHeight: '48px',
      maxHeight: '120px'
    },
    sendButton: {
      padding: '12px 24px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      height: '48px'
    },
    sendButtonDisabled: {
      background: '#cbd5e1',
      cursor: 'not-allowed'
    },
    attachButton: {
      padding: '8px 16px',
      background: 'transparent',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#475569',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    attachedDocs: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    docPill: {
      padding: '6px 12px',
      background: '#eff6ff',
      border: '1px solid #bfdbfe',
      borderRadius: '6px',
      fontSize: '13px',
      color: '#1e40af',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    removeDoc: {
      cursor: 'pointer',
      fontWeight: '700'
    },
    footer: {
      padding: '12px 24px',
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      textAlign: 'center',
      fontSize: '12px',
      color: '#64748b'
    }
  }

  return (
    <div style={styles.container}>
      {/* Hidden file input - used throughout the conversation */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        onChange={(e) => {
          handleFileUpload(e.target.files)
          e.target.value = '' // Reset so same file can be selected again
        }}
      />
      
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={styles.title}>Ask a tax question</h1>
            <p style={styles.disclaimer}>
              General information, not a substitute for tax advice. 
              <a href="#" style={styles.disclaimerLink}> Learn more</a>
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all messages? This cannot be undone.')) {
                  setMessages([])
                  localStorage.removeItem('askQuestionsMessages')
                }
              }}
              style={{
                padding: '8px 16px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                color: '#64748b'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#e2e8f0'
                e.currentTarget.style.color = '#1e293b'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f1f5f9'
                e.currentTarget.style.color = '#64748b'
              }}
            >
              🗑 Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyTitle}>What would you like to know?</div>
              
              <div style={styles.starterChips}>
                {starterQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={styles.starterChip}
                    onClick={() => setInputValue(q)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(102,126,234,0.15)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {q}
                  </div>
                ))}
              </div>

              <div
                style={{
                  ...styles.dropZone,
                  ...(isDragging ? styles.dropZoneActive : {})
                }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                📎 Drop your W-2, 1099, or IRS notice here (optional)
                <br />
                <span style={{ fontSize: '12px' }}>or click to browse</span>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    ...styles.messageCard,
                    ...(msg.type === 'user' ? styles.userMessage : {})
                  }}
                >
                  {msg.type === 'user' ? (
                    <>
                      <div style={styles.messageHeader}>
                        <span>You asked:</span>
                        {msg.states.length > 0 && (
                          <span style={styles.jurisdictionTag}>
                            Federal, {msg.states.join(', ')}
                          </span>
                        )}
                        {msg.topic && (
                          <span style={styles.jurisdictionTag}>{msg.topic}</span>
                        )}
                      </div>
                      <div style={styles.messageContent}>{msg.content}</div>
                      {msg.attachments.length > 0 && (
                        <div style={{ ...styles.attachedDocs, marginTop: '12px' }}>
                          {msg.attachments.map(doc => (
                            <div key={doc.id} style={styles.docPill}>
                              📄 {doc.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : msg.type === 'assistant' ? (
                    <>
                      <div style={styles.messageHeader}>
                        <span style={styles.jurisdictionTag}>{msg.jurisdiction} · 2024</span>
                        {msg.topic && (
                          <span style={styles.jurisdictionTag}>{msg.topic}</span>
                        )}
                      </div>
                      <div style={styles.messageContent}>
                        {renderMarkdown(parseAnswer(msg.content).summary)}
                      </div>
                      
                      {msg.docFacts && msg.docFacts.length > 0 && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: '#eff6ff',
                          borderRadius: '8px',
                          border: '1px solid #bfdbfe'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', marginBottom: '6px' }}>
                            From your docs:
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {msg.docFacts.map((fact, idx) => (
                              <div key={idx} style={styles.docPill}>
                                {fact}
                              </div>
                            ))}
                          </div>
                          <button
                            style={{
                              marginTop: '8px',
                              padding: '4px 12px',
                              background: 'white',
                              border: '1px solid #bfdbfe',
                              borderRadius: '4px',
                              fontSize: '12px',
                              color: '#1e40af',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleSend(true, msg.id)}
                          >
                            🔄 Exclude my docs for this answer
                          </button>
                        </div>
                      )}
                      
                      {parseAnswer(msg.content).details && (
                        <>
                          <div
                            style={styles.detailsToggle}
                            onClick={() => setExpandedDetails(prev => ({
                              ...prev,
                              [msg.id]: !prev[msg.id]
                            }))}
                          >
                            {expandedDetails[msg.id] ? '▼' : '▶'} Details & sources
                          </div>
                          {expandedDetails[msg.id] && (
                            <div style={styles.detailsContent}>
                              {renderMarkdown(parseAnswer(msg.content).details)}
                            </div>
                          )}
                        </>
                      )}

                      <div style={styles.followUpChips}>
                        <div
                          style={styles.followUpChip}
                          onClick={() => setInputValue('See forms & deadlines')}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                          📋 See forms & deadlines
                        </div>
                        <div
                          style={styles.followUpChip}
                          onClick={() => {
                            if (onNavigateToEligibility) {
                              onNavigateToEligibility()
                            } else {
                              setInputValue('Estimate my credit/refund')
                            }
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                          💰 Estimate my credit/refund
                        </div>
                        <div
                          style={styles.followUpChip}
                          onClick={() => setInputValue('Draft a simple letter/email')}
                          onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                          ✉️ Draft a letter/email
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ ...styles.messageContent, color: '#dc2626' }}>
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div style={styles.messageCard}>
                  <div style={styles.messageContent}>
                    <span style={{ color: '#667eea' }}>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Composer */}
      <div style={styles.composer}>
        {/* Chips */}
        <div style={styles.chips}>
          <button
            style={styles.attachButton}
            onClick={() => fileInputRef.current?.click()}
          >
            📎 Attach docs
          </button>
          
          {/* State Selector */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                ...styles.chip,
                ...(selectedStates.length > 0 ? styles.chipActive : {})
              }}
              onClick={() => setShowStateSelector(!showStateSelector)}
            >
              {selectedStates.length > 0 
                ? `Federal, ${selectedStates.join(', ')}` 
                : 'Federal'}
              <span style={{ marginLeft: '4px' }}>▼</span>
            </div>
            
            {showStateSelector && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: '8px',
                background: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                padding: '12px',
                maxHeight: '200px',
                overflowY: 'auto',
                width: '300px',
                zIndex: 1000
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                  Select states (optional):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {states.map(state => (
                    <div
                      key={state}
                      style={{
                        padding: '4px 8px',
                        background: selectedStates.includes(state) ? '#667eea' : '#f1f5f9',
                        color: selectedStates.includes(state) ? 'white' : '#475569',
                        borderRadius: '4px',
                        fontSize: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        fontWeight: selectedStates.includes(state) ? '600' : '400'
                      }}
                      onClick={() => {
                        setSelectedStates(prev => 
                          prev.includes(state) 
                            ? prev.filter(s => s !== state)
                            : [...prev, state]
                        )
                      }}
                    >
                      {state}
                    </div>
                  ))}
                </div>
                <button
                  style={{
                    marginTop: '12px',
                    width: '100%',
                    padding: '6px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowStateSelector(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>
          
          {topics.map(topic => (
            <div
              key={topic}
              style={{
                ...styles.chip,
                ...(selectedTopic === topic ? styles.chipActive : {})
              }}
              onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
            >
              {topic}
              {selectedTopic === topic && <span>✕</span>}
            </div>
          ))}
        </div>

        {attachedDocs.length > 0 && (
          <div style={styles.attachedDocs}>
            {attachedDocs.map(doc => (
              <div key={doc.id} style={styles.docPill}>
                📄 {doc.name}
                <span
                  style={styles.removeDoc}
                  onClick={() => setAttachedDocs(prev => prev.filter(d => d.id !== doc.id))}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div style={styles.inputRow}>
          <textarea
            style={styles.input}
            placeholder="Type your tax question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <button
            style={{
              ...styles.sendButton,
              ...(!inputValue.trim() && attachedDocs.length === 0 ? styles.sendButtonDisabled : {})
            }}
            onClick={handleSend}
            disabled={!inputValue.trim() && attachedDocs.length === 0}
            onMouseOver={(e) => {
              if (inputValue.trim() || attachedDocs.length > 0) {
                e.currentTarget.style.background = '#5568d3'
              }
            }}
            onMouseOut={(e) => {
              if (inputValue.trim() || attachedDocs.length > 0) {
                e.currentTarget.style.background = '#667eea'
              }
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        General information, not a substitute for tax advice. We don't collect PII beyond uploaded documents.
      </div>
    </div>
  )
}
