from flask import Blueprint, request, jsonify
import structlog
from services.safety import guardrails_enforce
from services.retrieval import Retriever
from services.llm import LLM
from config.settings import Settings

logger = structlog.get_logger(__name__)

assist_bp = Blueprint("assist", __name__)
SETTINGS = Settings()

# Initialize services lazily to avoid startup delays
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

@assist_bp.post("/ask")
def ask():
    """Handle user questions about EITC."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        question = (data.get("question") or "").strip()
        lang = (data.get("lang") or "en").lower()

        logger.info("ask_request", question_length=len(question), lang=lang)

        if not question:
            logger.warning("missing_question")
            return jsonify(error="Missing 'question'"), 400

        # Safety first
        safe_ok, safe_msg = guardrails_enforce(question, lang=lang)
        if not safe_ok:
            return jsonify(answer=safe_msg, citations=[], lang=lang)

        # Retrieval
        retriever = get_retriever()
        docs = retriever.search(question, k=3)
        context = "\n\n".join([d["text"] for d in docs])
        citations = [d["source"] for d in docs]

        # LLM
        llm = get_llm()
        answer = llm.generate(question=question, context=context, lang=lang)

        logger.info("ask_completed", answer_length=len(answer), num_citations=len(citations))
        return jsonify(answer=answer, citations=citations, lang=lang)
        
    except Exception as e:
        logger.error("ask_failed", error=str(e))
        error_msg = "An error occurred processing your request. Please try again." if lang.startswith("en") else "Ocurrió un error procesando tu solicitud. Por favor, inténtalo de nuevo."
        return jsonify(error=error_msg), 500
