# Enhanced Citations Rail

## ✅ Citations with Grouping, Deep-Linking & Icon Legend

Complete redesign of the Citations rail with source grouping, citation deep-linking, type icons, and improved reasoning trace.

---

## 🎯 What Changed

### Citations Display

**Before:**
- Flat list of citations
- No grouping
- No type indicators
- Basic click handling

**After:**
- ✅ **Grouped by source** - Doc title • type
- ✅ **Citation numbers** - [1], [2], [3] badges
- ✅ **Type icons** - 📄 📘 ⚖️ 📜
- ✅ **Icon legend** - Explains each type
- ✅ **Highlighted snippets** - Quoted text emphasized
- ✅ **Deep-linking** - Click scrolls to exact location
- ✅ **Brief highlight** - Flashes sentence on click

### Reasoning Trace

**Before:**
- Always expanded
- No timestamps
- Basic display

**After:**
- ✅ **Collapsed by default** - Cleaner interface
- ✅ **3 high-level steps** - Most recent
- ✅ **Chevrons** - Visual indicators
- ✅ **Timestamps** - "2m ago" format
- ✅ **Expandable** - Click to see details

### Citation Sync

**Before:**
- Manual numbering
- No sync with text
- Inconsistent order

**After:**
- ✅ **Auto-numbered** - Based on rail order
- ✅ **Synced with text** - [1]/[2]/[3] match rail
- ✅ **Deep-link anchors** - Scroll to exact location
- ✅ **Consistent order** - Sequential numbering

---

## 📁 Files Created/Modified

**Created**:
```
✅ /components/assistant/SourcesRail_enhanced.jsx
   - Grouped citations by source
   - Citation type icons + legend
   - Deep-linking with scroll + highlight
   - Reasoning trace with timestamps
   - Auto-numbered citations
```

**Modified**:
```
✅ /components/AssistantLayout.jsx
   - Uses enhanced SourcesRail
```

---

## 🎨 Citations Section

### Visual Structure

```
┌────────────────────────────────────────┐
│ 📚 Citations (5)                    ▼  │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ Citation Types                     │ │
│ │ 📄 Internal Doc  📘 IRS Pub        │ │
│ │ ⚖️ Case Law      📜 Regulation     │ │
│ └────────────────────────────────────┘ │
│                                        │
│ 📘 IRS Publication 17 • PDF            │
│ ┌──────────────────────────────────┐   │
│ │ The EITC income threshold is     │ [1]│
│ │ $63,398 for married filing...    │   │
│ │ Section 32(a)(1) • p. 45         │   │
│ └──────────────────────────────────┘   │
│                                        │
│ ⚖️ Smith v. Commissioner • Case Law    │
│ ┌──────────────────────────────────┐   │
│ │ Taxpayers must demonstrate...   │ [2]│
│ │ 123 T.C. 456 • p. 12             │   │
│ └──────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### Components

1. **Icon Legend** - Explains citation types
2. **Source Groups** - Grouped by document
3. **Citation Cards** - Individual citations
4. **Number Badges** - [1], [2], [3]
5. **Highlighted Snippets** - Quoted text
6. **Metadata** - Section, page numbers

---

## 🎨 Icon Legend

### Visual Design

```
┌────────────────────────────────────┐
│ Citation Types                     │
│ 📄 Internal Doc  📘 IRS Pub        │
│ ⚖️ Case Law      📜 Regulation     │
└────────────────────────────────────┘
```

### Icon Mapping

| Icon | Type | Description |
|------|------|-------------|
| 📄 | `internal` | Internal documents |
| 📘 | `irs_pub` | IRS Publications |
| ⚖️ | `case_law` | Case law decisions |
| 📜 | `regulation` | Tax regulations |

### Styling

```javascript
legend: {
  padding: '12px',
  background: neutral-50,
  borderRadius: '10px',
  marginBottom: '12px'
}

legendGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '8px',
  fontSize: '12px'
}
```

---

## 🎨 Source Grouping

### Group Header

```
📘 IRS Publication 17 • PDF
 ↑  ↑                   ↑
Icon Title             Type
```

**Components**:
- Type icon (📘)
- Document title
- Document type (• PDF)

### Styling

```javascript
sourceHeader: {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px',
  padding: '6px 0'
}

sourceIcon: {
  fontSize: '16px'
}

sourceTitle: {
  fontSize: '13px',
  fontWeight: '600',
  color: neutral-800
}

sourceType: {
  fontSize: '12px',
  color: neutral-500
}
```

---

## 🎨 Citation Cards

### Visual Design

```
┌──────────────────────────────────┐
│ The EITC income threshold is     │ [1]
│ $63,398 for married filing...    │
│ Section 32(a)(1) • p. 45         │
└──────────────────────────────────┘
```

### Components

1. **Number Badge** - Top right corner
2. **Snippet** - Quoted text with highlight
3. **Metadata** - Section, page number

### Number Badge

```
[1]
```

- Position: Absolute, top-right
- Size: 20x20px circle
- Background: indigo-600
- Color: white
- Font: 11px, bold

### Highlighted Snippet

```javascript
{citation.textBefore}
<span style={citationHighlight}>
  {citation.highlightedText}
