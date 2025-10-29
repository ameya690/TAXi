import React, { useEffect, useState } from 'react'

export default function Admin({ t }) {
  const [health, setHealth] = useState(null)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5001/health').then(r=>r.json()).then(setHealth)
  }, [])

  const loadMetrics = async () => {
    try {
      const res = await fetch('http://localhost:5001/metrics')
      const txt = await res.text()
      setMetrics(txt)
    } catch (e) {
      setMetrics('Metrics not enabled')
    }
  }

  return (
    <div>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <h3>Health</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(health, null, 2)}</pre>
        <button onClick={loadMetrics}>Load /metrics</button>
        {metrics && <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{metrics}</pre>}
      </div>
    </div>
  )
}
