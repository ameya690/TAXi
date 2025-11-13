# Assistant Feature Documentation

## Overview

The Assistant page is a comprehensive legal/tax document analysis interface with three main tabs: **Chat**, **Draft**, and **Table Review**. It features a three-column layout with context controls on the left, main content in the center, and sources/reasoning on the right.

## Architecture

### Frontend Components

```
/frontend/src/components/
├── Assistant.jsx              # Main container component
└── assistant/
    ├── ChatTab.jsx           # Chat conversation interface
    ├── MessageBlock.jsx      # Message rendering with block types
    ├── Composer.jsx          # Unified input with tools menu
    ├── DraftTab.jsx          # Long-form document editor
    ├── TableTab.jsx          # Data table viewer with query input
    ├── ContextRail.jsx       # Left rail: Matter, Knowledge, Docs
    └── SourcesRail.jsx       # Right rail: Citations, Reasoning, Suggestions
```

### Backend API

- **Endpoint**: `POST /api/assistant/chat`
- **Location**: `/backend/routes/assistant.py`

## Features

### 1. Center Pane with Tabs

#### Chat Tab
- **Conversation Stream** with three block types:
  1. **ChatAnswer**: Text with inline citation chips `[1][2]`
  2. **DraftBlock**: Preview with "Open in Draft tab" and "Continue drafting here" buttons
  3. **TableBlock**: Data summary with "Open in Table Review tab" button
  
- **Unified Composer**:
  - Multiline textarea input
  - `/tools` menu with:
    - 📊 Analyze Docs
    - ✍️ Draft Clause
    - 📋 Create Table
    - 🔍 Critique Language
  - 📎 Attach Docs button
  - Scope chips showing selected Matter and Docs
  - Send button

#### Draft Tab
- Full-screen editable text area
- Export button (downloads as .txt)
- Continue Drafting button
- Empty state when no draft exists

#### Table Review Tab
- Scrollable data table with sticky header
- Export CSV button
- Visualize button
- Sticky "Ask this table" input at bottom
- Empty state when no table exists

### 2. Left Context Rail

- **Matter Selector**: Dropdown to choose active matter/case
- **Knowledge Sources**: Toggle switches for:
  - IRS Publications
  - Case Law
  - Regulations
- **Docs in Scope**: List of selected documents with page counts

### 3. Right Sources Rail

- **Citations**: Grouped by source with:
  - Citation ID badges `[1]`
  - Sentence preview
  - Click to jump to source
  
- **Reasoning Trace**: Accordion with steps:
  - 🔍 Retrieve
  - 📊 Analyze
  - ✍️ Draft
  - 🧩 Synthesize
  - ✅ Verify
  
- **Suggestions**: Follow-up question chips that populate composer on click

### 4. Empty States

- Chat: "Start a conversation" with icon and description
- Draft: "No draft yet" with usage instructions
- Table: "No table data" with usage instructions
- Citations: "No citations yet"
- Suggestions: "No suggestions available"

### 5. Error Handling

- Error toast (top-right) for API failures
- Error message blocks in conversation stream
- Disabled send button when input is empty
- Loading dots animation during API calls

## API Response Format

### Answer Response
```json
{
  "type": "answer",
  "content": "Text with [1] citation [2] markers",
  "citations": [
    {
      "source": "IRS Publication 596",
      "items": [
        {"id": "1", "preview": "EITC eligibility requires..."}
      ]
    }
  ],
  "reasoning": [
    {"type": "retrieve", "title": "Retrieve Information", "description": "..."}
  ],
  "suggestions": ["Follow-up question 1", "Follow-up question 2"]
}
```

### Draft Response
```json
{
  "type": "draft",
  "content": "Long-form document text...",
  "citations": [...],
  "reasoning": [...],
  "suggestions": [...]
}
```

### Table Response
```json
{
  "type": "table",
  "tableData": {
    "columns": ["Col1", "Col2", "Col3"],
    "rows": [
      ["val1", "val2", "val3"],
      ["val4", "val5", "val6"]
    ]
  },
  "citations": [...],
  "reasoning": [...],
  "suggestions": [...]
}
```

## Usage

### Starting the Application

1. **Backend**:
   ```bash
   cd backend
   python app.py
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to the app and click **🤖 Assistant** in the navigation

### Using Tools

Type `/` in the composer to open the tools menu:
- `/analyze` - Analyze documents
- `/draft` - Generate long-form content
- `/table` - Create data tables
- `/critique` - Review language

### Workflow Examples

1. **Document Analysis**:
   - Select Matter from left rail
   - Enable Knowledge Sources
   - Type question in composer
   - Review answer with citations
   - Click citation chips to see sources

2. **Drafting**:
   - Type `/draft [description]`
   - Review draft preview in chat
   - Click "Open in Draft tab"
   - Edit and export

3. **Data Tables**:
   - Type `/table [description]`
   - Click "Open in Table Review tab"
   - Use "Ask this table" for queries
   - Export as CSV

## Styling

- **Color Scheme**:
  - Primary: `#667eea` (purple-blue gradient)
  - Background: `#f8fafc` (light gray)
  - Borders: `#e2e8f0`
  - Text: `#1e293b`, `#64748b`
  
- **Responsive**: Mobile-friendly with collapsible rails
- **Animations**: Smooth transitions, loading dots, slide-in toasts

## Future Enhancements

- [ ] Real-time streaming responses
- [ ] Document upload and OCR
- [ ] Advanced table filtering and sorting
- [ ] Citation source viewer modal
- [ ] Export drafts to DOCX/PDF
- [ ] Collaborative editing
- [ ] Version history for drafts
- [ ] Custom tool creation
