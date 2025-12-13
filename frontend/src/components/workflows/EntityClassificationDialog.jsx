import React from 'react'
import tokens from '../../styles/designTokens'

export default function EntityClassificationDialog({ onClose, onGetStarted }) {
  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
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
      maxWidth: '700px',
      width: '90%',
      maxHeight: '85vh',
      overflowY: 'auto',
      boxShadow: tokens.shadows.xl,
      animation: 'slideUp 0.3s ease-out'
    },
    header: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: tokens.spacing.md,
      marginBottom: tokens.spacing.lg,
      paddingBottom: tokens.spacing.md,
      borderBottom: `2px solid ${tokens.colors.primary[100]}`
    },
    icon: {
      fontSize: '48px',
      lineHeight: 1
    },
    headerText: {
      flex: 1
    },
    title: {
      fontSize: tokens.typography.fontSize.h2,
      fontWeight: tokens.typography.fontWeight.bold,
      color: tokens.colors.neutral[900],
      margin: 0,
      marginBottom: tokens.spacing.xs
    },
    subtitle: {
      fontSize: tokens.typography.fontSize.base,
      color: tokens.colors.neutral[600],
      margin: 0
    },
    section: {
      marginBottom: tokens.spacing.lg
    },
    sectionTitle: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.neutral[800],
      marginBottom: tokens.spacing.sm,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs
    },
    sectionIcon: {
      fontSize: '20px'
    },
    text: {
      fontSize: tokens.typography.fontSize.base,
      lineHeight: tokens.typography.lineHeight.relaxed,
      color: tokens.colors.neutral[700],
      marginBottom: tokens.spacing.md
    },
    list: {
      margin: 0,
      paddingLeft: tokens.spacing.lg,
      color: tokens.colors.neutral[700]
    },
    listItem: {
      marginBottom: tokens.spacing.sm,
      lineHeight: tokens.typography.lineHeight.relaxed
    },
    highlight: {
      background: tokens.colors.primary[50],
      padding: tokens.spacing.md,
      borderRadius: tokens.borderRadius.md,
      borderLeft: `4px solid ${tokens.colors.primary[500]}`,
      marginBottom: tokens.spacing.md
    },
    highlightText: {
      fontSize: tokens.typography.fontSize.base,
      color: tokens.colors.neutral[800],
      margin: 0,
      fontWeight: tokens.typography.fontWeight.medium
    },
    actions: {
      display: 'flex',
      gap: tokens.spacing.sm,
      justifyContent: 'flex-end',
      marginTop: tokens.spacing.xl,
      paddingTop: tokens.spacing.lg,
      borderTop: `1px solid ${tokens.colors.neutral[200]}`
    },
    button: {
      padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
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
    }
  }

  return (
    <>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={styles.header}>
            <span style={styles.icon}>🏢</span>
            <div style={styles.headerText}>
              <h2 style={styles.title}>Entity Classification Memo</h2>
              <p style={styles.subtitle}>AI-Powered Tax Entity Classification Analysis</p>
            </div>
          </div>

          {/* What is Entity Classification */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>ℹ️</span>
              What is Entity Classification?
            </h3>
            <p style={styles.text}>
              Entity classification determines how a business entity is treated for federal tax purposes. 
              Under the "check-the-box" regulations (Reg §301.7701), eligible entities can choose their 
              tax classification, which significantly impacts tax liability, reporting requirements, and 
              overall tax strategy.
            </p>
            <div style={styles.highlight}>
              <p style={styles.highlightText}>
                💡 The right entity classification can save thousands in taxes and simplify compliance. 
                This tool helps analyze your entity structure and provides AI-powered recommendations.
              </p>
            </div>
          </div>

          {/* Key Classifications */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📋</span>
              Common Tax Classifications
            </h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Disregarded Entity:</strong> Single-member LLC treated as sole proprietorship
              </li>
              <li style={styles.listItem}>
                <strong>Partnership:</strong> Multi-member LLC with pass-through taxation
              </li>
              <li style={styles.listItem}>
                <strong>C Corporation:</strong> Separate taxable entity with double taxation
              </li>
              <li style={styles.listItem}>
                <strong>S Corporation:</strong> Pass-through entity with corporate structure
              </li>
            </ul>
          </div>

          {/* How This Workflow Works */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🎯</span>
              How This Workflow Works
            </h3>
            <p style={styles.text}>
              This AI-powered workflow will guide you through entity classification analysis:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Step 1:</strong> Collect entity information (name, jurisdiction, structure, owners)
              </li>
              <li style={styles.listItem}>
                <strong>Step 2:</strong> AI reviews formation documents and operating agreements
              </li>
              <li style={styles.listItem}>
                <strong>Step 3:</strong> Analyzes entity under check-the-box regulations
              </li>
              <li style={styles.listItem}>
                <strong>Step 4:</strong> Generates professional classification memorandum
              </li>
              <li style={styles.listItem}>
                <strong>Step 5:</strong> Validates citations and provides final recommendations
              </li>
            </ul>
          </div>

          {/* What You'll Get */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>✨</span>
              What You'll Receive
            </h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>Comprehensive entity classification analysis</li>
              <li style={styles.listItem}>Professional memorandum with tax recommendations</li>
              <li style={styles.listItem}>Citations to relevant regulations (Reg §301.7701)</li>
              <li style={styles.listItem}>Comparison of classification options</li>
              <li style={styles.listItem}>Action items and next steps</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div style={styles.highlight}>
            <p style={styles.highlightText}>
              ⚠️ <strong>Important:</strong> This tool provides AI-generated analysis for informational 
              purposes only. It does not constitute legal or tax advice. Always consult with a qualified 
              tax professional before making entity classification elections.
            </p>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              style={{...styles.button, ...styles.secondaryButton}}
              onClick={onClose}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.neutral[50]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              Close
            </button>
            
            <button
              style={{...styles.button, ...styles.primaryButton}}
              onClick={onGetStarted}
              onMouseOver={(e) => {
                e.currentTarget.style.background = tokens.colors.primary[700]
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = tokens.colors.primary[600]
              }}
            >
              Get Started →
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
