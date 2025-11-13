# Assistant 3-Pane Layout Redesign

## ✅ Notion-Like Layout with Fixed Rails

Complete redesign of the Assistant interface with a professional 3-pane layout, Notion-style left rail, and resizable center pane.

---

## 🎯 What Changed

### Layout Structure

**Before:**
- ResizablePanel components
- Inconsistent widths
- No fixed structure
- Heavy shadows and gradients

**After:**
- ✅ **Fixed left rail**: 280px (resizable 200-400px)
- ✅ **Resizable center pane**: Flexible width (min 400px)
- ✅ **Fixed right rail**: 320px (resizable 280-480px)
- ✅ **Independent scrolling**: Each pane scrolls separately
- ✅ **Sticky headers**: Tabs and sections stay visible
- ✅ **Sticky composer**: Bottom of center pane only
- ✅ **Subtle separators**: 1px neutral-200 borders

### Left Context Rail (Notion-Like)

**Before:**
- Big dropdown selector
- Large toggle switches
- Heavy styling
- Jittery on changes

**After:**
- ✅ **Compact matter selector**: Title row with chevron + description
- ✅ **Knowledge sources**: Compact checkboxes with counts
- ✅ **Docs in scope**: Avatar/filetype icons in grid
- ✅ **Ghost "Add" button**: Dotted border for empty state
- ✅ **No jitter**: Fixed width, stable layout
- ✅ **Compact checkboxes**: 16px, not big switches

---

## 📁 Files Created

### New Components

**AssistantLayout.jsx**:
- 3-pane layout container
- Resizable dividers
- Fixed left/right rails
- Flexible center pane
- Sticky composer integration

**ContextRail_new.jsx**:
- 280px fixed width
- Notion-like matter selector
- Compact checkbox knowledge sources
- Doc icons grid with "+" button
- Empty state with dotted border
- No jitter on content changes

**SourcesRail_new.jsx**:
- 320px fixed width
- Collapsible sections
- Citations grouped by source
- Reasoning trace steps
- Suggestions list
- Sticky section headers

### Modified Files

**Assistant.jsx**:
- Integrated AssistantLayout
- Removed old ResizablePanel
- Updated tab styling
- Flat design tokens

---

## 🎨 Layout Structure

### 3-Pane Layout

```
┌────────────┬─────────────────────────┬────────────┐
│            │                         │            │
│   Context  │    Center Pane          │  Sources   │
│   Rail     │    (Resizable)          │   Rail     │
│   280px    │                         │   320px    │
│            │                         │            │
│  [Matter]  │  [Tabs: Chat/Draft/Tbl] │ [Citations]│
│  [Sources] │                         │ [Reasoning]│
│  [Docs]    │  [Content Area]         │ [Suggest.] │
│            │                         │            │
│            │  ─────────────────────  │            │
│            │  [Sticky Composer]      │            │
└────────────┴─────────────────────────┴────────────┘
     ↕              ↕              ↕
  Resizable    Resizable      Resizable
  200-400px    Flexible       280-480px
```

### Resizing

- **Left divider**: Drag to resize left rail (200-400px)
- **Right divider**: Drag to resize right rail (280-480px)
- **Center pane**: Automatically fills remaining space
- **Visual feedback**: Divider highlights on hover/drag

---

## 🎨 Left Context Rail (Notion-Like)

### Matter Selector

```
┌─────────────────────────────────────┐
│ MATTER                              │
├─────────────────────────────────────┤
│ Acme Corp                        ▼  │
│ Tax Return 2024                     │
└─────────────────────────────────────┘
```

**Features**:
- Title row with chevron
- Mini description below
- Click to expand/collapse
- Hover: neutral-50 background
- No jitter on state changes

### Knowledge Sources

```
┌─────────────────────────────────────┐
│ KNOWLEDGE SOURCES                   │
├─────────────────────────────────────┤
│ ☑ IRS Publications          · 12   │
│ ☐ Tax Code                  · 8    │
│ ☑ Case Law                  · 24   │
│ ☐ Regulations               · 15   │
└─────────────────────────────────────┘
```

**Features**:
- Compact 16px checkboxes
- Label + count on same line
- Hover: neutral-50 background
- Checked: indigo-600 background
- White checkmark (✓)

### Docs in Scope

**With Documents**:
```
┌─────────────────────────────────────┐
│ DOCS IN SCOPE                       │
├─────────────────────────────────────┤
│ [📄] [📄] [📝] [+]                  │
└─────────────────────────────────────┘
```

