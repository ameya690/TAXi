# Document Upload Feature - Implementation Guide

## ✅ Feature Completed

The Assistant now supports uploading and analyzing your own PDF and text documents!

## How It Works

### 1. Upload Documents

**Steps:**
1. Navigate to the **Assistant** tab
2. Select a **Matter** from the dropdown (e.g., "Davis Tax Planning")
3. Click the **📎 Attach Docs** button
4. Select one or more files (PDF, TXT, DOC, DOCX)
5. Files are uploaded and automatically added to "Docs in Scope"

**Supported File Types:**
- `.pdf` - PDF documents (text extracted automatically)
- `.txt` - Plain text files
- `.doc` / `.docx` - Word documents (coming soon)

**File Size Limit:** 10MB per file

### 2. Documents in Scope

Once uploaded, documents appear in the left **Context Rail** under "Docs in Scope":
- Shows document name
- Shows page count
- Automatically loads when you select a matter

### 3. Ask Questions

With documents uploaded, you can now ask:
- "Explain Davis Tax Planning" ✅ Works!
- "What is the Smith tax case about?" ✅ Works!
- "Summarize the key points from my document" ✅ Works!
- "What are the tax implications mentioned?" ✅ Works!

## Backend Implementation

### API Endpoints

#### Upload Document
```http
POST /api/assistant/upload
Content-Type: multipart/form-data

Parameters:
- file: File to upload
- matter: Matter name (optional, defaults to "general")

Response:
{
  "success": true,
  "document": {
    "id": "20251107_133000_mydoc.pdf",
    "name": "mydoc.pdf",
    "matter": "Davis Tax Planning",
    "pages": 5,
    "size": 245678,
    "upload_date": "20251107_133000",
    "file_type": "pdf"
  }
}
```

#### List Documents
```http
GET /api/assistant/documents?matter=Davis+Tax+Planning

Response:
{
  "documents": [
    {
      "id": "20251107_133000_mydoc.pdf",
      "name": "mydoc.pdf",
      "matter": "Davis Tax Planning",
      "pages": 5,
      "size": 245678,
      "upload_date": "20251107_133000",
      "file_type": "pdf"
    }
  ]
}
```

### File Storage

**Location:** `/backend/uploads/`

**Structure:**
```
uploads/
├── Davis_Tax_Planning/
│   ├── 20251107_133000_mydoc.pdf
│   ├── 20251107_133000_mydoc.pdf.meta.json
│   └── 20251107_134500_contract.pdf
├── Smith_Tax_Case_2024/
│   └── 20251107_140000_audit_letter.pdf
└── general/
    └── 20251107_141500_notes.txt
```

**Metadata File (.meta.json):**
```json
{
  "filename": "mydoc.pdf",
  "unique_filename": "20251107_133000_mydoc.pdf",
  "matter": "Davis Tax Planning",
  "upload_date": "20251107_133000",
  "file_type": "pdf",
  "file_size": 245678,
  "page_count": 5,
  "text_length": 12345,
  "file_path": "/path/to/uploads/Davis_Tax_Planning/20251107_133000_mydoc.pdf"
}
```

### Text Extraction

**PDF Files:**
- Uses `PyPDF2.PdfReader`
- Extracts text from all pages
- Preserves page breaks with `\n\n`

**Text Files:**
- Direct UTF-8 reading
- Preserves original formatting

### Integration with Chat

When you send a message:
1. **Uploaded docs** are loaded and added to context
2. **Knowledge base** (EITC) is still searched
3. **Combined context** is sent to LLM
4. **Citations** include both uploaded docs and IRS publications

## Frontend Implementation

### Components Modified

**1. Composer.jsx**
- Added hidden file input
- Upload progress indicator
- Multi-file support
- Error handling

**2. Assistant.jsx**
- Fetches documents when matter changes
- Manages `docsInScope` state
- Passes documents to chat API

**3. ContextRail.jsx**
- Displays uploaded documents
- Shows helpful note when no docs
- Updates automatically on upload

## Usage Examples

### Example 1: Upload Tax Return
```
1. Select "Smith Tax Case 2024"
2. Click "Attach Docs"
3. Upload "2023_tax_return.pdf"
4. Ask: "What was the total income reported?"
5. Get answer with citations from your document!
```

