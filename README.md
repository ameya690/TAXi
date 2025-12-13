# 🚕 TAXi - Tax Intelligence Assistant

An **AI-powered tax assistance platform** focused on **EITC eligibility screening**, **tax notice analysis**, and **intelligent document management** with a modern, intuitive interface.

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![React](https://img.shields.io/badge/react-18.3+-61dafb.svg)
![Flask](https://img.shields.io/badge/flask-2.3+-green.svg)

---

## ✨ Features

### 🤖 **AI Assistant**
- **Intelligent Q&A**: Ask questions about EITC, tax credits, and deductions
- **Context-Aware**: Retrieval-augmented generation (RAG) using FAISS
- **Multi-Provider Support**: Local models (Hugging Face) or cloud APIs (OpenRouter)
- **Citation System**: References source documents in responses

### 📊 **EITC Eligibility Calculator**
- **Interactive Wizard**: Step-by-step eligibility assessment
- **Real-time Validation**: Instant feedback on eligibility criteria
- **Save & Resume**: Store calculations for future reference
- **Multi-language**: English and Spanish support

### 📄 **Tax Notice Explainer**
- **OCR Processing**: Extract text from PDFs and images
- **Smart Analysis**: Identify notice types, deadlines, and amounts
- **Plain Language**: AI-generated summaries in simple terms
- **Action Items**: Clear next steps and recommendations

### 📚 **Knowledge Base & Vault**
- **Document Management**: Upload and organize tax documents
- **Smart Search**: Semantic search across your document library
- **Version Control**: Track document changes and history
- **Secure Storage**: Encrypted document storage

### 🔄 **Workflows**
- **Guided Processes**: Step-by-step tax-related workflows
- **Entity Classification**: Business structure guidance
- **R&D Credits**: Research & Development credit assistance
- **Transfer Pricing**: International tax compliance help

### 🎨 **Modern UI/UX**
- **Dark Mode**: Eye-friendly dark theme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Resizable Panels**: Customizable workspace layout
- **Rich Text Editor**: Notion-style block editing

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Tesseract OCR**: `brew install tesseract` (macOS) or `apt-get install tesseract-ocr` (Linux)
- **Poppler**: `brew install poppler` (macOS) or `apt-get install poppler-utils` (Linux)

### Installation

#### 1️⃣ **Backend Setup**

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Configure environment
cp ../.env.example .env
# Edit .env with your settings (optional)

# Build knowledge base index
python ../knowledge_base/scripts/build_index.py

# Start backend server
python app.py
```

Backend will run at: **http://localhost:5000**

#### 2️⃣ **Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

### 🎯 **One-Command Startup**

```bash
# From project root
./restart_all.sh
```

This script will:
- Stop any running instances
- Start backend on port 5001
- Start frontend on port 3000/3001
- Display service status and logs

---

## 🏗️ Project Structure

```
TAXi/
├── backend/                    # Flask API server
│   ├── app.py                 # Application entry point
│   ├── routes/                # API endpoints
│   │   ├── assist.py         # Chat assistance
│   │   ├── assistant.py      # Advanced assistant features
│   │   ├── eligibility.py    # EITC eligibility
│   │   ├── tax_notice.py     # Notice analysis
│   │   └── health.py         # Health checks
│   ├── services/              # Business logic
│   │   ├── llm.py            # LLM integration
│   │   ├── retrieval.py      # RAG & search
│   │   ├── ocr.py            # Document processing
│   │   └── eligibility_rules.py
│   ├── models/                # Data models
│   └── config/                # Configuration
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Assistant.jsx
│   │   │   ├── EligibilityCalculator.jsx
│   │   │   ├── TaxNoticeExplainer.jsx
│   │   │   ├── Knowledge.jsx
│   │   │   ├── Vault.jsx
│   │   │   └── Workflows.jsx
│   │   ├── AppModern.jsx      # Main application
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   └── package.json
│
├── knowledge_base/             # Document storage & embeddings
│   ├── documents/             # Source documents
│   ├── embeddings/            # FAISS indices
│   └── scripts/
│       └── build_index.py     # Index builder
│
├── tests/                      # Test suite
├── deployments/                # Docker configs
├── scripts/                    # Utility scripts
└── requirements.txt            # Python dependencies
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Backend Server
FLASK_ENV=development
HOST=0.0.0.0
PORT=5000
CORS_ORIGINS=http://localhost:3000

# LLM Provider
# Options: 'transformers' (local, free) or 'openrouter' (API, paid)
LLM_PROVIDER=transformers
MODEL_ID=google/flan-t5-base
MAX_NEW_TOKENS=256

# OpenRouter (optional - only if using cloud models)
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Retrieval & Embeddings
EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2
KB_DIR=../knowledge_base
INDEX_PATH=../knowledge_base/embeddings/eitc.faiss

# Logging & Monitoring
LOG_LEVEL=INFO
ENABLE_METRICS=true
```

### LLM Provider Options

#### **Local Models (Free)**
- `google/flan-t5-base` - Fast, lightweight (default)
- `google/flan-t5-large` - Better quality, slower
- No API key required, runs on your machine

#### **Cloud Models (Paid)**
Set `LLM_PROVIDER=openrouter` and choose from:
- `anthropic/claude-3.5-sonnet` - Best quality, 200K context
- `openai/gpt-4-turbo` - Very good, 128K context
- `openai/gpt-3.5-turbo` - Fast, affordable, 16K context
- `meta-llama/llama-3.1-70b-instruct` - Open source, 128K context

Get your API key at: [OpenRouter](https://openrouter.ai/keys)

---

## 📖 Usage

### Access Points

- **Main Application**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Documentation**: http://localhost:5000/health
- **Metrics**: http://localhost:5000/metrics

### Key Features

#### **1. Ask Questions**
Navigate to the Assistant tab and ask questions about:
- EITC eligibility requirements
- Tax credits and deductions
- IRS forms and procedures
- Tax deadlines and filing requirements

#### **2. Check Eligibility**
Use the EITC Eligibility Calculator to:
- Answer step-by-step questions
- Get instant eligibility determination
- Save calculations for later
- Export results as PDF

#### **3. Analyze Tax Notices**
Upload IRS or state tax notices to:
- Extract key information automatically
- Get plain-language explanations
- Understand deadlines and amounts due
- Receive actionable next steps

#### **4. Manage Documents**
Use the Vault to:
- Upload tax documents (PDF, images)
- Organize by category or client
- Search across all documents
- Track document versions

---

## 🧪 Testing

### Run Backend Tests

```bash
# From project root
python -m pytest tests/ -v

# With coverage
python -m pytest tests/ --cov=backend --cov-report=html
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/health

# Test all endpoints
./test_all_endpoints.sh

# Test specific endpoint
./test_backend.sh
```

---

## 🐳 Docker Deployment

```bash
cd deployments/docker
docker compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📚 Adding Knowledge Base Content

To enhance the AI's knowledge:

1. Add IRS publications or tax documents to `knowledge_base/documents/`
2. Rebuild the index:

```bash
python knowledge_base/scripts/build_index.py
```

3. Restart the backend server

Supported formats: PDF, TXT, DOCX

---

## 🔒 Security & Privacy

- **No Data Sharing**: All processing happens locally (when using local models)
- **Encrypted Storage**: Documents are stored securely
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse
- **CORS Protection**: Cross-origin requests are restricted
- **Input Validation**: All user inputs are validated and sanitized

⚠️ **Important**: This tool provides **informational assistance only** and is **not legal or tax advice**. Always consult with a qualified tax professional for specific situations.

---

## 🛠️ Development

### Tech Stack

**Backend:**
- Flask 2.3 - Web framework
- Transformers 4.43 - LLM inference
- FAISS - Vector similarity search
- Sentence-Transformers - Text embeddings
- PyTesseract - OCR processing
- Prometheus - Metrics collection

**Frontend:**
- React 18.3 - UI framework
- Vite 5.4 - Build tool
- React Quill - Rich text editor
- React Markdown - Markdown rendering

### Development Commands

```bash
# Backend
cd backend
source .venv/bin/activate
python app.py  # Development server with hot reload

# Frontend
cd frontend
npm run dev    # Development server with HMR

# Build for production
npm run build
npm run preview
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

Apache License 2.0 - See LICENSE file for details

**Disclaimer**: This software is provided "as is" without warranty of any kind. It is not a substitute for professional tax advice. EITC dollar amounts and phase-outs change annually - verify current IRS guidelines before making any tax decisions.

---

## 🙏 Acknowledgments

- IRS for public tax documentation
- Hugging Face for open-source models
- OpenRouter for API access to various LLMs
- The open-source community

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting guides

---

**Built with ❤️ for tax professionals and individuals seeking EITC assistance**
