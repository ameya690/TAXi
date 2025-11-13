import React, { useState, useMemo } from 'react'

export default function TableTab({ tableData, onCreateDraft, onAskTable }) {
  const [tableQuery, setTableQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ column: null, direction: 'asc' })
  const [filters, setFilters] = useState({})
  const [hiddenColumns, setHiddenColumns] = useState(new Set())
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const [queryResult, setQueryResult] = useState(null)

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!tableData?.rows) return []

    let result = [...tableData.rows]

    // Apply filters
    Object.entries(filters).forEach(([colIdx, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => 
          String(row[colIdx]).toLowerCase().includes(filterValue.toLowerCase())
        )
      }
    })

    // Apply sorting
    if (sortConfig.column !== null) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.column]
        const bVal = b[sortConfig.column]
        
        if (aVal === bVal) return 0
        
        const comparison = aVal < bVal ? -1 : 1
        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }

    return result
  }, [tableData, filters, sortConfig])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredAndSortedData.slice(start, start + rowsPerPage)
  }, [filteredAndSortedData, currentPage, rowsPerPage])

  // Visible columns
  const visibleColumns = useMemo(() => {
    return tableData?.columns?.filter((_, idx) => !hiddenColumns.has(idx)) || []
  }, [tableData, hiddenColumns])

  const handleSort = (colIdx) => {
    setSortConfig(prev => ({
      column: colIdx,
      direction: prev.column === colIdx && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleFilterChange = (colIdx, value) => {
    setFilters(prev => ({
      ...prev,
      [colIdx]: value
    }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const toggleColumn = (colIdx) => {
    setHiddenColumns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(colIdx)) {
        newSet.delete(colIdx)
      } else {
        newSet.add(colIdx)
      }
      return newSet
    })
  }

  const toggleRowSelection = (rowIdx) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowIdx)) {
        newSet.delete(rowIdx)
      } else {
        newSet.add(rowIdx)
      }
      return newSet
    })
  }

  const selectAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map((_, idx) => idx)))
    }
  }

  const handleCopyCSV = () => {
    if (!tableData) return
    
    const visibleColIndices = tableData.columns
      .map((_, idx) => idx)
      .filter(idx => !hiddenColumns.has(idx))
    
    const csv = [
      visibleColIndices.map(idx => tableData.columns[idx]).join(','),
      ...filteredAndSortedData.map(row => 
        visibleColIndices.map(idx => row[idx]).join(',')
      )
    ].join('\n')
    
    navigator.clipboard.writeText(csv)
    alert('CSV copied to clipboard!')
  }

  const handleCreateDraftFromTable = () => {
    if (!tableData) return
    
    const visibleColIndices = tableData.columns
      .map((_, idx) => idx)
      .filter(idx => !hiddenColumns.has(idx))
    
    // Generate markdown table
    let markdown = '| ' + visibleColIndices.map(idx => tableData.columns[idx]).join(' | ') + ' |\n'
    markdown += '| ' + visibleColIndices.map(() => '---').join(' | ') + ' |\n'
    
    filteredAndSortedData.forEach(row => {
      markdown += '| ' + visibleColIndices.map(idx => row[idx]).join(' | ') + ' |\n'
    })
    
    if (onCreateDraft) {
      onCreateDraft(markdown)
    }
  }

  const handleGenerateParagraphFromSelected = () => {
    if (selectedRows.size === 0) {
      alert('Please select rows first')
      return
    }
    
    const selectedData = Array.from(selectedRows).map(idx => paginatedData[idx])
    
    // Generate paragraph from selected rows
    let paragraph = `Based on the selected ${selectedRows.size} row(s):\n\n`
    
    selectedData.forEach((row, idx) => {
      paragraph += `${idx + 1}. `
      tableData.columns.forEach((col, colIdx) => {
        if (!hiddenColumns.has(colIdx)) {
          paragraph += `${col}: ${row[colIdx]}; `
        }
      })
      paragraph += '\n'
    })
    
    if (onCreateDraft) {
      onCreateDraft(paragraph)
    }
  }

  const handleAskTable = async (e) => {
    e.preventDefault()
    if (!tableQuery.trim() || !onAskTable) return
    
    setQueryResult({ loading: true })
    
    try {
      const result = await onAskTable(tableQuery, tableData, filteredAndSortedData)
      setQueryResult(result)
    } catch (error) {
      setQueryResult({ error: error.message })
    }
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#ffffff'
    },
    toolbar: {
      padding: '12px 20px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#fafbfc',
      flexWrap: 'wrap',
      gap: '8px'
    },
    toolbarLeft: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    toolbarRight: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    button: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      background: 'white',
      color: '#475569',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    primaryButton: {
      background: '#667eea',
      color: 'white',
      borderColor: '#667eea'
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px'
    },
    tableWrapper: {
      overflowX: 'auto',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '16px'
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
      zIndex: 1,
      cursor: 'pointer',
      userSelect: 'none'
    },
    filterInput: {
      width: '100%',
      padding: '6px 8px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      fontSize: '12px',
      marginTop: '4px'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #e2e8f0'
    },
    selectedRow: {
      background: '#eff6ff'
    },
    checkbox: {
      width: '16px',
      height: '16px',
      cursor: 'pointer'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderTop: '1px solid #e2e8f0',
      background: '#fafbfc'
    },
    paginationInfo: {
      fontSize: '13px',
      color: '#64748b'
    },
    paginationControls: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center'
    },
    pageButton: {
      padding: '6px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '4px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '13px'
    },
    stickyInput: {
      padding: '16px 20px',
      borderTop: '2px solid #e2e8f0',
      background: '#f0f9ff'
    },
    inputForm: {
      display: 'flex',
      gap: '8px'
    },
    input: {
      flex: 1,
      padding: '12px',
      border: '2px solid #bae6fd',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    queryResult: {
      marginTop: '12px',
      padding: '12px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '13px',
      lineHeight: '1.6'
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
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '400px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1e293b'
    },
    columnItem: {
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background 0.2s'
    }
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
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button
            style={{...styles.button, ...styles.primaryButton}}
            onClick={handleCopyCSV}
            onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
            onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
          >
            📋 Copy CSV
          </button>
          <button
            style={{...styles.button, ...styles.primaryButton}}
            onClick={handleCreateDraftFromTable}
            onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
            onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
          >
            ✍️ Create Draft
          </button>
          {selectedRows.size > 0 && (
            <button
              style={{...styles.button, background: '#10b981', color: 'white', borderColor: '#10b981'}}
              onClick={handleGenerateParagraphFromSelected}
              onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
            >
              📝 Generate Paragraph ({selectedRows.size})
            </button>
          )}
        </div>
        <div style={styles.toolbarRight}>
          <button
            style={styles.button}
            onClick={() => setShowColumnPicker(true)}
            onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
          >
            👁️ Columns
          </button>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            style={{...styles.button, cursor: 'pointer'}}
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={selectAllRows}
                    style={styles.checkbox}
                  />
                </th>
                {tableData.columns?.map((col, idx) => (
                  !hiddenColumns.has(idx) && (
                    <th key={idx} style={styles.tableHeader}>
                      <div onClick={() => handleSort(idx)}>
                        {col}
                        {sortConfig.column === idx && (
                          <span style={{ marginLeft: '4px' }}>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Filter..."
                        value={filters[idx] || ''}
                        onChange={(e) => handleFilterChange(idx, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={styles.filterInput}
                      />
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIdx) => (
                <tr 
                  key={rowIdx}
                  style={selectedRows.has(rowIdx) ? styles.selectedRow : {}}
                >
                  <td style={styles.tableCell}>
                    <input
                      type="checkbox"
                      checked={selectedRows.has(rowIdx)}
                      onChange={() => toggleRowSelection(rowIdx)}
                      style={styles.checkbox}
                    />
                  </td>
                  {row.map((cell, cellIdx) => (
                    !hiddenColumns.has(cellIdx) && (
                      <td key={cellIdx} style={styles.tableCell}>
                        {cell}
                      </td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Query Result */}
        {queryResult && !queryResult.loading && (
          <div style={styles.queryResult}>
            {queryResult.error ? (
              <div style={{ color: '#dc2626' }}>Error: {queryResult.error}</div>
            ) : (
              <div>{queryResult.content}</div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <div style={styles.paginationInfo}>
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} rows
        </div>
        <div style={styles.paginationControls}>
          <button
            style={styles.pageButton}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            ««
          </button>
          <button
            style={styles.pageButton}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          <span style={{ padding: '0 12px', fontSize: '13px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            style={styles.pageButton}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
          <button
            style={styles.pageButton}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »»
          </button>
        </div>
      </div>

      {/* Sticky Input */}
      <div style={styles.stickyInput}>
        <form onSubmit={handleAskTable} style={styles.inputForm}>
          <input
            type="text"
            placeholder="Ask this table... (e.g., 'What's the total?', 'Show rows where amount > 1000')"
            value={tableQuery}
            onChange={(e) => setTableQuery(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
            onBlur={(e) => e.target.style.borderColor = '#bae6fd'}
            style={styles.input}
          />
          <button
            type="submit"
            style={{...styles.button, ...styles.primaryButton}}
            disabled={!tableQuery.trim()}
          >
            Ask
          </button>
        </form>
        {queryResult?.loading && (
          <div style={{ marginTop: '8px', fontSize: '13px', color: '#64748b' }}>
            Analyzing table...
          </div>
        )}
      </div>

      {/* Column Picker Modal */}
      {showColumnPicker && (
        <div style={styles.modal} onClick={() => setShowColumnPicker(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Show/Hide Columns</div>
            {tableData.columns?.map((col, idx) => (
              <div
                key={idx}
                style={styles.columnItem}
                onClick={() => toggleColumn(idx)}
                onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <input
                  type="checkbox"
                  checked={!hiddenColumns.has(idx)}
                  onChange={() => {}}
                  style={styles.checkbox}
                />
                <span>{col}</span>
              </div>
            ))}
            <button
              style={{...styles.button, width: '100%', justifyContent: 'center', marginTop: '16px'}}
              onClick={() => setShowColumnPicker(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
