# Troubleshooting Blank Page Issue

## 🔍 Diagnosis Steps

### Step 1: Check Browser Console
1. Open your browser (Chrome/Firefox/Safari)
2. Press `F12` or `Cmd+Option+I` (Mac) to open Developer Tools
3. Click on the **Console** tab
4. Refresh the page (`Cmd+R` or `F5`)
5. Look for any **red error messages**

### Step 2: Hard Refresh
The browser might be caching old files:
1. **Chrome/Firefox**: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)
2. **Safari**: `Cmd+Option+E` then `Cmd+R`
3. Or: Open DevTools → Right-click refresh button → "Empty Cache and Hard Reload"

### Step 3: Check if Frontend Server is Running
```bash
cd frontend
npm run dev
```

Should see output like:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 4: Verify Files Exist
```bash
# Check all required files exist
ls -la frontend/src/components/Assistant.jsx
ls -la frontend/src/components/assistant/ChatTab.jsx
ls -la frontend/src/components/assistant/DraftTab.jsx
ls -la frontend/src/components/assistant/TableTab.jsx
ls -la frontend/src/components/ResizablePanel.jsx
ls -la frontend/src/utils/markdownToHtml.js
ls -la frontend/src/utils/assistantStorage.js
ls -la frontend/src/utils/citationParser.js
```

## 🐛 Common Issues & Fixes

### Issue 1: Import Error
**Symptom**: Console shows "Failed to resolve import"

**Fix**:
```bash
cd frontend
npm install
```

### Issue 2: Vite Not Running
**Symptom**: Page shows "This site can't be reached"

**Fix**:
```bash
cd frontend
npm run dev
```

### Issue 3: Port Already in Use
**Symptom**: "Port 5173 is already in use"

**Fix**:
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 5174
```

### Issue 4: React/Vite Build Error
**Symptom**: Console shows syntax errors

**Fix**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue 5: Browser Cache
**Symptom**: Old version still showing

**Fix**:
1. Clear browser cache completely
2. Hard refresh (`Cmd+Shift+R`)
3. Try incognito/private window

## 🔧 Quick Fixes to Try

### Fix 1: Restart Dev Server
```bash
# Stop the server (Ctrl+C)
cd frontend
npm run dev
```

### Fix 2: Clear All Caches
```bash
cd frontend
rm -rf node_modules .vite dist
npm install
npm run dev
```

### Fix 3: Check Console Log
The Assistant component now logs "Assistant component rendering" to console.
- If you see this → Component is loading
- If you don't see this → Import/render issue

### Fix 4: Verify App.jsx
Check that `App.jsx` has:
```javascript
import Assistant from './components/Assistant.jsx'

// In the render:
{tab === 'assistant' && <Assistant lang={lang} t={t} />}
```

## 📊 Debugging Checklist

- [ ] Frontend dev server is running (`npm run dev`)
- [ ] Browser console is open (F12)
- [ ] Hard refresh performed (`Cmd+Shift+R`)
- [ ] No red errors in console
- [ ] "Assistant component rendering" appears in console
- [ ] Network tab shows files loading (200 status)
- [ ] All component files exist
- [ ] node_modules installed

## 🎯 Expected Console Output

When working correctly, you should see:
```
Assistant component rendering
```

And NO errors like:
- ❌ "Failed to resolve import"
- ❌ "Cannot find module"
- ❌ "Unexpected token"
- ❌ "SyntaxError"

## 🔍 What to Look For in Console

### Good Signs ✅
- `Assistant component rendering` appears
- No red error messages
- Files load with 200 status codes
- React DevTools shows component tree

### Bad Signs ❌
- Red error messages
- "Failed to compile"
- "Module not found"
- Blank component tree in React DevTools

## 💡 Most Likely Causes

1. **Browser cache** (90% of cases)
   - Solution: Hard refresh

2. **Dev server not running** (5% of cases)
   - Solution: `npm run dev`

3. **Missing dependencies** (3% of cases)
   - Solution: `npm install`

4. **Import path error** (2% of cases)
   - Solution: Check file paths

## 🚀 Step-by-Step Recovery

### Complete Reset (If Nothing Else Works)

```bash
# 1. Stop all servers
# Press Ctrl+C in all terminal windows

# 2. Clean frontend
cd frontend
rm -rf node_modules package-lock.json .vite dist
npm install

# 3. Restart dev server
npm run dev

# 4. Hard refresh browser
# Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)
```

## 📝 What I Changed

### Files Modified:
1. **App.jsx**
   - Changed import from `Chat` to `Assistant`
   - Changed default tab to `'assistant'`
   - Updated main container height
   - Added conditional padding

2. **Assistant.jsx**
   - Added console.log for debugging
   - Added explicit width to container

### Files That Should Exist:
- `/frontend/src/components/Assistant.jsx`
- `/frontend/src/components/assistant/ChatTab.jsx`
- `/frontend/src/components/assistant/DraftTab.jsx`
- `/frontend/src/components/assistant/TableTab.jsx`
- `/frontend/src/components/assistant/ContextRail.jsx`
- `/frontend/src/components/assistant/SourcesRail.jsx`
- `/frontend/src/components/assistant/CitationChip.jsx`
- `/frontend/src/components/assistant/MessageBlock.jsx`
- `/frontend/src/components/ResizablePanel.jsx`
- `/frontend/src/utils/markdownToHtml.js`
- `/frontend/src/utils/assistantStorage.js`
- `/frontend/src/utils/citationParser.js`

## ✅ Success Indicators

You'll know it's working when:
1. Page loads with Assistant tab visible
2. You see three panels: Context Rail, Chat area, Sources Rail
3. Can type in the chat input
4. Can switch between Chat/Draft/Table tabs
5. Console shows "Assistant component rendering"

## 📞 Next Steps

1. **Try hard refresh first** (`Cmd+Shift+R`)
2. **Check browser console** for errors
3. **Verify dev server is running**
4. **Share console errors** if still blank

The `mv Chat.jsx Chat_Deprecated.jsx` command is **NOT** the issue since we already changed the import to `Assistant`.
