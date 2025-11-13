import React, { useState } from 'react'

export default function FileTable({ files, selectedFiles, onSelectionChange }) {
  const [sortField, setSortField] = useState('lastUsed')
  const [sortDirection, setSortDirection] = useState('desc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedFiles = [...files].sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]

    if (sortField === 'lastUsed') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(files.map(f => f.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectFile = (fileId) => {
    if (selectedFiles.includes(fileId)) {
      onSelectionChange(selectedFiles.filter(id => id !== fileId))
    } else {
      onSelectionChange([...selectedFiles, fileId])
    }
  }

  const formatDate = (date) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now - d
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return d.toLocaleDateString()
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      background: '#f8fafc',
      padding: '16px',
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: '600',
      color: '#475569',
      borderBottom: '2px solid #e2e8f0',
      cursor: 'pointer',
      userSelect: 'none'
    },
    thCheckbox: {
      width: '40px',
      cursor: 'default'
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #f1f5f9',
      fontSize: '14px',
      color: '#1e293b'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    },
    fileTitle: {
      fontWeight: '600',
      color: '#667eea',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    fileIcon: {
      fontSize: '20px'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    kindBadge: {
      background: '#dbeafe',
      color: '#1e40af'
    },
    versionBadge: {
      background: '#f3e8ff',
      color: '#6b21a8'
    },
    tags: {
      display: 'flex',
      gap: '4px',
      flexWrap: 'wrap'
    },
    tag: {
      padding: '2px 8px',
      background: '#f1f5f9',
      borderRadius: '8px',
      fontSize: '11px',
      color: '#64748b'
    },
    actions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    viewButton: {
      background: '#f0f4ff',
      color: '#667eea'
    },
    moreButton: {
      background: '#f8fafc',
      color: '#64748b'
    },
    sortIcon: {
      marginLeft: '4px',
      fontSize: '10px'
    },
    emptyState: {
      padding: '60px 20px',
      textAlign: 'center',
      color: '#94a3b8'
    }
  }

  const getFileIcon = (kind) => {
    if (kind.includes('PDF')) return '📄'
    if (kind.includes('Word')) return '📝'
    if (kind.includes('Spreadsheet')) return '📊'
    if (kind.includes('Notice')) return '📮'
    if (kind.includes('Memo')) return '📋'
    return '📁'
  }

  if (files.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            No files yet
          </div>
          <div style={{ fontSize: '14px' }}>
            Upload files using the drop zone above
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{...styles.th, ...styles.thCheckbox}}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={selectedFiles.length === files.length}
                onChange={handleSelectAll}
              />
            </th>
            <th style={styles.th} onClick={() => handleSort('title')}>
              Title
              {sortField === 'title' && (
                <span style={styles.sortIcon}>
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th style={styles.th} onClick={() => handleSort('kind')}>
              Kind
              {sortField === 'kind' && (
                <span style={styles.sortIcon}>
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th style={styles.th} onClick={() => handleSort('matter')}>
              Matter
              {sortField === 'matter' && (
                <span style={styles.sortIcon}>
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th style={styles.th} onClick={() => handleSort('versions')}>
              Versions
              {sortField === 'versions' && (
                <span style={styles.sortIcon}>
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th style={styles.th} onClick={() => handleSort('lastUsed')}>
              Last Used
              {sortField === 'lastUsed' && (
                <span style={styles.sortIcon}>
                  {sortDirection === 'asc' ? '▲' : '▼'}
                </span>
              )}
            </th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedFiles.map(file => (
            <tr
              key={file.id}
              style={{
                background: selectedFiles.includes(file.id) ? '#f0f4ff' : 'transparent'
              }}
            >
              <td style={styles.td}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleSelectFile(file.id)}
                />
              </td>
              <td style={styles.td}>
                <div style={styles.fileTitle}>
                  <span style={styles.fileIcon}>{getFileIcon(file.kind)}</span>
                  {file.title}
                </div>
                {file.tags.length > 0 && (
                  <div style={{...styles.tags, marginTop: '8px'}}>
                    {file.tags.map((tag, idx) => (
                      <span key={idx} style={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </td>
              <td style={styles.td}>
                <span style={{...styles.badge, ...styles.kindBadge}}>
                  {file.kind}
                </span>
              </td>
              <td style={styles.td}>{file.matter}</td>
              <td style={styles.td}>
                <span style={{...styles.badge, ...styles.versionBadge}}>
                  v{file.versions}
                </span>
              </td>
              <td style={styles.td}>{formatDate(file.lastUsed)}</td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  <button
                    style={{...styles.actionButton, ...styles.viewButton}}
                    onMouseOver={(e) => e.currentTarget.style.background = '#dbeafe'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#f0f4ff'}
                  >
                    👁️ View
                  </button>
                  <button
                    style={{...styles.actionButton, ...styles.moreButton}}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                  >
                    ⋯
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