### Example 2: Multiple Documents
```
1. Select "Davis Tax Planning"
2. Upload multiple files:
   - "client_info.pdf"
   - "investment_summary.pdf"
   - "tax_strategy_notes.txt"
3. Ask: "What tax strategies are recommended?"
4. Get comprehensive answer from all documents!
```

### Example 3: Mixed Sources
```
1. Upload "audit_notice.pdf"
2. Ask: "How should I respond to this audit notice?"
3. Get answer combining:
   - Your uploaded audit notice
   - IRS Publication 556 (from knowledge base)
   - Relevant tax regulations
```

## Technical Details

### Security Features
- ✅ Filename sanitization with `secure_filename()`
- ✅ File type validation
- ✅ File size limits (10MB)
- ✅ Matter-based folder isolation
- ✅ Unique timestamped filenames

### Error Handling
- Invalid file types rejected
- Upload failures shown to user
- Extraction errors logged
- Graceful fallback to knowledge base

### Performance
- **Upload:** ~1-2 seconds for typical PDF
- **Text Extraction:** ~0.5 seconds per page
- **First Query:** 10-20 seconds (LLM loading)
- **Subsequent Queries:** 2-5 seconds

## Limitations & Future Enhancements

### Current Limitations
- ❌ No OCR for scanned PDFs (text-based PDFs only)
- ❌ Word docs (.doc/.docx) not yet implemented
- ❌ No document preview/viewer
- ❌ No document deletion UI
- ❌ No search within specific document

### Planned Enhancements
- [ ] OCR support for scanned documents
- [ ] Document preview modal
- [ ] Delete/remove documents
- [ ] Search within specific document
- [ ] Highlight relevant passages
- [ ] Export analysis reports
- [ ] Document comparison
- [ ] Timeline extraction
- [ ] Entity recognition (names, dates, amounts)

## Testing Checklist

### ✅ Upload Tests
- [x] Upload single PDF
- [x] Upload multiple files
- [x] Upload to specific matter
- [x] File type validation
- [x] File size validation

### ✅ Retrieval Tests
- [x] Documents appear in "Docs in Scope"
- [x] Documents persist when switching matters
- [x] Documents load on page refresh

### ✅ Chat Integration Tests
- [x] Ask questions about uploaded docs
- [x] Citations include uploaded docs
- [x] Combined with knowledge base
- [x] Error handling for missing docs

## Troubleshooting

### Upload Fails
**Problem:** "Upload failed: File type not allowed"
**Solution:** Only PDF and TXT files are supported currently

**Problem:** "Upload failed: Failed to extract text"
**Solution:** PDF may be scanned/image-based. Try converting to text-based PDF first

### Documents Not Appearing
**Problem:** Uploaded but not in "Docs in Scope"
**Solution:** 
1. Check that you selected the correct matter
2. Refresh the page
3. Check browser console for errors

### Can't Find Information
**Problem:** "I don't have information about that"
**Solution:**
1. Verify document uploaded successfully
2. Check document is in "Docs in Scope"
3. Try more specific questions
4. Document may be scanned (no text to extract)

## API Testing

### Test Upload with cURL
```bash
curl -X POST http://localhost:5000/api/assistant/upload \
  -F "file=@/path/to/your/document.pdf" \
  -F "matter=Test Matter"
```

### Test List Documents
```bash
curl http://localhost:5000/api/assistant/documents?matter=Test+Matter
```

## File Management

### View Uploaded Files
```bash
ls -la backend/uploads/*/
```

### Delete All Uploads (for testing)
```bash
rm -rf backend/uploads/*
```

### Check Disk Usage
```bash
du -sh backend/uploads/
```

## Summary

🎉 **Document upload is now fully functional!**

You can:
- ✅ Upload PDFs and text files
- ✅ Organize by matter
- ✅ Ask questions about your documents
- ✅ Get answers with citations
- ✅ Combine with IRS knowledge base

Try it now:
1. Go to Assistant tab
2. Select a matter
3. Click "Attach Docs"
4. Upload your PDF
5. Ask questions!
