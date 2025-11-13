import React, { useState, useRef } from 'react'
import FileTable from './vault/FileTable'
import BulkActions from './vault/BulkActions'
import AccessControls from './vault/AccessControls'

export default function Vault({ lang = 'en', t = (k) => k }) {
  const [files, setFiles] = useState([
    {
      id: 'file-1',
      title: 'Client W-2 Forms 2024.pdf',
      kind: 'Tax Document',
      matter: 'Smith Family - 2024 Return',
      versions: 3,
      lastUsed: new Date('2024-11-08'),
      uploadedBy: 'John Doe',
      size: '2.4 MB',
      tags: ['W-2', '2024', 'Income']
    },
    {
      id: 'file-2',
      title: 'Transfer Pricing Study.docx',
      kind: 'Research Memo',
      matter: 'TechCorp - TP Analysis',
      versions: 5,
      lastUsed: new Date('2024-11-10'),
      uploadedBy: 'Jane Smith',
      size: '1.8 MB',
      tags: ['Transfer Pricing', 'Research']
    },
    {
      id: 'file-3',
      title: 'IRS Notice CP2000.pdf',
      kind: 'Notice',
      matter: 'Johnson - IRS Response',
      versions: 1,
      lastUsed: new Date('2024-11-09'),
      uploadedBy: 'John Doe',
      size: '856 KB',
      tags: ['IRS', 'Notice', 'CP2000']
    }
  ])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [showAccessControls, setShowAccessControls] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFileUpload(droppedFiles)
  }

  const handleFileUpload = (uploadedFiles) => {
    const newFiles = uploadedFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      title: file.name,
      kind: detectFileKind(file.name),
      matter: 'Unassigned',
      versions: 1,
      lastUsed: new Date(),
      uploadedBy: 'Current User',
      size: formatFileSize(file.size),
      tags: []
    }))

    setFiles(prev => [...newFiles, ...prev])
  }

  const detectFileKind = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    if (ext === 'pdf') return 'PDF Document'
    if (['doc', 'docx'].includes(ext)) return 'Word Document'
    if (['xls', 'xlsx'].includes(ext)) return 'Spreadsheet'
    return 'Document'
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFileUpload(selectedFiles)
  }

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on ${selectedFiles.length} files`)
    // Stub for bulk actions
    alert(`${action} action will be applied to ${selectedFiles.length} file(s)`)
  }

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fafbfc'
    },
    header: {
      padding: '20px 24px',
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#64748b',
      marginTop: '4px'
    },
    actions: {
      display: 'flex',
      gap: '12px'
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
    },
    secondaryButton: {
      background: 'white',
      color: '#667eea',
      border: '2px solid #667eea'
    },
    content: {
      flex: 1,
      overflow: 'auto',
      padding: '24px'
    },
    dropZone: {
      border: '2px dashed #cbd5e1',
      borderRadius: '12px',
      padding: '40px',
      textAlign: 'center',
      marginBottom: '24px',
      background: 'white',
      transition: 'all 0.3s'
    },
    dropZoneActive: {
      borderColor: '#667eea',
      background: '#f0f4ff',
      transform: 'scale(1.02)'
    },
    dropZoneIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    dropZoneTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px'
    },
    dropZoneText: {
      fontSize: '14px',
      color: '#64748b',
      marginBottom: '16px'
    },
    browseButton: {
      padding: '10px 20px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    stats: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      flex: 1,
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    statValue: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#667eea',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#64748b'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>
            <span>🗄️</span>
            Vault
          </div>
          <div style={styles.subtitle}>
            Secure document storage and management
          </div>
        </div>
        <div style={styles.actions}>
          <button
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={() => setShowAccessControls(true)}
            onMouseOver={(e) => e.currentTarget.style.background = '#f0f4ff'}
            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
          >
            🔒 Access Controls
          </button>
          <button
            style={{...styles.button, ...styles.primaryButton}}
            onClick={() => fileInputRef.current?.click()}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📤 Upload Files
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Drop Zone */}
        <div
          style={{
            ...styles.dropZone,
            ...(isDragging ? styles.dropZoneActive : {})
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div style={styles.dropZoneIcon}>📁</div>
          <div style={styles.dropZoneTitle}>
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </div>
          <div style={styles.dropZoneText}>
            or click below to browse
          </div>
          <button
            style={styles.browseButton}
            onClick={() => fileInputRef.current?.click()}
            onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
            onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
          >
            Browse Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{files.length}</div>
            <div style={styles.statLabel}>Total Files</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{selectedFiles.length}</div>
            <div style={styles.statLabel}>Selected</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {new Set(files.map(f => f.matter)).size}
            </div>
            <div style={styles.statLabel}>Matters</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {files.reduce((sum, f) => sum + f.versions, 0)}
            </div>
            <div style={styles.statLabel}>Total Versions</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <BulkActions
            selectedCount={selectedFiles.length}
            onAction={handleBulkAction}
          />
        )}

        {/* File Table */}
        <FileTable
          files={files}
          selectedFiles={selectedFiles}
          onSelectionChange={setSelectedFiles}
        />
      </div>

      {/* Access Controls Modal */}
      {showAccessControls && (
        <AccessControls
          onClose={() => setShowAccessControls(false)}
        />
      )}
    </div>
  )
}
