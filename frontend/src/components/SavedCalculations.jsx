import React, { useState, useEffect } from 'react'

export default function SavedCalculations({ onLoad }) {
  const [calculations, setCalculations] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadCalculations()
  }, [])

  const loadCalculations = () => {
    const saved = localStorage.getItem('tax_bot_saved_calculations')
    if (saved) {
      setCalculations(JSON.parse(saved))
    }
  }

  const saveCalculation = (name, formData, result) => {
    const newCalc = {
      id: Date.now(),
      name: name || `Calculation ${calculations.length + 1}`,
      timestamp: new Date().toISOString(),
      formData,
      result
    }
    const updated = [newCalc, ...calculations].slice(0, 20) // Keep last 20
    setCalculations(updated)
    localStorage.setItem('tax_bot_saved_calculations', JSON.stringify(updated))
  }

  const deleteCalculation = (id) => {
    const updated = calculations.filter(c => c.id !== id)
    setCalculations(updated)
    localStorage.setItem('tax_bot_saved_calculations', JSON.stringify(updated))
  }

  const clearAll = () => {
    if (confirm('Clear all saved calculations?')) {
      setCalculations([])
      localStorage.removeItem('tax_bot_saved_calculations')
    }
  }

  const exportToCSV = () => {
    let csv = 'Name,Date,Filing Status,Age,Children,Earned Income,AGI,Investment Income,Eligible,Credit Amount\n'
    calculations.forEach(calc => {
      const f = calc.formData
      const r = calc.result
      csv += `"${calc.name}",`
      csv += `"${new Date(calc.timestamp).toLocaleDateString()}",`
      csv += `"${f.filing_status}",`
      csv += `${f.age},`
      csv += `${f.qualifying_children},`
      csv += `${f.earned_income},`
      csv += `${f.agi},`
      csv += `${f.investment_income},`
      csv += `${r.eligible},`
      csv += `${r.estimated_credit || 0}\n`
    })
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `eitc-calculations-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const compareCalculations = () => {
    if (calculations.length < 2) {
      alert('Need at least 2 saved calculations to compare')
      return
    }
    
    let comparison = 'EITC Calculation Comparison\n'
    comparison += '='.repeat(80) + '\n\n'
    
    calculations.slice(0, 5).forEach((calc, i) => {
      comparison += `${i + 1}. ${calc.name} (${new Date(calc.timestamp).toLocaleDateString()})\n`
      comparison += `   Filing Status: ${calc.formData.filing_status}\n`
      comparison += `   Age: ${calc.formData.age}, Children: ${calc.formData.qualifying_children}\n`
      comparison += `   Earned Income: $${calc.formData.earned_income.toLocaleString()}\n`
      comparison += `   AGI: $${calc.formData.agi.toLocaleString()}\n`
      comparison += `   Result: ${calc.result.eligible ? '✅ ELIGIBLE' : '❌ NOT ELIGIBLE'}\n`
      if (calc.result.eligible && calc.result.estimated_credit) {
        comparison += `   Credit: $${calc.result.estimated_credit.toLocaleString()}\n`
      }
      comparison += '\n'
    })
    
    alert(comparison)
  }

  const styles = {
    button: {
      padding: '10px 16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      marginRight: '8px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: showModal ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '900px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    card: {
      padding: '16px',
      background: '#f7fafc',
      borderRadius: '8px',
      marginBottom: '12px',
      border: '2px solid #e2e8f0'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      marginLeft: '8px'
    },
    badgeEligible: {
      background: '#c6f6d5',
      color: '#22543d'
    },
    badgeNotEligible: {
      background: '#fed7d7',
      color: '#742a2a'
    }
  }

  return (
    <div>
      <button style={styles.button} onClick={() => setShowModal(true)}>
        💾 Saved Calculations ({calculations.length})
      </button>

      <div style={styles.modal} onClick={() => setShowModal(false)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>💾 Saved Calculations</h3>
            <button onClick={() => setShowModal(false)} style={{ ...styles.button, background: '#e2e8f0', color: '#2d3748' }}>
              ✕ Close
            </button>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button style={styles.button} onClick={exportToCSV}>
              📊 Export CSV
            </button>
            <button style={styles.button} onClick={compareCalculations}>
              ⚖️ Compare
            </button>
            <button style={{...styles.button, background: '#fed7d7', color: '#c53030'}} onClick={clearAll}>
              🗑️ Clear All
            </button>
          </div>

          {calculations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
              No saved calculations yet. Complete an eligibility check and save it!
            </div>
          ) : (
            calculations.map(calc => (
              <div key={calc.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <strong style={{ fontSize: '16px', color: '#2d3748' }}>{calc.name}</strong>
                    <span style={{
                      ...styles.badge,
                      ...(calc.result.eligible ? styles.badgeEligible : styles.badgeNotEligible)
                    }}>
                      {calc.result.eligible ? '✅ Eligible' : '❌ Not Eligible'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>
                    {new Date(calc.timestamp).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>Filing Status</div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{calc.formData.filing_status}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>Age / Children</div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{calc.formData.age} / {calc.formData.qualifying_children}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>Earned Income</div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>${calc.formData.earned_income.toLocaleString()}</div>
                  </div>
                  {calc.result.eligible && calc.result.estimated_credit > 0 && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096' }}>Estimated Credit</div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#667eea' }}>
                        ${calc.result.estimated_credit.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    style={{...styles.button, padding: '6px 12px', fontSize: '12px'}}
                    onClick={() => {
                      onLoad && onLoad(calc)
                      setShowModal(false)
                    }}
                  >
                    📖 View Details
                  </button>
                  <button
                    style={{...styles.button, padding: '6px 12px', fontSize: '12px'}}
                    onClick={() => {
                      const name = prompt('Rename calculation:', calc.name)
                      if (name) {
                        const updated = calculations.map(c => 
                          c.id === calc.id ? {...c, name} : c
                        )
                        setCalculations(updated)
                        localStorage.setItem('tax_bot_saved_calculations', JSON.stringify(updated))
                      }
                    }}
                  >
                    ✏️ Rename
                  </button>
                  <button
                    style={{...styles.button, padding: '6px 12px', fontSize: '12px', background: '#fed7d7', color: '#c53030'}}
                    onClick={() => deleteCalculation(calc.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Export function to save from Calculator component
export function useSavedCalculations() {
  const saveCalculation = (name, formData, result) => {
    const calculations = JSON.parse(localStorage.getItem('tax_bot_saved_calculations') || '[]')
    const newCalc = {
      id: Date.now(),
      name: name || `Calculation ${calculations.length + 1}`,
      timestamp: new Date().toISOString(),
      formData,
      result
    }
    const updated = [newCalc, ...calculations].slice(0, 20)
    localStorage.setItem('tax_bot_saved_calculations', JSON.stringify(updated))
    return newCalc
  }

  return { saveCalculation }
}
