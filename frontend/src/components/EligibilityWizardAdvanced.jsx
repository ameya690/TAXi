import React, { useEffect, useState } from 'react'

export default function EligibilityWizardAdvanced({ lang, t }) {
  console.log('EligibilityWizardAdvanced component loaded')
  
  const [schema, setSchema] = useState(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    tax_year: 2024,
    filing_status: 'single',
    age: 30,
    spouse_age: null,
    ssn_valid: true,
    spouse_ssn_valid: true,
    is_us_resident: true,
    qualifying_children: 0,
    earned_income: 0,
    agi: 0,
    investment_income: 0,
    has_foreign_earned_income: false,
    claimed_as_dependent: false,
    lived_in_us_over_half_year: true,
    is_self_employed: false,
    self_employment_tax: 0
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('Loading schema...')
    fetch('http://localhost:5000/api/eligibility/schema')
      .then(r => {
        console.log('Schema response:', r.status)
        return r.json()
      })
      .then(data => {
        console.log('Schema loaded:', data)
        setSchema(data)
      })
      .catch(err => {
        console.error('Schema load error:', err)
        // Set a minimal schema so UI still works
        setSchema({ version: '2.0.0', fields: [] })
      })
  }, [])

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/eligibility/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setResult(data)
      setStep(4) // Jump to results
    } catch (err) {
      console.error('Assessment error:', err)
      alert('Error assessing eligibility. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!schema) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      gap: '16px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <div style={{ color: '#2d3748', fontSize: '16px' }}>Loading calculator...</div>
    </div>
  )

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    card: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    header: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#2d3748',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    steps: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      flexWrap: 'wrap'
    },
    stepButton: {
      flex: 1,
      minWidth: '120px',
      padding: '12px 16px',
      border: 'none',
      borderRadius: '8px',
      background: '#f7fafc',
      color: '#4a5568',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    stepButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    },
    formGrid: {
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontWeight: '500',
      color: '#2d3748',
      fontSize: '14px'
    },
    help: {
      fontSize: '12px',
      color: '#718096',
      marginTop: '4px'
    },
    input: {
      padding: '10px 14px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'border 0.2s'
    },
    inputFocus: {
      borderColor: '#667eea'
    },
    select: {
      padding: '10px 14px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      cursor: 'pointer'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
      flexWrap: 'wrap'
    },
    button: {
      flex: 1,
      padding: '14px 32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      minWidth: '150px'
    },
    buttonSecondary: {
      background: '#e2e8f0',
      color: '#4a5568'
    },
    resultCard: {
      marginTop: '24px'
    },
    eligibleBadge: {
      display: 'inline-block',
      padding: '8px 16px',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '14px',
      marginBottom: '16px'
    },
    eligibleTrue: {
      background: '#c6f6d5',
      color: '#22543d'
    },
    eligibleFalse: {
      background: '#fed7d7',
      color: '#742a2a'
    },
    creditAmount: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#667eea',
      marginBottom: '8px'
    },
    section: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#2d3748'
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    listItem: {
      padding: '10px 0',
      borderBottom: '1px solid #f7fafc',
      fontSize: '14px',
      lineHeight: '1.6'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      gap: '16px'
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    confidence: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: '500',
      background: '#edf2f7',
      color: '#4a5568'
    }
  }

  const renderStep1 = () => (
    <div style={styles.card}>
      <div style={styles.header}>
        <span>👤</span>
        Personal Information
      </div>
      <div style={styles.formGrid}>
        <div style={styles.field}>
          <label style={styles.label}>Tax Year</label>
          <input 
            style={styles.input}
            type="number" 
            value={form.tax_year} 
            onChange={e => setForm({...form, tax_year: parseInt(e.target.value)||2024})} 
          />
          <div style={styles.help}>The tax year you're filing for</div>
        </div>
        
        <div style={styles.field}>
          <label style={styles.label}>Filing Status *</label>
          <select 
            style={styles.select}
            value={form.filing_status} 
            onChange={e => setForm({...form, filing_status: e.target.value})}
          >
            <option value="single">Single</option>
            <option value="married_filing_jointly">Married Filing Jointly</option>
            <option value="married_filing_separately">Married Filing Separately</option>
            <option value="head_of_household">Head of Household</option>
            <option value="qualifying_widow">Qualifying Surviving Spouse</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Your Age *</label>
          <input 
            style={styles.input}
            type="number" 
            value={form.age} 
            onChange={e => setForm({...form, age: parseInt(e.target.value)||0})} 
          />
          <div style={styles.help}>Your age on December 31</div>
        </div>

        {form.filing_status === 'married_filing_jointly' && (
          <div style={styles.field}>
            <label style={styles.label}>Spouse's Age</label>
            <input 
              style={styles.input}
              type="number" 
              value={form.spouse_age || ''} 
              onChange={e => setForm({...form, spouse_age: parseInt(e.target.value)||null})} 
            />
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>
            <input 
              type="checkbox"
              style={styles.checkbox}
              checked={form.ssn_valid} 
              onChange={e => setForm({...form, ssn_valid: e.target.checked})} 
            />
            {' '}Valid Social Security Number
          </label>
          <div style={styles.help}>SSN valid for employment</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            <input 
              type="checkbox"
              style={styles.checkbox}
              checked={form.is_us_resident} 
              onChange={e => setForm({...form, is_us_resident: e.target.checked})} 
            />
            {' '}U.S. Citizen/Resident Alien
          </label>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div style={styles.card}>
      <div style={styles.header}>
        <span>👨‍👩‍👧‍👦</span>
        Children & Dependents
      </div>
      <div style={styles.formGrid}>
        <div style={styles.field}>
          <label style={styles.label}>Number of Qualifying Children *</label>
          <input 
            style={styles.input}
            type="number" 
            min="0"
            value={form.qualifying_children} 
            onChange={e => setForm({...form, qualifying_children: parseInt(e.target.value)||0})} 
          />
          <div style={styles.help}>Children meeting all 4 EITC tests</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            <input 
              type="checkbox"
              style={styles.checkbox}
              checked={form.claimed_as_dependent} 
              onChange={e => setForm({...form, claimed_as_dependent: e.target.checked})} 
            />
            {' '}Someone else claims you as dependent
          </label>
        </div>

        {form.qualifying_children === 0 && (
          <div style={styles.field}>
            <label style={styles.label}>
              <input 
                type="checkbox"
                style={styles.checkbox}
                checked={form.lived_in_us_over_half_year} 
                onChange={e => setForm({...form, lived_in_us_over_half_year: e.target.checked})} 
              />
              {' '}Lived in U.S. over half the year
            </label>
            <div style={styles.help}>Required if claiming without children</div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div style={styles.card}>
      <div style={styles.header}>
        <span>💰</span>
        Income Information
      </div>
      <div style={styles.formGrid}>
        <div style={styles.field}>
          <label style={styles.label}>Earned Income ($) *</label>
          <input 
            style={styles.input}
            type="number" 
            min="0"
            step="1"
            value={form.earned_income} 
            onChange={e => setForm({...form, earned_income: parseFloat(e.target.value)||0})} 
          />
          <div style={styles.help}>Wages, salary, tips, self-employment</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Adjusted Gross Income - AGI ($) *</label>
          <input 
            style={styles.input}
            type="number" 
            min="0"
            step="1"
            value={form.agi} 
            onChange={e => setForm({...form, agi: parseFloat(e.target.value)||0})} 
          />
          <div style={styles.help}>From your tax return</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Investment Income ($)</label>
          <input 
            style={styles.input}
            type="number" 
            min="0"
            step="1"
            value={form.investment_income} 
            onChange={e => setForm({...form, investment_income: parseFloat(e.target.value)||0})} 
          />
          <div style={styles.help}>Interest, dividends, capital gains</div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>
            <input 
              type="checkbox"
              style={styles.checkbox}
              checked={form.is_self_employed} 
              onChange={e => setForm({...form, is_self_employed: e.target.checked})} 
            />
            {' '}Self-Employed
          </label>
        </div>

        {form.is_self_employed && (
          <div style={styles.field}>
            <label style={styles.label}>Self-Employment Tax ($)</label>
            <input 
              style={styles.input}
              type="number" 
              min="0"
              step="1"
              value={form.self_employment_tax} 
              onChange={e => setForm({...form, self_employment_tax: parseFloat(e.target.value)||0})} 
            />
            <div style={styles.help}>Your SE tax amount</div>
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.label}>
            <input 
              type="checkbox"
              style={styles.checkbox}
              checked={form.has_foreign_earned_income} 
              onChange={e => setForm({...form, has_foreign_earned_income: e.target.checked})} 
            />
            {' '}Filing Form 2555 (Foreign Income)
          </label>
        </div>
      </div>
    </div>
  )

  const renderResults = () => {
    if (!result) return null

    return (
      <div style={styles.card}>
        <div style={styles.header}>
          <span>📊</span>
          Your EITC Assessment Results
        </div>

        <div style={{textAlign: 'center', padding: '20px'}}>
          <div style={{
            ...styles.eligibleBadge,
            ...(result.eligible ? styles.eligibleTrue : styles.eligibleFalse)
          }}>
            {result.eligible ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}
          </div>
          
          {result.confidence && (
            <div style={styles.confidence}>
              Confidence: {result.confidence.toUpperCase()}
            </div>
          )}

          {result.eligible && result.estimated_credit > 0 && (
            <div>
              <div style={{fontSize: '14px', color: '#718096', marginTop: '20px'}}>
                Estimated Credit Amount
              </div>
              <div style={styles.creditAmount}>
                ${result.estimated_credit.toLocaleString()}
              </div>
              <div style={{fontSize: '14px', color: '#718096'}}>
                For Tax Year {result.tax_year}
              </div>
            </div>
          )}
        </div>

        {result.reasons && result.reasons.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              {result.eligible ? '✅ Assessment Details' : '❌ Reasons for Ineligibility'}
            </div>
            <ul style={styles.list}>
              {result.reasons.map((r, i) => (
                <li key={i} style={styles.listItem}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {result.success_factors && result.success_factors.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>✅ What You Have Going For You</div>
            <ul style={styles.list}>
              {result.success_factors.map((r, i) => (
                <li key={i} style={styles.listItem}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {result.warnings && result.warnings.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>⚠️ Warnings & Notes</div>
            <ul style={styles.list}>
              {result.warnings.map((r, i) => (
                <li key={i} style={styles.listItem}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {result.next_steps && result.next_steps.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>📝 Next Steps</div>
            <ul style={styles.list}>
              {result.next_steps.map((r, i) => (
                <li key={i} style={styles.listItem}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {result.additional_credits && result.additional_credits.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionTitle}>💡 Other Credits You May Qualify For</div>
            <ul style={styles.list}>
              {result.additional_credits.map((r, i) => (
                <li key={i} style={styles.listItem}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{...styles.section, fontSize: '12px', color: '#718096', fontStyle: 'italic'}}>
          {result.disclaimer}
        </div>

        <div style={styles.buttonGroup}>
          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={() => {
              setResult(null)
              setStep(1)
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {result ? renderResults() : (
        <>
          <div style={styles.steps}>
            <button 
              style={{...styles.stepButton, ...(step === 1 ? styles.stepButtonActive : {})}}
              onClick={() => setStep(1)}
            >
              1. Personal
            </button>
            <button 
              style={{...styles.stepButton, ...(step === 2 ? styles.stepButtonActive : {})}}
              onClick={() => setStep(2)}
            >
              2. Children
            </button>
            <button 
              style={{...styles.stepButton, ...(step === 3 ? styles.stepButtonActive : {})}}
              onClick={() => setStep(3)}
            >
              3. Income
            </button>
          </div>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div style={styles.buttonGroup}>
            {step > 1 && (
              <button 
                style={{...styles.button, ...styles.buttonSecondary}}
                onClick={() => setStep(step - 1)}
              >
                ← Previous
              </button>
            )}
            {step < 3 ? (
              <button 
                style={styles.button}
                onClick={() => setStep(step + 1)}
              >
                Next →
              </button>
            ) : (
              <button 
                style={styles.button}
                onClick={submit}
                disabled={loading}
              >
                {loading ? 'Calculating...' : '🔍 Check Eligibility'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
