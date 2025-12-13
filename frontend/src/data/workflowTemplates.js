/**
 * Seed workflow templates
 */

export const workflowTemplates = [
  {
    id: 'nexus-check',
    name: 'Jurisdictional Nexus Check',
    description: 'Analyze business activities to determine state tax nexus obligations',
    tags: ['Research', 'Advisory'],
    usageCount: 0,
    lastEdited: new Date().toISOString(),
    steps: [
      {
        id: 'collect-inputs',
        name: 'Collect Inputs',
        type: 'collect',
        inputs: {
          schema: {
            businessActivities: { type: 'text', label: 'Business Activities', required: true },
            states: { type: 'multiselect', label: 'States to Analyze', required: true },
            revenue: { type: 'number', label: 'Annual Revenue', required: true },
            employees: { type: 'number', label: 'Number of Employees', required: false }
          }
        },
        outputs: {
          schema: {
            collectedData: { type: 'object' }
          }
        }
      },
      {
        id: 'normalize-docs',
        name: 'Normalize Documents',
        type: 'transform',
        inputs: {
          schema: {
            documents: { type: 'file[]', label: 'Supporting Documents' }
          }
        },
        tools: ['pdf_extractor', 'text_normalizer'],
        prompt: 'Extract and normalize relevant business activity data from uploaded documents.',
        outputs: {
          schema: {
            normalizedData: { type: 'object' }
          }
        }
      },
      {
        id: 'run-analyses',
        name: 'Run Nexus Analysis',
        type: 'analyze',
        tools: ['nexus_analyzer', 'state_law_lookup'],
        prompt: 'Analyze {{businessActivities}} in {{states}} to determine nexus obligations based on revenue of {{revenue}} and {{employees}} employees.',
        outputs: {
          schema: {
            nexusResults: { type: 'table' },
            recommendations: { type: 'text' }
          }
        }
      },
      {
        id: 'assemble-draft',
        name: 'Assemble Draft Report',
        type: 'draft',
        tools: ['report_generator'],
        prompt: 'Generate a comprehensive nexus analysis report with findings and recommendations.',
        outputs: {
          schema: {
            report: { type: 'draft' }
          }
        }
      },
      {
        id: 'qa-citations',
        name: 'QA & Citations',
        type: 'review',
        tools: ['citation_validator', 'qa_checker'],
        prompt: 'Verify all citations and check report quality.',
        outputs: {
          schema: {
            qaReport: { type: 'text' },
            validatedReport: { type: 'draft' }
          }
        }
      }
    ]
  },
  {
    id: 'rd-credit',
    name: 'R&D Credit Eligibility',
    description: 'Evaluate research activities for R&D tax credit qualification',
    tags: ['Research', 'Filing'],
    usageCount: 0,
    lastEdited: new Date().toISOString(),
    steps: [
      {
        id: 'collect-inputs',
        name: 'Collect Project Data',
        type: 'collect',
        inputs: {
          schema: {
            projectDescription: { type: 'textarea', label: 'Project Description', required: true },
            expenses: { type: 'number', label: 'Total Expenses', required: true },
            employees: { type: 'text', label: 'Key Personnel', required: true }
          }
        }
      },
      {
        id: 'normalize-docs',
        name: 'Extract Technical Details',
        type: 'transform',
        tools: ['technical_extractor'],
        prompt: 'Extract technical details and innovation elements from project documentation.'
      },
      {
        id: 'run-analyses',
        name: 'Four-Part Test Analysis',
        type: 'analyze',
        tools: ['rd_analyzer', 'four_part_test'],
        prompt: 'Evaluate {{projectDescription}} against the four-part test for R&D credit eligibility.'
      },
      {
        id: 'assemble-draft',
        name: 'Generate Eligibility Memo',
        type: 'draft',
        tools: ['memo_generator'],
        prompt: 'Create detailed R&D credit eligibility memorandum with supporting analysis.'
      },
      {
        id: 'qa-citations',
        name: 'Validate Citations',
        type: 'review',
        tools: ['citation_validator'],
        prompt: 'Verify all IRC §41 citations and technical references.'
      }
    ]
  },
  {
    id: 'entity-classification',
    name: 'Entity Classification Memo',
    description: 'Analyze entity structure and prepare classification memorandum',
    tags: ['Research', 'Advisory'],
    usageCount: 0,
    lastEdited: new Date().toISOString(),
    steps: [
      {
        id: 'collect-inputs',
        name: 'Collect Entity Information & Documents',
        type: 'collect',
        inputs: {
          schema: {
            entityName: { type: 'text', label: 'Entity Name', required: true },
            jurisdiction: { type: 'text', label: 'Jurisdiction', required: true },
            owners: { type: 'number', label: 'Number of Owners', required: true },
            structure: { type: 'select', label: 'Legal Structure', options: ['LLC', 'Corp', 'Partnership', 'Other'], required: true }
          }
        },
        uploadDocuments: true,
        documentTypes: ['Operating Agreement', 'Articles of Organization', 'Form 8832 (Entity Classification Election)']
      },
      {
        id: 'normalize-docs',
        name: 'Review Formation Documents',
        type: 'transform',
        tools: ['doc_analyzer'],
        prompt: 'Extract key provisions from formation documents and operating agreements.'
      },
      {
        id: 'run-analyses',
        name: 'Classification Analysis',
        type: 'analyze',
        tools: ['check_the_box_analyzer', 'reg_lookup'],
        prompt: 'Analyze entity under check-the-box regulations for {{entityName}} in {{jurisdiction}}.'
      },
      {
        id: 'assemble-draft',
        name: 'Draft Classification Memo',
        type: 'draft',
        tools: ['memo_generator'],
        prompt: 'Prepare entity classification memorandum with recommendations.'
      },
      {
        id: 'qa-citations',
        name: 'Review & Cite',
        type: 'review',
        tools: ['citation_validator'],
        prompt: 'Validate Reg §301.7701 citations and review analysis.'
      }
    ]
  },
  {
    id: 'eitc-eligibility',
    name: 'EITC Eligibility Assessment',
    description: 'Calculate Earned Income Tax Credit eligibility and credit amount',
    tags: ['Filing', 'Calculator'],
    usageCount: 0,
    lastEdited: new Date().toISOString(),
    steps: [
      {
        id: 'collect-inputs',
        name: 'Collect Taxpayer Information',
        type: 'collect',
        icon: '📝',
        inputs: {
          schema: {
            filingStatus: { type: 'select', label: 'Filing Status', options: ['Single', 'Married Filing Jointly', 'Head of Household', 'Qualifying Widow(er)'], required: true },
            earnedIncome: { type: 'number', label: 'Earned Income', required: true },
            agi: { type: 'number', label: 'Adjusted Gross Income', required: true },
            qualifyingChildren: { type: 'number', label: 'Number of Qualifying Children', required: true },
            investmentIncome: { type: 'number', label: 'Investment Income', required: false },
            taxYear: { type: 'number', label: 'Tax Year', required: true }
          }
        },
        outputs: {
          schema: {
            taxpayerData: { type: 'object' }
          }
        }
      },
      {
        id: 'validate-children',
        name: 'Validate Qualifying Children',
        type: 'analyze',
        icon: '👶',
        tools: ['eitc_validator', 'pub_596_lookup'],
        prompt: 'Verify that {{qualifyingChildren}} children meet the relationship, age, residency, and joint return tests under IRC §32.',
        outputs: {
          schema: {
            validChildren: { type: 'number' },
            validationDetails: { type: 'text' }
          }
        }
      },
      {
        id: 'check-thresholds',
        name: 'Check Income Thresholds',
        type: 'analyze',
        icon: '💰',
        tools: ['threshold_checker', 'eitc_calculator'],
        prompt: 'Verify earned income of {{earnedIncome}} and AGI of {{agi}} are within EITC limits for {{filingStatus}} with {{qualifyingChildren}} children in {{taxYear}}.',
        outputs: {
          schema: {
            meetsThresholds: { type: 'boolean' },
            thresholdAnalysis: { type: 'table' }
          }
        }
      },
      {
        id: 'calculate-credit',
        name: 'Calculate EITC Amount',
        type: 'analyze',
        icon: '🧮',
        tools: ['eitc_calculator', 'phase_out_calculator'],
        prompt: 'Calculate EITC for {{earnedIncome}} earned income, {{agi}} AGI, {{filingStatus}} filing status, and {{qualifyingChildren}} qualifying children.',
        outputs: {
          schema: {
            creditAmount: { type: 'number' },
            calculationBreakdown: { type: 'table' }
          }
        }
      },
      {
        id: 'generate-report',
        name: 'Generate Eligibility Report',
        type: 'draft',
        icon: '📄',
        tools: ['report_generator'],
        prompt: 'Create comprehensive EITC eligibility report with credit calculation, requirements checklist, and supporting citations.',
        outputs: {
          schema: {
            report: { type: 'draft' }
          }
        }
      }
    ]
  },
  {
    id: 'irs-notice-response',
    name: 'Respond to IRS Notice',
    description: 'Analyze IRS notice and prepare comprehensive response',
    tags: ['Filing', 'Advisory'],
    usageCount: 0,
    lastEdited: new Date().toISOString(),
    steps: [
      {
        id: 'collect-inputs',
        name: 'Collect Notice Information',
        type: 'collect',
        icon: '📮',
        inputs: {
          schema: {
            noticeType: { type: 'select', label: 'Notice Type', options: ['CP2000', 'CP501', 'CP503', 'CP504', 'Letter 525', 'Letter 566', 'Other'], required: true },
            noticeDate: { type: 'date', label: 'Notice Date', required: true },
            taxYear: { type: 'number', label: 'Tax Year', required: true },
            proposedChange: { type: 'number', label: 'Proposed Tax Change', required: false },
            responseDeadline: { type: 'date', label: 'Response Deadline', required: true }
          }
        },
        outputs: {
          schema: {
            noticeData: { type: 'object' }
          }
        }
      },
      {
        id: 'analyze-notice',
        name: 'Analyze Notice Content',
        type: 'analyze',
        icon: '🔍',
        tools: ['notice_analyzer', 'irs_pub_lookup'],
        prompt: 'Analyze {{noticeType}} notice for tax year {{taxYear}} with proposed change of {{proposedChange}}. Identify key issues and required documentation.',
        outputs: {
          schema: {
            issuesSummary: { type: 'text' },
            requiredDocs: { type: 'list' }
          }
        }
      },
      {
        id: 'gather-evidence',
        name: 'Gather Supporting Evidence',
        type: 'transform',
        icon: '📎',
        tools: ['document_organizer', 'evidence_collector'],
        prompt: 'Organize supporting documentation and evidence to address the issues identified in the {{noticeType}} notice.',
        outputs: {
          schema: {
            evidenceList: { type: 'table' },
            missingDocs: { type: 'list' }
          }
        }
      },
      {
        id: 'draft-response',
        name: 'Draft Response Letter',
        type: 'draft',
        icon: '✍️',
        tools: ['letter_generator', 'citation_formatter'],
        prompt: 'Draft professional response letter to {{noticeType}} notice addressing all issues, providing explanations, and referencing supporting documentation. Include response deadline of {{responseDeadline}}.',
        outputs: {
          schema: {
            responseLetter: { type: 'draft' }
          }
        }
      },
      {
        id: 'review-checklist',
        name: 'Review & Submission Checklist',
        type: 'review',
        icon: '✅',
        tools: ['checklist_generator', 'deadline_tracker'],
        prompt: 'Create submission checklist including all required documents, proper addressing, deadline tracking, and follow-up procedures.',
        outputs: {
          schema: {
            checklist: { type: 'list' },
            submissionInstructions: { type: 'text' }
          }
        }
      }
    ]
  }
]

export function getWorkflowById(id) {
  return workflowTemplates.find(w => w.id === id)
}

export function getWorkflowsByTag(tag) {
  return workflowTemplates.filter(w => w.tags.includes(tag))
}
