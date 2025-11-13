import React, { useState } from 'react'

export default function Chat({ lang, t }) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const ask = async () => {
    if (!question.trim()) return
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lang })
      })
      const data = await res.json()
      // Safe logging that won't cause parsing errors
      try {
        console.log('API Response received successfully')
      } catch (e) {
        console.error('Error logging response:', e)
      }
      
      // Safely handle the response
      const answer = data && data.answer ? String(data.answer) : 'No answer received'
      const citations = data && data.citations ? data.citations : []
      
      // Safe logging - no template literals or complex objects
      console.log('API Response received')
      console.log('Question: ' + question)
      console.log('Answer length: ' + answer.length)
      
      setHistory(h => [{ q: question, a: answer, cits: citations }, ...h])
      setQuestion('')
    } catch (e) {
      alert('Error contacting backend')
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    inputContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px'
    },
    input: {
      flex: 1,
      padding: '14px 18px',
      fontSize: '15px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    button: {
      padding: '14px 32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    history: {
      display: 'grid',
      gap: '16px'
    },
    messageCard: {
      background: '#f7fafc',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s'
    },
    question: {
      display: 'flex',
      alignItems: 'start',
      gap: '12px',
      marginBottom: '16px'
    },
    questionBubble: {
      background: 'white',
      padding: '12px 16px',
      borderRadius: '12px',
      flex: 1,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    answer: {
      display: 'flex',
      alignItems: 'start',
      gap: '12px'
    },
    answerBubble: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '12px',
      flex: 1,
      whiteSpace: 'pre-wrap',
      lineHeight: '1.6',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
    },
    citations: {
      marginTop: '12px',
      padding: '12px',
      background: 'white',
      borderRadius: '8px',
      fontSize: '13px',
      color: '#4a5568',
      borderLeft: '3px solid #667eea'
    },
    citationTitle: {
      fontWeight: '600',
      marginBottom: '6px',
      color: '#2d3748'
    },
    citationList: {
      fontSize: '12px',
      color: '#718096',
      lineHeight: '1.8'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#a0aec0'
    },
    icon: {
      fontSize: '48px',
      marginBottom: '16px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.inputContainer}>
        <input
          style={{
            ...styles.input,
            ...(question ? { borderColor: '#667eea' } : {})
          }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('chat_placeholder')}
          onKeyDown={(e) => e.key === 'Enter' && !loading && ask()}
        />
        <button 
          onClick={ask} 
          disabled={loading || !question.trim()}
          style={{
            ...styles.button,
            ...(loading || !question.trim() ? styles.buttonDisabled : {})
          }}
          onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          {loading ? '⏳ ' + t('sending') : '🚀 ' + t('ask')}
        </button>
      </div>

      {history.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.icon}>💬</div>
          <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
            {lang === 'en' ? 'Ask a question about EITC' : 'Haz una pregunta sobre el EITC'}
          </div>
          <div style={{ fontSize: '14px' }}>
            {lang === 'en' 
              ? 'Get instant answers backed by official IRS materials'
              : 'Obtén respuestas instantáneas respaldadas por materiales oficiales del IRS'
            }
          </div>
        </div>
      ) : (
        <div style={styles.history}>
          {history.map((item, idx) => (
            <div key={idx} style={styles.messageCard}>
              <div style={styles.question}>
                <span style={{ fontSize: '24px' }}>👤</span>
                <div style={styles.questionBubble}>
                  <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                    {t('you')}
                  </div>
                  <div>{item.q}</div>
                </div>
              </div>
              
              <div style={styles.answer}>
                <span style={{ fontSize: '24px' }}>🚕</span>
                <div style={{ flex: 1 }}>
                  <div style={styles.answerBubble}>
                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                      {t('taxi')}
                    </div>
                    <div>{item.a}</div>
                  </div>
                  
                  {!!item.cits.length && (
                    <div style={styles.citations}>
                      <div style={styles.citationTitle}>
                        📚 {t('citations')}
                      </div>
                      <div style={styles.citationList}>
                        {item.cits.map((cit, i) => (
                          <div key={i}>• {cit.split('/').pop()}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
