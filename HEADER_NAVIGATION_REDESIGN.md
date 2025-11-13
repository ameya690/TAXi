# Header & Navigation Redesign

## ✅ Compressed 56px Header with Global Search

Complete redesign of the top bar and navigation with breadcrumbs, global search, and legacy dropdown.

---

## 🎯 What Changed

### Header (Top Bar)

**Before:**
- 64px height
- Large logo and subtitle
- Simple language selector
- No breadcrumbs
- No search
- No region badge

**After:**
- ✅ **56px height** - Compressed and efficient
- ✅ **Flat design** - No gradients or heavy shadows
- ✅ **Breadcrumbs** - "Org / Matter / Artifact"
- ✅ **Global search** - Cmd/Ctrl+K shortcut
- ✅ **Region badge** - US/EU indicator
- ✅ **User menu** - User info display
- ✅ **Loading bar** - Thin progress indicator

### Navigation

**Before:**
- All tabs in one row
- No organization
- Eligibility and Tax Notice as main tabs

**After:**
- ✅ **Main tabs** - Assistant, Workflows, Vault, Knowledge
- ✅ **Legacy dropdown** - Eligibility, Tax Notice hidden
- ✅ **Admin** - Right-aligned
- ✅ **48px height** - Compact navigation
- ✅ **Flat design** - No pills or gradients

---

## 📁 Files Created

### New Components

**Header Component** (`/components/Header.jsx`):
- 56px compressed header
- Left: Logo + breadcrumbs
- Center: Global search with Cmd+K
- Right: Region, language, user, logout
- Loading progress bar
- Search modal

**Navigation Component** (`/components/Navigation.jsx`):
- Main tabs (Assistant, Workflows, Vault, Knowledge)
- Legacy dropdown (Eligibility, Tax Notice)
- Admin tab (right-aligned)
- Flat button design
- 48px height

### Modified Files

**App.jsx**:
- Integrated Header component
- Integrated Navigation component
- Added search handler
- Added breadcrumbs state
- Added loading state
- Re-imported legacy components

**Design Tokens** (`/styles/designTokens.js`):
- Updated headerHeight: 56px
- Added navHeight: 48px

---

## 🎨 Header Layout

### Structure (56px height)

```
┌─────────────────────────────────────────────────────────────┐
│ 🚕 TAXi / Org / Matter │ 🔍 Search… (⌘K) │ US EN 👤 Logout │
└─────────────────────────────────────────────────────────────┘
  ← Left (Logo + Breadcrumbs)
                            ← Center (Global Search)
                                              ← Right (Controls)
```

### Left Section

**Logo + Breadcrumbs**:
```
🚕 TAXi / Organization / Matter / Artifact
```

- Product mark (🚕 TAXi)
- Breadcrumb trail with `/` separators
- Last item bold (current location)
- Clickable navigation

### Center Section

**Global Search**:
```
┌────────────────────────────────────┐
│ 🔍 Search docs, matters, workflows…│
│                              ⌘K/^K │
└────────────────────────────────────┘
```

- Full-width search input
- Search icon (🔍) on left
- Keyboard shortcut badge on right
- Cmd+K (Mac) or Ctrl+K (Windows/Linux)
- Opens modal on click or shortcut

### Right Section

**Controls**:
```
[US] [EN ▼] [👤 User] [Logout]
```

- **Region badge**: US/EU indicator
- **Language selector**: EN/ES dropdown
- **User menu**: Name with avatar
- **Logout button**: Sign out action

### Loading Progress Bar

```
┌─────────────────────────────────────┐
│ Header content                      │
├─────────────────────────────────────┤
│ ▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← 2px progress
└─────────────────────────────────────┘
```

- 2px height
- Indigo-600 color
- Animated left-to-right
- Only visible when `isLoading={true}`

---

## 🔍 Global Search Modal

### Trigger

**Keyboard Shortcut**:
- Mac: `⌘K`
- Windows/Linux: `Ctrl+K`

**Click**:
- Click search input in header

### Modal Layout

