# Enhanced Composer with Slash Commands

## ✅ Composer Redesigned with Scope Chips & Commands

Complete redesign of the Composer with auto-expanding input, scope chips, slash commands, and thinking status.

---

## 🎯 What Changed

### Input Behavior

**Before:**
- Fixed height textarea
- No auto-expansion
- Basic placeholder

**After:**
- ✅ **One row initially** - Minimal footprint
- ✅ **Auto-expands** - Grows with content
- ✅ **6 lines max** - Prevents overflow
- ✅ **Smart placeholder** - "Type / for commands..."

### Scope Display

**Before:**
- No visible context
- Matter/docs hidden

**After:**
- ✅ **Prefix chips** - Always visible
- ✅ **Matter chip** - 📁 Acme Corp
- ✅ **Docs count chip** - 📄 3 docs
- ✅ **Compact design** - Pill-shaped badges

### Actions

**Before:**
- Limited actions
- No command menu

**After:**
- ✅ **Attach button** - 📎 Upload files
- ✅ **/Tools button** - Opens slash menu
- ✅ **Send button** - ↵ Submit message
- ✅ **Disabled states** - When empty/thinking

### Slash Commands

**Before:**
- No command system
- Manual typing

**After:**
- ✅ **/ opens menu** - Searchable command list
- ✅ **5 commands** - Analyze, Draft, Table, Critique, Eligibility
- ✅ **Keyboard navigation** - Arrow keys + Enter
- ✅ **Fuzzy search** - Filter as you type
- ✅ **Legacy badge** - For old features

### Thinking Status

**Before:**
- No loading indicator
- Unclear when processing

**After:**
- ✅ **Status strip** - Above composer
- ✅ **"Model is thinking…"** - Clear message
- ✅ **Animated dots** - Pulsing indicators
- ✅ **Disabled input** - While thinking

---

## 📁 Files Created/Modified

**Created**:
```
✅ /components/assistant/Composer_new.jsx
   - Auto-expanding textarea (1-6 lines)
   - Scope chips (Matter, Docs)
   - Slash command menu
   - Thinking status strip
   - Attach, /Tools, Send actions
```

**Modified**:
```
✅ /components/AssistantLayout.jsx
   - Uses new Composer
   - Manages isThinking state
   - Handles document uploads
```

---

## 🎨 Composer Layout

### Visual Structure

```
┌─────────────────────────────────────────────────────────┐
│ Model is thinking…  ●●●                                 │ ← Thinking strip
├─────────────────────────────────────────────────────────┤
│ [📁 Acme Corp] [📄 3 docs]  [Input...]  [📎] [/] [Send]│
│  ↑ Prefix chips              ↑ Input    ↑ Suffix actions│
└─────────────────────────────────────────────────────────┘
```

### Components

1. **Thinking Strip** (conditional)
2. **Composer Row**:
   - Prefix: Scope chips
   - Center: Auto-expanding textarea
   - Suffix: Action buttons

---

## 🎨 Scope Chips (Prefix)

### Matter Chip

```
┌──────────────┐
│ 📁 Acme Corp │
└──────────────┘
```

- Icon: 📁
- Label: Matter name
- Background: neutral-100
- Border: neutral-200
- Border radius: Full (pill)
- Font size: 12px

### Docs Count Chip

```
┌───────────┐
│ 📄 3 docs │
└───────────┘
```

- Icon: 📄
- Label: Count + "doc/docs"
- Same styling as matter chip
- Only shows when docs > 0

### Styling

```javascript
chip: {
  padding: '6px 12px',
  background: neutral-100,
  border: '1px solid neutral-200',
  borderRadius: '9999px', // full
  fontSize: '12px',
  color: neutral-700,
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
}
```

---

## 🎨 Auto-Expanding Textarea

### Behavior

**Initial**: 1 row (~40px height)
**Typing**: Expands automatically
**Maximum**: 6 rows (~144px height)
**Overflow**: Scrolls vertically

### Implementation

```javascript
// Auto-resize on input change
useEffect(() => {
  if (inputRef.current) {
    inputRef.current.style.height = 'auto'
    const scrollHeight = inputRef.current.scrollHeight
    const lineHeight = 24
    const newRows = Math.min(
      Math.max(Math.ceil(scrollHeight / lineHeight), 1), 
      6
    )
    setRows(newRows)
  }
}, [inputValue])
```

### Styling

```javascript
textarea: {
  width: '100%',
  padding: '8px 16px',
  border: '1px solid neutral-200',
  borderRadius: '14px',
  fontSize: '15px',
  lineHeight: '24px',
  resize: 'none',
  minHeight: '40px',
  maxHeight: '144px' // 6 lines
}
```

---

