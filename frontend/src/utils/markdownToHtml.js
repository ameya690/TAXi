/**
 * Convert Markdown to HTML for rich text editor
 * Handles common markdown syntax
 */
export function markdownToHtml(markdown) {
  if (!markdown) return ''
  
  let html = markdown
  
  // Headers (order matters - start with most # first)
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>')
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // Bold
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  
  // Lists - Unordered
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>')
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>')
  
  // Lists - Ordered
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>')
  
  // Wrap consecutive <li> in <ul> or <ol>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return '<ul>' + match + '</ul>'
  })
  
  // Line breaks - convert double newlines to paragraphs
  html = html.split('\n\n').map(para => {
    if (para.trim() && !para.startsWith('<')) {
      return '<p>' + para.trim() + '</p>'
    }
    return para
  }).join('\n')
  
  // Single line breaks
  html = html.replace(/\n/g, '<br>')
  
  // Code blocks
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')
  
  return html
}

/**
 * Convert HTML back to Markdown (for export)
 */
export function htmlToMarkdown(html) {
  if (!html) return ''
  
  let markdown = html
  
  // Headers
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
  markdown = markdown.replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n')
  markdown = markdown.replace(/<h5>(.*?)<\/h5>/gi, '##### $1\n\n')
  markdown = markdown.replace(/<h6>(.*?)<\/h6>/gi, '###### $1\n\n')
  
  // Bold
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
  markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**')
  
  // Italic
  markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*')
  markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*')
  
  // Links
  markdown = markdown.replace(/<a href="([^"]+)">([^<]+)<\/a>/gi, '[$2]($1)')
  
  // Lists
  markdown = markdown.replace(/<ul>(.*?)<\/ul>/gis, (match, content) => {
    return content.replace(/<li>(.*?)<\/li>/gi, '- $1\n')
  })
  markdown = markdown.replace(/<ol>(.*?)<\/ol>/gis, (match, content) => {
    let counter = 1
    return content.replace(/<li>(.*?)<\/li>/gi, () => `${counter++}. $1\n`)
  })
  
  // Paragraphs
  markdown = markdown.replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
  
  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n')
  
  // Code
  markdown = markdown.replace(/<pre><code>(.*?)<\/code><\/pre>/gis, '```$1```')
  markdown = markdown.replace(/<code>(.*?)<\/code>/gi, '`$1`')
  
  // Strikethrough
  markdown = markdown.replace(/<del>(.*?)<\/del>/gi, '~~$1~~')
  
  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '')
  
  // Clean up extra newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n')
  
  return markdown.trim()
}
