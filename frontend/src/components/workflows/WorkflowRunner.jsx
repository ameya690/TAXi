import React, { useState, useEffect } from 'react'

export default function WorkflowRunner({ workflow, onComplete, onCancel }) {
  const [stepStatuses, setStepStatuses] = useState(workflow.stepStatuses || {})
  const [artifacts, setArtifacts] = useState(workflow.artifacts || {})
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [inputValues, setInputValues] = useState({})
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    // Auto-start first step if not started
    if (currentStepIndex === 0 && stepStatuses[workflow.steps[0]?.id] === 'pending') {
      // Could auto-run or wait for user to click Run
    }
  }, [])

  const handleRunStep = async (stepIndex) => {
    const step = workflow.steps[stepIndex]
    setStepStatuses(prev => ({ ...prev, [step.id]: 'running' }))
    setIsRunning(true)

    // Simulate step execution
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate mock artifacts based on step type
    const mockArtifacts = generateMockArtifacts(step)
    setArtifacts(prev => ({ ...prev, [step.id]: mockArtifacts }))
    setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
    setIsRunning(false)

    // Move to next step
    if (stepIndex < workflow.steps.length - 1) {
      setCurrentStepIndex(stepIndex + 1)
      setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
    }
  }

  const handleRerunStep = (stepIndex) => {
    const step = workflow.steps[stepIndex]
    setStepStatuses(prev => ({ ...prev, [step.id]: 'pending' }))
    setCurrentStepIndex(stepIndex)
  }

  const handleEditInput = (stepId, fieldName, value) => {
    setInputValues(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        [fieldName]: value
      }
    }))
  }

  const generateMockArtifacts = (step) => {
    switch (step.type) {
      case 'collect':
        return { type: 'data', content: inputValues[step.id] || {} }
      case 'analyze':
        return {
          type: 'table',
          content: {
            columns: ['State', 'Nexus Status', 'Reason'],
            rows: [
              ['California', 'Yes', 'Physical presence'],
              ['Texas', 'Yes', 'Economic nexus'],
              ['Nevada', 'No', 'No substantial activity']
            ]
          }
        }
      case 'draft':
        return {
          type: 'draft',
          content: `# ${step.name} Output\n\nThis is a generated draft document based on the analysis.\n\n## Key Findings\n\n- Finding 1\n- Finding 2\n- Finding 3`
        }
      default:
        return { type: 'text', content: `Output from ${step.name}` }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return '✅'
      case 'running': return '⏳'
      case 'needs_attention': return '⚠️'
      default: return '⭕'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return '#10b981'
      case 'running': return '#f59e0b'
      case 'needs_attention': return '#ef4444'
      default: return '#94a3b8'
    }
  }

  const styles = {
    container: {
      display: 'flex',
      height: '100%',
      background: '#fafbfc'
    },
    sidebar: {
      width: '300px',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column'
    },
    sidebarHeader: {
      padding: '20px',
      borderBottom: '1px solid #e2e8f0'
    },
    sidebarTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px'
    },
    runInfo: {
      fontSize: '12px',
      color: '#64748b'
    },
    stepsList: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px'
    },
    stepItem: {
      padding: '12px',
      marginBottom: '8px',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    stepItemActive: {
      borderColor: '#667eea',
      background: '#eff6ff'
    },
    stepHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '4px'
    },
    stepName: {
      flex: 1,
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b'
    },
    stepStatus: {
      fontSize: '12px',
      color: '#64748b'
    },
    sidebarFooter: {
      padding: '16px',
      borderTop: '1px solid #e2e8f0'
    },
    completeButton: {
      width: '100%',
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      background: '#10b981',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    },
    stepView: {
      padding: '24px',
      flex: 1
    },
    stepViewHeader: {
      marginBottom: '24px'
    },
    stepViewTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px'
    },
    stepViewStatus: {
      display: 'inline-block',
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600'
    },
    inputSection: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid #e2e8f0'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '16px'
    },
    inputField: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none'
    },
    artifactSection: {
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      border: '1px solid #e2e8f0'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px'
    },
    th: {
      background: '#f8fafc',
      padding: '12px',
      textAlign: 'left',
      fontWeight: '600',
      borderBottom: '2px solid #e2e8f0'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e2e8f0'
    },
    draftPreview: {
      background: '#f8fafc',
      padding: '16px',
      borderRadius: '8px',
      fontFamily: 'inherit',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap'
    },
    actionButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px'
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    runButton: {
      background: '#667eea',
      color: 'white'
    },
    rerunButton: {
      background: '#f59e0b',
      color: 'white'
    },
    editButton: {
      background: '#f1f5f9',
      color: '#475569'
    }
  }

  const currentStep = workflow.steps[currentStepIndex]
  const currentStatus = stepStatuses[currentStep?.id] || 'pending'
  const currentArtifact = artifacts[currentStep?.id]

  const renderArtifact = (artifact) => {
    if (!artifact) return null

    switch (artifact.type) {
      case 'table':
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                {artifact.content.columns.map((col, idx) => (
                  <th key={idx} style={styles.th}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artifact.content.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} style={styles.td}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )
      case 'draft':
        return <div style={styles.draftPreview}>{artifact.content}</div>
      case 'data':
        return <pre style={styles.draftPreview}>{JSON.stringify(artifact.content, null, 2)}</pre>
      default:
        return <div>{artifact.content}</div>
    }
  }

  return (
    <div style={styles.container}>
      {/* Progress Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarTitle}>Workflow Progress</div>
          <div style={styles.runInfo}>
            Run ID: {workflow.runId?.slice(-8)}
          </div>
        </div>

        <div style={styles.stepsList}>
          {workflow.steps.map((step, index) => {
            const status = stepStatuses[step.id] || 'pending'
            const isActive = index === currentStepIndex

            return (
              <div
                key={step.id}
                style={{
                  ...styles.stepItem,
                  ...(isActive ? styles.stepItemActive : {})
                }}
                onClick={() => setCurrentStepIndex(index)}
              >
                <div style={styles.stepHeader}>
                  <span style={{ fontSize: '18px' }}>{getStatusIcon(status)}</span>
                  <span style={styles.stepName}>{step.name}</span>
                </div>
                <div style={styles.stepStatus}>
                  {status === 'pending' && 'Pending'}
                  {status === 'running' && 'Running...'}
                  {status === 'done' && 'Completed'}
                  {status === 'needs_attention' && 'Needs Attention'}
                </div>
              </div>
            )
          })}
        </div>

        <div style={styles.sidebarFooter}>
          <button
            style={styles.completeButton}
            onClick={onComplete}
            disabled={Object.values(stepStatuses).some(s => s !== 'done')}
            onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
          >
            Complete Workflow
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.stepView}>
          <div style={styles.stepViewHeader}>
            <div style={styles.stepViewTitle}>{currentStep?.name}</div>
            <span
              style={{
                ...styles.stepViewStatus,
                background: `${getStatusColor(currentStatus)}20`,
                color: getStatusColor(currentStatus)
              }}
            >
              {getStatusIcon(currentStatus)} {currentStatus.toUpperCase()}
            </span>
          </div>

          {/* Input Section */}
          {currentStep?.inputs?.schema && Object.keys(currentStep.inputs.schema).length > 0 && (
            <div style={styles.inputSection}>
              <div style={styles.sectionTitle}>📝 Inputs</div>
              {Object.entries(currentStep.inputs.schema).map(([fieldName, fieldConfig]) => (
                <div key={fieldName} style={styles.inputField}>
                  <label style={styles.label}>
                    {fieldConfig.label || fieldName}
                    {fieldConfig.required && <span style={{ color: '#dc2626' }}> *</span>}
                  </label>
                  <input
                    type={fieldConfig.type === 'number' ? 'number' : 'text'}
                    value={inputValues[currentStep.id]?.[fieldName] || ''}
                    onChange={(e) => handleEditInput(currentStep.id, fieldName, e.target.value)}
                    style={styles.input}
                    disabled={currentStatus === 'done'}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Artifact Display */}
          {currentArtifact && (
            <div style={styles.artifactSection}>
              <div style={styles.sectionTitle}>📊 Output</div>
              {renderArtifact(currentArtifact)}
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            {currentStatus === 'pending' && (
              <button
                style={{...styles.button, ...styles.runButton}}
                onClick={() => handleRunStep(currentStepIndex)}
                disabled={isRunning}
                onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
                onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
              >
                ▶ Run Step
              </button>
            )}
            {currentStatus === 'done' && (
              <button
                style={{...styles.button, ...styles.rerunButton}}
                onClick={() => handleRerunStep(currentStepIndex)}
                onMouseOver={(e) => e.currentTarget.style.background = '#d97706'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f59e0b'}
              >
                🔄 Re-run Step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
