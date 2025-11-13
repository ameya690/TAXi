# Blank Screen Debugging Guide

## 🐛 Issue
Seeing a blank screen after the chat fix.

## 🔍 Possible Causes

### 1. React Error
- Syntax error in a component
- Missing import
- Runtime error during render

### 2. State Loading Issue
- Component waiting for state to load
- Infinite loading state

### 3. CSS/Styling Issue
- Component rendering but invisible
- Z-index problems
- Display: none somewhere

## 🔧 Quick Fixes Applied

### 1. Added Loading State Check
```javascript
if (!isStateLoaded) {
  return <div>Loading Assistant...</div>
}
```

### 2. Added Error Boundary
```javascript
const [hasError, setHasError] = useState(false)

if (hasError) {
  return <div>Something went wrong...</div>
}
```

## 🧪 Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Look for red error messages
4. Check for:
   - Import errors
   - Syntax errors
   - Runtime errors
   - Network errors

### Step 2: Check Network Tab
1. Go to Network tab in DevTools
2. Refresh page
3. Check if all JavaScript files load (200 status)
4. Look for 404 errors

### Step 3: Check React DevTools
1. Install React DevTools extension
2. Open Components tab
3. See if Assistant component is mounted
4. Check component props and state

### Step 4: Add Console Logs
Add these to Assistant.jsx:
```javascript
console.log('1. Assistant component loaded')
console.log('2. isStateLoaded:', isStateLoaded)
console.log('3. messages:', messages)
console.log('4. About to render AssistantLayout')
```

### Step 5: Check File Paths
Verify these files exist:
```
✓ /components/AssistantLayout.jsx
✓ /components/assistant/ContextRail_new.jsx
✓ /components/assistant/SourcesRail_enhanced.jsx
✓ /components/assistant/Composer_new.jsx
✓ /components/assistant/ReasoningTrace.jsx
✓ /components/assistant/ChatTab.jsx
✓ /components/assistant/DocumentBlock.jsx
```

## 🚨 Common Errors

### Error: Cannot read property 'map' of undefined
**Cause**: Trying to map over undefined array
**Fix**: Add default values
```javascript
messages={messages || []}
docsInScope={docsInScope || []}
```

### Error: Element type is invalid
**Cause**: Component not exported properly
**Fix**: Check export statements
```javascript
export default function Component() { }
```

### Error: Hooks can only be called inside function components
**Cause**: Using hooks incorrectly
**Fix**: Ensure hooks are at top level of component

## 🔧 Temporary Workaround

If you need to get the app working immediately, you can temporarily revert to the old components:

1. **Revert AssistantLayout import**:
```javascript
// In Assistant.jsx, comment out new layout
// import AssistantLayout from './AssistantLayout'

// Use old layout temporarily
return (
  <div style={{ padding: '20px' }}>
    <h1>Assistant (Debug Mode)</h1>
    <ChatTab 
      messages={messages}
      isLoading={isLoading}
      onSend={handleSend}
      // ... other props
    />
  </div>
)
```

2. **Check if it renders**:
- If it works → Problem is in AssistantLayout or its children
- If it doesn't work → Problem is in Assistant component itself

## 📊 Diagnostic Checklist

Run through this checklist:

- [ ] Browser console shows no errors
- [ ] Network tab shows all files loaded (200 status)
- [ ] React DevTools shows Assistant component mounted
- [ ] Console.log('Assistant rendering') appears
- [ ] isStateLoaded becomes true
- [ ] AssistantLayout receives props correctly
- [ ] ChatTab receives messages array
- [ ] Composer renders
- [ ] No CSS hiding the content (check computed styles)

## 🎯 Most Likely Causes

Based on the changes made:

1. **AssistantLayout props mismatch** (80% likely)
   - Missing required prop
   - Prop type mismatch
   - Undefined prop being used

2. **Import path error** (15% likely)
   - Wrong file extension (.jsx vs .js)
   - Case sensitivity issue
   - Missing file

3. **State initialization** (5% likely)
   - isStateLoaded stuck at false
   - Infinite loop in useEffect

## 🔍 Next Steps

1. **Check browser console** - This will tell you exactly what's wrong
2. **Look for the console.log** - "Assistant component rendering" should appear
3. **Check if "Loading Assistant..." appears** - If yes, state isn't loading
4. **Share the console error** - I can help fix the specific error

## 💡 Quick Test

Add this at the very top of Assistant.jsx to test if the file is even loading:

```javascript
console.log('===== ASSISTANT.JSX FILE LOADED =====')

export default function Assistant({ lang = 'en', t = (k) => k }) {
  console.log('===== ASSISTANT COMPONENT RENDERING =====')
  
  // Rest of component...
}
```

If you don't see these logs, the file isn't loading at all.

---

**Please check your browser console and share any error messages you see!** 🔍
