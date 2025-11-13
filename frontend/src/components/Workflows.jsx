import React, { useState } from 'react'
import WorkflowHome from './workflows/WorkflowHome'
import WorkflowBuilder from './workflows/WorkflowBuilder'
import WorkflowRunner from './workflows/WorkflowRunner'
import { workflowTemplates } from '../data/workflowTemplates'

export default function Workflows({ lang = 'en', t = (k) => k }) {
  const [view, setView] = useState('home') // 'home', 'builder', 'run'
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [workflows, setWorkflows] = useState(workflowTemplates)
  const [runningWorkflow, setRunningWorkflow] = useState(null)

  const handleCreateNew = () => {
    setSelectedWorkflow({
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      tags: [],
      usageCount: 0,
      lastEdited: new Date().toISOString(),
      steps: []
    })
    setView('builder')
  }

  const handleEditWorkflow = (workflow) => {
    setSelectedWorkflow(workflow)
    setView('builder')
  }

  const handleRunWorkflow = (workflow) => {
    setRunningWorkflow({
      ...workflow,
      runId: `run-${Date.now()}`,
      startedAt: new Date().toISOString(),
      stepStatuses: workflow.steps.reduce((acc, step) => {
        acc[step.id] = 'pending'
        return acc
      }, {}),
      artifacts: {}
    })
    setView('run')
  }

  const handleSaveWorkflow = (workflow) => {
    setWorkflows(prev => {
      const existing = prev.find(w => w.id === workflow.id)
      if (existing) {
        return prev.map(w => w.id === workflow.id ? { ...workflow, lastEdited: new Date().toISOString() } : w)
      }
      return [...prev, { ...workflow, lastEdited: new Date().toISOString() }]
    })
    setView('home')
  }

  const handleBackToHome = () => {
    setView('home')
    setSelectedWorkflow(null)
    setRunningWorkflow(null)
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
    breadcrumb: {
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
      overflow: 'auto'
    }
  }

  const getBreadcrumb = () => {
    if (view === 'home') return 'All Workflows'
    if (view === 'builder') return `Builder • ${selectedWorkflow?.name || 'New Workflow'}`
    if (view === 'run') return `Running • ${runningWorkflow?.name}`
    return ''
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>
            <span>⚙️</span>
            Workflows
          </div>
          <div style={styles.breadcrumb}>{getBreadcrumb()}</div>
        </div>
        <div style={styles.actions}>
          {view !== 'home' && (
            <button
              style={{...styles.button, ...styles.secondaryButton}}
              onClick={handleBackToHome}
              onMouseOver={(e) => e.currentTarget.style.background = '#f0f4ff'}
              onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
              ← Back to Home
            </button>
          )}
          {view === 'home' && (
            <button
              style={{...styles.button, ...styles.primaryButton}}
              onClick={handleCreateNew}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              + Create Workflow
            </button>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {view === 'home' && (
          <WorkflowHome
            workflows={workflows}
            onEdit={handleEditWorkflow}
            onRun={handleRunWorkflow}
            onCreate={handleCreateNew}
          />
        )}
        {view === 'builder' && (
          <WorkflowBuilder
            workflow={selectedWorkflow}
            onSave={handleSaveWorkflow}
            onCancel={handleBackToHome}
          />
        )}
        {view === 'run' && (
          <WorkflowRunner
            workflow={runningWorkflow}
            onComplete={handleBackToHome}
            onCancel={handleBackToHome}
          />
        )}
      </div>
    </div>
  )
}
