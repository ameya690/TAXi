import React, { useState } from 'react'

export default function TableTab({ tableData }) {
  const [tableQuery, setTableQuery] = useState('')

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      height: '100%'
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px'
    },
    tableWrapper: {
      overflowX: 'auto',
      border: '1px solid #e2e8f0',
      borderRadius: '8px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px',
      background: 'white'
    },
    tableHeader: {
      background: '#f1f5f9',
      fontWeight: '600',
      textAlign: 'left',
      padding: '12px',
      borderBottom: '2px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 1
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #e2e8f0'
    },
    stickyInput: {
      padding: '16px',
      borderTop: '1px solid #e2e8f0',
      background: '#f0f9ff',
      position: 'sticky',
      bottom: 0
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #bae6fd',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    emptyState: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      color: '#94a3b8',
      padding: '40px'
    },
    actions: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      background: '#667eea',
      color: 'white',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  }

  const handleExport = () => {
    if (!tableData) return
    
    const csv = [
      tableData.columns.join(','),
      ...tableData.rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `table-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!tableData) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px' }}>📋</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#64748b' }}>
              No table data
            </div>
            <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
              Use the /table command in chat to create data tables.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.actions}>
          <button
            style={styles.button}
            onClick={handleExport}
            onMouseOver={(e) => e.target.style.background = '#5568d3'}
            onMouseOut={(e) => e.target.style.background = '#667eea'}
          >
            📥 Export CSV
          </button>
          <button
            style={{...styles.button, background: '#10b981'}}
            onMouseOver={(e) => e.target.style.background = '#059669'}
            onMouseOut={(e) => e.target.style.background = '#10b981'}
          >
            📊 Visualize
          </button>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {tableData.columns?.map((col, idx) => (
                  <th key={idx} style={styles.tableHeader}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows?.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} style={styles.tableCell}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.stickyInput}>
        <input
          type="text"
          placeholder="Ask this table..."
          value={tableQuery}
          onChange={(e) => setTableQuery(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
          onBlur={(e) => e.target.style.borderColor = '#bae6fd'}
          style={styles.input}
        />
      </div>
    </div>
  )
}
