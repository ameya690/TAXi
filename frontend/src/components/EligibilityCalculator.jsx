import React, { useState, useEffect } from 'react'

export default function EligibilityCalculator({ lang, t }) {
  const [form, setForm] = useState({
    tax_year: 2024,
    filing_status: 'single',
    age: 30,
    ssn_valid: true,
    is_us_resident: true,
    qualifying_children: 0,
    earned_income: 25000,
    agi: 25000,
    investment_income: 0,
    has_foreign_earned_income: false,
    claimed_as_dependent: false,
    lived_in_us_over_half_year: true,
    is_self_employed: false,
    self_employment_tax: 0
  })
  
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/eligibility/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Error checking eligibility. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '30px',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
      }}>
        <h2 style={{ margin: 0, fontSize: '28px', marginBottom: '8px' }}>
          🧮 EITC Eligibility Calculator
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          Calculate your Earned Income Tax Credit for 2024
        </p>
      </div>

      {/* Income Sources Guide */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '10px' }}>
          💵 What Income Counts for EITC?
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Earned Income */}
          <div style={{
            padding: '20px',
            background: '#f0fff4',
            border: '2px solid #c6f6d5',
            borderRadius: '10px'
          }}>
            <h4 style={{ margin: 0, marginBottom: '12px', color: '#22543d', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✅ Earned Income (Counts)
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#2d3748' }}>
              <li><strong>Wages & Salaries</strong> - W-2 income from jobs</li>
              <li><strong>Tips</strong> - Reported and unreported tips</li>
              <li><strong>Self-Employment Income</strong> - Net profit from business (Schedule C)</li>
              <li><strong>Farm Income</strong> - Agricultural business income (Schedule F)</li>
              <li><strong>Union Strike Benefits</strong></li>
              <li><strong>Long-Term Disability</strong> - Before minimum retirement age</li>
              <li><strong>Nontaxable Combat Pay</strong> - Optional to include</li>
            </ul>
          </div>

          {/* Investment Income */}
          <div style={{
            padding: '20px',
            background: '#fffaf0',
            border: '2px solid #fbd38d',
            borderRadius: '10px'
          }}>
            <h4 style={{ margin: 0, marginBottom: '12px', color: '#7c2d12', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ Investment Income (Must be ≤ $11,000)
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#2d3748' }}>
              <li><strong>Interest Income</strong> - Taxable & tax-exempt</li>
              <li><strong>Dividends</strong> - Ordinary & qualified</li>
              <li><strong>Capital Gains</strong> - Net capital gain income</li>
              <li><strong>Rental Income</strong> - Passive rental income</li>
              <li><strong>Royalties</strong> - Income from royalties</li>
            </ul>
            <div style={{ marginTop: '12px', padding: '10px', background: 'white', borderRadius: '6px', fontSize: '13px' }}>
              <strong>⚠️ Important:</strong> If total investment income exceeds $11,000, you cannot claim EITC.
            </div>
          </div>

          {/* Does NOT Count */}
          <div style={{
            padding: '20px',
            background: '#fff5f5',
            border: '2px solid #feb2b2',
            borderRadius: '10px'
          }}>
            <h4 style={{ margin: 0, marginBottom: '12px', color: '#742a2a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ❌ Does NOT Count as Earned Income
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8', color: '#2d3748' }}>
              <li><strong>Social Security Benefits</strong></li>
              <li><strong>Unemployment Compensation</strong></li>
              <li><strong>Pensions & Annuities</strong></li>
              <li><strong>Alimony & Child Support</strong></li>
              <li><strong>Welfare Benefits</strong> - TANF, SNAP, etc.</li>
              <li><strong>Workers' Compensation</strong></li>
              <li><strong>Disability Insurance</strong> - After retirement age</li>
              <li><strong>Scholarships & Grants</strong> - For tuition</li>
            </ul>
          </div>
        </div>

        {/* Calculation Tips */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '10px',
          border: '2px solid rgba(102, 126, 234, 0.3)'
        }}>
          <h4 style={{ margin: 0, marginBottom: '12px', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💡 Calculation Tips
          </h4>
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#4a5568' }}>
            <p style={{ margin: 0, marginBottom: '10px' }}>
              <strong>Earned Income:</strong> Add all W-2 wages + self-employment net profit (after expenses)
            </p>
            <p style={{ margin: 0, marginBottom: '10px' }}>
              <strong>AGI (Adjusted Gross Income):</strong> Found on line 11 of your Form 1040
            </p>
            <p style={{ margin: 0, marginBottom: '10px' }}>
              <strong>Self-Employed?</strong> Subtract half of your self-employment tax from net profit
            </p>
            <p style={{ margin: 0 }}>
              <strong>EITC uses the LESSER of:</strong> Your earned income OR your AGI
            </p>
          </div>
        </div>

        {/* Examples */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: '#f7fafc',
          borderRadius: '10px'
        }}>
          <h4 style={{ margin: 0, marginBottom: '15px', color: '#2d3748' }}>
            📋 Examples
          </h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ padding: '15px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
              <strong style={{ color: '#22543d' }}>✓ Employed Worker:</strong>
              <div style={{ fontSize: '14px', marginTop: '8px', color: '#4a5568' }}>
                W-2 wages: $30,000 + Tips: $2,000 = <strong>$32,000 earned income</strong>
              </div>
            </div>
            <div style={{ padding: '15px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
              <strong style={{ color: '#22543d' }}>✓ Self-Employed:</strong>
              <div style={{ fontSize: '14px', marginTop: '8px', color: '#4a5568' }}>
                Gross receipts: $50,000 - Business expenses: $15,000 = Net profit: $35,000<br />
                Self-employment tax: $4,900 ÷ 2 = $2,450 deduction<br />
                <strong>$32,550 earned income</strong> (35,000 - 2,450)
              </div>
            </div>
            <div style={{ padding: '15px', background: 'white', borderRadius: '8px', borderLeft: '4px solid #48bb78' }}>
              <strong style={{ color: '#22543d' }}>✓ Multiple Jobs:</strong>
              <div style={{ fontSize: '14px', marginTop: '8px', color: '#4a5568' }}>
                Job 1: $20,000 + Job 2: $10,000 + Side business: $5,000 = <strong>$35,000 earned income</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          {/* Personal Info Section */}
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#2d3748' }}>
            📋 Personal Information
          </h3>
          
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748' }}>
                Tax Year
              </label>
              <input
                type="number"
                value={form.tax_year}
                onChange={(e) => updateForm('tax_year', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748' }}>
                Filing Status
              </label>
              <select
                value={form.filing_status}
                onChange={(e) => updateForm('filing_status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              >
                <option value="single">Single</option>
                <option value="married_filing_jointly">Married Filing Jointly</option>
                <option value="married_filing_separately">Married Filing Separately</option>
                <option value="head_of_household">Head of Household</option>
                <option value="qualifying_widow">Qualifying Surviving Spouse</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748' }}>
                Your Age
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => updateForm('age', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748' }}>
                Qualifying Children
              </label>
              <input
                type="number"
                min="0"
                value={form.qualifying_children}
                onChange={(e) => updateForm('qualifying_children', parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          {/* Income Section */}
          <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#2d3748' }}>
            💰 Income Information
          </h3>
          
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748' }}>
                Earned Income ($)
              </label>
              <input
                type="number"
                value={form.earned_income}
                onChange={(e) => updateForm('earned_income', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
              <small style={{ color: '#718096', fontSize: '12px' }}>Wages, salary, tips</small>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748' }}>
                AGI - Adjusted Gross Income ($)
              </label>
              <input
                type="number"
                value={form.agi}
                onChange={(e) => updateForm('agi', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
              <small style={{ color: '#718096', fontSize: '12px' }}>From tax return</small>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2d3748' }}>
                Investment Income ($)
              </label>
              <input
                type="number"
                value={form.investment_income}
                onChange={(e) => updateForm('investment_income', parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
              <small style={{ color: '#718096', fontSize: '12px' }}>Interest, dividends, etc.</small>
            </div>
          </div>

          {/* Checkboxes */}
          <h3 style={{ marginTop: '30px', marginBottom: '20px', color: '#2d3748' }}>
            ✓ Verification
          </h3>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.ssn_valid}
                onChange={(e) => updateForm('ssn_valid', e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '15px' }}>I have a valid Social Security Number</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.is_us_resident}
                onChange={(e) => updateForm('is_us_resident', e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '15px' }}>I am a U.S. citizen or resident alien</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.is_self_employed}
                onChange={(e) => updateForm('is_self_employed', e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '15px' }}>I am self-employed</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '30px',
              width: '100%',
              padding: '16px',
              background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? '⏳ Calculating...' : '🔍 Check My Eligibility'}
          </button>
        </div>
      </form>

      {/* Results */}
      {result && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Eligibility Status */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              display: 'inline-block',
              padding: '12px 24px',
              borderRadius: '25px',
              background: result.eligible ? '#c6f6d5' : '#fed7d7',
              color: result.eligible ? '#22543d' : '#742a2a',
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '20px'
            }}>
              {result.eligible ? '✅ ELIGIBLE FOR EITC' : '❌ NOT ELIGIBLE'}
            </div>

            {result.eligible && result.estimated_credit > 0 && (
              <div>
                <div style={{ fontSize: '14px', color: '#718096', marginBottom: '10px' }}>
                  Your Estimated Credit
                </div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '10px'
                }}>
                  ${result.estimated_credit.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: '#718096' }}>
                  For Tax Year {result.tax_year}
                </div>
              </div>
            )}
          </div>

          {/* Reasons */}
          {result.reasons && result.reasons.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#2d3748', marginBottom: '15px' }}>
                {result.eligible ? '✅ Details' : '❌ Reasons'}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {result.reasons.map((reason, i) => (
                  <li key={i} style={{
                    padding: '10px',
                    borderBottom: '1px solid #f7fafc',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          {result.next_steps && result.next_steps.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#2d3748', marginBottom: '15px' }}>
                📝 Next Steps
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {result.next_steps.map((step, i) => (
                  <li key={i} style={{
                    padding: '10px',
                    borderBottom: '1px solid #f7fafc',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Credits */}
          {result.additional_credits && result.additional_credits.length > 0 && (
            <div>
              <h4 style={{ color: '#2d3748', marginBottom: '15px' }}>
                💡 Other Credits You May Qualify For
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {result.additional_credits.map((credit, i) => (
                  <li key={i} style={{
                    padding: '10px',
                    borderBottom: '1px solid #f7fafc',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    {credit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{
            marginTop: '25px',
            padding: '15px',
            background: '#f7fafc',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#718096',
            fontStyle: 'italic'
          }}>
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  )
}