```
┌─────────────────────────────────────┐
│ Search docs, matters, workflows…    │
├─────────────────────────────────────┤
│                                     │
│ Quick actions:                      │
│ 📄 Search documents                 │
│ 📁 Search matters                   │
│ ⚙️ Search workflows                 │
│                                     │
└─────────────────────────────────────┘
```

**Features**:
- Large search input
- Quick action suggestions
- Enter to search
- Escape to close
- Backdrop click to close

---

## 🧭 Navigation Layout

### Structure (48px height)

```
┌────────────────────────────────────────────────────────┐
│ [Assistant] [Workflows] [Vault] [Knowledge] │ [Legacy▼] [Admin] │
└────────────────────────────────────────────────────────┘
  ← Main Tabs                                   ← Dropdown  ← Admin
```

### Main Tabs

**4 Primary Tabs**:
1. **🤖 Assistant** - AI assistant interface
2. **⚙️ Workflows** - Workflow management
3. **🗄️ Vault** - Document storage
4. **📚 Knowledge** - Knowledge bases

**Design**:
- Flat buttons
- Active: Indigo-600 background
- Inactive: Transparent
- Hover: Neutral-100 background
- Icon + label

### Legacy Dropdown

**Button**:
```
[Legacy ▼]
```

**Menu**:
```
┌─────────────────────────┐
│ ✅ EITC Calculator      │
├─────────────────────────┤
│ 📄 Tax Notice Explainer │
└─────────────────────────┘
```

**Features**:
- Hides deprecated features
- Keeps them accessible
- Clean main navigation
- Dropdown on click

### Admin Tab

**Right-Aligned**:
```
                              [🛠️ Admin]
```

- Separated from main tabs
- Right side of navigation
- Same styling as main tabs

---

## 🎨 Visual Design

### Colors

**Header**:
- Background: White (surface1)
- Border: Neutral-200
- Text: Neutral-900

**Navigation**:
- Background: White (surface0)
- Border: Neutral-100 (divider)
- Active tab: Indigo-600
- Inactive tab: Transparent
- Hover: Neutral-100

**Search**:
- Input background: Neutral-50
- Border: Neutral-200
- Focus: Indigo-600 border + shadow
- Icon: Neutral-500

**Progress Bar**:
- Background: Neutral-100
- Fill: Indigo-600
- Animated

### Typography

**Header**:
- Logo: 18px, semibold
- Breadcrumbs: 13px, normal
- Search: 15px, normal

**Navigation**:
- Tab labels: 15px, medium
- Active: 15px, semibold

### Spacing

**Header**:
- Height: 56px
- Padding: 0 24px
- Gap: 24px

**Navigation**:
- Height: 48px
- Padding: 0 24px
- Gap: 8px

### Borders

**Header**:
- Bottom: 1px solid neutral-200

**Navigation**:
- Bottom: 1px solid neutral-100

---

## 🔧 Component Props

### Header Component

```javascript
<Header
  lang="en"                    // Current language
  setLang={(lang) => {}}       // Language change handler
  breadcrumbs={['TAXi', 'Org']} // Breadcrumb trail
  onSearch={(query) => {}}     // Search handler
  isLoading={false}            // Show progress bar
  region="US"                  // Region badge (US/EU)
  user={{ name: 'John' }}      // User info (optional)
  onLogout={() => {}}          // Logout handler (optional)
/>
```

### Navigation Component

```javascript
<Navigation
  activeTab="assistant"        // Current active tab
  onTabChange={(tab) => {}}    // Tab change handler
/>
```

---

## 📊 Before & After Comparison

### Header Height

**Before**: 64px  
**After**: 56px  
**Savings**: 8px (12.5% reduction)

### Navigation

**Before**:
- 6 tabs in main row
- No organization
- Cluttered

**After**:
- 4 main tabs
- 2 legacy items in dropdown
- 1 admin tab (right-aligned)
- Clean and organized

### Features Added

**Before**:
- ❌ No breadcrumbs
- ❌ No global search
- ❌ No region badge
- ❌ No user menu
- ❌ No loading indicator

**After**:
- ✅ Breadcrumb navigation
- ✅ Global search (Cmd+K)
- ✅ Region badge (US/EU)
- ✅ User menu with avatar
- ✅ Loading progress bar

