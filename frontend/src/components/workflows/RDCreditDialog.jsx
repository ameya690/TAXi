import React from 'react'
import tokens from '../../styles/designTokens'

export default function RDCreditDialog({ onClose, onGetStarted }) {
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
          <div style={styles.header}>
            <span style={styles.icon}>🔬</span>
            <div style={styles.headerText}>
              <h2 style={styles.title}>R&D Credit Eligibility</h2>
              <p style={styles.subtitle}>AI-Powered Research & Development Tax Credit Analysis</p>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>ℹ️</span>
              What is the R&D Tax Credit?
            </h3>
            <p style={styles.text}>
              The Research & Development (R&D) Tax Credit (IRC §41) is a valuable federal tax incentive 
              that rewards companies for investing in innovation. It can offset income tax liability 
              dollar-for-dollar and, for qualified small businesses, can even offset payroll taxes.
            </p>
            <div style={styles.highlight}>
              <p style={styles.highlightText}>
                💡 Many companies don't realize they qualify! The R&D credit isn't just for scientists 
                in labs—it applies to software development, manufacturing improvements, product design, 
                and much more.
              </p>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📋</span>
              Four-Part Test for Qualification
            </h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Permitted Purpose:</strong> New or improved product, process, software, technique, formula, or invention
              </li>
              <li style={styles.listItem}>
                <strong>Elimination of Uncertainty:</strong> Technical uncertainty about capability, method, or design
              </li>
              <li style={styles.listItem}>
                <strong>Process of Experimentation:</strong> Systematic evaluation of alternatives
              </li>
              <li style={styles.listItem}>
                <strong>Technological in Nature:</strong> Relies on principles of physical/biological sciences, engineering, or computer science
              </li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>🎯</span>
              How This Workflow Works
            </h3>
            <p style={styles.text}>
              This AI-powered workflow evaluates your R&D activities and estimates potential credits:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Step 1:</strong> Collect project and expense data
              </li>
              <li style={styles.listItem}>
                <strong>Step 2:</strong> AI analyzes activities against the four-part test
              </li>
              <li style={styles.listItem}>
                <strong>Step 3:</strong> Calculates qualified research expenses (QREs)
              </li>
              <li style={styles.listItem}>
                <strong>Step 4:</strong> Estimates credit amount using regular or ASC method
              </li>
              <li style={styles.listItem}>
                <strong>Step 5:</strong> Generates detailed eligibility report with documentation guidance
              </li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>✨</span>
              What You'll Receive
            </h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>Eligibility determination for each activity</li>
              <li style={styles.listItem}>Estimated R&D credit amount (federal & state)</li>
              <li style={styles.listItem}>Qualified Research Expenses (QRE) breakdown</li>
              <li style={styles.listItem}>Four-part test analysis for each project</li>
              <li style={styles.listItem}>Documentation requirements and best practices</li>
              <li style={styles.listItem}>Form 6765 preparation guidance</li>
            </ul>
          </div>

          <div style={styles.highlight}>
            <p style={styles.highlightText}>
              ⚠️ <strong>Important:</strong> This tool provides AI-generated estimates for planning 
              purposes only. R&D credit claims require detailed contemporaneous documentation and 
              should be prepared by qualified tax professionals. IRS scrutiny of R&D credits is high.
            </p>
          </div>

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
