/**
 * Parse content and inject citation markers
 * Handles both [1] style citations and generates citation data
 */

export function parseCitations(content, citations = []) {
  if (!content || !citations.length) return { segments: [{ type: 'text', content }], citations: [] }

  const segments = []
  const citationMap = new Map()
  
  // Build citation map by number
  citations.forEach((citation, idx) => {
    citationMap.set(idx + 1, citation)
  })

  // Regex to find citation markers like [1], [2], etc.
  const citationRegex = /\[(\d+)\]/g
  let lastIndex = 0
  let match

  while ((match = citationRegex.exec(content)) !== null) {
    // Add text before citation
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      })
    }

    // Add citation
    const citationNumber = parseInt(match[1])
    const citation = citationMap.get(citationNumber)
    
    segments.push({
      type: 'citation',
      number: citationNumber,
      citationId: `cite-${citationNumber}`,
      quote: citation?.quote || 'Citation text',
      source: citation?.source || `Source ${citationNumber}`,
      location: citation?.location || citation?.section || ''
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      content: content.substring(lastIndex)
    })
  }

  return { segments, citations }
}

/**
 * Group citations by source
 */
export function groupCitationsBySource(citations) {
  const grouped = {}
  
  citations.forEach((citation, idx) => {
    const source = citation.source || `Source ${idx + 1}`
    if (!grouped[source]) {
      grouped[source] = []
    }
    grouped[source].push({
      ...citation,
      number: idx + 1,
      citationId: `cite-${idx + 1}`
    })
  })

  return grouped
}

/**
 * Extract citation numbers from content
 */
export function extractCitationNumbers(content) {
  if (!content) return []
  
  const citationRegex = /\[(\d+)\]/g
  const numbers = []
  let match

  while ((match = citationRegex.exec(content)) !== null) {
    numbers.push(parseInt(match[1]))
  }

  return [...new Set(numbers)].sort((a, b) => a - b)
}