**Empty State**:
```
┌─────────────────────────────────────┐
│ DOCS IN SCOPE                       │
├─────────────────────────────────────┤
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│ │  No documents in scope          │ │
│ │  [+ Add Documents]              │ │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
└─────────────────────────────────────┘
```

**Features**:
- 40x40px icon grid
- Filetype icons (📄 PDF, 📝 DOC, 📎 Other)
- Ghost "+" button with dashed border
- Empty state: dotted border card
- Hover effects on icons

---

## 🎨 Center Pane

### Sticky Tabs

```
┌─────────────────────────────────────────┐
│ [💬 Chat] [✍️ Draft] [📋 Table] [🗑️ Clear] │
└─────────────────────────────────────────┘
```

**Features**:
- Sticky at top of center pane
- Active tab: indigo-600
- Inactive: transparent
- Hover: neutral-100
- Clear button right-aligned

### Content Area

- Scrollable content
- Independent from rails
- Full height minus tabs and composer
- Padding: 24px

### Sticky Composer

```
─────────────────────────────────────────
[Composer: Input + Quick Tools + Send]
```

**Features**:
- Sticky at bottom of center pane only
- Not sticky in rails
- Border top: neutral-100
- Background: surface1
- Full composer functionality

---

## 🎨 Right Sources Rail

### Collapsible Sections

```
┌─────────────────────────────────────┐
│ 📚 Citations (5)                 ▼  │
├─────────────────────────────────────┤
│ 📄 IRS Publications (3)             │
│   ┌─────────────────────────────┐   │
│   │ IRC §32(a)(1)...           │   │
│   └─────────────────────────────┘   │
│                                     │
│ 🧠 Reasoning (2)                 ▼  │
├─────────────────────────────────────┤
│   Step 1: Analyze income...        │
│                                     │
│ 💡 Suggestions (3)               ▼  │
├─────────────────────────────────────┤
│   → Ask about dependents...         │
└─────────────────────────────────────┘
```

**Features**:
- Sticky section headers
- Collapsible with chevron
- Count badges
- Grouped citations by source
- Hover effects
- Highlight active citation

---

## 🎯 Design Tokens Used

### Colors

```javascript
background: neutral-50 (#fafafa)
surface1: white
borders: neutral-200
dividers: neutral-100
primary: indigo-600 (checkboxes, active tabs)
```

### Spacing

```javascript
xs: 8px
sm: 12px
md: 16px
lg: 24px
```

### Typography

```javascript
sectionTitle: 12px, semibold, uppercase
base: 15px / 24px
small: 13px / 20px
xs: 12px / 18px
```

### Borders

```javascript
width: 1px
color: neutral-200
divider: neutral-100
radius: 10-14px
```

---

## 🔧 Component Props

### AssistantLayout

```javascript
<AssistantLayout lang="en" t={translateFn}>
  {/* Tab content goes here */}
</AssistantLayout>
```

**Features**:
- Manages 3-pane layout
- Handles resizing
- Provides context/sources rails
- Sticky composer at bottom

### ContextRail

```javascript
<ContextRail
  selectedMatter="Acme Corp"
  setSelectedMatter={(matter) => {}}
  knowledgeSources={{
    irs_pubs: true,
    tax_code: false
  }}
  setKnowledgeSources={(sources) => {}}
  docsInScope={[
    { name: 'W-2.pdf', type: 'pdf' }
  ]}
  onAddDocs={() => {}}
/>
```

### SourcesRail

```javascript
<SourcesRail
  citations={[
    { id: 1, source: 'IRS Pub', text: '...', section: '§32' }
  ]}
  reasoningTrace={[
    { title: 'Step 1', description: '...' }
  ]}
  suggestions={[
    { text: 'Ask about...' }
  ]}
  onCitationClick={(citation) => {}}
  onSuggestionClick={(suggestion) => {}}
  highlightedCitation={1}
/>
```

---

## 📊 Before & After

### Layout

**Before**:
- ResizablePanel wrappers
- Inconsistent widths
- No fixed structure
- Heavy shadows

**After**:
- Fixed 280px left rail
- Fixed 320px right rail
- Resizable center pane
- Subtle 1px borders

### Left Rail

**Before**:
- Large dropdown (select element)
- Big toggle switches
- Heavy styling
- Jitters on changes

