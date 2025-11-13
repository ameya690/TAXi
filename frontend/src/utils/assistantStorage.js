/**
 * Assistant state persistence using localStorage
 */

const STORAGE_KEY = 'taxi_assistant_state'
const STORAGE_VERSION = '1.0'

export function saveAssistantState(state) {
  try {
    const stateToSave = {
      version: STORAGE_VERSION,
      timestamp: new Date().toISOString(),
      messages: state.messages,
      draftContent: state.draftContent,
      tableData: state.tableData,
      selectedMatter: state.selectedMatter,
      docsInScope: state.docsInScope,
      citations: state.citations,
      reasoningTrace: state.reasoningTrace,
      suggestions: state.suggestions,
      knowledgeSources: state.knowledgeSources
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    return true
  } catch (error) {
    console.error('Failed to save assistant state:', error)
    return false
  }
}

export function loadAssistantState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    
    const state = JSON.parse(saved)
    
    // Check version compatibility
    if (state.version !== STORAGE_VERSION) {
      console.warn('Assistant state version mismatch, clearing old state')
      clearAssistantState()
      return null
    }
    
    return {
      messages: state.messages || [],
      draftContent: state.draftContent || '',
      tableData: state.tableData || null,
      selectedMatter: state.selectedMatter || null,
      docsInScope: state.docsInScope || [],
      citations: state.citations || [],
      reasoningTrace: state.reasoningTrace || [],
      suggestions: state.suggestions || [],
      knowledgeSources: state.knowledgeSources || {
        irs_publications: true,
        case_law: false,
        regulations: true
      }
    }
  } catch (error) {
    console.error('Failed to load assistant state:', error)
    return null
  }
}

export function clearAssistantState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear assistant state:', error)
    return false
  }
}

export function getStateTimestamp() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    
    const state = JSON.parse(saved)
    return state.timestamp
  } catch (error) {
    return null
  }
}
