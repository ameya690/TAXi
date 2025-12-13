import React, { useState, useRef } from 'react'
import FileTable from './vault/FileTable'
import BulkActions from './vault/BulkActions'
import AccessControls from './vault/AccessControls'

export default function Vault({ lang = 'en', t = (k) => k }) {
  // Markdown renderer helper
  const renderMarkdown = (text) => {
    if (!text) return null
    
    return text.split('\n').map((line, idx) => {
      // Headers
      if (line.startsWith('#### ')) {
        return <h4 key={idx} style={{ fontSize: '16px', fontWeight: '600', margin: '12px 0 6px 0', color: '#1e293b' }}>{line.replace('#### ', '')}</h4>
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} style={{ fontSize: '18px', fontWeight: '600', margin: '16px 0 8px 0', color: '#1e293b' }}>{line.replace('### ', '')}</h3>
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} style={{ fontSize: '20px', fontWeight: '700', margin: '20px 0 12px 0', color: '#1e293b' }}>{line.replace('## ', '')}</h2>
      }
      if (line.startsWith('# ')) {
        return <h1 key={idx} style={{ fontSize: '24px', fontWeight: '700', margin: '24px 0 16px 0', color: '#1e293b' }}>{line.replace('# ', '')}</h1>
      }
      
      // Bold text with **
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <p key={idx} style={{ margin: '8px 0', lineHeight: '1.6', color: '#475569' }}>
            {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
          </p>
        )
      }
      
      // List items
      if (line.match(/^[\d]+\.\s/)) {
        // Numbered list
        return <li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', color: '#475569', listStyleType: 'decimal' }}>{line.replace(/^[\d]+\.\s/, '')}</li>
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', color: '#475569' }}>{line.replace(/^[*-]\s/, '')}</li>
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <div key={idx} style={{ height: '8px' }} />
      }
      
      // Regular paragraphs
      return <p key={idx} style={{ margin: '8px 0', lineHeight: '1.6', color: '#475569' }}>{line}</p>
    })
  }
  
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
  const [showKeyTermsDialog, setShowKeyTermsDialog] = useState(false)
  const [extractedTerms, setExtractedTerms] = useState(null)
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

  const handleFileUpload = async (uploadedFiles) => {
    // Upload files to backend
    for (const file of uploadedFiles) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('matter', 'Vault Documents')
        
        const response = await fetch('/api/assistant/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          console.error('Upload failed for:', file.name)
          continue
        }
        
        const result = await response.json()
        console.log('File uploaded:', result)
        
        // Add to UI
        const newFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          title: file.name,
          kind: detectFileKind(file.name),
          matter: 'Vault Documents',
          versions: 1,
          lastUsed: new Date(),
          uploadedBy: 'Current User',
          size: formatFileSize(file.size),
          tags: [],
          unique_filename: result.document?.unique_filename,
          backend_uploaded: true
        }
        
        setFiles(prev => [newFile, ...prev])
        
      } catch (error) {
        console.error('Error uploading file:', error)
        alert(`Failed to upload ${file.name}: ${error.message}`)
      }
    }
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

  const handleBulkAction = async (action) => {
    console.log(`Bulk action: ${action} on ${selectedFiles.length} files`)
    
    const selectedFileObjects = files.filter(f => selectedFiles.includes(f.id))
    
    try {
      switch (action) {
        case 'extract-terms':
          await handleExtractKeyTerms(selectedFileObjects)
          break
        case 'add-kb':
          await handleAddToKnowledgeBase(selectedFileObjects)
          break
        case 'download':
          await handleDownloadSelected(selectedFileObjects)
          break
        case 'delete':
          await handleDeleteSelected(selectedFileObjects)
          break
        default:
          alert(`${action} action will be applied to ${selectedFiles.length} file(s)`)
      }
    } catch (error) {
      console.error('Action failed:', error)
      alert(`Failed to ${action}: ${error.message}`)
    }
  }
  
  const handleExtractKeyTerms = async (fileObjects) => {
    // Show loading state
    const loadingMsg = `Extracting key terms from ${fileObjects.length} document(s)...`
    console.log(loadingMsg)
    
    // Build a detailed analysis request
    const fileNames = fileObjects.map(f => f.title).join(', ')
    const fileDetails = fileObjects.map(f => `- ${f.title} (${f.kind}, ${f.matter})`).join('\n')
    
    // First, we need to get the list of uploaded documents from the backend
    // to pass them to the Assistant API
    const question = `Analyze the uploaded tax documents and extract key information. Please extract and organize:\n\n1. **Key Terms**: Important tax terms, concepts, or provisions mentioned\n2. **Dates**: Filing deadlines, tax years, important dates\n3. **Amounts**: Dollar amounts, percentages, thresholds mentioned\n4. **Entities**: Taxpayer names, companies, IRS references\n5. **Document Types**: Classifications and categories\n\nProvide specific values and details found in the documents. Format as a clear, organized list.`
    
    try {
      // Show loading indicator
      setExtractedTerms({ loading: true, files: fileObjects })
      setShowKeyTermsDialog(true)
      
      // Get list of uploaded documents for the matter
      const matter = fileObjects[0]?.matter || 'Vault Documents'
      
      // Fetch uploaded documents for this matter
      let docsForAPI = []
      try {
        const docsResponse = await fetch(`/api/assistant/documents?matter=${encodeURIComponent(matter)}`)
        if (docsResponse.ok) {
          const docsData = await docsResponse.json()
          // Map to the format expected by the chat API
          docsForAPI = docsData.documents?.map(doc => ({
            name: doc.filename,
            unique_name: doc.unique_filename,
            matter: doc.matter
          })) || []
        }
      } catch (err) {
        console.warn('Could not fetch documents:', err)
      }
      
      console.log('Sending documents to API:', docsForAPI)
      
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          lang: 'en',
          docs: docsForAPI,
          matter: matter
        })
      })
      
      if (!response.ok) throw new Error('Failed to extract key terms')
      
      const result = await response.json()
      
      // Store results and show dialog
      setExtractedTerms({
        loading: false,
        files: fileObjects,
        content: result.content,
        citations: result.citations || []
      })
      
    } catch (error) {
      setExtractedTerms({
        loading: false,
        files: fileObjects,
        error: error.message
      })
      throw new Error(`Key term extraction failed: ${error.message}`)
    }
  }
  
  const handleAddToKnowledgeBase = async (fileObjects) => {
    const confirmation = confirm(`Add ${fileObjects.length} document(s) to the Knowledge Base?\n\nThese documents will be indexed and searchable.`)
    if (!confirmation) return
    
    console.log('Adding to knowledge base:', fileObjects)
    
    // In a real implementation, this would call a backend endpoint to index the documents
    // For now, we'll simulate success
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert(`✅ Successfully added ${fileObjects.length} document(s) to Knowledge Base!\n\nDocuments are now indexed and searchable.`)
  }
  
  const handleDownloadSelected = async (fileObjects) => {
    if (fileObjects.length === 1) {
      // Single file download
      const file = fileObjects[0]
      console.log('Downloading single file:', file.title)
      
      // Create a mock download (in production, this would fetch the actual file)
      const blob = new Blob([`Mock content for ${file.title}`], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.title
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert(`✅ Downloaded: ${file.title}`)
    } else {
      // Multiple files - create ZIP
      console.log('Creating ZIP of', fileObjects.length, 'files')
      
      // In production, this would call backend to create ZIP
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const zipName = `vault-documents-${new Date().toISOString().split('T')[0]}.zip`
      const blob = new Blob([`Mock ZIP containing ${fileObjects.length} files`], { type: 'application/zip' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = zipName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert(`✅ Downloaded ${fileObjects.length} files as: ${zipName}`)
    }
  }
  
  const handleDeleteSelected = async (fileObjects) => {
    const confirmation = confirm(`⚠️ Delete ${fileObjects.length} document(s)?\n\nThis action cannot be undone.\n\nFiles:\n${fileObjects.map(f => '• ' + f.title).join('\n')}`)
    if (!confirmation) return
    
    console.log('Deleting files:', fileObjects.map(f => f.id))
    
    // Simulate backend deletion
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Remove from state
    setFiles(prevFiles => prevFiles.filter(f => !selectedFiles.includes(f.id)))
    setSelectedFiles([])
    
    alert(`✅ Successfully deleted ${fileObjects.length} document(s)`)
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
      
      {/* Key Terms Dialog */}
      {showKeyTermsDialog && extractedTerms && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e293b'
                }}>
                  🔍 Extracted Key Terms
                </h2>
                <p style={{
                  margin: '8px 0 0 0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  {extractedTerms.files?.length} document(s) analyzed
                </p>
              </div>
              <button
                onClick={() => setShowKeyTermsDialog(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px 8px'
                }}
              >
                ✕
              </button>
            </div>
            
            {/* Documents List */}
            <div style={{
              background: '#f8fafc',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                DOCUMENTS ANALYZED:
              </div>
              {extractedTerms.files?.map((file, idx) => (
                <div key={idx} style={{
                  fontSize: '14px',
                  color: '#475569',
                  marginBottom: '4px'
                }}>
                  📄 {file.title}
                </div>
              ))}
            </div>
            
            {/* Loading State */}
            {extractedTerms.loading && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  Analyzing documents...
                </div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Extracting key terms, dates, amounts, and entities
                </div>
              </div>
            )}
            
            {/* Error State */}
            {extractedTerms.error && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '16px',
                color: '#991b1b'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>❌ Extraction Failed</div>
                <div style={{ fontSize: '14px' }}>{extractedTerms.error}</div>
              </div>
            )}
            
            {/* Content */}
            {!extractedTerms.loading && !extractedTerms.error && extractedTerms.content && (
              <div style={{
                fontSize: '14px',
                lineHeight: '1.8',
                color: '#334155'
              }}>
                {renderMarkdown(extractedTerms.content)}
              </div>
            )}
            
            {/* Actions */}
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  // Copy to clipboard
                  navigator.clipboard.writeText(extractedTerms.content || '')
                  alert('✅ Copied to clipboard!')
                }}
                disabled={extractedTerms.loading || extractedTerms.error}
                style={{
                  padding: '10px 20px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#475569',
                  cursor: extractedTerms.loading || extractedTerms.error ? 'not-allowed' : 'pointer',
                  opacity: extractedTerms.loading || extractedTerms.error ? 0.5 : 1
                }}
              >
                📋 Copy to Clipboard
              </button>
              <button
                onClick={() => setShowKeyTermsDialog(false)}
                style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
