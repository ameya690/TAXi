import React, { useState, useRef, useEffect } from 'react'
import DocumentBlock from './DocumentBlock'
import tokens from '../../styles/designTokens'

export default function ChatTab({ 
  messages, 
  isLoading, 
  onSend, 
  onOpenInDraft, 
  onOpenInTable,
  onConvertToDraft,
  selectedMatter,
  docsInScope,
  onDocumentsUploaded,
  highlightedCitation,
  onCitationClick
}) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%',
      background: tokens.colors.surface0
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: `${tokens.spacing.xl} ${tokens.spacing.lg}`,
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%'
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.md,
      color: tokens.colors.neutral[500],
      padding: tokens.spacing.xl,
      textAlign: 'center'
    },
    emptyIcon: {
      fontSize: '48px',
      opacity: 0.5
    },
    emptyTitle: {
      fontSize: tokens.typography.fontSize.h2,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[700],
      marginBottom: tokens.spacing.xs
    },
    emptyText: {
      fontSize: tokens.typography.fontSize.base,
      color: tokens.colors.neutral[600],
      maxWidth: '400px'
    },
    loadingBlock: {
      padding: tokens.spacing.lg,
      background: tokens.colors.surface1,
      border: `${tokens.borders.width} solid ${tokens.borders.color}`,
      borderRadius: tokens.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm
    },
    loadingDots: {
      display: 'flex',
      gap: '4px'
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: tokens.colors.neutral[400],
      animation: 'bounce 1.4s infinite ease-in-out both'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyTitle}>
              Start a conversation
            </div>
            <div style={styles.emptyText}>
              Ask questions, draft documents, or analyze your tax materials. 
              Your conversation will appear here as document blocks.
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <DocumentBlock
              key={msg.id || index}
              title={msg.role === 'assistant' ? (msg.title || 'Response') : null}
              content={msg.content}
              timestamp={msg.timestamp}
              artifactType={msg.artifactType}
              citations={msg.citations || []}
              onCitationHover={(citation) => {
                // Handle citation hover to highlight in right rail
              }}
              onCitationClick={onCitationClick}
              onInsertAction={(action) => {
                console.log('Insert action:', action)
                // Handle insert actions
              }}
              isUser={msg.role === 'user'}
            />
          ))
        )}
        {isLoading && (
          <div style={styles.loadingBlock}>
            <div style={styles.loadingDots}>
              <div style={{...styles.dot, animationDelay: '0s'}} />
              <div style={{...styles.dot, animationDelay: '0.2s'}} />
              <div style={{...styles.dot, animationDelay: '0.4s'}} />
            </div>
            <span style={{ color: tokens.colors.neutral[600], fontSize: tokens.typography.fontSize.small }}>
              Thinking...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