---

## 🎯 Definition of Done

✅ **Header is flat** - No gradients  
✅ **56px height** - Compressed from 64px  
✅ **No big purple capsule** - Flat buttons only  
✅ **Legacy items hidden** - Behind dropdown  
✅ **Breadcrumbs** - Org / Matter / Artifact  
✅ **Global search** - Cmd/Ctrl+K shortcut  
✅ **Region badge** - US/EU indicator  
✅ **User menu** - Avatar and name  
✅ **Loading bar** - Thin progress indicator  
✅ **Main tabs** - Assistant, Workflows, Vault, Knowledge  
✅ **Admin right-aligned** - Separated from main tabs  

---

## 🚀 Usage Examples

### Basic Setup

```javascript
import Header from './components/Header'
import Navigation from './components/Navigation'

function App() {
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('assistant')
  const [isLoading, setIsLoading] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState(['TAXi'])

  const handleSearch = (query) => {
    console.log('Search:', query)
    // Implement search
  }

  return (
    <>
      <Header
        lang={lang}
        setLang={setLang}
        breadcrumbs={breadcrumbs}
        onSearch={handleSearch}
        isLoading={isLoading}
        region="US"
      />
      
      <Navigation
        activeTab={tab}
        onTabChange={setTab}
      />
      
      {/* Main content */}
    </>
  )
}
```

### Update Breadcrumbs

```javascript
// Navigate to a matter
setBreadcrumbs(['TAXi', 'Acme Corp', 'Tax Return 2024'])

// Navigate to a document
setBreadcrumbs(['TAXi', 'Acme Corp', 'Tax Return 2024', 'W-2 Forms'])
```

### Show Loading

```javascript
// Start loading
setIsLoading(true)

// Fetch data
await fetchData()

// Stop loading
setIsLoading(false)
```

### Handle Search

```javascript
const handleSearch = async (query) => {
  setIsLoading(true)
  
  const results = await searchAPI(query)
  
  // Display results
  showSearchResults(results)
  
  setIsLoading(false)
}
```

---

## 🎨 Keyboard Shortcuts

### Global Search

**Mac**: `⌘K`  
**Windows/Linux**: `Ctrl+K`

**Actions**:
- Open search modal
- Focus search input
- `Enter` to search
- `Escape` to close

---

## 📱 Responsive Behavior

### Desktop (> 768px)

- Full header with all elements
- All navigation tabs visible
- Search input full width

### Tablet (768px - 1024px)

- Compressed spacing
- Search input narrower
- All tabs still visible

### Mobile (< 768px)

- Logo + hamburger menu
- Search icon only (no input)
- Navigation in slide-out menu

---

## 🔮 Future Enhancements

### Header

- [ ] Recent searches
- [ ] Search filters
- [ ] Search suggestions
- [ ] Notifications bell
- [ ] Quick actions menu

### Navigation

- [ ] Tab badges (counts)
- [ ] Tab icons only mode
- [ ] Customizable tab order
- [ ] Pinned tabs
- [ ] Tab groups

### Search

- [ ] Real-time results
- [ ] Search history
- [ ] Advanced filters
- [ ] Saved searches
- [ ] Search analytics

---

## ✅ Summary

**Created:**
- Header component (56px, flat, breadcrumbs, search)
- Navigation component (48px, main tabs, legacy dropdown)
- Global search modal (Cmd+K)
- Loading progress bar

**Features:**
- ✅ Compressed 56px header
- ✅ Breadcrumb navigation
- ✅ Global search with keyboard shortcut
- ✅ Region badge (US/EU)
- ✅ User menu
- ✅ Loading progress indicator
- ✅ Legacy dropdown (Eligibility, Tax Notice)
- ✅ Clean, flat design

**Benefits:**
- 🎨 Cleaner, more professional look
- 📏 More screen space for content
- 🔍 Quick access to search
- 🧭 Better navigation organization
- ⚡ Visual loading feedback
- ♿ Keyboard accessibility

**Refresh your browser** to see the new compressed header and navigation! 🎉
