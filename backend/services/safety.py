from typing import Tuple
import structlog

logger = structlog.get_logger(__name__)

_BLOCK_OUTSIDE = [
    "crypto", "cryptocurrency", "bitcoin", "stock", "stocks", "mortgage", "medical", 
    "immigration", "criminal", "asylum", "visa", "foreign tax", "company taxes", 
    "business taxes", "state tax", "sales tax", "withholding tables", "erisa", 
    "retirement distributions", "1099-k", "politics", "election", "voting",
    "weather", "sports", "recipe", "cooking", "movie", "music", "game",
    "animal", "monkey", "dog", "cat", "car", "vehicle", "travel", "hotel"
]

# Keywords that indicate EITC or tax-related questions
_EITC_KEYWORDS = [
    "eitc", "earned income", "tax credit", "income tax", "tax return", "irs",
    "refund", "filing", "qualify", "eligible", "eligibility", "dependent",
    "child", "children", "w-2", "w2", "1040", "schedule", "federal tax",
    "tax year", "adjusted gross income", "agi", "claim", "credit",
    "withholding", "deduction", "exemption", "tax form", "tax law",
    "taxpayer", "social security number", "ssn", "investment income",
    "military", "army", "navy", "air force", "marine", "marines", "soldier",
    "veteran", "combat", "deployment", "service", "armed forces"
]

def guardrails_enforce(question: str, lang: str = "en") -> Tuple[bool, str]:
    """Enforce safety guardrails to keep responses within EITC scope.
    
    Args:
        question: User's question
        lang: Language code ("en" or "es")
        
    Returns:
        Tuple of (is_safe, message). If not safe, message contains explanation.
    """
    ql = question.lower()
    
    # Check for explicitly blocked topics
    if any(term in ql for term in _BLOCK_OUTSIDE):
        logger.info("blocked_out_of_scope", question=question[:100], lang=lang)
        if lang.startswith("en"):
            return (False, "I'm focused only on EITC (Earned Income Tax Credit). Please ask about EITC eligibility, requirements, or filing. — Informational only, not tax advice.")
        else:
            return (False, "Estoy enfocado solo en el EITC (Crédito Tributario por Ingreso del Trabajo). Por favor, pregunta específicamente sobre elegibilidad, requisitos o presentación del EITC. — Solo con fines informativos, no es asesoramiento fiscal.")
    
    # Check if question is actually about EITC/taxes (require at least one EITC keyword)
    # Exception: very short questions or greetings pass through
    if len(ql.split()) >= 3:  # Only check questions with 3+ words
        has_eitc_keyword = any(keyword in ql for keyword in _EITC_KEYWORDS)
        
        if not has_eitc_keyword:
            logger.info("blocked_no_eitc_keywords", question=question[:100], lang=lang)
            if lang.startswith("en"):
                return (False, "I'm specialized in EITC (Earned Income Tax Credit) only. Please ask questions about EITC eligibility, qualifications, income limits, or how to claim the credit. — Informational only, not tax advice.")
            else:
                return (False, "Estoy especializado solo en el EITC (Crédito Tributario por Ingreso del Trabajo). Por favor, pregunta sobre elegibilidad del EITC, calificaciones, límites de ingresos o cómo reclamar el crédito. — Solo con fines informativos, no es asesoramiento fiscal.")
    
    # Disallow definitive refund amounts and guarantees
    if "guarantee" in ql or "exact refund" in ql or "audit risk" in ql:
        logger.info("blocked_definitive_claim", question=question[:100], lang=lang)
        if lang.startswith("en"):
            return (False, "I can’t provide guarantees, exact refund amounts, or audit risk predictions. I can help explain EITC rules. — Informational only, not tax advice.")
        else:
            return (False, "No puedo garantizar montos exactos de reembolso ni predecir riesgos de auditoría. Puedo ayudar a explicar reglas del EITC. — Solo con fines informativos, no es asesoramiento fiscal.")
    
    logger.debug("guardrails_passed", question=question[:100])
    return (True, "")
