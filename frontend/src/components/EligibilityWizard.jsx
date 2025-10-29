import React, { useEffect, useState } from 'react'

export default function EligibilityWizard({ lang, t }) {
  const [schema, setSchema] = useState(null)
  const [form, setForm] = useState({
    tax_year: 2024,
    filing_status: 'single',
    age: 30,
    ssn_valid: true,
    is_us_resident: true,
    qualifying_children: 0,
    earned_income: 0,
    agi: 0,
    investment_income: 0,
    has_foreign_earned_income: false,
    claimed_as_dependent: false,
  })
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/eligibility/schema').then(r => r.json()).then(setSchema)
  }, [])

  const submit = async () => {
    const res = await fetch('http://localhost:5000/api/eligibility/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setResult(data)
  }

  if (!schema) return <div>{t('loading')}</div>

  return (
    <div>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <label>Tax year
          <input type="number" value={form.tax_year} onChange={e=>setForm({...form, tax_year: parseInt(e.target.value||0)})} />
        </label>
        <label>Filing status
          <select value={form.filing_status} onChange={e=>setForm({...form, filing_status: e.target.value})}>
            {schema.fields.find(f=>f.name==='filing_status').choices.map(c=>(<option key={c} value={c}>{c}</option>))}
          </select>
        </label>
        <label>Age
          <input type="number" value={form.age} onChange={e=>setForm({...form, age: parseInt(e.target.value||0)})} />
        </label>
        <label>Valid SSN?
          <input type="checkbox" checked={form.ssn_valid} onChange={e=>setForm({...form, ssn_valid: e.target.checked})} />
        </label>
        <label>U.S. resident?
          <input type="checkbox" checked={form.is_us_resident} onChange={e=>setForm({...form, is_us_resident: e.target.checked})} />
        </label>
        <label>Qualifying children
          <input type="number" value={form.qualifying_children} onChange={e=>setForm({...form, qualifying_children: parseInt(e.target.value||0)})} />
        </label>
        <label>Earned income
          <input type="number" value={form.earned_income} onChange={e=>setForm({...form, earned_income: parseFloat(e.target.value||0)})} />
        </label>
        <label>AGI
          <input type="number" value={form.agi} onChange={e=>setForm({...form, agi: parseFloat(e.target.value||0)})} />
        </label>
        <label>Investment income
          <input type="number" value={form.investment_income} onChange={e=>setForm({...form, investment_income: parseFloat(e.target.value||0)})} />
        </label>
        <label>Foreign earned income?
          <input type="checkbox" checked={form.has_foreign_earned_income} onChange={e=>setForm({...form, has_foreign_earned_income: e.target.checked})} />
        </label>
        <label>Claimed as dependent?
          <input type="checkbox" checked={form.claimed_as_dependent} onChange={e=>setForm({...form, claimed_as_dependent: e.target.checked})} />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={submit}>{t('assess')}</button>
      </div>

      {result && (
        <div style={{ marginTop: 16, border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
          <div><strong>{t('eligible')}:</strong> {String(result.eligible)}</div>
          <div style={{ marginTop: 8 }}><strong>{t('reasons')}:</strong>
            <ul>{(result.reasons || []).map((r,i)=><li key={i}>{r}</li>)}</ul>
          </div>
          <div><strong>{t('notes')}:</strong>
            <ul>{(result.notes || []).map((r,i)=><li key={i}>{r}</li>)}</ul>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>{result.disclaimer}</div>
        </div>
      )}
    </div>
  )
}