</span>
{citation.textAfter}
```

**Highlight Style**:
- Background: indigo-200 (40% opacity)
- Padding: 2px 4px
- Border radius: 3px
- Font weight: medium

### Metadata Row

```
Section 32(a)(1) • p. 45
```

- Font size: 12px
- Color: neutral-500
- Separator: • (bullet)

---

## 🎨 Deep-Linking

### How It Works

1. **Citation has anchor ID**:
   ```javascript
   citation.anchorId = 'citation-1'
   ```

2. **Text has matching anchor**:
   ```html
   <span id="citation-1">
     The threshold is $63,398 [1].
   </span>
   ```

3. **Click scrolls to anchor**:
   ```javascript
   element.scrollIntoView({ 
     behavior: 'smooth', 
     block: 'center' 
   })
   ```

4. **Brief highlight**:
   ```javascript
   element.style.background = indigo-100
   setTimeout(() => {
     element.style.background = 'transparent'
   }, 2000)
   ```

### Implementation

```javascript
const handleCitationClick = (citation) => {
  // Find anchor element
  const element = document.getElementById(citation.anchorId)
  
  if (element) {
    // Scroll to center
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    })
    
    // Flash highlight
    element.style.background = tokens.colors.primary[100]
    element.style.transition = 'background 300ms ease-out'
    
    setTimeout(() => {
      element.style.background = 'transparent'
    }, 2000)
  }
}
```

---

## 🎨 Citation Numbering

### Auto-Numbering

Citations are numbered sequentially based on their order in the rail:

```javascript
const groupedCitations = citations.reduce((acc, citation, index) => {
  // ...grouping logic...
  acc[source].items.push({
    ...citation,
    number: index + 1 // [1], [2], [3]
  })
  return acc
}, {})
```

### Sync with Text

Text citations use the same numbers:

```
The threshold is $63,398 [1].
                         ↑
              Matches rail number
```

### Display

**In Rail**:
```
┌──────────────────┐
│ Citation text... │ [1]
└──────────────────┘
```

**In Text**:
```
...text [1] more text...
        ↑
   Superscript link
```

---

## 🎨 Reasoning Trace

### Visual Design

```
┌────────────────────────────────────────┐
│ 🧠 Reasoning Trace (3)              ▼  │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ ▸ Step 1: Analyze income      2m  │ │
│ │   Reviewed W-2 forms and...        │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ ▸ Step 2: Check eligibility   1m  │ │
│ │   Compared against EITC...         │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ ▸ Step 3: Calculate credit  Just now│ │
│ │   Applied income thresholds...     │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Components

1. **Chevron** - ▸ indicator
2. **Step number** - Step 1, Step 2, etc.
3. **Title** - Brief description
4. **Timestamp** - "2m ago" format
5. **Description** - Detailed explanation

### Collapsed by Default

```javascript
const [expandedSections, setExpandedSections] = useState({
  citations: true,
  reasoning: false,  // ← Collapsed
  suggestions: true
})
```

### Show 3 Steps

```javascript
reasoningTrace.slice(0, 3).map((step, index) => (
  // Render step
))
```

### Timestamps

```javascript
const formatTimestamp = (ts) => {
  const diffMins = Math.floor((now - date) / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return date.toLocaleDateString()
}
```

### Styling

```javascript
reasoningStep: {
  padding: '12px',
  background: neutral-50,
  border: '1px solid neutral-200',
  borderRadius: '10px',
  borderLeft: '3px solid indigo-600',
  cursor: 'pointer'
}

reasoningHeader: {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px'
}

reasoningTitle: {
  fontSize: '13px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}

reasoningTimestamp: {
  fontSize: '12px',
  color: neutral-500
}
```

---

## 🎯 Definition of Done

✅ **Group by source** - Doc title • type  
✅ **Citation numbers** - [1], [2], [3] badges  
✅ **Quoted snippets** - With subtle highlight  
✅ **Deep-linking** - Click scrolls to anchor  
✅ **Brief highlight** - Flashes sentence  
✅ **Icon legend** - 📄 📘 ⚖️ 📜  
✅ **Type icons** - On each source group  
✅ **Reasoning collapsed** - By default  
✅ **3 high-level steps** - Most recent  
✅ **Chevrons** - ▸ indicators  
✅ **Timestamps** - "2m ago" format  
✅ **Numbers in sync** - Text [1]/[2]/[3] match rail  
✅ **Deep-link correctly** - Scroll to exact location  

---

## 📊 Before & After

### Citations Display

**Before**:
```
┌────────────────────┐
│ Citation 1         │
│ Citation 2         │
│ Citation 3         │
└────────────────────┘
Flat list, no grouping
```

**After**:
```
┌────────────────────────────┐
│ 📘 IRS Pub 17 • PDF        │
│ ┌────────────────────────┐ │
│ │ Citation text...    [1]│ │
│ └────────────────────────┘ │
│                            │
│ ⚖️ Smith v. Comm • Case    │
│ ┌────────────────────────┐ │
│ │ Citation text...    [2]│ │
│ └────────────────────────┘ │
└────────────────────────────┘
Grouped by source, numbered
```

