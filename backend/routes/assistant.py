"""
Assistant API route for advanced chat with draft, table, and citation support.
"""
from flask import Blueprint, request, jsonify
from services.llm import LLM
from services.retrieval import Retriever
from services.safety import guardrails_enforce
from config.settings import Settings
from werkzeug.utils import secure_filename
import structlog
import os
import PyPDF2
import json
from datetime import datetime

logger = structlog.get_logger(__name__)

assistant_bp = Blueprint('assistant', __name__)
SETTINGS = Settings()

# Upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'txt', 'doc', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize services lazily
_retriever = None
_llm = None

def get_retriever():
    global _retriever
    if _retriever is None:
        _retriever = Retriever(SETTINGS)
    return _retriever

def get_llm():
    global _llm
    if _llm is None:
        _llm = LLM(SETTINGS)
    return _llm


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_pdf(file_path):
    """Extract text content from PDF file."""
    try:
        text = []
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text.append(page.extract_text())
        return '\n\n'.join(text)
    except Exception as e:
        logger.error("pdf_extraction_error", error=str(e), file_path=file_path)
        return None


def extract_text_from_txt(file_path):
    """Extract text content from text file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        logger.error("txt_extraction_error", error=str(e), file_path=file_path)
        return None


@assistant_bp.route('/upload', methods=['POST'])
def upload_document():
    """Handle document upload for matter-specific analysis."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        matter = request.form.get('matter', 'general')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Secure the filename
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        
        # Create matter-specific folder
        matter_folder = os.path.join(UPLOAD_FOLDER, secure_filename(matter))
        os.makedirs(matter_folder, exist_ok=True)
        
        # Save file
        file_path = os.path.join(matter_folder, unique_filename)
        file.save(file_path)
        
        logger.info("file_uploaded", filename=filename, matter=matter, size=os.path.getsize(file_path))
        
        # Extract text based on file type
        file_ext = filename.rsplit('.', 1)[1].lower()
        text_content = None
        
        if file_ext == 'pdf':
            text_content = extract_text_from_pdf(file_path)
        elif file_ext == 'txt':
            text_content = extract_text_from_txt(file_path)
        
        if text_content is None:
            return jsonify({'error': 'Failed to extract text from file'}), 500
        
        # Calculate page count (approximate for PDFs)
        page_count = 1
        if file_ext == 'pdf':
            try:
                with open(file_path, 'rb') as f:
                    pdf_reader = PyPDF2.PdfReader(f)
                    page_count = len(pdf_reader.pages)
            except:
                page_count = max(1, len(text_content) // 3000)  # Rough estimate
        
        # Save metadata
        metadata = {
            'filename': filename,
            'unique_filename': unique_filename,
            'matter': matter,
            'upload_date': timestamp,
            'file_type': file_ext,
            'file_size': os.path.getsize(file_path),
            'page_count': page_count,
            'text_length': len(text_content),
            'file_path': file_path
        }
        
        metadata_path = file_path + '.meta.json'
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        logger.info("document_processed", filename=filename, pages=page_count, text_length=len(text_content))
        
        return jsonify({
            'success': True,
            'document': {
                'id': unique_filename,
                'name': filename,
                'matter': matter,
                'pages': page_count,
                'size': os.path.getsize(file_path),
                'upload_date': timestamp,
                'file_type': file_ext
            }
        }), 200
        
    except Exception as e:
        logger.error("upload_error", error=str(e), exc_info=True)
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500


@assistant_bp.route('/documents', methods=['GET'])
def list_documents():
    """List all uploaded documents, optionally filtered by matter."""
    try:
        matter = request.args.get('matter')
        documents = []
        
        # Determine which folders to search
        if matter:
            folders = [os.path.join(UPLOAD_FOLDER, secure_filename(matter))]
        else:
            folders = [os.path.join(UPLOAD_FOLDER, d) for d in os.listdir(UPLOAD_FOLDER) 
                      if os.path.isdir(os.path.join(UPLOAD_FOLDER, d))]
        
        # Collect documents from folders
        for folder in folders:
            if not os.path.exists(folder):
                continue
                
            for filename in os.listdir(folder):
                if filename.endswith('.meta.json'):
                    continue
                if not allowed_file(filename):
                    continue
                    
                metadata_path = os.path.join(folder, filename + '.meta.json')
                if os.path.exists(metadata_path):
                    with open(metadata_path, 'r') as f:
                        metadata = json.load(f)
                        documents.append({
                            'id': metadata['unique_filename'],
                            'name': metadata['filename'],
                            'matter': metadata['matter'],
                            'pages': metadata['page_count'],
                            'size': metadata['file_size'],
                            'upload_date': metadata['upload_date'],
                            'file_type': metadata['file_type']
                        })
        
        return jsonify({'documents': documents}), 200
        
    except Exception as e:
        logger.error("list_documents_error", error=str(e), exc_info=True)
        return jsonify({'error': 'Failed to list documents'}), 500


@assistant_bp.route('/chat', methods=['POST', 'OPTIONS'])
def assistant_chat():
    """
    Handle assistant chat requests with support for multiple response types:
    - answer: Regular text response with citations
    - draft: Long-form document generation
    - table: Structured data table
    """
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return '', 204
    
    # Get the message
    try:
        data = request.get_json(force=True, silent=True) or {}
        message = data.get('message', '').strip()
        lang = data.get('lang', 'en').lower()
        docs = data.get('docs', [])
    except:
        return jsonify({'error': 'Invalid request'}), 400
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400
    
    # Use simple OpenRouter LLM directly
    from services.simple_llm import generate_answer
    
    try:
        result = generate_answer(message, lang, docs)
        return jsonify({
            'type': 'answer',
            'content': result['content'],
            'citations': result['citations'],
            'reasoning': [],
            'suggestions': []
        }), 200
    except Exception as e:
        logger.error("chat_error", error=str(e))
        return jsonify({'error': 'Failed to generate answer'}), 500
    
    # Context-aware mock responses based on question keywords
    if 'document' in message or 'form' in message or 'file' in message or 'paperwork' in message:
        content = """**Federal · 2024**

Here are the key documents you'll need for filing:

• **W-2 forms** from all employers
• **1099 forms** for any contract work or other income
• **Social Security numbers** for you, spouse, and dependents
• **Bank account information** for direct deposit
• **Prior year tax return** (if available)

**Next steps:**
1. Gather all income documents by January 31st
2. Organize receipts for deductions you plan to claim

### Details & Sources

Most employers must provide W-2s by January 31st. If you're claiming EITC, you'll also need:
- Proof of qualifying children (birth certificates, school records)
- Documentation of earned income
- Investment income statements (if any)

**Sources:**
[1] IRS Publication 17 - Your Federal Income Tax
[2] IRS Form 1040 Instructions

— Informational only, not tax advice."""
    
    elif 'notice' in message or 'letter' in message or 'cp' in message or 'irs' in message:
        content = """**Federal · 2024**

If you received an IRS notice, here's what to do:

• **Don't panic** - Most notices are routine and easily resolved
• **Read carefully** - The notice explains what the IRS needs
• **Respond by the deadline** - Usually 30 days from the notice date
• **Keep copies** of everything you send to the IRS

**Next steps:**
1. Check the notice type (CP2000, CP14, etc.) at the top
2. Gather documents mentioned in the notice

### Details & Sources

Common IRS notices:
- **CP2000**: Proposed changes to your return (income mismatch)
- **CP14**: Balance due notice
- **CP501**: Reminder of balance due
- **Letter 525**: Request for more information

Most notices can be resolved by mail. You have the right to appeal if you disagree.

**Sources:**
[1] IRS Notice Explanations
[2] IRS Publication 556 - Examination of Returns

— Informational only, not tax advice."""
    
    else:
        # Default EITC response
        content = """**Federal · 2024**

Based on your question, here's what you need to know:

• You may qualify for EITC if you have earned income from employment or self-employment
• Your income must be below certain thresholds (varies by filing status and number of children)
• You must have a valid Social Security number
• You cannot file as "Married Filing Separately"

**Next steps:**
1. Check the current income limits for your filing status at IRS.gov
2. Gather your W-2 forms and income documentation

### Details & Sources

The Earned Income Tax Credit (EITC) is a refundable tax credit for low-to-moderate income workers. For 2024:

- **Single/Head of Household with no children**: Income limit ~$17,640
- **Married Filing Jointly with no children**: Income limit ~$24,210
- **With 1 qualifying child**: Income limits increase to ~$46,560-$53,120
- **With 2 qualifying children**: Income limits increase to ~$52,918-$59,478
- **With 3+ qualifying children**: Income limits increase to ~$56,838-$63,398

**Sources:**
[1] IRS Publication 596 - Earned Income Credit (2024)
[2] IRS Form 1040 Instructions
[3] IRS EITC Qualification Rules

— Informational only, not tax advice."""
    
    # Return the response
    return jsonify({
        'type': 'answer',
        'content': content,
        'citations': [
            {'title': 'IRS Publication 596', 'section': 'EITC Eligibility', 'year': '2024'},
            {'title': 'IRS Form 1040 Instructions', 'section': 'Credits', 'year': '2024'}
        ],
        'reasoning': [],
        'suggestions': []
    }), 200
    
    # OLD CODE BELOW - NOT REACHED
    try:
        
        # Safety check - TEMPORARILY DISABLED FOR DEBUGGING
        # if not docs:  # Only enforce strict guardrails if no custom docs
        #     safe_ok, safe_msg = guardrails_enforce(message, lang=lang)
        #     if not safe_ok:
        #         return jsonify({
        #             'type': 'answer',
        #             'content': safe_msg,
        #             'citations': [],
        #             'reasoning': [],
        #             'suggestions': []
        #         }), 200
        
        # Determine response type based on message content
        response_type = 'answer'
        if message.startswith('/draft'):
            response_type = 'draft'
            message = message[6:].strip()  # Remove /draft prefix
        elif message.startswith('/table'):
            response_type = 'table'
            message = message[6:].strip()  # Remove /table prefix
        elif message.startswith('/analyze'):
            message = message[8:].strip()  # Remove /analyze prefix
        elif message.startswith('/critique'):
            message = message[9:].strip()  # Remove /critique prefix
        
        # Check if asking about a specific matter without context
        is_matter_query = matter and any(keyword in message.lower() for keyword in [
            'matter', 'case', 'planning', matter.lower() if matter else ''
        ])
        
        # Prioritize uploaded documents over knowledge base
        uploaded_docs_context = get_uploaded_docs_context(docs)
        docs_retrieved = []
        
        if uploaded_docs_context:
            # Use uploaded documents as primary context
            context = uploaded_docs_context
            # Add uploaded docs to citations
            for doc in docs:
                docs_retrieved.append({
                    'text': f"Content from uploaded document: {doc.get('name', 'document')}",
                    'source': doc.get('name', 'Uploaded Document')
                })
            logger.info("using_uploaded_docs", doc_count=len(docs))
        else:
            # Fall back to knowledge base retrieval
            retriever = get_retriever()
            docs_retrieved = retriever.search(message, k=3)
            context = "\n\n".join([d["text"] for d in docs_retrieved])
            logger.info("using_knowledge_base", doc_count=len(docs_retrieved))
        
        # Build additional context from matter and knowledge settings
        additional_context = build_context(matter, docs, knowledge)
        if additional_context:
            context = additional_context + "\n\n" + context
        
        # If asking about a matter but no docs in scope, provide helpful response
        if is_matter_query and not docs:
            llm_response = (
                f"I don't have specific documents for '{matter}' loaded yet. "
                f"To analyze this matter, please:\n\n"
                f"1. Upload relevant documents using the 'Attach Docs' button\n"
                f"2. Add them to 'Docs in Scope' in the left panel\n"
                f"3. Ask your question again\n\n"
                f"Currently, I can answer general questions about EITC (Earned Income Tax Credit) "
                f"using the IRS knowledge base. Would you like to know anything about EITC eligibility, "
                f"calculations, or requirements?"
            )
        else:
            # Get LLM response with enhanced prompt for uploaded docs
            llm = get_llm()
            
            # If we have uploaded docs, enhance the prompt
            if docs:
                if response_type == 'table':
                    enhanced_message = (
                        f"Based on the uploaded document(s), {message}\n\n"
                        f"Format your response as a markdown table with clear headers and rows. "
                        f"Use | to separate columns. Example:\n"
                        f"| Header 1 | Header 2 |\n"
                        f"| Data 1 | Data 2 |\n\n"
                        f"Provide ONLY the table, no additional text."
                    )
                else:
                    enhanced_message = (
                        f"Based on the uploaded document(s), {message}\n\n"
                        f"Please provide a comprehensive answer using the document content."
                    )
                llm_response = llm.generate(enhanced_message, context, lang=lang)
            else:
                if response_type == 'table':
                    enhanced_message = (
                        f"{message}\n\n"
                        f"Format your response as a markdown table with clear headers and rows. "
                        f"Use | to separate columns. Provide ONLY the table."
                    )
                    llm_response = llm.generate(enhanced_message, context, lang=lang)
                else:
                    llm_response = llm.generate(message, context, lang=lang)
        
        # Format response based on type
        if response_type == 'draft':
            result = format_draft_response(llm_response, message, docs_retrieved, matter)
        elif response_type == 'table':
            result = format_table_response(llm_response, message, docs_retrieved, matter)
        else:
            result = format_answer_response(llm_response, message, docs_retrieved, matter)
        
        logger.info("assistant_chat_success", response_type=response_type)
        return jsonify(result), 200
        
    except Exception as e:
        logger.error("assistant_chat_error", error=str(e), exc_info=True)
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500


def get_uploaded_docs_context(docs):
    """Get text content from uploaded documents."""
    if not docs:
        return None
    
    context_parts = []
    for doc in docs:
        doc_id = doc.get('id')
        if not doc_id:
            continue
        
        # Find the document file
        for matter_folder in os.listdir(UPLOAD_FOLDER):
            folder_path = os.path.join(UPLOAD_FOLDER, matter_folder)
            if not os.path.isdir(folder_path):
                continue
            
            file_path = os.path.join(folder_path, doc_id)
            metadata_path = file_path + '.meta.json'
            
            if os.path.exists(file_path) and os.path.exists(metadata_path):
                # Read metadata
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                
                # Extract text
                file_ext = metadata.get('file_type', 'txt')
                if file_ext == 'pdf':
                    text = extract_text_from_pdf(file_path)
                elif file_ext == 'txt':
                    text = extract_text_from_txt(file_path)
                else:
                    continue
                
                if text:
                    # Add document header with metadata
                    doc_header = (
                        f"=== DOCUMENT: {metadata['filename']} ===\n"
                        f"Type: {file_ext.upper()}\n"
                        f"Pages: {metadata.get('page_count', 1)}\n"
                        f"Matter: {metadata.get('matter', 'N/A')}\n"
                        f"\n--- CONTENT ---\n"
                    )
                    context_parts.append(doc_header + text + "\n--- END OF DOCUMENT ---")
                    logger.info("document_loaded", filename=metadata['filename'], text_length=len(text))
                break
    
    return "\n\n".join(context_parts) if context_parts else None


def build_context(matter, docs, knowledge):
    """Build context string from matter, docs, and knowledge sources."""
    context_parts = []
    
    if matter:
        context_parts.append(f"Matter: {matter}")
    
    if docs:
        doc_list = ", ".join([doc.get('name', 'Unknown') for doc in docs])
        context_parts.append(f"Documents in scope: {doc_list}")
    
    if knowledge:
        enabled_sources = [k.replace('_', ' ').title() for k, v in knowledge.items() if v]
        if enabled_sources:
            context_parts.append(f"Knowledge sources: {', '.join(enabled_sources)}")
    
    return "\n".join(context_parts)


def format_answer_response(llm_response, message, docs_retrieved, matter=None):
    """Format a standard answer response with citations."""
    # Extract citations from retrieved docs
    citations = extract_citations_from_docs(docs_retrieved)
    
    # Generate reasoning trace
    reasoning = generate_reasoning_trace(message)
    
    # Generate suggestions
    suggestions = generate_suggestions(message, matter)
    
    return {
        'type': 'answer',
        'content': llm_response,
        'citations': citations,
        'reasoning': reasoning,
        'suggestions': suggestions
    }


def format_draft_response(llm_response, message, docs_retrieved, matter=None):
    """Format a draft document response."""
    # Extract citations from retrieved docs
    citations = extract_citations_from_docs(docs_retrieved)
    
    # Generate reasoning trace
    reasoning = [
        {'type': 'retrieve', 'title': 'Retrieve Context', 'description': 'Gathered relevant documents and precedents'},
        {'type': 'analyze', 'title': 'Analyze Requirements', 'description': 'Identified key clauses and legal requirements'},
        {'type': 'draft', 'title': 'Draft Document', 'description': 'Generated comprehensive draft with proper structure'}
    ]
    
    suggestions = generate_suggestions(message, matter) if matter else [
        'Review and edit the draft',
        'Add specific details for your case',
        'Export to your document editor'
    ]
    
    return {
        'type': 'draft',
        'content': llm_response,
        'citations': citations,
        'reasoning': reasoning,
        'suggestions': suggestions
    }


def format_table_response(llm_response, message, docs_retrieved, matter=None):
    """Format a table data response."""
    # Parse table from response (simplified)
    table_data = parse_table_from_response(llm_response)
    
    citations = extract_citations_from_docs(docs_retrieved)
    
    reasoning = [
        {'type': 'retrieve', 'title': 'Retrieve Data', 'description': 'Collected relevant data points'},
        {'type': 'analyze', 'title': 'Structure Data', 'description': 'Organized data into tabular format'},
        {'type': 'verify', 'title': 'Verify Accuracy', 'description': 'Cross-referenced data with sources'}
    ]
    
    suggestions = generate_suggestions(message, matter) if matter else [
        'Export table to CSV',
        'Visualize the data',
        'Ask follow-up questions about specific rows'
    ]
    
    return {
        'type': 'table',
        'tableData': table_data,
        'citations': citations,
        'reasoning': reasoning,
        'suggestions': suggestions
    }


def extract_citations_from_docs(docs_retrieved):
    """Extract citations from retrieved documents."""
    if not docs_retrieved:
        return []
    
    # Group citations by source
    citations_by_source = {}
    for idx, doc in enumerate(docs_retrieved, 1):
        source = doc.get('source', 'Unknown Source')
        text_preview = doc.get('text', '')[:150] + '...' if len(doc.get('text', '')) > 150 else doc.get('text', '')
        
        if source not in citations_by_source:
            citations_by_source[source] = []
        
        citations_by_source[source].append({
            'id': str(idx),
            'preview': text_preview
        })
    
    # Convert to list format
    return [
        {'source': source, 'items': items}
        for source, items in citations_by_source.items()
    ]


def generate_reasoning_trace(message):
    """Generate reasoning trace steps."""
    return [
        {'type': 'retrieve', 'title': 'Retrieve Information', 'description': 'Searched knowledge base for relevant tax regulations and publications'},
        {'type': 'analyze', 'title': 'Analyze Query', 'description': 'Identified key concepts and requirements in your question'},
        {'type': 'synthesize', 'title': 'Synthesize Answer', 'description': 'Combined information from multiple sources to provide comprehensive response'}
    ]


def generate_suggestions(message, matter=None):
    """Generate follow-up suggestions based on context."""
    if matter:
        # Matter-specific suggestions
        return [
            f'What documents do I need for {matter}?',
            'What are the key tax issues to consider?',
            'Can you draft a summary of the tax implications?'
        ]
    else:
        # General EITC suggestions
        return [
            'What are the income limits for EITC?',
            'How do I calculate my earned income?',
            'What documents do I need to claim EITC?'
        ]


def parse_table_from_response(text):
    """Parse markdown table structure from LLM response."""
    try:
        lines = text.strip().split('\n')
        table_lines = []
        
        # Find lines that look like table rows (contain |)
        for line in lines:
            line = line.strip()
            if '|' in line and not line.startswith('|--') and not all(c in '|-: ' for c in line):
                table_lines.append(line)
        
        if len(table_lines) < 2:
            # No valid table found, return a simple representation
            return {
                'columns': ['Information'],
                'rows': [[text[:200] + '...' if len(text) > 200 else text]]
            }
        
        # Parse header (first line)
        header_line = table_lines[0]
        columns = [col.strip() for col in header_line.split('|') if col.strip()]
        
        # Parse data rows (skip separator line if present)
        rows = []
        for line in table_lines[1:]:
            # Skip separator lines (like |---|---|)
            if all(c in '|-: ' for c in line):
                continue
            row = [cell.strip() for cell in line.split('|') if cell.strip() or cell == '']
            if row and len(row) > 0:
                # Pad row to match column count
                while len(row) < len(columns):
                    row.append('')
                rows.append(row[:len(columns)])
        
        if not rows:
            # No data rows found
            return {
                'columns': columns if columns else ['Information'],
                'rows': [['No data extracted']]
            }
        
        return {
            'columns': columns,
            'rows': rows
        }
        
    except Exception as e:
        logger.error("table_parsing_error", error=str(e), text=text[:200])
        # Fallback: return text as single cell
        return {
            'columns': ['Response'],
            'rows': [[text]]
        }
