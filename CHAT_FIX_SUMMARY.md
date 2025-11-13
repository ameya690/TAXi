# Chat Functionality Fix

## 🐛 Issue

When sending a message in the chat:
- "Model is thinking..." appears briefly
- Then nothing shows up
- Messages disappear

## 🔍 Root Cause

The issue had **two problems**:

### 1. Disconnected Message Handler

The `AssistantLayout` component had its own `handleSendMessage` function that:
- Only logged the message
- Set `isThinking` to true temporarily
- **Never called the actual API** or parent's handler

```javascript
// OLD - Broken
const handleSendMessage = (message) => {
  console.log('Send message:', message)
  setIsThinking(true)
  setTimeout(() => setIsThinking(false), 2000)
  // ❌ No actual message sending!
}
```

### 2. Mismatched Message Properties

The `ChatTab` component expected messages with `role` property:
```javascript
isUser={msg.role === 'user'}
```

But the `Assistant` component created messages with only `type` property:
```javascript
{
  type: 'user',  // ❌ Missing 'role'
  content: message
}
```

## ✅ Solution

### Fix 1: Connect AssistantLayout to Parent Handler

**Updated AssistantLayout** to accept props:
```javascript
export default function AssistantLayout({ 
  onSend,           // ← New prop
  isLoading,        // ← New prop
  selectedMatter,   // ← New prop
  docsInScope,      // ← New prop
  onDocumentsUploaded // ← New prop
}) {
  // ...
  
  const handleSendMessage = (message) => {
    if (onSend) {
      onSend(message)  // ✅ Call parent's handler
    }
  }
}
```

**Updated Assistant** to pass props:
```javascript
<AssistantLayout 
  onSend={handleSend}
  isLoading={isLoading}
  selectedMatter={selectedMatter}
  docsInScope={docsInScope}
  onDocumentsUploaded={handleDocumentsUploaded}
>
```

### Fix 2: Add Role Property to Messages

**User messages**:
```javascript
const userMessage = {
  id: Date.now(),
  type: 'user',
  role: 'user',     // ✅ Added
  content: message,
  timestamp: new Date()
}
```

**Assistant messages**:
```javascript
assistantMessage = {
  id: Date.now() + 1,
  type: 'answer',
  role: 'assistant',  // ✅ Added
  content: data.content,
  citations: data.citations || [],
  timestamp: new Date()
}
```

## 📊 Data Flow (Fixed)

```
User types message
      ↓
Composer (in AssistantLayout)
      ↓
handleSendMessage (in AssistantLayout)
      ↓
onSend prop → handleSend (in Assistant)
      ↓
API call to /api/assistant/chat
      ↓
Response received
      ↓
Message added to state with 'role' property
      ↓
ChatTab renders DocumentBlock
      ↓
Message appears! ✅
```

## 🔧 Files Modified

```
✅ /components/AssistantLayout.jsx
   - Accept onSend, isLoading, selectedMatter, docsInScope props
   - Connect handleSendMessage to parent's onSend
   - Use isLoading prop instead of local isThinking
   - Pass onDocumentsUploaded to Composer

✅ /components/Assistant.jsx
   - Pass required props to AssistantLayout
   - Add 'role' property to all messages
   - User messages: role: 'user'
   - Assistant messages: role: 'assistant'
   - Error messages: role: 'assistant'
```

## ✅ Result

Now when you send a message:

1. ✅ **Message appears immediately** (user message)
2. ✅ **"Model is thinking..." shows** (isLoading = true)
3. ✅ **API is called** (handleSend in Assistant)
4. ✅ **Response is received** (from backend)
5. ✅ **Assistant message appears** (with proper role)
6. ✅ **Loading indicator disappears** (isLoading = false)

## 🧪 Testing

To test the fix:

1. **Refresh the browser** (Cmd+R)
2. **Navigate to Assistant tab**
3. **Type a message** in the composer
4. **Press Send** or Enter
5. **Verify**:
   - Your message appears as a document block
   - "Model is thinking..." appears
   - Assistant response appears (or error if API not available)

## ⚠️ Note

If you still see errors, it's likely because:
- The backend API `/api/assistant/chat` doesn't exist yet
- The backend server isn't running
- The API endpoint needs to be implemented

The chat UI will now properly display error messages if the API fails.

## 🔮 Next Steps

If the backend API isn't implemented yet, you can:

1. **Mock the response** temporarily:
   ```javascript
   // In handleSend, replace the fetch with:
   const data = {
     type: 'answer',
     content: 'This is a mock response for testing.',
     citations: [],
     reasoning: [],
     suggestions: []
   }
   ```

2. **Implement the backend API** at `/api/assistant/chat`

3. **Test with real data** once backend is ready

---

**The chat functionality is now properly connected!** 🎉
