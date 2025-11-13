# Notion-Style Document Blocks

## ✅ Chat Redesigned as Document Blocks

Complete redesign of the chat interface from messaging bubbles to Notion-style document blocks with inline citations, drag handles, and insert actions.

---

## 🎯 What Changed

### Tabs

**Before:**
- Filled pill buttons
- Background color for active state
- Heavy styling

**After:**
- ✅ **Notion-style underlines** - Clean, minimal
- ✅ **2px accent underline** - Selected tab only
- ✅ **No filled pills** - Transparent background
- ✅ **Color change on hover** - Subtle interaction

### Chat Interface

**Before:**
- Chat bubbles (messaging app style)
- User messages on right
- Assistant messages on left
- Gradient backgrounds
- No structure

**After:**
- ✅ **Document blocks** - Notion-like cards
- ✅ **Title line (H3)** - Clear hierarchy
- ✅ **Meta row** - Time • artifact type
- ✅ **68-74ch measure** - Optimal reading width
- ✅ **Inline citations** - Superscript [1], [2]
- ✅ **Hover highlights** - Citations highlight in right rail
- ✅ **Drag handles** - Six dots on hover
- ✅ **Insert buttons** - + between blocks

---

## 📁 Files Created

```
✅ /components/assistant/DocumentBlock.jsx
   - Notion-style document card
   - Title + meta row
   - Inline citation superscripts
   - Drag handle (six dots)
   - Insert action menu
   - 68-74ch reading width

✅ NOTION_STYLE_BLOCKS.md
   - Complete documentation
```

### Files Modified

```
✅ /components/Assistant.jsx
   - Notion-style tab underlines
   - No filled pills
   - 2px accent underline

✅ /components/assistant/ChatTab.jsx
   - Uses DocumentBlock instead of MessageBlock
   - Removed Composer (now in layout)
   - Notion-style empty state
   - Loading block with dots
```

---

## 🎨 Tabs Design (Notion-Style)

### Visual Appearance

```
┌──────────────────────────────────────────────┐
│ Chat    Draft    Table Review      Clear     │
│ ══                                            │
└──────────────────────────────────────────────┘
  ↑
  2px indigo-600 underline
```

### Tab States

**Inactive**:
- Background: transparent
- Color: neutral-600
- Border: none
- Hover: neutral-900

**Active**:
- Background: transparent
- Color: neutral-900
- Border bottom: 2px solid indigo-600
- Font weight: semibold

### Styling

```javascript
tab: {
  background: 'transparent',
  border: 'none',
  padding: '8px 0',
  fontSize: '15px',
  fontWeight: '500',
  color: neutral-600,
  borderBottom: '2px solid transparent',
  marginBottom: '-1px'
}

tabActive: {
  color: neutral-900,
  fontWeight: '600',
  borderBottom: '2px solid indigo-600'
}
```

---

## 🎨 Document Block Design

### Block Structure

```
┌─────────────────────────────────────────────┐
│ ⋮⋮  Response                                │
│     2m ago • Analysis                       │
│                                             │
│     Based on the information provided,     │
│     you may qualify for EITC [1]. The      │
│     income threshold is $63,398 [2].       │
│                                             │
│                    [+]                      │
└─────────────────────────────────────────────┘
 ↑                  ↑
 Drag handle        Insert button
 (on hover)         (on hover)
```

### Components

**Drag Handle** (left side):
- Six dots (⋮⋮) in 2x3 grid
- Appears on hover
- 20x20px
- Left: -24px (outside block)
- Color: neutral-400
- Cursor: grab

**Title Line**:
- H3 (16px, semibold)
- Color: neutral-900
- Margin bottom: 4px

**Meta Row**:
- 12px, neutral-500
- Format: "2m ago • Analysis"
- Separator: • (bullet)

**Body Content**:
- 15px / 24px line height
- Color: neutral-700
- Max width: 72ch (optimal reading)
- Pre-wrap, word-wrap

**Citations**:
- Superscript [1], [2]
- Color: indigo-600
- Font weight: semibold
- Cursor: pointer
- Hover: underline + darker color

**Insert Button** (bottom center):
- 24px circle
- + icon
- Appears on hover
- Bottom: -12px (between blocks)
- Opens action menu

---

## 🎨 Citation Superscripts

### Inline Citations

```
The income threshold is $63,398 [1].
                                 ↑
                          Superscript link
```

### Styling