## 🎨 Slash Command Menu

### Visual Design

```
┌────────────────────────────────────────┐
│ COMMANDS                               │
├────────────────────────────────────────┤
│ 📊 Analyze Docs          /analyze      │
│    Analyze uploaded documents          │
├────────────────────────────────────────┤
│ ✍️ Draft Letter          /draft        │
│    Draft a formal letter or document   │
├────────────────────────────────────────┤
│ 📋 Create Table          /table        │
│    Create a structured table           │
├────────────────────────────────────────┤
│ 🔍 Critique Language     /critique     │
│    Review and improve writing          │
├────────────────────────────────────────┤
│ ✅ Open Eligibility      /eligibility  │
│    EITC eligibility calculator LEGACY  │
└────────────────────────────────────────┘
```

### Commands

1. **📊 Analyze Docs** - `/analyze`
   - Analyze uploaded documents
   
2. **✍️ Draft Letter** - `/draft`
   - Draft a formal letter or document
   
3. **📋 Create Table** - `/table`
   - Create a structured table
   
4. **🔍 Critique Language** - `/critique`
   - Review and improve writing
   
5. **✅ Open Eligibility** - `/eligibility`
   - EITC eligibility calculator (legacy)

### Triggering

**Type `/`**:
- Opens menu automatically
- Shows all commands
- Focus stays in input

**Type `/ana`**:
- Filters to matching commands
- Shows "Analyze Docs"
- Highlights first match

### Navigation

**Arrow Down**: Next command
**Arrow Up**: Previous command
**Enter**: Select highlighted command
**Escape**: Close menu
**Click**: Select command

### Filtering

```javascript
const filteredCommands = slashCommands.filter(cmd => {
  const search = slashMenuFilter.toLowerCase()
  return (
    cmd.label.toLowerCase().includes(search) ||
    cmd.command.toLowerCase().includes(search) ||
    cmd.description.toLowerCase().includes(search)
  )
})
```

### Selection

When command selected:
1. Replace `/filter` with `/command `
2. Add space after command
3. Close menu
4. Focus input
5. Position cursor after command

---

## 🎨 Suffix Actions

### Attach Button (📎)

```
┌────┐
│ 📎 │
└────┘
```

- Icon: 📎
- Size: 36x36px
- Opens file picker
- Accepts: .pdf, .doc, .docx, .txt
- Multiple files allowed

### Tools Button (/)

```
┌────┐
│ /  │
└────┐
```

- Icon: /
- Size: 36x36px
- Inserts `/` in input
- Opens slash menu
- Focuses input

### Send Button

```
┌──────────┐
│ Send  ↵  │
└──────────┘
```

- Label: "Send"
- Icon: ↵ (return symbol)
- Background: indigo-600
- Color: white
- Disabled when:
  - Input is empty
  - Model is thinking
- Hover: indigo-700

### Styling

```javascript
iconButton: {
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  border: '1px solid neutral-200',
  background: white,
  cursor: 'pointer',
  fontSize: '16px'
}

sendButton: {
  padding: '8px 16px',
  background: indigo-600,
  color: white,
  border: 'none',
  borderRadius: '10px',
  fontWeight: '600',
  cursor: 'pointer'
}
```

---

## 🎨 Thinking Status Strip

### Visual Design

```
┌─────────────────────────────────────────────┐
│ ●●● Model is thinking…                      │
└─────────────────────────────────────────────┘
```

### Components

**Animated Dots**:
- 3 dots (●●●)
- 4px diameter each
- Pulsing animation
- Staggered delays (0s, 0.2s, 0.4s)
- Color: indigo-600

**Status Text**:
- "Model is thinking…"
- Font size: 13px
- Color: indigo-700

### Styling

```javascript
thinkingStrip: {
  padding: '6px 16px',
  background: indigo-50,
  borderBottom: '1px solid indigo-200',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  color: indigo-700
}
```

### Animation

```css
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}
```

### Behavior

- Shows when `isThinking = true`
- Hides when `isThinking = false`
- Disables input while visible
- Disables send button while visible

---

## 🎯 Definition of Done

✅ **One row initially** - Minimal footprint  
✅ **Auto-expands** - Grows to 6 lines max  
✅ **Prefix chips** - Matter and docs count  
✅ **Suffix actions** - Attach, /Tools, Send  
✅ **/ opens menu** - Searchable command list  
✅ **5 commands** - Analyze, Draft, Table, Critique, Eligibility  
✅ **Keyboard navigation** - Arrows + Enter  
✅ **Fuzzy search** - Filter commands  
✅ **Legacy badge** - For old features  
✅ **Thinking strip** - Above composer  
✅ **Scope chips always visible** - Never hidden  

---

