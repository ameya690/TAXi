import React, { useState } from 'react'
import tokens from './styles/designTokens'
import Header from './components/Header'
import AskQuestions from './components/AskQuestions'
import Documents from './components/Documents'
import EITCEligibility from './components/EITCEligibility'

// Regular user components (simplified)
function RegularHome() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
        Welcome to TAXi
      </h1>
      <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px' }}>
        Your personal tax assistant for EITC eligibility and general tax questions
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Check EITC Eligibility</h3>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>
            Find out if you qualify for the Earned Income Tax Credit and estimate your credit amount.
          </p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Ask Tax Questions</h3>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>
            Get answers to your tax questions powered by AI and IRS publications.
          </p>
        </div>
        
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Manage Documents</h3>
          <p style={{ color: '#64748b', marginBottom: '16px' }}>
            Upload and organize your tax documents securely in one place.
          </p>
        </div>
      </div>
      
      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#eff6ff',
        borderRadius: '8px',
        borderLeft: '4px solid #667eea'
      }}>
        <p style={{ margin: 0, color: '#1e40af' }}>
          ℹ️ <strong>Note:</strong> This tool provides general tax information only. For personalized tax advice, 
          please consult with a qualified tax professional.
        </p>
      </div>
    </div>
  )
}

export default function AppRegular({ onSwitchExperience }) {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'eligibility', label: 'Check Eligibility', icon: '✅' },
    { id: 'questions', label: 'Ask Questions', icon: '💬' },
    { id: 'documents', label: 'Documents', icon: '📄' },
    { id: 'admin', label: 'Settings', icon: '⚙️' }
  ]

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#fafbfc'
    },
    header: {
      background: tokens.colors.surface1,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      padding: `0 ${tokens.spacing.lg}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.sm,
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.bold,
      color: tokens.colors.neutral[900]
    },
    logoIcon: {
      fontSize: '28px'
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      background: tokens.colors.surface0,
      borderBottom: `${tokens.borders.width} solid ${tokens.borders.divider}`,
      padding: `0 ${tokens.spacing.lg}`,
      height: '48px'
    },
    navButton: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      background: 'transparent',
      border: 'none',
      borderRadius: tokens.borderRadius.sm,
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.neutral[600],
      cursor: 'pointer',
      transition: `all ${tokens.motion.duration.normal} ${tokens.motion.easing.out}`,
      display: 'flex',
      alignItems: 'center',
      gap: tokens.spacing.xs,
      outline: 'none'
    },
    navButtonActive: {
      background: tokens.colors.primary[600],
      color: '#ffffff',
      fontWeight: tokens.typography.fontWeight.semibold
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: tokens.colors.primary[100],
      color: tokens.colors.primary[700],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      position: 'relative'
    },
    content: {
      flex: 1,
      overflow: 'auto'
    },
    switchBanner: {
      background: '#fef3c7',
      padding: '12px 24px',
      textAlign: 'center',
      borderBottom: '1px solid #fbbf24',
      fontSize: '14px',
      color: '#92400e'
    },
    switchButton: {
      marginLeft: '12px',
      padding: '4px 12px',
      background: '#f59e0b',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <RegularHome />
      case 'eligibility':
        return <EITCEligibility />
      case 'questions':
        return <AskQuestions onNavigateToEligibility={() => setActiveTab('eligibility')} />
      case 'documents':
        return <Documents />
      case 'admin':
        return (
          <div style={{ padding: '40px' }}>
            <h2>Settings</h2>
            <p>Manage your account settings</p>
          </div>
        )
      default:
        return <RegularHome />
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🏛️</span>
          <span>TAXi</span>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '500', 
            color: tokens.colors.neutral[500],
            marginLeft: '8px'
          }}>
            Individual
          </span>
        </div>
        
        <div style={styles.avatar} onClick={onSwitchExperience} title="Switch to Professional">
          👤
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...styles.navButton,
              ...(activeTab === tab.id ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveTab(tab.id)}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = tokens.colors.neutral[100]
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span style={{ fontSize: tokens.iconSize.inline }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div style={styles.switchBanner}>
        💼 Need advanced features for tax professionals?
        <button style={styles.switchButton} onClick={onSwitchExperience}>
          Switch to Professional
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {renderContent()}
      </div>
    </div>
  )
}
