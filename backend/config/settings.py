from pydantic import BaseModel
import os
from pathlib import Path

class Settings(BaseModel):
    env: str = os.getenv("FLASK_ENV", "development")
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "5000"))
    cors_origins: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")

    # LLM
    llm_provider: str = os.getenv("LLM_PROVIDER", "transformers")
    model_id: str = os.getenv("MODEL_ID", "google/flan-t5-base")
    max_new_tokens: int = int(os.getenv("MAX_NEW_TOKENS", "256"))

    # Retrieval
    embed_model: str = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    kb_dir: str = os.getenv("KB_DIR", "../knowledge_base")
    index_path: Path = Path(os.getenv("INDEX_PATH", "../knowledge_base/embeddings/eitc.faiss"))

    # Logging / Metrics
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    enable_metrics: bool = os.getenv("ENABLE_METRICS", "true").lower() == "true"
