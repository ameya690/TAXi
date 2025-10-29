# TAX Intelligence Bot — Intelligent Tax Assistance (EITC Assistant)

An **AI-powered** EITC helper focused on **eligibility screening** and **safe guidance**, with **English/Spanish** UI and a simple admin page.

> ✅ **No OpenAI key required** — uses a small local model via Hugging Face `transformers` (defaults to `google/flan-t5-base`).  
> 🖥️ **One-liners** to run locally (Python + Node).  
> 🔒 **Safety-first**: restricts scope to EITC and adds disclaimers.  
> 📚 **Retrieval**: FAISS + sentence-transformers over local IRS docs you provide.

---

## Quick Start (Local)

**Prereqs**
- Python 3.11+
- Node.js 18+
- (First run downloads model weights from Hugging Face; no token needed for default model.)

**1) Backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r ../requirements.txt

# (optional) set env, otherwise sensible defaults are used
cp ../.env.example .env

# build the small demo knowledge index (uses sample doc)
python ../knowledge_base/scripts/build_index.py

# start API
python app.py
```

**2) Frontend**

```bash
cd ../frontend
npm install
npm run dev  # opens http://localhost:3000
```

**3) Use it**

- App: http://localhost:3000  
- API: http://localhost:5000  
- Admin page: http://localhost:3000/admin

> Tip: Drop official IRS EITC PDFs or text into `knowledge_base/documents/` and re-run:
>
> ```bash
> python knowledge_base/scripts/build_index.py
> ```

---

## Docker (optional)

```bash
cd deployments/docker
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## What’s inside

```
TAXI/
├── backend/                # Flask API, retrieval & safety
│   ├── app.py
│   ├── routes/             # API endpoints
│   ├── services/           # LLM, retrieval, rules/safety
│   ├── models/             # (sqlite) logs
│   └── config/             # settings
├── frontend/               # React (Vite) UI
├── knowledge_base/         # docs + embeddings
│   ├── documents/          # put IRS materials here
│   ├── embeddings/         # FAISS index
│   └── scripts/            # build_index.py
├── tests/                  # pytest
├── deployments/            # docker compose
├── docs/                   # OpenAPI
├── scripts/                # setup/deploy helpers
├── requirements.txt
└── .env.example
```

---

## Configuration

`.env` (all optional; defaults shown):

```
FLASK_ENV=development
PORT=5000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000

# LLM
LLM_PROVIDER=transformers
MODEL_ID=google/flan-t5-base
MAX_NEW_TOKENS=256

# Retrieval
EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2
KB_DIR=../knowledge_base
INDEX_PATH=../knowledge_base/embeddings/eitc.faiss

# Logging / Metrics
LOG_LEVEL=INFO
ENABLE_METRICS=true
```

> **Important**: EITC **dollar amounts & phase-outs change** each year. This demo ships without official numeric thresholds. The eligibility endpoint applies structural checks and returns **“informational only”** results. Load current IRS publications into the KB to power answers, and implement/confirm numeric thresholds in `services/eligibility_rules.py` before using for real decisions.

---

## Testing

```bash
python -m pytest tests/ -q
```

---

## License

Apache-2.0 (see headers in source). **Not legal or tax advice.**
