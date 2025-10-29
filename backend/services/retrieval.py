import os
import json
import numpy as np
from typing import List, Dict
from sentence_transformers import SentenceTransformer
import faiss
import structlog
from config.settings import Settings

logger = structlog.get_logger(__name__)

class Retriever:
    def __init__(self, settings: Settings):
        self.s = settings
        self.model = SentenceTransformer(self.s.embed_model)
        self.idx = None
        self.meta = []
        self._load()

    def _load(self):
        """Load FAISS index and metadata, with fallback to sample document."""
        idx_path = self.s.index_path
        meta_path = idx_path.with_suffix('.json')
        
        try:
            if os.path.exists(idx_path) and os.path.exists(meta_path):
                logger.info("loading_faiss_index", index_path=str(idx_path))
                self.idx = faiss.read_index(str(idx_path))
                with open(meta_path, "r", encoding="utf-8") as f:
                    self.meta = json.load(f)
                logger.info("index_loaded", num_documents=len(self.meta))
            else:
                logger.warning("index_not_found", index_path=str(idx_path), message="Loading fallback document")
                # Fallback: load sample document as a pseudo-index
                sample = os.path.join(os.path.dirname(self.s.kb_dir), "knowledge_base", "documents", "eitc_overview.txt")
                if os.path.exists(sample):
                    with open(sample, "r", encoding="utf-8") as f:
                        txt = f.read()
                    self.meta = [{"content": txt, "source": "eitc_overview.txt"}]
                    emb = self.model.encode([txt], convert_to_numpy=True, normalize_embeddings=True)
                    self.idx = faiss.IndexFlatIP(emb.shape[1])
                    self.idx.add(emb)
                    logger.info("fallback_index_created", source="eitc_overview.txt")
                else:
                    logger.warning("no_knowledge_base", sample_path=sample)
        except Exception as e:
            logger.error("index_load_failed", error=str(e), index_path=str(idx_path))
            # Initialize empty state to avoid crashes
            self.idx = None
            self.meta = []

    def search(self, query: str, k: int = 3) -> List[Dict]:
        """Search for relevant documents using semantic similarity.
        
        Args:
            query: Search query
            k: Number of results to return
            
        Returns:
            List of documents with text and source
        """
        if self.idx is None or not self.meta:
            logger.warning("search_no_index", query=query[:100])
            return [{"text": "No knowledge base loaded. Please contact support.", "source": "N/A"}]
        
        try:
            q = self.model.encode([query], convert_to_numpy=True, normalize_embeddings=True)
            search_k = min(k, len(self.meta))
            D, I = self.idx.search(q, search_k)
            
            out = []
            for rank, i in enumerate(I[0]):
                if i < 0 or i >= len(self.meta):
                    logger.warning("invalid_index", index=int(i), meta_length=len(self.meta))
                    continue
                m = self.meta[i]
                # Get content with fallback, truncate to reasonable length
                content = m.get("content", m.get("text", ""))[:2000]
                source = m.get("source", "unknown")
                out.append({"text": content, "source": source})
            
            logger.debug("search_completed", query_length=len(query), results=len(out))
            return out if out else [{"text": "No relevant documents found.", "source": "N/A"}]
            
        except Exception as e:
            logger.error("search_failed", error=str(e), query=query[:100])
            return [{"text": "Search failed. Please try again.", "source": "N/A"}]
