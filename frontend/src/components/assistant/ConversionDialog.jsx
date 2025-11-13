import React from 'react'
import tokens from '../../styles/designTokens'

export default function ConversionDialog({ 
  type, // 'draft' or 'table'
  onContinueChat,
  onSwitchTab,
  onCancel 
}) {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    },
    dialog: {
      background: tokens.colors.surface1,
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.xl,
      maxWidth: '480px',
      width: '90%',
      boxShadow: tokens.shadows.xl,
      animation: 'slideUp 0.3s ease-out'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      marginBottom: tokens.spacing.md
    },
    icon: {
      fontSize: '32px'
    },
    title: {
      fontSize: tokens.typography.fontSize.h3,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[900],
      margin: 0
    },
    message: {
      fontSize: tokens.typography.fontSize.base,
      lineHeight: tokens.typography.lineHeight.base,
      color: tokens.colors.neutral[700],
      marginBottom: tokens.spacing.lg
    },
    actions: {
      display: 'flex',
      gap: tokens.spacing.sm,
      justifyContent: 'flex-end'
    },
    button: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      cursor: 'pointer',
      border: 'none',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      outline: 'none'
    },
    primaryButton: {
      background: tokens.colors.primary[600],
      color: '#ffffff'
    },
    secondaryButton: {
      background: 'transparent',
      color: tokens.colors.neutral[700],
      border: `${tokens.borders.width} solid ${tokens.borders.color}`
    },
    cancelButton: {
      background: 'transparent',
      color: tokens.colors.neutral[600],
      border: 'none'
    }
  }

  const typeConfig = {
    draft: {
      icon: '✍️',
      title: 'Draft Created',
      message: 'I\'ve created a draft document for you. Would you like to continue chatting here or switch to the Draft tab to review and edit it?',
      primaryAction: 'Open in Draft',
      secondaryAction: 'Continue Chat'
    },
    table: {
      icon: '📋',
      title: 'Table Created',
      message: 'I\'ve created a table for you. Would you like to continue chatting here or switch to the Table Review tab to analyze the data?',
      primaryAction: 'Open in Table',
      secondaryAction: 'Continue Chat'
    }
  }

  const config = typeConfig[type] || typeConfig.draft

  return (
    <>
      <div style={styles.overlay} onClick={onCancel}>
        <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <span style={styles.icon}>{config.icon}</span>
            <h3 style={styles.title}>{config.title}</h3>
          </div>
          
          <p style={styles.message}>{config.message}</p>
          
          <div style={styles.actions}>
            <button
              style={{...styles.button, ...styles.cancelButton}}
              onClick={onCancel}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.neutral[100]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Cancel
            </button>
            
            <button
              style={{...styles.button, ...styles.secondaryButton}}
              onClick={onContinueChat}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.neutral[50]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {config.secondaryAction}
            </button>
            
            <button
              style={{...styles.button, ...styles.primaryButton}}
              onClick={onSwitchTab}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.primary[700]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = tokens.colors.primary[600]
              }}
            >
              {config.primaryAction}
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
