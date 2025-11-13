import React, { useState } from 'react'

export default function StepEditor({ step, onUpdate, onDelete }) {
  const [activeTab, setActiveTab] = useState('inputs')

  const handleUpdateField = (field, value) => {
    onUpdate({ ...step, [field]: value })
  }

  const handleAddInput = () => {
    const fieldName = prompt('Enter field name:')
    if (fieldName) {
      onUpdate({
        ...step,
        inputs: {
          ...step.inputs,
          schema: {
            ...step.inputs?.schema,
            [fieldName]: { type: 'text', label: fieldName, required: false }
          }
        }
      })
    }
  }

  const handleAddTool = () => {
    const toolName = prompt('Enter tool name:')
    if (toolName) {
      onUpdate({
        ...step,
        tools: [...(step.tools || []), toolName]
      })
    }
  }

  const styles = {
    container: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '900px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #f1f5f9'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b'
    },
    deleteButton: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      background: '#fee2e2',
      color: '#dc2626',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      borderBottom: '2px solid #f1f5f9'
    },
    tab: {
      padding: '12px 20px',
      border: 'none',
      background: 'transparent',
      fontSize: '14px',
      fontWeight: '600',
      color: '#64748b',
      cursor: 'pointer',
      borderBottom: '2px solid transparent',
      marginBottom: '-2px',
      transition: 'all 0.2s'
    },
    tabActive: {
      color: '#667eea',
      borderBottomColor: '#667eea'
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'monospace',
      outline: 'none'
    },
    schemaList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    schemaItem: {
      padding: '12px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0'
    },
    schemaField: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '8px'
    },
    fieldName: {
      fontWeight: '600',
      fontSize: '14px',
      color: '#1e293b',
      flex: 1
    },
    fieldType: {
      padding: '4px 12px',
      background: '#dbeafe',
      color: '#1e40af',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600'
    },
    addButton: {
      padding: '10px 16px',
      border: '2px dashed #cbd5e1',
      borderRadius: '8px',
      background: 'transparent',
      color: '#667eea',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s'
    },
    toolsList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '12px'
    },
    toolChip: {
      padding: '8px 16px',
      background: '#f1f5f9',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#475569',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontSize: '16px',
      padding: 0
    },
    tracePreview: {
      background: '#1e293b',
      color: '#e2e8f0',
      padding: '16px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '13px',
      lineHeight: '1.6'
    },
    variableHint: {
      fontSize: '12px',
      color: '#64748b',
      marginTop: '8px',
      fontStyle: 'italic'
    }
  }

  const renderInputsTab = () => (
    <div>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Input Schema</div>
        <div style={styles.schemaList}>
          {Object.entries(step.inputs?.schema || {}).map(([fieldName, fieldConfig]) => (
            <div key={fieldName} style={styles.schemaItem}>
              <div style={styles.schemaField}>
                <span style={styles.fieldName}>{fieldConfig.label || fieldName}</span>
                <span style={styles.fieldType}>{fieldConfig.type}</span>
                {fieldConfig.required && (
                  <span style={{ fontSize: '12px', color: '#dc2626' }}>*required</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          style={styles.addButton}
          onClick={handleAddInput}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#667eea'
            e.currentTarget.style.background = '#f0f4ff'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          + Add Input Field
        </button>
      </div>
    </div>
  )

  const renderToolsTab = () => (
    <div>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Selected Tools</div>
        <div style={styles.toolsList}>
          {(step.tools || []).map((tool, index) => (
            <div key={index} style={styles.toolChip}>
              🔧 {tool}
              <button
                style={styles.removeButton}
                onClick={() => {
                  onUpdate({
                    ...step,
                    tools: step.tools.filter((_, i) => i !== index)
                  })
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          style={styles.addButton}
          onClick={handleAddTool}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#667eea'
            e.currentTarget.style.background = '#f0f4ff'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          + Add Tool
        </button>
      </div>
    </div>
  )

  const renderPromptTab = () => (
    <div>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Prompt Template</div>
        <textarea
          value={step.prompt || ''}
          onChange={(e) => handleUpdateField('prompt', e.target.value)}
          placeholder="Enter prompt template with {{variables}}..."
          style={styles.textarea}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        <div style={styles.variableHint}>
          💡 Use {'{{'} and {'}}'}  to reference input variables (e.g., {'{{businessActivities}}'})
        </div>
      </div>
    </div>
  )

  const renderOutputsTab = () => (
    <div>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Output Schema</div>
        <div style={styles.schemaList}>
          {Object.entries(step.outputs?.schema || {}).map(([fieldName, fieldConfig]) => (
            <div key={fieldName} style={styles.schemaItem}>
              <div style={styles.schemaField}>
                <span style={styles.fieldName}>{fieldName}</span>
                <span style={styles.fieldType}>{fieldConfig.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTraceTab = () => (
    <div>
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Trace Preview</div>
        <div style={styles.tracePreview}>
          <div>→ Step: {step.name}</div>
          <div>→ Type: {step.type}</div>
          <div>→ Tools: {(step.tools || []).join(', ') || 'None'}</div>
          <div>→ Inputs: {Object.keys(step.inputs?.schema || {}).length} fields</div>
          <div>→ Outputs: {Object.keys(step.outputs?.schema || {}).length} fields</div>
          {step.prompt && (
            <>
              <div style={{ marginTop: '12px' }}>→ Prompt:</div>
              <div style={{ paddingLeft: '16px', color: '#94a3b8' }}>{step.prompt}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <input
          type="text"
          value={step.name}
          onChange={(e) => handleUpdateField('name', e.target.value)}
          style={{...styles.title, border: 'none', outline: 'none', background: 'transparent'}}
        />
        <button
          style={styles.deleteButton}
          onClick={onDelete}
          onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
          onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
        >
          🗑️ Delete Step
        </button>
      </div>

      <div style={styles.tabs}>
        {['inputs', 'tools', 'prompt', 'outputs', 'trace'].map(tab => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'inputs' && renderInputsTab()}
      {activeTab === 'tools' && renderToolsTab()}
      {activeTab === 'prompt' && renderPromptTab()}
      {activeTab === 'outputs' && renderOutputsTab()}
      {activeTab === 'trace' && renderTraceTab()}
    </div>
  )
}
