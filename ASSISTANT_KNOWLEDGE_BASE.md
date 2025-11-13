# Assistant Knowledge Base - Current State

## What Works Now

### ✅ EITC Questions
The Assistant can answer questions about:
- **Earned Income Tax Credit (EITC)** eligibility
- Income limits and calculations
- Qualifying children requirements
- Documentation needed
- General tax credit information

**Examples that work:**
- "What is EITC?"
- "What are the income limits for EITC?"
- "How do I qualify for the earned income tax credit?"
- "What documents do I need to claim EITC?"

### ❌ Matter-Specific Questions (Not Yet Available)
The Assistant **cannot** currently answer questions about:
- Specific client matters (Smith Tax Case, Davis Tax Planning, etc.)
- Custom uploaded documents
- Case-specific analysis

**Examples that won't work yet:**
- "Explain Davis Tax Planning"
- "What is the Smith tax case?"
- "Analyze the Johnson EITC Review"

## Why This Limitation Exists

### Current Knowledge Base
The Assistant uses the same knowledge base as the regular Chat feature:
- **Location**: `/knowledge_base/embeddings/eitc.faiss`
- **Content**: IRS Publication 596 and related EITC documents
- **Scope**: General EITC information only

### Matter Names Are Placeholders
The matter names in the dropdown (Smith Tax Case, Davis Tax Planning, etc.) are:
- UI placeholders for demonstration
- Not connected to actual documents
- Meant to show how the feature would work with real client data

## What Happens When You Ask About a Matter

When you select a matter and ask about it, the Assistant will:

1. **Detect** that you're asking about a specific matter
2. **Check** if documents are in scope
3. **Respond** with helpful guidance:
   ```
   I don't have specific documents for 'Davis Tax Planning' loaded yet.
   To analyze this matter, please:
   
   1. Upload relevant documents using the 'Attach Docs' button
   2. Add them to 'Docs in Scope' in the left panel
   3. Ask your question again
   
   Currently, I can answer general questions about EITC...
   ```

## How to Add Matter-Specific Knowledge

### Option 1: Quick Demo (Recommended for Testing)
Add sample documents to the existing knowledge base:

```bash
cd knowledge_base/documents
# Add your PDF or text files here
# Then rebuild the index:
cd ../scripts
python build_index.py
```

### Option 2: Full Implementation (For Production)
Implement document upload and per-matter knowledge bases:

1. **Backend Changes**:
   - Add file upload endpoint
   - Create per-matter embedding indices
   - Update retrieval to search matter-specific docs

2. **Frontend Changes**:
   - Implement "Attach Docs" button functionality
   - Add file picker and upload UI
   - Show uploaded docs in "Docs in Scope"

3. **Storage**:
   - Store uploaded files per matter
   - Create separate FAISS indices per matter
   - Maintain metadata about document sources

## Contextual Suggestions

The Assistant now provides **context-aware suggestions**:

### When No Matter Selected
- "What are the income limits for EITC?"
- "How do I calculate my earned income?"
- "What documents do I need to claim EITC?"

### When Matter Selected
- "What documents do I need for [Matter Name]?"
- "What are the key tax issues to consider?"
- "Can you draft a summary of the tax implications?"

## Testing the Current System

### Test EITC Questions ✅
```
1. Don't select a matter (or select one but ask general questions)
2. Ask: "What is EITC?"
3. Ask: "What are the income limits?"
4. Ask: "Who qualifies for EITC?"
```

### Test Matter Detection ✅
```
1. Select "Davis Tax Planning" from Matter dropdown
2. Ask: "Explain Davis Tax Planning"
3. You'll see a helpful message explaining how to add documents
```

### Test Knowledge Sources ✅
```
1. Toggle knowledge sources on/off in left rail
2. Ask EITC questions
3. See how responses use IRS Publications
```

## Future Enhancements

### Phase 1: Document Upload
- [ ] File upload API endpoint
- [ ] Frontend file picker component
- [ ] Store files in matter-specific folders
- [ ] Display uploaded files in "Docs in Scope"

### Phase 2: Per-Matter Embeddings
- [ ] Create embeddings for uploaded documents
- [ ] Store in matter-specific FAISS indices
- [ ] Update retrieval to search correct index
- [ ] Merge results from general + matter-specific knowledge

### Phase 3: Advanced Features
- [ ] OCR for scanned documents
- [ ] Multi-document comparison
- [ ] Timeline extraction from case documents
- [ ] Automatic citation of specific document sections
- [ ] Export analysis reports

## Quick Reference

| Feature | Status | Notes |
|---------|--------|-------|
| EITC Questions | ✅ Working | Uses IRS knowledge base |
| Matter Selection | ✅ Working | UI only, no backend integration |
| Knowledge Toggles | ✅ Working | UI only, all use same KB |
| Docs in Scope | 🚧 Placeholder | Shows helpful note |
| Attach Docs | 🚧 Not Implemented | Button present but no functionality |
| Citations | ✅ Working | Shows IRS publication sources |
| Reasoning Trace | ✅ Working | Shows retrieval/analysis steps |
| Contextual Suggestions | ✅ Working | Adapts to selected matter |

## Workaround for Testing

To test matter-specific functionality without implementing full upload:

1. **Add sample documents** to `/knowledge_base/documents/`
2. **Name them** after your matters (e.g., `davis_tax_planning.txt`)
3. **Rebuild index**: `python knowledge_base/scripts/build_index.py`
4. **Ask questions** - the retrieval will find relevant content

This won't be matter-scoped, but will demonstrate the retrieval and citation features.
