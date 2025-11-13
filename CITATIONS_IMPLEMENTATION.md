# Citation Chips & Reasoning Trace Implementation

## ✅ All Features Implemented

Interactive citation chips with hover tooltips, grouped citations in the right rail, click-to-highlight functionality, and collapsible reasoning trace!

## 🎯 Features Implemented

### 1. 📎 Citation Chips in Messages
- **Inline chips** - `[1]` `[2]` `[3]` appear in text
- **Blue badges** - Styled as clickable chips
- **Hover tooltips** - Show full quote and source
- **Click to highlight** - Syncs with right rail
- **Visual feedback** - Highlighted in yellow when active

### 2. 💬 Hover Tooltips
- **Quote display** - Sentence-level citation text
- **Source location** - e.g., "Pub 596 §1"
- **Dark theme** - Professional tooltip styling
- **Arrow pointer** - Points to citation chip
- **Auto-positioning** - Appears above chip

### 3. 📚 Right Rail - Grouped Citations
- **Grouped by source** - All citations organized
- **Source headers** - 📚 icon + source name
- **Citation cards** - Each citation in a card
- **Quote preview** - Shows citation text
- **Section reference** - §1, §2, etc.
- **Click to highlight** - Highlights in message

### 4. 🔗 Click-to-Highlight
- **Bidirectional** - Click chip OR rail item
- **Yellow highlight** - Active citation stands out
- **Toggle behavior** - Click again to unhighlight
- **Synced state** - Updates both views
- **Visual feedback** - Border and background change

### 5. 🧩 Collapsible Reasoning Trace
- **Accordion UI** - Expand/collapse steps
- **Step icons** - 🔍 Retrieve, 📊 Analyze, ✍️ Draft, etc.
- **High-level steps** - No private chain-of-thought
- **Tool invocations** - Shows what tools were used
- **Descriptions** - Details when expanded
- **Clean design** - Matches overall UI

## 🎨 Visual Design

### Citation Chips
```
This is a sentence [1] with a citation.
                    ^^^
                Blue chip, clickable
```

