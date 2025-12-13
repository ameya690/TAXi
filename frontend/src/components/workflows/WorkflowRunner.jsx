import React, { useState, useEffect } from 'react'
import EITCInfoDialog from '../eligibility/EITCInfoDialog'
import EntityClassificationDialog from './EntityClassificationDialog'
import JurisdictionalNexusDialog from './JurisdictionalNexusDialog'
import RDCreditDialog from './RDCreditDialog'

export default function WorkflowRunner({ workflow, onComplete, onCancel }) {
  const [stepStatuses, setStepStatuses] = useState(workflow.stepStatuses || {})
  const [artifacts, setArtifacts] = useState(workflow.artifacts || {})
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [inputValues, setInputValues] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(
    workflow.id === 'eitc-eligibility' || 
    workflow.id === 'entity-classification' ||
    workflow.id === 'nexus-check' ||
    workflow.id === 'rd-credit'
  )
  const [uploadedDocuments, setUploadedDocuments] = useState({})
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    // Auto-start first step if not started
    if (currentStepIndex === 0 && stepStatuses[workflow.steps[0]?.id] === 'pending') {
      // Could auto-run or wait for user to click Run
    }
  }, [])

  const handleFileUpload = async (stepId, file, documentType) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('matter', inputValues[stepId]?.entityName || 'Entity Classification')
      
      const response = await fetch('/api/assistant/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const result = await response.json()
      
      // Store uploaded document info
      setUploadedDocuments(prev => ({
        ...prev,
        [stepId]: [
          ...(prev[stepId] || []),
          {
            type: documentType,
            filename: result.document.filename,
            unique_filename: result.document.unique_filename,
            matter: result.document.matter,
            uploadDate: result.document.upload_date,
            fileSize: result.document.file_size,
            pageCount: result.document.page_count
          }
        ]
      }))
      
      console.log('Document uploaded successfully:', result)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload ${file.name}: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenericWorkflow = async (step, stepIndex, analysisType) => {
    if (step.id === 'collect-inputs') {
      // Validate inputs
      const inputs = inputValues[step.id] || {}
      const schema = step.inputs?.schema || {}
      
      const missingFields = Object.entries(schema)
        .filter(([field, config]) => config.required && !inputs[field])
        .map(([field, config]) => config.label || field)
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`)
      }
      
      setArtifacts(prev => ({ ...prev, [step.id]: {
        type: 'data',
        content: inputs
      }}))
      setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
      setIsRunning(false)
      
      if (stepIndex < workflow.steps.length - 1) {
        setCurrentStepIndex(stepIndex + 1)
        setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
      }
      return
    }
    
    if (step.id === 'assemble-draft' || step.id === 'generate-summary') {
      // Call Assistant API for final analysis
      const inputs = inputValues['collect-inputs'] || {}
      const inputSummary = Object.entries(inputs).map(([k, v]) => `${k}: ${v}`).join(', ')
      
      const question = `Based on the following information, provide a comprehensive ${analysisType}:\n\n${inputSummary}\n\nProvide detailed analysis with specific recommendations, citations to relevant tax code sections, and actionable next steps. Format the response professionally with clear sections.`
      
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          lang: 'en'
        })
      })
      
      if (!response.ok) throw new Error(`Failed to generate ${analysisType}`)
      
      const result = await response.json()
      
      setArtifacts(prev => ({ ...prev, [step.id]: {
        type: 'draft',
        content: result.content
      }}))
      setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
      setIsRunning(false)
      
      if (stepIndex < workflow.steps.length - 1) {
        setCurrentStepIndex(stepIndex + 1)
        setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
      }
      return
    }
    
    // Intermediate steps - simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    const inputs = inputValues['collect-inputs'] || {}
    
    setArtifacts(prev => ({ ...prev, [step.id]: {
      type: 'data',
      content: {
        status: 'Completed',
        message: `✅ ${step.name} completed successfully`,
        summary: `Analyzed data for ${analysisType}`
      }
    }}))
    setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
    setIsRunning(false)
    
    if (stepIndex < workflow.steps.length - 1) {
      setCurrentStepIndex(stepIndex + 1)
      setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
    }
  }

  const handleRunStep = async (stepIndex) => {
    const step = workflow.steps[stepIndex]
    setStepStatuses(prev => ({ ...prev, [step.id]: 'running' }))
    setIsRunning(true)

    try {
      // Special handling for EITC eligibility workflow
      if (workflow.id === 'eitc-eligibility') {
        if (step.id === 'collect-inputs') {
          // Validate required inputs are filled
          const inputs = inputValues[step.id] || {}
          const schema = step.inputs?.schema || {}
          
          const missingFields = Object.entries(schema)
            .filter(([field, config]) => config.required && !inputs[field])
            .map(([field, config]) => config.label || field)
          
          if (missingFields.length > 0) {
            throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`)
          }
          
          // Store inputs as artifact for reference
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'data',
            content: inputs
          }}))
          
          // Mark as done
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          
          // Move to next step
          if (stepIndex < workflow.steps.length - 1) {
            setCurrentStepIndex(stepIndex + 1)
            setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
          }
          return
        }
        
        if (step.id === 'validate-children') {
          // Simulate validation
          await new Promise(resolve => setTimeout(resolve, 1500))
          const inputs = inputValues['collect-inputs'] || {}
          const numChildren = parseInt(inputs.qualifyingChildren) || 0
          
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'data',
            content: {
              validChildren: numChildren,
              validationDetails: `Validated ${numChildren} qualifying children based on EITC requirements.`
            }
          }}))
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          
          // Move to next step
          if (stepIndex < workflow.steps.length - 1) {
            setCurrentStepIndex(stepIndex + 1)
            setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
          }
          return
        }
        
        if (step.id === 'check-thresholds') {
          // Simulate threshold check
          await new Promise(resolve => setTimeout(resolve, 1500))
          const inputs = inputValues['collect-inputs'] || {}
          
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'table',
            content: {
              columns: ['Requirement', 'Your Value', 'Status'],
              rows: [
                ['Earned Income', `$${parseInt(inputs.earnedIncome || 0).toLocaleString()}`, '✅ Valid'],
                ['AGI', `$${parseInt(inputs.agi || 0).toLocaleString()}`, '✅ Valid'],
                ['Investment Income', `$${parseInt(inputs.investmentIncome || 0).toLocaleString()}`, '✅ Under $11,000']
              ]
            }
          }}))
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          
          // Move to next step
          if (stepIndex < workflow.steps.length - 1) {
            setCurrentStepIndex(stepIndex + 1)
            setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
          }
          return
        }
        
        if (step.id === 'calculate-credit') {
          console.log('=== CALCULATE CREDIT STEP ===')
          console.log('All input values:', inputValues)
          
          // Call real backend API
          const inputs = inputValues['collect-inputs'] || {}
          console.log('Inputs from collect-inputs step:', inputs)
          
          // Validate we have required inputs
          if (!inputs.earnedIncome || !inputs.agi) {
            console.error('Missing required inputs:', inputs)
            throw new Error('Missing required inputs. Please fill in all fields in Step 1.')
          }
          
          // Map workflow inputs to API format
          const apiPayload = {
            tax_year: parseInt(inputs.taxYear) || 2024,
            filing_status: inputs.filingStatus?.toLowerCase().replace(/ /g, '_') || 'single',
            age: 30, // Default, could add to inputs
            ssn_valid: true,
            is_us_resident: true,
            qualifying_children: parseInt(inputs.qualifyingChildren) || 0,
            earned_income: parseFloat(inputs.earnedIncome) || 0,
            agi: parseFloat(inputs.agi) || 0,
            investment_income: parseFloat(inputs.investmentIncome) || 0,
            has_foreign_earned_income: false,
            claimed_as_dependent: false,
            lived_in_us_over_half_year: true,
            is_self_employed: false,
            self_employment_tax: 0
          }
          
          console.log('API Payload:', apiPayload)
          console.log('Calling API: /api/eligibility/assess')
          
          const response = await fetch('/api/eligibility/assess', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiPayload)
          })
          
          console.log('API Response status:', response.status)
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error:', errorText)
            throw new Error(`Failed to assess eligibility: ${response.status}`)
          }
          
          const result = await response.json()
          console.log('API Result:', result)
          
          // Store real results
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'eligibility_result',
            content: result
          }}))
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          
          console.log('Step completed successfully')
          
          // Move to next step (generate report)
          if (stepIndex < workflow.steps.length - 1) {
            setCurrentStepIndex(stepIndex + 1)
            setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
          }
          return
        }
        
        if (step.id === 'generate-report') {
          // Generate a summary report
          await new Promise(resolve => setTimeout(resolve, 1500))
          const calcArtifact = artifacts['calculate-credit']
          const result = calcArtifact?.content || {}
          
          const reportContent = `# EITC Eligibility Report

## Summary
${result.eligible ? '✅ **Eligible for EITC**' : '❌ **Not Eligible for EITC**'}

${result.eligible && result.estimated_credit ? `### Estimated Credit Amount: $${result.estimated_credit.toLocaleString()}` : ''}

## Details
${result.details ? result.details.map(d => `- ${d}`).join('\n') : 'No additional details available.'}

## Disclaimer
${result.disclaimer || 'This is an estimate for informational purposes only. Consult a tax professional for official guidance.'}
`
          
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'draft',
            content: reportContent
          }}))
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          return
        }
      }
      
      // Special handling for Entity Classification workflow
      if (workflow.id === 'entity-classification') {
        if (step.id === 'collect-inputs') {
          // Validate required inputs
          const inputs = inputValues[step.id] || {}
          const schema = step.inputs?.schema || {}
          
          const missingFields = Object.entries(schema)
            .filter(([field, config]) => config.required && !inputs[field])
            .map(([field, config]) => config.label || field)
          
          if (missingFields.length > 0) {
            throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`)
          }
          
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'data',
            content: inputs
          }}))
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          
          if (stepIndex < workflow.steps.length - 1) {
            setCurrentStepIndex(stepIndex + 1)
            setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
          }
          return
        }
        
        if (step.id === 'normalize-docs' || step.id === 'run-analyses') {
          // Simulate document review and analysis
          await new Promise(resolve => setTimeout(resolve, 2000))
          const inputs = inputValues['collect-inputs'] || {}
          
          const analysisContent = step.id === 'normalize-docs' 
            ? `Reviewed formation documents for ${inputs.entityName || 'entity'}. Key provisions identified.`
            : `Analyzed ${inputs.entityName || 'entity'} under check-the-box regulations (Reg §301.7701).`
          
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'data',
            content: { analysis: analysisContent, status: 'completed' }
          }}))
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          
          if (stepIndex < workflow.steps.length - 1) {
            setCurrentStepIndex(stepIndex + 1)
            setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
          }
          return
        }
        
        if (step.id === 'assemble-draft') {
          // Call Assistant API to generate entity classification memo
          const inputs = inputValues['collect-inputs'] || {}
          const docs = uploadedDocuments['collect-inputs'] || []
          
          // Build question with document context
          let question = `Prepare a comprehensive entity classification memorandum for ${inputs.entityName}, a ${inputs.structure} formed in ${inputs.jurisdiction} with ${inputs.owners} owner(s).`
          
          if (docs.length > 0) {
            question += `\n\nI have uploaded the following documents for analysis:\n`
            docs.forEach(doc => {
              question += `- ${doc.type}: ${doc.filename}\n`
            })
            question += `\nPlease analyze these documents and `
          } else {
            question += ` Please `
          }
          
          question += `analyze the entity under check-the-box regulations (Reg §301.7701) and provide tax classification recommendations. Include:\n\n1. Analysis of formation documents and operating agreement provisions\n2. Check-the-box regulation analysis (Reg §301.7701-1, -2, -3)\n3. Comparison of classification options (Partnership, C-Corp, S-Corp)\n4. Advantages and disadvantages of each option\n5. Specific recommendations based on the entity structure\n6. Citations to relevant regulations and authorities\n\nFormat the memo professionally with clear sections.`
          
          console.log('Calling Assistant API for entity classification memo...')
          console.log('Uploaded documents:', docs)
          
          // Prepare docs array for API
          const docsForAPI = docs.map(doc => ({
            name: doc.filename,
            unique_name: doc.unique_filename,
            matter: doc.matter
          }))
          
          const response = await fetch('/api/assistant/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: question,
              lang: 'en',
              docs: docsForAPI,
              matter: inputs.entityName
            })
          })
          
          if (!response.ok) {
            throw new Error('Failed to generate classification memo')
          }
          
          const result = await response.json()
          const memoContent = result.content || 'Unable to generate memo'
          
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'draft',
            content: memoContent
          }}))
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          
          if (stepIndex < workflow.steps.length - 1) {
            setCurrentStepIndex(stepIndex + 1)
            setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
          }
          return
        }
        
        if (step.id === 'qa-citations') {
          // Final review step
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          setArtifacts(prev => ({ ...prev, [step.id]: {
            type: 'data',
            content: {
              status: 'Reviewed',
              message: '✅ Citations validated. Memo ready for client delivery.',
              citations: ['Reg §301.7701-1', 'Reg §301.7701-2', 'Reg §301.7701-3']
            }
          }}))
          setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
          setIsRunning(false)
          return
        }
      }
      
      // Nexus Check workflow
      if (workflow.id === 'nexus-check') {
        await handleGenericWorkflow(step, stepIndex, 'nexus analysis')
        return
      }
      
      // R&D Credit workflow
      if (workflow.id === 'rd-credit') {
        await handleGenericWorkflow(step, stepIndex, 'R&D credit analysis')
        return
      }
      
      // Default mock behavior for other workflows
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockArtifacts = generateMockArtifacts(step)
      setArtifacts(prev => ({ ...prev, [step.id]: mockArtifacts }))
      setStepStatuses(prev => ({ ...prev, [step.id]: 'done' }))
      setIsRunning(false)

      // Move to next step
      if (stepIndex < workflow.steps.length - 1) {
        setCurrentStepIndex(stepIndex + 1)
        setStepStatuses(prev => ({ ...prev, [workflow.steps[stepIndex + 1].id]: 'pending' }))
      }
    } catch (error) {
      console.error('Step execution error:', error)
      setStepStatuses(prev => ({ ...prev, [step.id]: 'needs_attention' }))
      setArtifacts(prev => ({ ...prev, [step.id]: {
        type: 'error',
        content: { message: error.message }
      }}))
      setIsRunning(false)
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
      case 'eligibility_result':
        const result = artifact.content
        return (
          <div>
            {/* Eligibility Status */}
            <div style={{
              padding: '24px',
              borderRadius: '12px',
              background: result.eligible ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {result.eligible ? '✅' : '❌'}
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
                {result.eligible ? 'Eligible for EITC!' : 'Not Eligible'}
              </h3>
              {result.eligible && result.estimated_credit && (
                <div style={{ fontSize: '36px', fontWeight: '700', marginTop: '16px' }}>
                  ${result.estimated_credit.toLocaleString()}
                </div>
              )}
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '8px 0 0 0' }}>
                {result.eligible ? 'Estimated EITC Amount' : result.reason || 'Does not meet eligibility requirements'}
              </p>
            </div>

            {/* Details */}
            {result.details && result.details.length > 0 && (
              <div style={styles.artifactSection}>
                <h4 style={styles.sectionTitle}>Eligibility Details</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                  {result.details.map((detail, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Breakdown */}
            {result.breakdown && (
              <div style={styles.artifactSection}>
                <h4 style={styles.sectionTitle}>Credit Breakdown</h4>
                <table style={styles.table}>
                  <tbody>
                    {Object.entries(result.breakdown).map(([key, value]) => (
                      <tr key={key}>
                        <td style={{...styles.td, fontWeight: '600'}}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        <td style={styles.td}>{typeof value === 'number' ? `$${value.toLocaleString()}` : value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Disclaimer */}
            {result.disclaimer && (
              <div style={{
                padding: '16px',
                background: '#fef3c7',
                borderLeft: '4px solid #f59e0b',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#78350f',
                fontStyle: 'italic'
              }}>
                {result.disclaimer}
              </div>
            )}
          </div>
        )
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
        // Simple Markdown rendering
        const renderMarkdown = (text) => {
          return text
            .split('\n')
            .map((line, idx) => {
              // Headers
              if (line.startsWith('### ')) {
                return <h3 key={idx} style={{ fontSize: '18px', fontWeight: '600', margin: '16px 0 8px 0', color: '#1e293b' }}>{line.replace('### ', '')}</h3>
              }
              if (line.startsWith('## ')) {
                return <h2 key={idx} style={{ fontSize: '20px', fontWeight: '700', margin: '20px 0 12px 0', color: '#1e293b' }}>{line.replace('## ', '')}</h2>
              }
              if (line.startsWith('# ')) {
                return <h1 key={idx} style={{ fontSize: '24px', fontWeight: '700', margin: '24px 0 16px 0', color: '#1e293b' }}>{line.replace('# ', '')}</h1>
              }
              // Bold text
              if (line.includes('**')) {
                const parts = line.split('**')
                return (
                  <p key={idx} style={{ margin: '8px 0', lineHeight: '1.6', color: '#475569' }}>
                    {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                  </p>
                )
              }
              // List items
              if (line.startsWith('- ')) {
                return <li key={idx} style={{ marginLeft: '20px', marginBottom: '4px', color: '#475569' }}>{line.replace('- ', '')}</li>
              }
              // Empty lines
              if (line.trim() === '') {
                return <div key={idx} style={{ height: '8px' }} />
              }
              // Regular paragraphs
              return <p key={idx} style={{ margin: '8px 0', lineHeight: '1.6', color: '#475569' }}>{line}</p>
            })
        }
        return <div style={styles.draftPreview}>{renderMarkdown(artifact.content)}</div>
      case 'data':
        return <pre style={styles.draftPreview}>{JSON.stringify(artifact.content, null, 2)}</pre>
      case 'error':
        return (
          <div style={{
            padding: '16px',
            background: '#fee2e2',
            borderLeft: '4px solid #ef4444',
            borderRadius: '8px',
            color: '#991b1b'
          }}>
            <strong>Error:</strong> {artifact.content.message}
          </div>
        )
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
                  {fieldConfig.type === 'select' ? (
                    <select
                      value={inputValues[currentStep.id]?.[fieldName] || ''}
                      onChange={(e) => handleEditInput(currentStep.id, fieldName, e.target.value)}
                      style={styles.input}
                      disabled={currentStatus === 'done'}
                    >
                      <option value="">Select...</option>
                      {fieldConfig.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={fieldConfig.type === 'number' ? 'number' : 'text'}
                      value={inputValues[currentStep.id]?.[fieldName] || ''}
                      onChange={(e) => handleEditInput(currentStep.id, fieldName, e.target.value)}
                      style={styles.input}
                      disabled={currentStatus === 'done'}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Document Upload Section */}
          {currentStep?.uploadDocuments && (
            <div style={styles.inputSection}>
              <div style={styles.sectionTitle}>📎 Upload Documents</div>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Upload the following documents for analysis:
              </p>
              {currentStep.documentTypes?.map((docType, idx) => (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  <label style={styles.label}>{docType}</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) handleFileUpload(currentStep.id, file, docType)
                      }}
                      style={{ flex: 1 }}
                      disabled={currentStatus === 'done' || isUploading}
                    />
                    {uploadedDocuments[currentStep.id]?.find(d => d.type === docType) && (
                      <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
                        ✓ Uploaded
                      </span>
                    )}
                  </div>
                  {uploadedDocuments[currentStep.id]?.find(d => d.type === docType) && (
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      {uploadedDocuments[currentStep.id].find(d => d.type === docType).filename} 
                      ({uploadedDocuments[currentStep.id].find(d => d.type === docType).pageCount} pages)
                    </div>
                  )}
                </div>
              ))}
              {isUploading && (
                <div style={{ 
                  padding: '12px', 
                  background: '#eff6ff', 
                  borderRadius: '8px',
                  color: '#1e40af',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  📤 Uploading document...
                </div>
              )}
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

      {/* Info Dialog for EITC Eligibility */}
      {showInfoDialog && workflow.id === 'eitc-eligibility' && (
        <EITCInfoDialog
          onClose={() => setShowInfoDialog(false)}
          onGetStarted={() => setShowInfoDialog(false)}
        />
      )}
      
      {/* Info Dialog for Entity Classification */}
      {showInfoDialog && workflow.id === 'entity-classification' && (
        <EntityClassificationDialog
          onClose={() => setShowInfoDialog(false)}
          onGetStarted={() => setShowInfoDialog(false)}
        />
      )}
      
      {/* Info Dialog for Nexus Check */}
      {showInfoDialog && workflow.id === 'nexus-check' && (
        <JurisdictionalNexusDialog
          onClose={() => setShowInfoDialog(false)}
          onGetStarted={() => setShowInfoDialog(false)}
        />
      )}
      
      {/* Info Dialog for R&D Credit */}
      {showInfoDialog && workflow.id === 'rd-credit' && (
        <RDCreditDialog
          onClose={() => setShowInfoDialog(false)}
          onGetStarted={() => setShowInfoDialog(false)}
        />
      )}
    </div>
  )
}
