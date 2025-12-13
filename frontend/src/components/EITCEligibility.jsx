import React, { useState } from 'react'

export default function EITCEligibility() {
  const [formData, setFormData] = useState({
    filingStatus: '',
    earnedIncome: '',
    agi: '',
    qualifyingChildren: '',
    investmentIncome: '',
    taxYear: '2024'
  })
  const [result, setResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateEITC = () => {
    setIsCalculating(true)
    
    // Simulate calculation
    setTimeout(() => {
      const earnedIncome = parseFloat(formData.earnedIncome) || 0
      const agi = parseFloat(formData.agi) || 0
      const children = parseInt(formData.qualifyingChildren) || 0
      const investmentIncome = parseFloat(formData.investmentIncome) || 0
      
      // 2024 EITC thresholds and calculations
      const limits = {
        'Single': { 0: 18380, 1: 48440, 2: 54884, 3: 58380 },
        'Married Filing Jointly': { 0: 24800, 1: 54440, 2: 60884, 3: 64380 },
        'Head of Household': { 0: 18380, 1: 48440, 2: 54884, 3: 58380 }
      }
      
      const maxCredits = {
        0: 632,
        1: 4213,
        2: 6960,
        3: 7830
      }
      
      const status = formData.filingStatus
      const limit = limits[status]?.[Math.min(children, 3)] || 0
      const maxCredit = maxCredits[Math.min(children, 3)] || 0
      
      // Check eligibility
      const eligible = 
        earnedIncome > 0 &&
        agi <= limit &&
        investmentIncome <= 11600 &&
        status !== 'Married Filing Separately'
      
      // Simple credit calculation (simplified for demo)
      let creditAmount = 0
      if (eligible) {
        const phaseInRate = children === 0 ? 0.0765 : children === 1 ? 0.34 : children === 2 ? 0.40 : 0.45
        const phaseInLimit = children === 0 ? 8260 : children === 1 ? 12390 : children === 2 ? 17400 : 17400
        
        if (earnedIncome <= phaseInLimit) {
          creditAmount = earnedIncome * phaseInRate
        } else {
          creditAmount = maxCredit - ((agi - phaseInLimit) * 0.1598)
        }
        creditAmount = Math.max(0, Math.min(creditAmount, maxCredit))
      }
      
      setResult({
        eligible,
        creditAmount: Math.round(creditAmount),
        maxCredit,
        incomeLimit: limit,
        details: {
          earnedIncome,
          agi,
          children,
          status,
          investmentIncome
        }
      })
      setIsCalculating(false)
    }, 1000)
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fafbfc'
    },
    header: {
      padding: '24px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0'
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0
    },
    content: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    },
    card: {
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '16px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#334155',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box',
      background: 'white'
    },
    button: {
      width: '100%',
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '8px'
    },
    buttonDisabled: {
      background: '#94a3b8',
      cursor: 'not-allowed'
    },
    resultCard: {
      background: 'white',
      border: '2px solid #2563eb',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '24px'
    },
    resultHeader: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '16px',
      textAlign: 'center'
    },
    resultAmount: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#2563eb',
      textAlign: 'center',
      marginBottom: '8px'
    },
    resultSubtext: {
      fontSize: '14px',
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '24px'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginTop: '16px',
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '8px'
    },
    detailItem: {
      fontSize: '14px'
    },
    detailLabel: {
      color: '#64748b',
      marginBottom: '4px'
    },
    detailValue: {
      color: '#1e293b',
      fontWeight: '600'
    },
    ineligibleCard: {
      background: '#fef2f2',
      border: '2px solid #dc2626',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '24px'
    },
    ineligibleHeader: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#dc2626',
      marginBottom: '12px',
      textAlign: 'center'
    },
    ineligibleText: {
      fontSize: '14px',
      color: '#64748b',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    disclaimer: {
      fontSize: '12px',
      color: '#64748b',
      marginTop: '16px',
      padding: '12px',
      background: '#f8fafc',
      borderRadius: '6px',
      textAlign: 'center'
    }
  }

  const isFormValid = formData.filingStatus && formData.earnedIncome && formData.agi && formData.qualifyingChildren !== ''

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>EITC Eligibility Calculator</h1>
        <p style={styles.subtitle}>
          Check if you qualify for the Earned Income Tax Credit and estimate your credit amount
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Your Information</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Filing Status *</label>
            <select
              style={styles.select}
              value={formData.filingStatus}
              onChange={(e) => handleInputChange('filingStatus', e.target.value)}
            >
              <option value="">Select filing status</option>
              <option value="Single">Single</option>
              <option value="Married Filing Jointly">Married Filing Jointly</option>
              <option value="Head of Household">Head of Household</option>
              <option value="Qualifying Widow(er)">Qualifying Widow(er)</option>
              <option value="Married Filing Separately">Married Filing Separately</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Earned Income *</label>
            <input
              type="number"
              style={styles.input}
              placeholder="Enter your earned income (wages, salary, self-employment)"
              value={formData.earnedIncome}
              onChange={(e) => handleInputChange('earnedIncome', e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Adjusted Gross Income (AGI) *</label>
            <input
              type="number"
              style={styles.input}
              placeholder="Enter your AGI from tax return"
              value={formData.agi}
              onChange={(e) => handleInputChange('agi', e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Number of Qualifying Children *</label>
            <input
              type="number"
              style={styles.input}
              placeholder="0, 1, 2, or 3+"
              min="0"
              value={formData.qualifyingChildren}
              onChange={(e) => handleInputChange('qualifyingChildren', e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Investment Income (optional)</label>
            <input
              type="number"
              style={styles.input}
              placeholder="Interest, dividends, capital gains"
              value={formData.investmentIncome}
              onChange={(e) => handleInputChange('investmentIncome', e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Tax Year</label>
            <input
              type="number"
              style={styles.input}
              value={formData.taxYear}
              onChange={(e) => handleInputChange('taxYear', e.target.value)}
            />
          </div>

          <button
            style={{
              ...styles.button,
              ...((!isFormValid || isCalculating) ? styles.buttonDisabled : {})
            }}
            onClick={calculateEITC}
            disabled={!isFormValid || isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Eligibility'}
          </button>
        </div>

        {result && (
          result.eligible ? (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>✅ You May Qualify for EITC!</div>
              <div style={styles.resultAmount}>${result.creditAmount.toLocaleString()}</div>
              <div style={styles.resultSubtext}>Estimated credit amount for {formData.taxYear}</div>
              
              <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>Filing Status</div>
                  <div style={styles.detailValue}>{result.details.status}</div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>Qualifying Children</div>
                  <div style={styles.detailValue}>{result.details.children}</div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>Earned Income</div>
                  <div style={styles.detailValue}>${result.details.earnedIncome.toLocaleString()}</div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>AGI</div>
                  <div style={styles.detailValue}>${result.details.agi.toLocaleString()}</div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>Income Limit</div>
                  <div style={styles.detailValue}>${result.incomeLimit.toLocaleString()}</div>
                </div>
                <div style={styles.detailItem}>
                  <div style={styles.detailLabel}>Maximum Credit</div>
                  <div style={styles.detailValue}>${result.maxCredit.toLocaleString()}</div>
                </div>
              </div>

              <div style={styles.disclaimer}>
                This is an estimate only. Actual credit may vary based on additional factors. 
                Consult IRS Publication 596 or a tax professional for complete eligibility requirements.
              </div>
            </div>
          ) : (
            <div style={styles.ineligibleCard}>
              <div style={styles.ineligibleHeader}>❌ Not Eligible for EITC</div>
              <div style={styles.ineligibleText}>
                Based on the information provided, you may not qualify for EITC. 
                This could be due to income exceeding limits (${result.incomeLimit.toLocaleString()}), 
                investment income over $11,600, or filing status restrictions.
                <br /><br />
                Review your information and try again, or consult a tax professional for personalized guidance.
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
