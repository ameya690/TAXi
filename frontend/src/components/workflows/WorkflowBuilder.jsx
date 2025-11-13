import React, { useState } from 'react'
import StepEditor from './StepEditor'

export default function WorkflowBuilder({ workflow, onSave, onCancel }) {
  const [editedWorkflow, setEditedWorkflow] = useState(workflow)
  const [selectedStepIndex, setSelectedStepIndex] = useState(0)
  const [showAddStep, setShowAddStep] = useState(false)

  const defaultSteps = [
    { id: 'collect-inputs', name: 'Collect Inputs', type: 'collect', icon: '📝' },
    { id: 'normalize-docs', name: 'Normalize Docs', type: 'transform', icon: '🔄' },
    { id: 'run-analyses', name: 'Run Analyses', type: 'analyze', icon: '🔍' },
    { id: 'assemble-draft', name: 'Assemble Draft', type: 'draft', icon: '✍️' },
    { id: 'qa-citations', name: 'QA & Citations', type: 'review', icon: '✅' }
  ]

  const handleUpdateWorkflow = (field, value) => {
    setEditedWorkflow(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdateStep = (stepIndex, updatedStep) => {
    setEditedWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map((step, idx) => idx === stepIndex ? updatedStep : step)
    }))
  }

  const handleAddStep = (stepTemplate) => {
    const newStep = {
      ...stepTemplate,
      id: `${stepTemplate.id}-${Date.now()}`,
      inputs: { schema: {} },
      tools: [],
      prompt: '',
      outputs: { schema: {} }
    }
    setEditedWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
    setSelectedStepIndex(editedWorkflow.steps.length)
    setShowAddStep(false)
  }

  const handleDeleteStep = (stepIndex) => {
    setEditedWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== stepIndex)
    }))
    if (selectedStepIndex >= editedWorkflow.steps.length - 1) {
      setSelectedStepIndex(Math.max(0, editedWorkflow.steps.length - 2))
    }
  }

  const handleSave = () => {
    onSave(editedWorkflow)
  }

  const styles = {
    container: {
      display: 'flex',
      height: '100%',
      background: '#fafbfc'
    },
    sidebar: {
      width: '320px',
      background: 'white',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column'
    },
    sidebarHeader: {
      padding: '20px',
      borderBottom: '1px solid #e2e8f0'
    },
    workflowName: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '12px',
      outline: 'none'
    },
    workflowDescription: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      fontFamily: 'inherit',
      outline: 'none'
    },
    stepper: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px'
    },
    stepItem: {
      position: 'relative',
      paddingLeft: '40px',
      marginBottom: '24px',
      cursor: 'pointer'
    },
    stepConnector: {
      position: 'absolute',
      left: '15px',
      top: '32px',
      bottom: '-24px',
      width: '2px',
      background: '#e2e8f0'
    },
    stepIcon: {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'white',
      border: '2px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      transition: 'all 0.2s'
    },
    stepIconActive: {
      background: '#667eea',
      borderColor: '#667eea',
      color: 'white'
    },
    stepContent: {
      padding: '12px',
      borderRadius: '8px',
      background: '#fafbfc',
      transition: 'all 0.2s'
    },
    stepContentActive: {
      background: '#eff6ff',
      border: '2px solid #667eea'
    },
    stepName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    stepType: {
      fontSize: '12px',
      color: '#64748b'
    },
    addStepButton: {
      width: '100%',
      padding: '12px',
      border: '2px dashed #cbd5e1',
      borderRadius: '8px',
      background: 'transparent',
      color: '#667eea',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    sidebarFooter: {
      padding: '20px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      gap: '12px'
    },
    button: {
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    saveButton: {
      background: '#667eea',
      color: 'white'
    },
    cancelButton: {
      background: '#f1f5f9',
      color: '#475569'
    },
    mainContent: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px'
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
      maxWidth: '500px',
      width: '90%'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '20px',
      color: '#1e293b'
    },
    stepTemplateGrid: {
      display: 'grid',
      gap: '12px'
    },
    stepTemplate: {
      padding: '16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }

  return (
    <div style={styles.container}>
      {/* Sidebar with Stepper */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <input
            type="text"
            placeholder="Workflow Name"
            value={editedWorkflow.name}
            onChange={(e) => handleUpdateWorkflow('name', e.target.value)}
            style={styles.workflowName}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          <textarea
            placeholder="Description..."
            value={editedWorkflow.description}
            onChange={(e) => handleUpdateWorkflow('description', e.target.value)}
            style={styles.workflowDescription}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        <div style={styles.stepper}>
          {editedWorkflow.steps.map((step, index) => {
            const isActive = index === selectedStepIndex
            const isLast = index === editedWorkflow.steps.length - 1

            return (
              <div
                key={index}
                style={styles.stepItem}
                onClick={() => setSelectedStepIndex(index)}
              >
                {!isLast && <div style={styles.stepConnector} />}
                <div style={{
                  ...styles.stepIcon,
                  ...(isActive ? styles.stepIconActive : {})
                }}>
                  {step.icon || (index + 1)}
                </div>
                <div style={{
                  ...styles.stepContent,
                  ...(isActive ? styles.stepContentActive : {})
                }}>
                  <div style={styles.stepName}>{step.name}</div>
                  <div style={styles.stepType}>{step.type}</div>
                </div>
              </div>
            )
          })}

          <button
            style={styles.addStepButton}
            onClick={() => setShowAddStep(true)}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#667eea'
              e.currentTarget.style.background = '#f0f4ff'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            + Add Step
          </button>
        </div>

        <div style={styles.sidebarFooter}>
          <button
            style={{...styles.button, ...styles.cancelButton}}
            onClick={onCancel}
            onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
          >
            Cancel
          </button>
          <button
            style={{...styles.button, ...styles.saveButton}}
            onClick={handleSave}
            onMouseOver={(e) => e.currentTarget.style.background = '#5568d3'}
            onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
          >
            Save
          </button>
        </div>
      </div>

      {/* Main Content - Step Editor */}
      <div style={styles.mainContent}>
        {editedWorkflow.steps[selectedStepIndex] && (
          <StepEditor
            step={editedWorkflow.steps[selectedStepIndex]}
            onUpdate={(updatedStep) => handleUpdateStep(selectedStepIndex, updatedStep)}
            onDelete={() => handleDeleteStep(selectedStepIndex)}
          />
        )}
      </div>

      {/* Add Step Modal */}
      {showAddStep && (
        <div style={styles.modal} onClick={() => setShowAddStep(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Add Step</div>
            <div style={styles.stepTemplateGrid}>
              {defaultSteps.map(template => (
                <div
                  key={template.id}
                  style={styles.stepTemplate}
                  onClick={() => handleAddStep(template)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#667eea'
                    e.currentTarget.style.background = '#f8fafc'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{template.icon}</span>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{template.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{template.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
