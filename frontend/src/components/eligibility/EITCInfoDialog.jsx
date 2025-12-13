import React from 'react'
import tokens from '../../styles/designTokens'

export default function EITCInfoDialog({ onClose, onGetStarted }) {
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
            <span style={styles.icon}>💰</span>
            <div style={styles.headerText}>
              <h2 style={styles.title}>EITC Eligibility Assessment</h2>
              <p style={styles.subtitle}>Earned Income Tax Credit - Free Money for Working Families</p>
            </div>
          </div>

          {/* What is EITC */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>ℹ️</span>
              What is the EITC?
            </h3>
            <p style={styles.text}>
              The <strong>Earned Income Tax Credit (EITC)</strong> is a refundable tax credit for low to moderate-income 
              working individuals and families. It reduces the amount of tax you owe and may result in a refund, 
              even if you don't owe any taxes.
            </p>
            <div style={styles.highlight}>
              <p style={styles.highlightText}>
                💡 The EITC is designed to supplement wages for working people with low to moderate income. 
                It can be worth up to <strong>$7,430</strong> for families with three or more children!
              </p>
            </div>
          </div>

          {/* Key Benefits */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>✨</span>
              Key Benefits
            </h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Refundable Credit:</strong> You can get money back even if you don't owe taxes
              </li>
              <li style={styles.listItem}>
                <strong>Boosts Income:</strong> Helps working families make ends meet
              </li>
              <li style={styles.listItem}>
                <strong>No Cost:</strong> Free to claim on your tax return
              </li>
              <li style={styles.listItem}>
                <strong>Increases with Children:</strong> Larger credit for families with qualifying children
              </li>
            </ul>
          </div>

          {/* How This Assessment Works */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🎯</span>
              How This Assessment Works
            </h3>
            <p style={styles.text}>
              This tool will help you determine if you qualify for the EITC and estimate your potential credit amount. 
              We'll ask you about:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Your filing status and age</li>
              <li style={styles.listItem}>Number of qualifying children</li>
              <li style={styles.listItem}>Your earned income and investment income</li>
              <li style={styles.listItem}>Residency and citizenship status</li>
              <li style={styles.listItem}>Other eligibility requirements</li>
            </ul>
          </div>

          {/* Quick Eligibility Check */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📋</span>
              Basic Requirements
            </h3>
            <p style={styles.text}>To qualify for EITC, you generally must:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Have earned income from employment or self-employment</li>
              <li style={styles.listItem}>Have a valid Social Security number</li>
              <li style={styles.listItem}>Be a U.S. citizen or resident alien all year</li>
              <li style={styles.listItem}>Not file as "Married Filing Separately"</li>
              <li style={styles.listItem}>Have investment income of $11,000 or less</li>
              <li style={styles.listItem}>Meet income limits based on your filing status and number of children</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div style={styles.highlight}>
            <p style={styles.highlightText}>
              ⚠️ <strong>Important:</strong> This is an assessment tool for informational purposes only. 
              It does not constitute tax advice. For official guidance, consult a qualified tax professional 
              or visit IRS.gov.
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
