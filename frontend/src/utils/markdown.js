/**
 * Simple Markdown parser for rendering assistant responses
 * Handles common Markdown syntax without external dependencies
 */

export function parseMarkdown(text) {
  if (!text) return ''
  
  let html = text
  
  // Escape HTML to prevent XSS
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Headers (must come before bold/italic)
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  
  // Code blocks (triple backticks)
  html = html.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
  })
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // Unordered lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>')
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>')
  
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gim, '<blockquote>$1</blockquote>')
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>')
  html = html.replace(/^\*\*\*$/gim, '<hr>')
  
  // Line breaks (double newline = paragraph)
  html = html.split('\n\n').map(para => {
    // Don't wrap if already in a block element
    if (para.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/)) {
      return para
    }
    return `<p>${para.replace(/\n/g, '<br>')}</p>`
  }).join('\n')
  
  return html
}

/**
 * Parse Markdown and handle citations
 */
export function parseMarkdownWithCitations(text, citations = []) {
  if (!text) return { html: '', citationRefs: [] }
  
  const citationRefs = []
  
  // First, extract citation markers [1], [2], etc.
  let processedText = text.replace(/\[(\d+)\]/g, (match, num) => {
    citationRefs.push(parseInt(num))
    return `<sup class="citation" data-citation="${num}">[${num}]</sup>`
  })
  
  // Then parse the markdown
  const html = parseMarkdown(processedText)
  
  return { html, citationRefs }
}
