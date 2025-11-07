import React, { useState } from 'react'

export default function TaxNoticeExplainer({ lang, t }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (selectedFile) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/bmp', 'image/gif']
    
    if (!validTypes.includes(selectedFile.type)) {
      setError(t('notice_invalid_file_type') || 'Invalid file type. Please upload a PDF or image file.')
      return
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(t('notice_file_too_large') || 'File too large. Maximum size is 10MB.')
      return
    }
    
    setFile(selectedFile)
    setError(null)
    setResult(null)
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const analyzeNotice = async () => {
    if (!file) {
      setError(t('notice_no_file') || 'Please select a file first.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('lang', lang)

      const response = await fetch(`${API_BASE}/api/tax-notice/analyze`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || t('notice_analysis_failed') || 'Failed to analyze notice.')
      }
    } catch (err) {
      console.error('Analysis error:', err)
      setError(t('notice_network_error') || 'Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setResult(null)
    setError(null)
  }

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '32px',
      textAlign: 'center',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    description: {
      fontSize: '16px',
      color: '#718096',
      lineHeight: '1.6',
    },
    uploadSection: {
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      marginBottom: '24px',
    },
    dropZone: {
      border: dragActive ? '3px dashed #667eea' : '2px dashed #cbd5e0',
      borderRadius: '12px',
      padding: '48px 24px',
      textAlign: 'center',
      background: dragActive ? '#f7fafc' : '#fafafa',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginBottom: '20px',
    },
    dropZoneIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    dropZoneText: {
      fontSize: '16px',
      color: '#4a5568',
      marginBottom: '8px',
    },
    dropZoneSubtext: {
      fontSize: '14px',
      color: '#a0aec0',
    },
    fileInfo: {
      background: '#f7fafc',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fileName: {
      fontSize: '14px',
      color: '#2d3748',
      fontWeight: '500',
    },
    button: {
      padding: '12px 32px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    },
    secondaryButton: {
      background: '#e2e8f0',
      color: '#4a5568',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    resultSection: {
      background: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    keyDetail: {
      display: 'flex',
      padding: '12px 0',
      borderBottom: '1px solid #e2e8f0',
    },
    keyDetailLabel: {
      fontWeight: '600',
      color: '#4a5568',
      minWidth: '180px',
    },
    keyDetailValue: {
      color: '#2d3748',
      flex: 1,
    },
    summary: {
      background: '#f7fafc',
      padding: '20px',
      borderRadius: '8px',
      lineHeight: '1.8',
      color: '#2d3748',
      fontSize: '15px',
      marginTop: '16px',
    },
    nextStepsList: {
      listStyle: 'none',
      padding: 0,
      margin: '16px 0 0 0',
    },
    nextStepItem: {
      padding: '12px 16px',
      background: '#f7fafc',
      borderRadius: '8px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      fontSize: '15px',
      color: '#2d3748',
    },
    referencedSection: {
      background: '#fffbeb',
      border: '1px solid #fbbf24',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
    },
    referencedSectionHeader: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#92400e',
      marginBottom: '8px',
    },
    referencedSectionText: {
      fontSize: '14px',
      color: '#78350f',
      lineHeight: '1.6',
    },
    error: {
      background: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      padding: '16px',
      color: '#c00',
      marginBottom: '20px',
    },
    loader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '40px',
    },
    spinner: {
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      animation: 'spin 1s linear infinite',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span>📄</span>
          {t('notice_title') || 'Explain My Tax Notice'}
        </h2>
        <p style={styles.description}>
          {t('notice_description') || 
            'Upload your IRS or state tax notice (PDF or image) and get a clear explanation in simple terms, plus actionable next steps.'}
        </p>
      </div>

      {!result && (
        <div style={styles.uploadSection}>
          <div
            style={styles.dropZone}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <div style={styles.dropZoneIcon}>📤</div>
            <div style={styles.dropZoneText}>
              {t('notice_drop_zone') || 'Drag and drop your tax notice here, or click to browse'}
            </div>
            <div style={styles.dropZoneSubtext}>
              {t('notice_file_types') || 'Supports PDF, PNG, JPG, TIFF (max 10MB)'}
            </div>
          </div>

          <input
            id="fileInput"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp,.gif"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />

          {file && (
            <div style={styles.fileInfo}>
              <div>
                <div style={styles.fileName}>📎 {file.name}</div>
                <div style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px' }}>
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                onClick={resetForm}
                style={{ ...styles.button, ...styles.secondaryButton }}
              >
                ✕ {t('notice_remove') || 'Remove'}
              </button>
            </div>
          )}

          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={analyzeNotice}
              disabled={!file || loading}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...((!file || loading) ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? '⏳' : '🔍'} {loading ? (t('notice_analyzing') || 'Analyzing...') : (t('notice_analyze') || 'Analyze Notice')}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <div>{t('notice_processing') || 'Processing your tax notice...'}</div>
        </div>
      )}

      {result && (
        <>
          <div style={styles.resultSection}>
            <h3 style={styles.sectionTitle}>
              <span>📋</span>
              {t('notice_key_details') || 'Key Details'}
            </h3>
            {Object.entries(result.key_details).map(([key, value]) => (
              value && (
                <div key={key} style={styles.keyDetail}>
                  <div style={styles.keyDetailLabel}>
                    {t(`notice_detail_${key}`) || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                  </div>
                  <div style={styles.keyDetailValue}>{value}</div>
                </div>
              )
            ))}
          </div>

          <div style={styles.resultSection}>
            <h3 style={styles.sectionTitle}>
              <span>💡</span>
              {t('notice_summary') || 'Plain Language Summary'}
            </h3>
            <div style={styles.summary}>
              {result.summary}
            </div>
          </div>

          <div style={styles.resultSection}>
            <h3 style={styles.sectionTitle}>
              <span>✅</span>
              {t('notice_next_steps') || 'Next Steps'}
            </h3>
            <ul style={styles.nextStepsList}>
              {result.next_steps.map((step, idx) => (
                <li key={idx} style={styles.nextStepItem}>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {result.referenced_sections && result.referenced_sections.length > 0 && (
            <div style={styles.resultSection}>
              <h3 style={styles.sectionTitle}>
                <span>🔖</span>
                {t('notice_referenced_sections') || 'Referenced Sections'}
              </h3>
              {result.referenced_sections.map((section, idx) => (
                <div key={idx} style={styles.referencedSection}>
                  <div style={styles.referencedSectionHeader}>
                    Section {section.section} ({section.relevance} relevance)
                  </div>
                  <div style={styles.referencedSectionText}>
                    {section.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={resetForm}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              📤 {t('notice_upload_another') || 'Upload Another Notice'}
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