**After**:
- Compact title row + chevron
- 16px checkboxes
- Counts inline (· 12)
- No jitter, stable layout

### Composer

**Before**:
- Floating at bottom of container
- Visible in all panes

**After**:
- Sticky to center pane only
- Not visible in rails
- Better focus

---

## ✅ Definition of Done

✅ **Left rail fixed 280px** - Resizable 200-400px  
✅ **Right rail fixed 320px** - Resizable 280-480px  
✅ **Center pane resizable** - Min 400px  
✅ **Independent scrolling** - Each pane scrolls separately  
✅ **Sticky headers** - Tabs and sections stay visible  
✅ **Sticky composer** - Bottom of center pane only  
✅ **Subtle separators** - 1px neutral-200 borders  
✅ **Notion-like left rail** - Compact, no jitter  
✅ **Compact checkboxes** - 16px, not switches  
✅ **Matter selector** - Title row + chevron  
✅ **Knowledge sources** - Checkboxes with counts  
✅ **Docs in scope** - Icon grid + ghost button  
✅ **Empty state** - Dotted border card  

---

## 🚀 Key Features

### Resizable Panes

- Drag dividers to resize
- Visual feedback (highlight on hover)
- Min/max constraints
- Smooth resizing
- No jitter

### Independent Scrolling

- Each pane scrolls separately
- Sticky headers stay visible
- Composer sticky to center only
- Better focus and organization

### Notion-Like Left Rail

- Compact matter selector
- Checkbox knowledge sources
- Doc icons in grid
- Ghost "+" button
- Empty state with dotted border
- No layout shifts

### Professional Design

- Flat surfaces
- Subtle borders
- Consistent spacing
- Clean typography
- Smooth animations

---

## 🎨 Visual Examples

### Matter Selector (Collapsed)

```
┌─────────────────────────────────────┐
│ Acme Corp                        ▼  │
│ Tax Return 2024                     │
└─────────────────────────────────────┘
```

### Matter Selector (Expanded)

```
┌─────────────────────────────────────┐
│ Acme Corp                        ▲  │
│ Tax Return 2024                     │
├─────────────────────────────────────┤
│ • Acme Corp                         │
│ • Beta Inc                          │
│ • Gamma LLC                         │
└─────────────────────────────────────┘
```

### Knowledge Source Checkbox

```
☑ IRS Publications          · 12
  ↑                            ↑
  16px checkbox              Count
  Indigo-600 when checked
```

### Doc Icons Grid

```
┌───┬───┬───┬───┐
│📄 │📄 │📝 │ + │
└───┴───┴───┴───┘
 40px 40px 40px  Dashed
 PDF  PDF  DOC   border
```

### Empty Docs State

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│  No documents in scope          │
│                                 │
│  [+ Add Documents]              │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

---

## 🔮 Future Enhancements

### Left Rail

- [ ] Drag-and-drop doc reordering
- [ ] Doc preview on hover
- [ ] Bulk doc actions
- [ ] Matter search/filter
- [ ] Recent matters list

### Center Pane

- [ ] Split view (chat + draft)
- [ ] Tab persistence
- [ ] Tab reordering
- [ ] Keyboard shortcuts
- [ ] Full-screen mode

### Right Rail

- [ ] Citation export
- [ ] Reasoning visualization
- [ ] Suggestion filtering
- [ ] Search within citations
- [ ] Copy citation text

### Resizing

- [ ] Save resize preferences
- [ ] Double-click to reset
- [ ] Keyboard resize (arrows)
- [ ] Preset layouts
- [ ] Collapse/expand rails

---

## ✅ Summary

**Created:**
- AssistantLayout component (3-pane structure)
- ContextRail_new component (Notion-like)
- SourcesRail_new component (collapsible sections)

**Features:**
- ✅ Fixed 280px left rail (resizable)
- ✅ Fixed 320px right rail (resizable)
- ✅ Resizable center pane
- ✅ Independent scrolling
- ✅ Sticky headers and composer
- ✅ Notion-like left rail
- ✅ Compact checkboxes (16px)
- ✅ Doc icons grid
- ✅ Empty state with dotted border
- ✅ No jitter on changes

**Benefits:**
- 🎨 Professional, clean layout
- 📏 Consistent spacing and structure
- 🔄 Flexible, resizable panes
- 📱 Better organization
- ⚡ Smooth, stable interactions
- ♿ Better accessibility

**Refresh your browser** to see the new 3-pane Assistant layout! 🎉
