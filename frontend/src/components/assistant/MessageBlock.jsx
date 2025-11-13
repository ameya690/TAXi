import React from 'react'
import ReactMarkdown from 'react-markdown'
import CitationChip from './CitationChip'
import { parseCitations } from '../../utils/citationParser'

export default function MessageBlock({ message, styles, onOpenInDraft, onOpenInTable, onConvertToDraft, highlightedCitation, onCitationClick }) {
  if (message.type === 'user') {
    return (
      <div style={{...styles.message, ...styles.userMessage}}>
        {message.content}
      </div>
    )
  }

  if (message.type === 'answer') {
    return (
      <div style={{...styles.message, ...styles.assistantMessage}}>
        <AnswerContent 
          content={message.content} 
          citations={message.citations}
          onConvertToDraft={onConvertToDraft}
          highlightedCitation={highlightedCitation}
          onCitationClick={onCitationClick}
        />
      </div>
    )
  }

  if (message.type === 'draft') {
    return (
      <div style={{...styles.message, alignSelf: 'flex-start', maxWidth: '90%'}}>
        <DraftBlock content={message.content} onOpenInDraft={onOpenInDraft} />
      </div>
    )
  }

  if (message.type === 'table') {
    return (
      <div style={{...styles.message, alignSelf: 'flex-start', maxWidth: '90%'}}>
        <TableBlock data={message.data} onOpenInTable={onOpenInTable} />
      </div>
    )
  }

  if (message.type === 'error') {
    return (
      <div style={{
        ...styles.message, 
        ...styles.assistantMessage,
        background: '#fee2e2',
        color: '#991b1b'
      }}>
        {message.content}
      </div>
    )
  }

  return null
}

function AnswerContent({ content, citations = [], onConvertToDraft, highlightedCitation, onCitationClick }) {
  const markdownStyles = {
    h1: { fontSize: '1.5em', fontWeight: '600', marginTop: '1em', marginBottom: '0.5em', color: '#1e293b' },
    h2: { fontSize: '1.3em', fontWeight: '600', marginTop: '0.8em', marginBottom: '0.4em', color: '#334155' },
    h3: { fontSize: '1.1em', fontWeight: '600', marginTop: '0.6em', marginBottom: '0.3em', color: '#475569' },
    p: { marginBottom: '0.8em', lineHeight: '1.6' },
    ul: { marginLeft: '1.5em', marginBottom: '0.8em', lineHeight: '1.6' },
    ol: { marginLeft: '1.5em', marginBottom: '0.8em', lineHeight: '1.6' },
    li: { marginBottom: '0.3em' },
    strong: { fontWeight: '600', color: '#1e293b' },
    code: { 
      background: '#f1f5f9', 
      padding: '2px 6px', 
      borderRadius: '4px', 
      fontSize: '0.9em',
      fontFamily: 'monospace'
    },
    pre: {
      background: '#f1f5f9',
      padding: '12px',
      borderRadius: '6px',
      overflow: 'auto',
      marginBottom: '0.8em'
    }
  }

  // Parse content for citations
  const { segments } = parseCitations(content, citations)

  const renderContent = () => {
    return segments.map((segment, idx) => {
      if (segment.type === 'text') {
        return (
          <ReactMarkdown
            key={idx}
            components={{
              h1: ({node, ...props}) => <h1 style={markdownStyles.h1} {...props} />,
              h2: ({node, ...props}) => <h2 style={markdownStyles.h2} {...props} />,
              h3: ({node, ...props}) => <h3 style={markdownStyles.h3} {...props} />,
              p: ({node, ...props}) => <p style={markdownStyles.p} {...props} />,
              ul: ({node, ...props}) => <ul style={markdownStyles.ul} {...props} />,
              ol: ({node, ...props}) => <ol style={markdownStyles.ol} {...props} />,
              li: ({node, ...props}) => <li style={markdownStyles.li} {...props} />,
              strong: ({node, ...props}) => <strong style={markdownStyles.strong} {...props} />,
              code: ({node, inline, ...props}) => 
                inline ? 
                  <code style={markdownStyles.code} {...props} /> : 
                  <pre style={markdownStyles.pre}><code {...props} /></pre>
            }}
          >
            {segment.content}
          </ReactMarkdown>
        )
      } else if (segment.type === 'citation') {
        return (
          <CitationChip
            key={idx}
            citationId={segment.citationId}
            number={segment.number}
            quote={segment.quote}
            source={segment.source}
            location={segment.location}
            isHighlighted={highlightedCitation === segment.citationId}
            onClick={onCitationClick}
          />
        )
      }
      return null
    })
  }

  return (
    <div>
      <div style={{ lineHeight: '1.6' }}>
        {renderContent()}
      </div>
      {onConvertToDraft && (
        <button
          onClick={() => onConvertToDraft(content)}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            background: 'white',
            color: '#667eea',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#667eea'
            e.currentTarget.style.color = 'white'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.color = '#667eea'
          }}
        >
          ✍️ Convert to Draft
        </button>
      )}
    </div>
  )
}

function DraftBlock({ content, onOpenInDraft }) {
  const styles = {
    container: {
      background: '#fefce8',
      border: '1px solid #fde047',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    preview: {
      fontSize: '13px',
      color: '#854d0e',
      lineHeight: '1.6',
      maxHeight: '100px',
      overflow: 'hidden',
      position: 'relative'
    },
    fade: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '30px',
      background: 'linear-gradient(transparent, #fefce8)'
    },
    actions: {
      display: 'flex',
      gap: '8px'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      background: '#eab308',
      color: 'white',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#854d0e', textTransform: 'uppercase' }}>
        ✍️ Draft Generated
      </div>
      <div style={styles.preview}>
        {content.substring(0, 200)}...
        <div style={styles.fade} />
      </div>
      <div style={styles.actions}>
        <button
          style={styles.button}
          onClick={() => onOpenInDraft(content)}
          onMouseOver={(e) => e.target.style.background = '#ca8a04'}
          onMouseOut={(e) => e.target.style.background = '#eab308'}
        >
          Open in Draft tab
        </button>
        <button
          style={{...styles.button, background: '#f59e0b'}}
          onMouseOver={(e) => e.target.style.background = '#d97706'}
          onMouseOut={(e) => e.target.style.background = '#f59e0b'}
        >
          Continue drafting here
        </button>
      </div>
    </div>
  )
}

function TableBlock({ data, onOpenInTable }) {
  const styles = {
    container: {
      background: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    preview: {
      fontSize: '13px',
      color: '#075985',
      lineHeight: '1.6'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      background: '#0ea5e9',
      color: 'white',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      alignSelf: 'flex-start'
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#075985', textTransform: 'uppercase' }}>
        📋 Table Created
      </div>
      <div style={styles.preview}>
        {data?.rows?.length || 0} rows × {data?.columns?.length || 0} columns
      </div>
      <button
        style={styles.button}
        onClick={() => onOpenInTable(data)}
        onMouseOver={(e) => e.target.style.background = '#0284c7'}
        onMouseOut={(e) => e.target.style.background = '#0ea5e9'}
      >
        Open in Table Review tab
      </button>
    </div>
  )
}