**Styles:**
- Background: Light blue (#dbeafe)
- Text: Dark blue (#1e40af)
- Border: Blue (#93c5fd)
- Highlighted: Yellow (#fef3c7) with orange border

### Hover Tooltip
```
┌─────────────────────────────────┐
│ "The earned income credit is    │
│ available to eligible taxpayers │
│ with qualifying children."      │
│                                 │
│ Pub 596 §1                      │
└─────────────────────────────────┘
         ▼
        [1]
```

**Styles:**
- Background: Dark slate (#1e293b)
- Text: White
- Quote: Italic with blue border
- Source: Gray, smaller font

### Right Rail Citations
```
📚 IRS Publication 596
  [1] "The earned income credit..."
      §1
  
  [2] "Qualifying children must..."
      §2

📚 IRS Publication 17
  [3] "Tax credits reduce your..."
      §5
```

**Styles:**
- Source header: Bold with icon
- Citation cards: White background
- Number: Blue, bold
- Quote: Gray, quoted
- Section: Smaller, lighter gray

### Reasoning Trace
```
🔍 Retrieve Pub 596          ▶
📊 Analyze eligibility       ▼
    Checked income thresholds,
    verified qualifying child
    requirements...
✍️ Draft response           ▶
```

**Styles:**
- Accordion items: White cards
- Icons: Emoji for each step type
- Expanded: Shows description
- Collapsed: Just title

## 📁 Files Created/Modified

### New Files
- `/frontend/src/components/assistant/CitationChip.jsx`
  - Reusable citation chip component
  - Hover tooltip logic
  - Click handling
  - Highlight state

- `/frontend/src/utils/citationParser.js`
  - Parse content for citations
  - Group citations by source
  - Extract citation numbers
  - Segment text and citations

### Modified Files
- `/frontend/src/components/assistant/MessageBlock.jsx`
  - Import CitationChip and parser
  - Render citations inline
  - Pass highlight state
  - Handle citation clicks

- `/frontend/src/components/assistant/SourcesRail.jsx`
  - Group citations by source
  - Add click-to-highlight
  - Show section references
  - Visual highlight state
  - Already had ReasoningAccordion

- `/frontend/src/components/assistant/ChatTab.jsx`
  - Pass citation props through
  - Forward highlight state
  - Forward click handler

- `/frontend/src/components/Assistant.jsx`
  - Add highlightedCitation state
  - Add handleCitationClick
  - Wire up all components
  - Pass props to ChatTab and SourcesRail

## 🚀 How to Use

### Viewing Citations

#### 1. Inline Citations
- Look for blue `[1]` `[2]` chips in messages
- **Hover** over chip to see tooltip
- Tooltip shows full quote and source

#### 2. Right Rail
- Scroll to "Citations" section
- Citations grouped by source
- Each shows number, quote, section

#### 3. Highlighting
**From Message:**
1. Click citation chip `[1]`
2. Chip highlights yellow
3. Same citation highlights in rail

**From Rail:**
1. Click citation card in rail
2. Card highlights yellow
3. Same chip highlights in message

**Toggle Off:**
- Click highlighted citation again
- Returns to normal state

### Reasoning Trace

#### 1. View Steps
- Scroll to "Reasoning Trace" section
- See list of high-level steps
- Icons show step type

#### 2. Expand Details
- Click step header
- Arrow changes ▶ to ▼
- Description appears below

#### 3. Collapse
- Click header again
- Description hides
- Arrow returns to ▶

## 💡 Example Workflows

### Workflow 1: Verify Citation
1. Read answer with citation `[1]`
2. Hover over `[1]` to see quote
3. Click `[1]` to highlight
4. Check right rail for full context
5. See source: "Pub 596 §1"
6. Verify information

### Workflow 2: Explore Sources
1. Look at right rail
2. See citations grouped by source
3. Click citation card
4. Highlights in message
5. Read context around citation
6. Click another citation
7. Switches highlight

### Workflow 3: Understand Reasoning
1. Scroll to Reasoning Trace
2. See "🔍 Retrieve Pub 596"
3. Click to expand
4. Read: "Retrieved sections on EITC eligibility..."
5. See next step: "📊 Analyze"
6. Expand to see analysis details
7. Understand AI's process

## 🔧 Technical Details

### Citation Parsing
```javascript
const { segments } = parseCitations(content, citations)
// Returns: [
//   { type: 'text', content: 'This is ' },
//   { type: 'citation', number: 1, quote: '...', source: '...' },
//   { type: 'text', content: ' more text.' }
// ]
```

### Grouping Citations
```javascript
const grouped = groupCitationsBySource(citations)
// Returns: {
//   'Pub 596': [
//     { number: 1, quote: '...', location: '1' },
//     { number: 2, quote: '...', location: '2' }
//   ],
//   'Pub 17': [...]
// }
```

### Highlight State
```javascript
const [highlightedCitation, setHighlightedCitation] = useState(null)

const handleCitationClick = (citationId) => {
  setHighlightedCitation(prev => 
    prev === citationId ? null : citationId
  )
}
```

### Tooltip Positioning
```css
position: absolute;
bottom: 100%;
left: 50%;
transform: translateX(-50%);
margin-bottom: 8px;
```

## 📊 Citation Data Structure

### Backend Response
```javascript
{
  content: "This is an answer [1] with citations [2].",
  citations: [
    {
      source: "IRS Publication 596",
      quote: "The earned income credit is available...",
      location: "1",
      section: "1"
    },
    {
      source: "IRS Publication 596",
      quote: "Qualifying children must meet...",
      location: "2"
    }
  ]
}
```

### Frontend Processing
```javascript
// Parse content
const { segments } = parseCitations(content, citations)

// Group by source
const grouped = groupCitationsBySource(citations)

// Render
segments.map(segment => {
  if (segment.type === 'citation') {
    return <CitationChip {...segment} />
  }
  return <ReactMarkdown>{segment.content}</ReactMarkdown>
})
```

## 🎯 Reasoning Trace Structure

### Backend Response
```javascript
{
  reasoningTrace: [
    {
      type: 'retrieve',
      title: 'Retrieve Pub 596',
      description: 'Retrieved sections on EITC eligibility criteria...'
    },
    {
      type: 'analyze',
      title: 'Analyze eligibility',
      description: 'Checked income thresholds and qualifying child requirements...'
    },
    {
      type: 'draft',
      title: 'Draft response',
      description: 'Composed answer with citations...'
    }
  ]
}
```

### Step Types & Icons
- `retrieve` → 🔍 (Search/Retrieve)
- `analyze` → 📊 (Analysis)
- `draft` → ✍️ (Writing)
- `synthesize` → 🧩 (Combining)
- `verify` → ✅ (Verification)

## ✅ Definition of Done - Checklist

### Citation Chips
- ✅ Inline `[1]` `[2]` chips in messages
- ✅ Hover tooltips with quote and source
- ✅ Source location display (§1, §2)
- ✅ Click to highlight
- ✅ Visual feedback (blue → yellow)

### Right Rail
- ✅ Citations grouped by source
- ✅ Source headers with icons
- ✅ Citation cards with quotes
- ✅ Section references
- ✅ Click to highlight in message
- ✅ Highlight state synced

### Reasoning Trace
- ✅ Collapsible accordion UI
- ✅ High-level steps only
- ✅ Tool invocations shown
- ✅ Step icons
- ✅ Expand/collapse functionality
- ✅ No private chain-of-thought

### Interactions
- ✅ Bidirectional highlighting
- ✅ Toggle highlight on/off
- ✅ Smooth transitions
- ✅ Hover effects
- ✅ Click feedback

## 🎨 Color Palette

### Citation Chips
- **Normal**: #dbeafe (light blue)
- **Hover**: #bfdbfe (medium blue)
- **Highlighted**: #fef3c7 (yellow)
- **Border (normal)**: #93c5fd (blue)
- **Border (highlighted)**: #f59e0b (orange)

### Tooltips
- **Background**: #1e293b (dark slate)
- **Text**: white
- **Quote border**: #60a5fa (blue)
- **Source text**: #94a3b8 (gray)

### Right Rail
- **Background**: #f8fafc (light gray)
- **Card**: white
- **Highlighted card**: #fef3c7 (yellow)
- **Number**: #667eea (purple)
- **Quote**: #64748b (gray)

## 🚧 Future Enhancements (Optional)

### Advanced Citations
- Multi-page citations
- Image/chart citations
- Video timestamp citations
- Code snippet citations

### Enhanced Tooltips
- Larger previews
- Related citations
- "See full document" link
- Copy citation button

### Reasoning Trace
- Timeline view
- Confidence scores
- Alternative paths explored
- Performance metrics

### Interactions
- Keyboard navigation
- Citation search
- Filter by source
- Export citations

## 📝 Notes

### Citation Format
- Uses `[1]` `[2]` notation
- Numbers correspond to citation list
- Sequential numbering
- Reused numbers for same source

### Tooltip Behavior
- Appears on hover
- Disappears on mouse leave
- Non-blocking (pointer-events: none)
- Auto-positioned above chip

### Highlight Persistence
- Persists across scrolling
- Clears on new highlight
- Toggle to remove
- Visual in both locations

### Performance
- Efficient parsing (one pass)
- Memoized grouping
- No re-renders on hover
- Smooth animations

## ✨ Summary

The Assistant now has **interactive citations** and **reasoning transparency**:

✅ **Citation chips** - `[1]` `[2]` inline  
✅ **Hover tooltips** - Quote + source  
✅ **Section references** - §1, §2, etc.  
✅ **Grouped by source** - Organized in rail  
✅ **Click-to-highlight** - Bidirectional sync  
✅ **Visual feedback** - Yellow highlights  
✅ **Reasoning trace** - Collapsible steps  
✅ **Tool invocations** - What AI did  
✅ **High-level only** - No private thoughts  

**Refresh your browser** and ask a question - you'll see citation chips you can hover and click! 📎
