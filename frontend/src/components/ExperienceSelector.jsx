import React, { useState } from 'react'
import tokens from '../styles/designTokens'

export default function ExperienceSelector({ onSelect }) {
  const [hoveredCard, setHoveredCard] = useState(null)

  const experiences = [
    {
      id: 'regular',
      title: 'Individual Taxpayer',
      icon: '👤',
      description: 'Simple tools for personal tax needs',
      features: [
        'Check EITC eligibility',
        'Ask tax questions',
        'Upload and organize documents',
        'Get general tax guidance'
      ],
      disclaimer: 'Provides general tax information only, not personalized advice',
      color: tokens.colors.primary[500]
    },
    {
      id: 'pro',
      title: 'Tax Professional',
      icon: '💼',
      description: 'Advanced workspace for tax practitioners',
      features: [
        'AI-powered research assistant',
        'Multi-step workflow automation',
        'Client document vault',
        'Knowledge base management'
      ],
      disclaimer: null,
      color: tokens.colors.primary[600]
    }
  ]

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: tokens.spacing.lg
    },
    container: {
      maxWidth: '1000px',
      width: '100%',
      textAlign: 'center'
    },
    header: {
      marginBottom: tokens.spacing.xl,
      color: 'white'
    },
    logo: {
      fontSize: '48px',
      marginBottom: tokens.spacing.md
    },
    title: {
      fontSize: tokens.typography.fontSize.h1,
      fontWeight: tokens.typography.fontWeight.bold,
      margin: 0,
      marginBottom: tokens.spacing.sm,
      color: 'white'
    },
    subtitle: {
      fontSize: tokens.typography.fontSize.lg,
      margin: 0,
      color: 'rgba(255, 255, 255, 0.9)'
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: tokens.spacing.lg,
      marginBottom: tokens.spacing.lg
    },
    card: {
      background: tokens.colors.surface1,
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.xl,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
      border: '3px solid transparent',
      position: 'relative',
      overflow: 'hidden',
      outline: 'none'
    },
    cardHovered: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
      borderColor: tokens.colors.primary[500]
    },
    cardIcon: {
      fontSize: '64px',
      marginBottom: tokens.spacing.md,
      display: 'block'
    },
    cardTitle: {
      fontSize: tokens.typography.fontSize.h3,
      fontWeight: tokens.typography.fontWeight.bold,
      color: tokens.colors.neutral[900],
      margin: 0,
      marginBottom: tokens.spacing.xs
    },
    cardDescription: {
      fontSize: tokens.typography.fontSize.base,
      color: tokens.colors.neutral[600],
      marginBottom: tokens.spacing.lg
    },
    featuresList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      marginBottom: tokens.spacing.lg,
      textAlign: 'left'
    },
    featureItem: {
      fontSize: tokens.typography.fontSize.sm,
      color: tokens.colors.neutral[700],
      marginBottom: tokens.spacing.sm,
      paddingLeft: tokens.spacing.lg,
      position: 'relative',
      lineHeight: tokens.typography.lineHeight.relaxed
    },
    featureIcon: {
      position: 'absolute',
      left: 0,
      color: tokens.colors.primary[500]
    },
    disclaimer: {
      fontSize: tokens.typography.fontSize.xs,
      color: tokens.colors.neutral[500],
      fontStyle: 'italic',
      padding: tokens.spacing.sm,
      background: tokens.colors.neutral[50],
      borderRadius: tokens.borderRadius.sm,
      marginTop: tokens.spacing.md
    },
    button: {
      width: '100%',
      padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
      background: tokens.colors.primary[600],
      color: 'white',
      border: 'none',
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.semibold,
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.fast} ${tokens.motion.easing.out}`,
      outline: 'none'
    },
    footer: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: tokens.typography.fontSize.sm,
      marginTop: tokens.spacing.xl
    }
  }

  const handleSelect = (experienceId) => {
    localStorage.setItem('experience', experienceId)
    onSelect(experienceId)
  }

  const handleKeyDown = (e, experienceId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(experienceId)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logo}>🏛️</div>
          <h1 style={styles.title}>Welcome to TAXi</h1>
          <p style={styles.subtitle}>Choose your experience to get started</p>
        </div>

        <div style={styles.cardsContainer}>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              role="button"
              tabIndex={0}
              style={{
                ...styles.card,
                ...(hoveredCard === exp.id ? styles.cardHovered : {})
              }}
              onClick={() => handleSelect(exp.id)}
              onKeyDown={(e) => handleKeyDown(e, exp.id)}
              onMouseEnter={() => setHoveredCard(exp.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onFocus={() => setHoveredCard(exp.id)}
              onBlur={() => setHoveredCard(null)}
              aria-label={`Select ${exp.title} experience`}
            >
              <span style={styles.cardIcon}>{exp.icon}</span>
              <h2 style={styles.cardTitle}>{exp.title}</h2>
              <p style={styles.cardDescription}>{exp.description}</p>

              <ul style={styles.featuresList}>
                {exp.features.map((feature, idx) => (
                  <li key={idx} style={styles.featureItem}>
                    <span style={styles.featureIcon}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {exp.disclaimer && (
                <div style={styles.disclaimer}>
                  ⚠️ {exp.disclaimer}
                </div>
              )}

              <button
                style={styles.button}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = tokens.colors.primary[700]
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = tokens.colors.primary[600]
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(exp.id)
                }}
              >
                Continue as {exp.title}
              </button>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <p>You can switch between experiences anytime from your profile menu</p>
        </div>
      </div>
    </div>
  )
}