```javascript
citation: {
  color: indigo-600,
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.85em',
  textDecoration: 'none'
}

citation:hover: {
  color: indigo-700,
  textDecoration: 'underline'
}
```

### Interaction

**Hover**:
- Highlights matching citation in right rail
- Changes color to indigo-700
- Adds underline

**Click**:
- Scrolls to citation in right rail
- Expands citation details
- Highlights citation card

---

## 🎨 Drag Handle (Six Dots)

### Visual Design

```
⋮⋮
⋮⋮
⋮⋮

2x3 grid of dots
Each dot: 3x3px
Gap: 2px
```

### Styling

```javascript
dragHandle: {
  position: 'absolute',
  left: '-24px',
  top: '24px',
  width: '20px',
  height: '20px',
  opacity: isHovered ? 1 : 0,
  cursor: 'grab',
  color: neutral-400
}

dragDots: {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 3px)',
  gridTemplateRows: 'repeat(3, 3px)',
  gap: '2px'
}

dot: {
  width: '3px',
  height: '3px',
  background: 'currentColor',
  borderRadius: '50%'
}
```

### Interaction

- Appears on block hover
- Fade in/out (opacity transition)
- Cursor changes to grab
- Ready for drag-and-drop (future)

---

## 🎨 Insert Action Menu

### Button

```
     [+]
```

- 24px circle
- Centered below block
- Appears on hover
- Background: white
- Border: 1px neutral-200

### Menu

```
┌──────────────────────┐
│ 💬 Ask follow-up     │
│ ✍️ Create draft      │
│ 📋 Create table      │
└──────────────────────┘
```

### Actions

1. **Ask follow-up** - Insert new chat input
2. **Create draft** - Open draft tab with context
3. **Create table** - Create table from block

### Styling

```javascript
insertButton: {
  position: 'absolute',
  left: '50%',
  bottom: '-12px',
  transform: 'translateX(-50%)',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: white,
  border: '1px solid neutral-200',
  opacity: isHovered ? 1 : 0
}

insertMenu: {
  position: 'absolute',
  left: '50%',
  bottom: '-12px',
  transform: 'translate(-50%, 100%)',
  marginTop: '8px',
  background: white,
  border: '1px solid neutral-200',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  minWidth: '180px'
}
```

---

## 🎨 User vs Assistant Blocks

### User Blocks

```
┌─────────────────────────────────────────────┐
│ What is the EITC income threshold?         │
│ Just now                                    │
└─────────────────────────────────────────────┘
```

- No title
- No drag handle
- No insert button
- Background: neutral-50
- Border: neutral-200
- Simpler styling

### Assistant Blocks

```
┌─────────────────────────────────────────────┐
│ ⋮⋮  Response                                │
│     2m ago • Analysis                       │
│                                             │
│     The EITC income threshold is $63,398   │
│     for married filing jointly [1].        │
│                                             │
│                    [+]                      │
└─────────────────────────────────────────────┘
```

- Has title (H3)
- Has meta row (time + type)
- Has drag handle
- Has insert button
- Has citations
- Background: white
- Border: neutral-200

---

## 📊 Reading Width

### Optimal Measure

**68-74 characters per line** for optimal readability:

```javascript
content: {
  maxWidth: '72ch',
  fontSize: '15px',
  lineHeight: '24px'
}
```

### Why 72ch?

- Optimal reading comfort
- Reduces eye strain
- Improves comprehension
- Standard for long-form content
- Used by Medium, Notion, etc.

---

## 🎨 Block Hover States

### Default State

- Border: 1px neutral-200
- Shadow: none
- Drag handle: hidden
- Insert button: hidden

### Hover State

- Border: 1px neutral-300
- Shadow: xs (0 1px 2px rgba(0,0,0,0.05))
- Drag handle: visible (fade in)
- Insert button: visible (fade in)

### Transition

```javascript
transition: 'all 150ms cubic-bezier(0, 0, 0.2, 1)'
```

---

## 🎯 Definition of Done

✅ **Tabs are Notion-style** - Underlines, not pills  
✅ **2px accent underline** - Selected tab only  
✅ **No filled pills** - Transparent background  
✅ **Document blocks** - Not chat bubbles  
✅ **Title line (H3)** - Clear hierarchy  
✅ **Meta row** - Time • artifact type  
✅ **68-74ch measure** - Optimal reading width  
✅ **Inline citations** - Superscript [1], [2]  
✅ **Citation hover** - Highlights in right rail  
✅ **Drag handle** - Six dots on hover  
✅ **Insert button** - + between blocks  
✅ **Insert menu** - Follow-up, draft, table  
✅ **Reads like Notion** - Not messaging app  

