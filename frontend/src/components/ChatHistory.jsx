import React, { useState, useEffect } from 'react'

export default function ChatHistory({ onLoadChat }) {
  const [history, setHistory] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const saved = localStorage.getItem('tax_bot_chat_history')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }

  const saveToHistory = (question, answer, citations) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      question,
      answer,
      citations
    }
    const updated = [newEntry, ...history].slice(0, 50) // Keep last 50
    setHistory(updated)
    localStorage.setItem('tax_bot_chat_history', JSON.stringify(updated))
  }

  const deleteEntry = (id) => {
    const updated = history.filter(h => h.id !== id)
    setHistory(updated)
    localStorage.setItem('tax_bot_chat_history', JSON.stringify(updated))
  }

  const clearAll = () => {
    if (confirm('Clear all chat history?')) {
      setHistory([])
      localStorage.removeItem('tax_bot_chat_history')
    }
  }

  const exportToJSON = () => {
    const dataStr = JSON.stringify(history, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tax-bot-history-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const exportToText = () => {
    let text = 'TAX Intelligence Bot - Chat History\n'
    text += '=' .repeat(50) + '\n\n'
    history.forEach((entry, i) => {
      text += `[${new Date(entry.timestamp).toLocaleString()}]\n`
      text += `Q: ${entry.question}\n`
      text += `A: ${entry.answer}\n`
      if (entry.citations && entry.citations.length > 0) {
        text += `Sources: ${entry.citations.join(', ')}\n`
      }
      text += '\n' + '-'.repeat(50) + '\n\n'
    })
    const dataBlob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tax-bot-history-${new Date().toISOString().split('T')[0]}.txt`
    link.click()
  }

  const styles = {
    button: {
      padding: '10px 16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginRight: '8px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: showModal ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    entry: {
      padding: '16px',
      background: '#f7fafc',
      borderRadius: '8px',
      marginBottom: '12px',
      border: '1px solid #e2e8f0'
    },
    timestamp: {
      fontSize: '12px',
      color: '#718096',
      marginBottom: '8px'
    },
    question: {
      fontWeight: '600',
      marginBottom: '8px',
      color: '#2d3748'
    },
    answer: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#4a5568'
    }
  }

  // Expose saveToHistory to parent component
  React.useImperativeHandle(React.useRef(), () => ({
    saveToHistory
  }))

  return (
    <div>
      <button style={styles.button} onClick={() => setShowModal(true)}>
        📋 View History ({history.length})
      </button>

      <div style={styles.modal} onClick={() => setShowModal(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>💬 Chat History</h3>
            <button onClick={() => setShowModal(false)} style={{ ...styles.button, background: '#e2e8f0', color: '#2d3748' }}>
              ✕ Close
            </button>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button style={styles.button} onClick={exportToJSON}>
              📥 Export JSON
            </button>
            <button style={styles.button} onClick={exportToText}>
              📄 Export TXT
            </button>
            <button style={{...styles.button, background: '#fed7d7', color: '#c53030'}} onClick={clearAll}>
              🗑️ Clear All
            </button>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
              No chat history yet. Start a conversation!
            </div>
          ) : (
            history.map(entry => (
              <div key={entry.id} style={styles.entry}>
                <div style={styles.timestamp}>
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
                <div style={styles.question}>
                  Q: {entry.question}
                </div>
                <div style={styles.answer}>
                  A: {entry.answer.substring(0, 200)}
                  {entry.answer.length > 200 && '...'}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  <button
                    style={{...styles.button, padding: '6px 12px', fontSize: '12px'}}
                    onClick={() => {
                      onLoadChat && onLoadChat(entry)
                      setShowModal(false)
                    }}
                  >
                    📖 View Full
                  </button>
                  <button
                    style={{...styles.button, padding: '6px 12px', fontSize: '12px', background: '#fed7d7', color: '#c53030'}}
                    onClick={() => deleteEntry(entry.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Export function to save from Chat component
export function useChatHistory() {
  const saveToHistory = (question, answer, citations) => {
    const history = JSON.parse(localStorage.getItem('tax_bot_chat_history') || '[]')
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      question,
      answer,
      citations
    }
    const updated = [newEntry, ...history].slice(0, 50)
    localStorage.setItem('tax_bot_chat_history', JSON.stringify(updated))
  }

  return { saveToHistory }
}
