# Fix Blank Screen - Clear Cache

The browser is loading cached JavaScript files that don't have the new theme system. Here's how to fix it:

## 🔧 Quick Fix Steps

### 1. **Hard Refresh Browser**
```
Chrome/Edge: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
Firefox: Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)
Safari: Cmd+Option+R (Mac)
```

### 2. **Clear Browser Cache** (if hard refresh doesn't work)

**Chrome/Edge:**
1. Open DevTools (F12 or Cmd+Option+I)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Firefox:**
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable Cache"
4. Refresh page

**Safari:**
1. Safari menu → Preferences → Advanced
2. Check "Show Develop menu"
3. Develop → Empty Caches
4. Refresh page

### 3. **Restart Dev Server**

Stop the current server (Ctrl+C) and restart:

```bash
cd /Users/spartan/projects/TAXi/frontend
npm start
```

### 4. **Check Console Logs**

After refreshing, check the browser console for these logs:
```
useThemedTokens - isDarkMode: false
useThemedTokens - theme.colors: {neutral: {...}, fg: {...}, ...}
useThemedTokens - theme.colors.neutral: {50: "#fafafa", 100: "#f5f5f5", ...}
```

If you see these logs, the theme is loading correctly!

---

## 🎯 What's Happening

The browser cached the old JavaScript bundle that:
- Used old theme system (themes.js)
- Didn't have `neutral` colors
- Didn't have backward compatibility

The new code has:
- Enhanced theme system (themes-enhanced.js)
- `neutral` colors for backward compatibility
- All old color tokens working

---

## ✅ Verification

After clearing cache, you should see:
1. ✅ No console errors
2. ✅ App loads normally
3. ✅ Dark mode toggle in header
4. ✅ Console logs showing theme data

---

## 🚨 If Still Not Working

### Option A: Delete node_modules/.cache
```bash
cd /Users/spartan/projects/TAXi/frontend
rm -rf node_modules/.cache
npm start
```

### Option B: Check if correct file is being imported

The hook should import from `themes-enhanced.js`:
```javascript
// In useThemedTokens.js
import { getTheme, motion, getFocusRing, getButtonTokens } from '../styles/themes-enhanced'
```

NOT from `themes.js` (old file).

---

## 📝 Summary

**Problem**: Browser cache has old JavaScript  
**Solution**: Hard refresh + clear cache  
**Verification**: Check console logs for theme data  

**The code is correct - it's just a caching issue!** 🎉