### Citation Click

**Before**:
- Basic click handler
- No scroll
- No highlight

**After**:
1. Click citation in rail
2. Scrolls to anchor in text
3. Centers on screen
4. Flashes highlight (2s)
5. Fades back to normal

### Reasoning Trace

**Before**:
```
┌────────────────────┐
│ Step 1: ...        │
│ Step 2: ...        │
│ Step 3: ...        │
│ Step 4: ...        │
│ Step 5: ...        │
└────────────────────┘
Always expanded, all steps
```

**After**:
```
┌────────────────────────┐
│ 🧠 Reasoning (5)    ▸  │ ← Collapsed
└────────────────────────┘

(Click to expand)
  ↓
┌────────────────────────┐
│ 🧠 Reasoning (5)    ▼  │
├────────────────────────┤
│ ▸ Step 1: ...     2m   │
│ ▸ Step 2: ...     1m   │
│ ▸ Step 3: ...  Just now│
└────────────────────────┘
Shows 3 most recent
```

---

## 🚀 Key Features

### Source Grouping

- Groups citations by document
- Shows document title + type
- Type icon for each group
- Organized, scannable

### Citation Cards

- Number badge [1], [2], [3]
- Highlighted snippet
- Section + page metadata
- Click to jump to text
- Hover effects

### Deep-Linking

- Smooth scroll to anchor
- Centers on screen
- Brief highlight (2s)
- Visual feedback
- Precise navigation

### Icon Legend

- 4 citation types
- Clear visual guide
- Compact 2x2 grid
- Always visible

### Reasoning Trace

- Collapsed by default
- Shows 3 recent steps
- Chevron indicators
- Relative timestamps
- Expandable on click

---

## 🎨 Visual Examples

### Citation with Highlight

```
┌──────────────────────────────────┐
│ The EITC income threshold is     │ [1]
│ $63,398 for married filing       │
│ ▔▔▔▔▔▔▔                          │
│ ↑ Highlighted quoted text        │
│                                  │
│ Section 32(a)(1) • p. 45         │
└──────────────────────────────────┘
```

### Source Group

```
📘 IRS Publication 17 • PDF
 ↑  ↑                   ↑
Icon Title             Type

┌──────────────────┐
│ Citation 1... [1]│
└──────────────────┘
┌──────────────────┐
│ Citation 2... [2]│
└──────────────────┘
```

### Reasoning Step

```
┌────────────────────────────────┐
│ ▸ Step 1: Analyze income   2m  │
│   ↑        ↑                ↑  │
│   Chevron  Title        Timestamp│
│                                │
│   Reviewed W-2 forms and...    │
│   ↑ Description                │
└────────────────────────────────┘
```

### Deep-Link Flow

```
1. Click citation in rail:
   ┌──────────────┐
   │ Text...   [1]│ ← Click
   └──────────────┘

2. Scrolls to text:
   The threshold is $63,398 [1].
                            ↑
                    Scrolls here

3. Highlights briefly:
   ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
   The threshold is $63,398 [1].
   ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
   (Fades after 2s)
```

---

## 🔮 Future Enhancements

### Citations

- [ ] Export citations (BibTeX, APA)
- [ ] Citation search/filter
- [ ] Copy citation text
- [ ] Citation annotations
- [ ] Multi-select citations

### Deep-Linking

- [ ] Highlight duration preference
- [ ] Highlight color customization
- [ ] Scroll offset adjustment
- [ ] Back to citation button
- [ ] Citation history

### Grouping

- [ ] Sort by date/relevance
- [ ] Filter by type
- [ ] Collapse/expand groups
- [ ] Group statistics
- [ ] Custom grouping

### Reasoning

- [ ] Expand all steps
- [ ] Step-by-step playback
- [ ] Export reasoning
- [ ] Reasoning graph
- [ ] Time visualization

---

## ✅ Summary

**Created:**
- Enhanced SourcesRail component
- Source grouping by document
- Citation type icons + legend
- Deep-linking with scroll + highlight
- Reasoning trace with timestamps
- Auto-numbered citations

**Features:**
- ✅ Grouped by source (Doc • type)
- ✅ Citation numbers [1], [2], [3]
- ✅ Highlighted snippets
- ✅ Deep-linking to text
- ✅ Brief sentence highlight
- ✅ Icon legend (📄 📘 ⚖️ 📜)
- ✅ Reasoning collapsed by default
- ✅ 3 high-level steps
- ✅ Chevrons + timestamps
- ✅ Numbers synced with text

**Benefits:**
- 🎯 Better organization (grouping)
- 🔗 Precise navigation (deep-linking)
- 📊 Clear types (icon legend)
- ⏱️ Temporal context (timestamps)
- 📝 Highlighted quotes (snippets)
- ♿ Accessible interactions

**Refresh your browser** to see the enhanced Citations rail! 🎉
