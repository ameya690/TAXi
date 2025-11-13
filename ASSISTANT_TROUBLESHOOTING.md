# Assistant Feature - Troubleshooting Guide

## Issue Fixed: "Failed to get response" Error

### Problem
When trying to chat in the Assistant tab, users were getting:
- Error message: "Sorry, I encountered an error. Please try again."
- Console error: "Error: Failed to get response"

### Root Cause
The backend route `/api/assistant/chat` was importing non-existent modules:
- `from services.llm_service import get_llm_response` (incorrect)

### Solution Applied

1. **Fixed Backend Imports** (`backend/routes/assistant.py`):
   - Changed to use existing services: `LLM`, `Retriever`, `guardrails_enforce`
   - Added lazy initialization pattern matching other routes
   - Integrated with actual knowledge base retrieval

2. **Updated API Integration**:
   - Added proper document retrieval using `Retriever.search()`
   - Integrated safety checks with `guardrails_enforce()`
   - Used `LLM.generate()` for response generation
   - Added proper citation extraction from retrieved documents

3. **Improved Frontend Error Handling**:
   - Added console logging for debugging
   - Show actual error messages to users
   - Better error parsing from server responses

## Verification Steps

### 1. Backend is Running
```bash
cd /Users/spartan/projects/TAXi
source .venv/bin/activate
python backend/app.py
```

Expected output:
```
2025-11-07 13:17:16 [info] starting_taxi env=development host=0.0.0.0 port=5000
* Running on http://127.0.0.1:5000
```

### 2. Test API Endpoint
```bash
curl -X POST http://localhost:5000/api/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is EITC?","lang":"en"}'
```

Expected: JSON response with `type`, `content`, `citations`, `reasoning`, `suggestions`

### 3. Frontend is Running
```bash
cd frontend
npm run dev
```

Expected: Running on http://localhost:3000

### 4. Test in Browser
1. Navigate to http://localhost:3000
2. Click "🤖 Assistant" tab
3. Type a message in the composer
4. Click "Send"
5. Should see response with citations in right rail

## Current Status

✅ Backend route properly integrated with existing services
✅ API endpoint responding correctly
✅ Frontend error handling improved
✅ Citations extracted from retrieved documents
✅ Reasoning trace generated
✅ Suggestions provided

## Known Limitations

1. **Knowledge Base**: If embeddings aren't built, you'll see:
   - Warning: "No knowledge base loaded"
   - Fallback responses from LLM without context
   
   **Solution**: Build the knowledge base:
   ```bash
   cd knowledge_base
   python scripts/build_index.py
   ```

2. **LLM Model Loading**: First request takes ~15 seconds to load FLAN-T5 model
   - Subsequent requests are faster
   - Model is cached in memory

3. **Table Parsing**: Currently returns sample data
   - Real table parsing from LLM output needs enhancement

## Debugging Tips

### Check Backend Logs
Look for these log entries:
```
[info] assistant_chat_request
[debug] guardrails_passed
[info] loading_llm_model
[info] answer_generated
[info] assistant_chat_success
```

### Check Browser Console
Open DevTools (F12) and look for:
- Network tab: Check `/api/assistant/chat` request/response
- Console tab: Look for "Assistant chat error:" messages

### Common Issues

**Issue**: "Failed to get response"
- **Check**: Is backend running on port 5000?
- **Check**: Is frontend proxy configured correctly?
- **Fix**: Restart both frontend and backend

**Issue**: Slow first response
- **Cause**: LLM model loading
- **Expected**: 10-20 seconds for first request
- **Fix**: Wait for model to load, subsequent requests are fast

**Issue**: Empty citations
- **Cause**: Knowledge base not loaded
- **Fix**: Build embeddings with `build_index.py`

## Next Steps

To enhance the Assistant feature:

1. **Build Knowledge Base**:
   ```bash
   cd knowledge_base
   python scripts/build_index.py
   ```

2. **Add More Documents**: Place PDFs/text files in `knowledge_base/documents/`

3. **Improve Table Parsing**: Enhance `parse_table_from_response()` to extract actual tables from LLM output

4. **Add Streaming**: Implement SSE for real-time response streaming

5. **Document Upload**: Add file upload functionality for user documents