## 📊 Before & After

### Composer Size

**Before**:
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
Fixed 4-5 rows, always large
```

**After**:
```
┌─────────────────────────────────────────┐
│ [Chips] [Input...] [Actions]           │
└─────────────────────────────────────────┘
1 row initially, expands to 6 max
```

### Context Visibility

**Before**:
- Matter: Hidden
- Docs: Hidden
- No visual context

**After**:
```
[📁 Acme Corp] [📄 3 docs]
Always visible, clear context
```

### Commands

**Before**:
- Manual typing
- No autocomplete
- No discovery

**After**:
```
Type /
  ↓
┌────────────────────────┐
│ 📊 Analyze Docs        │
│ ✍️ Draft Letter        │
│ 📋 Create Table        │
│ 🔍 Critique Language   │
│ ✅ Open Eligibility    │
└────────────────────────┘
Searchable, keyboard nav
```

---

## 🚀 Key Features

### Auto-Expanding Input

- Starts at 1 row (40px)
- Grows with content
- Max 6 rows (144px)
- Smooth transitions
- No manual resizing

### Scope Chips

- Always visible
- Matter name (if selected)
- Document count (if any)
- Compact pill design
- Clear visual context

### Slash Commands

- Type `/` to open
- Searchable list
- Keyboard navigation
- Icon + label + description
- Command preview
- Legacy badge

### Thinking Status

- Thin strip above composer
- Animated pulsing dots
- Clear status message
- Disables input/send
- Auto-hides when done

### Smart Actions

- Attach files (📎)
- Open commands (/)
- Send message (↵)
- Disabled states
- Hover effects

---

## 🎨 Visual Examples

### Minimal State (1 row)

```
┌─────────────────────────────────────────────────────────┐
│ [📁 Acme Corp] [📄 3 docs]  Type / for commands...  [📎] [/] [Send] │
└─────────────────────────────────────────────────────────┘
```

### Expanded State (3 rows)

```
┌─────────────────────────────────────────────────────────┐
│ [📁 Acme Corp] [📄 3 docs]  ┌──────────────────┐  [📎]  │
│                             │ This is a longer │  [/]   │
│                             │ message that     │  [Send]│
│                             │ spans 3 rows     │        │
│                             └──────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### With Slash Menu

```
                    ┌────────────────────────────┐
                    │ COMMANDS                   │
                    ├────────────────────────────┤
                    │ 📊 Analyze Docs  /analyze  │
                    │ ✍️ Draft Letter  /draft    │
                    │ 📋 Create Table  /table    │
                    └────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ [📁 Acme Corp] [📄 3 docs]  /ana...  [📎] [/] [Send]    │
└─────────────────────────────────────────────────────────┘
```

### With Thinking Status

```
┌─────────────────────────────────────────────────────────┐
│ ●●● Model is thinking…                                  │
├─────────────────────────────────────────────────────────┤
│ [📁 Acme Corp] [📄 3 docs]  [Input disabled]  [📎] [/] [Send] │
└─────────────────────────────────────────────────────────┘
```

---

## 🔮 Future Enhancements

### Commands

- [ ] Custom user commands
- [ ] Command history
- [ ] Command aliases
- [ ] Command templates
- [ ] Command categories

### Input

- [ ] Markdown preview
- [ ] @mentions for docs
- [ ] #tags for topics
- [ ] Emoji picker
- [ ] Voice input

### Scope

- [ ] Click to change matter
- [ ] Click to manage docs
- [ ] Scope presets
- [ ] Scope history
- [ ] Scope suggestions

### Status

- [ ] Progress percentage
- [ ] Estimated time
- [ ] Cancel button
- [ ] Retry button
- [ ] Error states

---

## ✅ Summary

**Created:**
- Enhanced Composer component
- Auto-expanding textarea (1-6 lines)
- Scope chips (Matter, Docs)
- Slash command menu (5 commands)
- Thinking status strip
- Suffix actions (Attach, /Tools, Send)

**Features:**
- ✅ One row initially, expands to 6 max
- ✅ Prefix chips always visible
- ✅ Suffix actions (Attach, /Tools, Send)
- ✅ / opens searchable command list
- ✅ Keyboard navigation (arrows + Enter)
- ✅ Fuzzy search filtering
- ✅ Legacy badge for old features
- ✅ Thinking status strip
- ✅ Disabled states while thinking

**Benefits:**
- 🎯 Clear context (scope chips)
- ⌨️ Efficient commands (slash menu)
- 📏 Adaptive size (auto-expand)
- 🎨 Clean, minimal design
- ⚡ Fast, keyboard-friendly
- 💡 Discoverable features

**Refresh your browser** to see the new enhanced Composer! 🎉
