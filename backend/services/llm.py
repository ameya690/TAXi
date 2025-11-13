from transformers import pipeline
import threading
import structlog
from config.settings import Settings
from typing import Optional
import requests
import json

logger = structlog.get_logger(__name__)

_SYSTEM_EN = (
    "You are TAX Intelligence Bot, a helpful tax assistant. "
    "When provided with tax documents or IRS materials, analyze them carefully and provide accurate information. "
    "For EITC questions, use official IRS materials. For uploaded documents, analyze the specific content provided. "
    "If you are unsure, say so and suggest consulting a qualified tax professional. "
    "Always include a brief disclaimer: 'Informational only, not tax advice.'"
)
_SYSTEM_ES = (
    "Eres TAX Intelligence Bot, un asistente fiscal útil. "
    "Cuando se te proporcionen documentos fiscales o materiales del IRS, analízalos cuidadosamente y proporciona información precisa. "
    "Para preguntas sobre EITC, usa materiales oficiales del IRS. Para documentos cargados, analiza el contenido específico proporcionado. "
    "Si no estás seguro, dilo y sugiere consultar a un profesional de impuestos calificado. "
    "Incluye siempre el aviso: 'Solo con fines informativos, no es asesoramiento fiscal.'"
)

class LLM:
    _lock = threading.Lock()
    _pipe = None

    def __init__(self, settings: Settings):
        self.s = settings

    def _ensure_pipe(self):
        if LLM._pipe is None:
            with LLM._lock:
                if LLM._pipe is None:
                    try:
                        # Default: FLAN-T5 base (CPU friendly-ish). You can change MODEL_ID via env.
                        task = "text2text-generation"
                        device = 0 if self._is_gpu_available() else -1
                        
                        # Configure model_kwargs properly
                        model_kwargs = {}
                        if self._is_gpu_available():
                            try:
                                import torch
                                model_kwargs["torch_dtype"] = torch.float16
                            except ImportError:
                                logger.warning("torch_not_available", message="Could not import torch for dtype configuration")
                        
                        logger.info("loading_llm_model", model=self.s.model_id, device=device)
                        LLM._pipe = pipeline(
                            task, 
                            model=self.s.model_id,
                            device=device,
                            model_kwargs=model_kwargs
                        )
                        logger.info("llm_model_loaded", model=self.s.model_id)
                    except Exception as e:
                        logger.error("llm_load_failed", error=str(e), model=self.s.model_id)
                        raise RuntimeError(f"Failed to load LLM model {self.s.model_id}: {str(e)}") from e
        return LLM._pipe

    def _is_gpu_available(self) -> bool:
        """Check if GPU is available for PyTorch."""
        try:
            import torch
            return torch.cuda.is_available()
        except (ImportError, RuntimeError) as e:
            logger.debug("gpu_check_failed", error=str(e))
            return False

    def generate(self, question: str, context: str, lang: str = "en") -> str:
        """Generate an answer using the LLM.
        
        Args:
            question: User's question
            context: Retrieved context from knowledge base or uploaded documents
            lang: Language code ("en" or "es")
            
        Returns:
            Generated answer with disclaimer
        """
        # Route to appropriate provider
        if self.s.llm_provider == "openrouter":
            return self._generate_openrouter(question, context, lang)
        else:
            return self._generate_transformers(question, context, lang)
    
    def _generate_openrouter(self, question: str, context: str, lang: str = "en") -> str:
        """Generate answer using OpenRouter API."""
        try:
            if not self.s.openrouter_api_key:
                logger.error("openrouter_api_key_missing")
                return self._get_fallback_response(lang)
            
            system = _SYSTEM_EN if lang.startswith("en") else _SYSTEM_ES
            
            # Build prompt with context
            user_message = f"Question: {question}\n\nContext:\n{context}\n\nPlease provide a detailed answer based on the context above."
            
            # Call OpenRouter API
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.s.openrouter_api_key}",
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://github.com/yourusername/taxi",  # Optional
                    "X-Title": "TAX Intelligence Bot"  # Optional
                },
                json={
                    "model": self.s.openrouter_model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user_message}
                    ],
                    "max_tokens": 2000,
                    "temperature": 0.7
                },
                timeout=30
            )
            
            if response.status_code != 200:
                logger.error("openrouter_api_error", status=response.status_code, response=response.text)
                return self._get_fallback_response(lang)
            
            data = response.json()
            text = data["choices"][0]["message"]["content"].strip()
            
            # Ensure disclaimer exists
            if "Informational only" not in text and "Solo con fines informativos" not in text:
                if lang.startswith("en"):
                    text += "\n\n— Informational only, not tax advice."
                else:
                    text += "\n\n— Solo con fines informativos, no es asesoramiento fiscal."
            
            logger.info("answer_generated_openrouter", answer_length=len(text), model=self.s.openrouter_model)
            return text
            
        except Exception as e:
            logger.error("openrouter_generation_failed", error=str(e), question=question[:100])
            return self._get_fallback_response(lang)
    
    def _generate_transformers(self, question: str, context: str, lang: str = "en") -> str:
        """Generate answer using local transformers model."""
        try:
            pipe = self._ensure_pipe()

            system = _SYSTEM_EN if lang.startswith("en") else _SYSTEM_ES
            
            # Truncate context if too long (FLAN-T5 has 512 token limit)
            # Conservative limit to leave room for system prompt and question
            max_context_length = self._get_max_context_length()
            if len(context) > max_context_length:
                logger.debug("truncating_context", original_length=len(context), max_length=max_context_length)
                context = context[:max_context_length] + "..."
            
            # Create a language-aware prompt for FLAN-T5
            if lang.startswith("es"):
                # Spanish prompt - instruct to respond in Spanish
                prompt = f"Responde en español. Pregunta: {question}\n\nInformación: {context}\n\nRespuesta en español:"
            else:
                # English prompt
                prompt = f"Explain in detail: {question}\n\nBased on this information: {context}\n\nDetailed explanation:"

            logger.debug("generating_answer", question_length=len(question), context_length=len(context), prompt_length=len(prompt))
            # Generate with parameters optimized for detailed responses
            out = pipe(
                prompt, 
                max_length=512,
                min_length=50,
                num_beams=4,
                early_stopping=False,
                no_repeat_ngram_size=3,
                length_penalty=2.0,
                repetition_penalty=1.2
            )
            
            # Validate output format
            if not out or not isinstance(out, list) or len(out) == 0:
                logger.error("invalid_llm_output", output=out)
                return self._get_fallback_response(lang)
            
            if "generated_text" not in out[0]:
                logger.error("missing_generated_text", output_keys=list(out[0].keys()))
                return self._get_fallback_response(lang)
            
            text = out[0]["generated_text"].strip()
            
            # Ensure disclaimer exists (redundant but safe)
            if "Informational only" not in text and "Solo con fines informativos" not in text:
                if lang.startswith("en"):
                    text += "\n\n— Informational only, not tax advice."
                else:
                    text += "\n\n— Solo con fines informativos, no es asesoramiento fiscal."
            
            logger.info("answer_generated", answer_length=len(text))
            return text
            
        except Exception as e:
            logger.error("generation_failed", error=str(e), question=question[:100])
            return self._get_fallback_response(lang)
    
    def _get_max_context_length(self) -> int:
        """Get maximum context length based on model type."""
        # FLAN-T5 has 512 token limit, use conservative character estimate
        # Roughly 4 chars per token, leave more room for output
        return 600
    
    def _get_fallback_response(self, lang: str) -> str:
        """Fallback if LLM fails."""
        if lang.startswith("es"):
            return "Tengo problemas para responder en este momento. Inténtalo de nuevo o contacta con soporte. — Solo con fines informativos, no es asesoramiento fiscal."
        else:
            return "I'm having trouble answering right now. Please try again or contact support. — Informational only, not tax advice."