---

## 📊 Before & After

### Tabs

**Before**:
```
[💬 Chat] [✍️ Draft] [📋 Table]
  ↑
  Filled pill, gradient background
```

**After**:
```
Chat    Draft    Table
══
↑
2px underline, transparent background
```

### Chat Interface

**Before**:
```
┌─────────────────────────┐
│ User message bubble     │ ← Right aligned
└─────────────────────────┘

    ┌─────────────────────────┐
    │ Assistant bubble        │ ← Left aligned
    └─────────────────────────┘
```

**After**:
```
┌─────────────────────────────────────────────┐
│ What is the EITC threshold?                 │
│ Just now                                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ⋮⋮  Response                                │
│     2m ago • Analysis                       │
│                                             │
│     The threshold is $63,398 [1].          │
│                                             │
│                    [+]                      │
└─────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### Notion-Style Tabs

- Clean underline design
- 2px accent color
- No filled backgrounds
- Minimal, professional

### Document Blocks

- Structured like Notion pages
- Clear hierarchy (title, meta, content)
- Optimal reading width (72ch)
- Professional appearance

### Inline Citations

- Superscript format [1], [2]
- Hover highlights in right rail
- Click to jump to citation
- Seamless reading experience

### Interactive Elements

- Drag handle (six dots)
- Insert action button (+)
- Action menu (follow-up, draft, table)
- Smooth hover transitions

### Reading Experience

- Optimal line length (72ch)
- Clear typography (15px/24px)
- Proper spacing
- Reads like a document, not chat

---

## 🎨 Visual Examples

### Tab Underline

```
Chat    Draft    Table Review
══
```

- 2px solid indigo-600
- Only on active tab
- Positioned at bottom
- Margin bottom: -1px (overlaps border)

### Citation Superscript

```
The income threshold is $63,398 [1].
                                 ↑
                          Indigo-600
                          Clickable
                          Hover: underline
```

### Drag Handle

```
⋮⋮  Response
    2m ago • Analysis
```

- Six dots in 2x3 grid
- Left: -24px (outside block)
- Opacity: 0 → 1 on hover
- Color: neutral-400

### Insert Button

```
┌─────────────────────────────────────────────┐
│ Block content...                            │
│                                             │
│                    [+]                      │
└─────────────────────────────────────────────┘
                     ↓
            ┌──────────────────────┐
            │ 💬 Ask follow-up     │
            │ ✍️ Create draft      │
            │ 📋 Create table      │
            └──────────────────────┘
```

---

## 🔮 Future Enhancements

### Document Blocks

- [ ] Drag-and-drop reordering
- [ ] Block comments/annotations
- [ ] Block linking
- [ ] Block templates
- [ ] Block export (PDF, Markdown)

### Citations

- [ ] Citation preview on hover
- [ ] Citation management
- [ ] Citation export
- [ ] Citation search
- [ ] Multi-citation support

### Insert Actions

- [ ] Custom actions
- [ ] Action templates
- [ ] Keyboard shortcuts
- [ ] Quick actions menu
- [ ] Action history

### Reading Experience

- [ ] Focus mode (hide rails)
- [ ] Reading progress
- [ ] Bookmarks
- [ ] Table of contents
- [ ] Print-friendly view

---

## ✅ Summary

**Created:**
- DocumentBlock component (Notion-style)
- Inline citation superscripts
- Drag handle (six dots)
- Insert action menu
- Notion-style tab underlines

**Features:**
- ✅ Tabs with 2px underlines
- ✅ Document blocks (not bubbles)
- ✅ Title + meta row
- ✅ 68-74ch reading width
- ✅ Inline citations [1], [2]
- ✅ Citation hover highlights
- ✅ Drag handle on hover
- ✅ Insert button (+) between blocks
- ✅ Action menu (follow-up, draft, table)

**Benefits:**
- 📄 Reads like a document
- 🎨 Professional Notion-like design
- 📏 Optimal reading experience
- 🔗 Seamless citations
- ⚡ Interactive elements
- ♿ Better structure and hierarchy

**Refresh your browser** to see the new Notion-style document blocks! 🎉
