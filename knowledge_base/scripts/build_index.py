#!/usr/bin/env python3
"""
Knowledge Base Index Builder for TAXI (Tax Intelligence EITC Assistant)

This script processes IRS documents and creates a FAISS vector index for retrieval.
Supports PDF, DOCX, and TXT files.

Usage:
    python build_index.py [--rebuild] [--docs-dir DOCS_DIR] [--index-path INDEX_PATH]

Environment Variables:
    EMBED_MODEL: sentence transformer model (default: sentence-transformers/all-MiniLM-L6-v2)
    KB_DIR: knowledge base directory (default: ../knowledge_base)
"""

import os
import sys
import json
import argparse
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import PyPDF2
import docx

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DocumentProcessor:
    """Processes different document types and extracts text content."""

    def __init__(self):
        self.supported_extensions = {'.pdf', '.docx', '.txt'}

    def process_file(self, file_path: Path) -> Optional[Dict[str, Any]]:
        """Process a single file and return document data."""
        if file_path.suffix.lower() not in self.supported_extensions:
            logger.warning(f"Unsupported file type: {file_path}")
            return None

        try:
            if file_path.suffix.lower() == '.pdf':
                return self._process_pdf(file_path)
            elif file_path.suffix.lower() == '.docx':
                return self._process_docx(file_path)
            elif file_path.suffix.lower() == '.txt':
                return self._process_txt(file_path)
        except Exception as e:
            logger.error(f"Error processing {file_path}: {e}")
            return None

    def _process_pdf(self, file_path: Path) -> Dict[str, Any]:
        """Process PDF file."""
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"

        return {
            'id': file_path.stem,
            'title': file_path.stem.replace('_', ' ').title(),
            'content': text.strip(),
            'source': str(file_path),
            'type': 'pdf'
        }

    def _process_docx(self, file_path: Path) -> Dict[str, Any]:
        """Process DOCX file."""
        doc = docx.Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"

        return {
            'id': file_path.stem,
            'title': file_path.stem.replace('_', ' ').title(),
            'content': text.strip(),
            'source': str(file_path),
            'type': 'docx'
        }

    def _process_txt(self, file_path: Path) -> Dict[str, Any]:
        """Process TXT file."""
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()

        return {
            'id': file_path.stem,
            'title': file_path.stem.replace('_', ' ').title(),
            'content': text.strip(),
            'source': str(file_path),
            'type': 'txt'
        }

class IndexBuilder:
    """Builds FAISS index from processed documents."""

    def __init__(self, embed_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.embed_model = SentenceTransformer(embed_model_name)
        logger.info(f"Loaded embedding model: {embed_model_name}")

    def build_index(self, documents: List[Dict[str, Any]], index_path: Path) -> None:
        """Build and save FAISS index from documents."""
        if not documents:
            logger.warning("No documents to index")
            return

        logger.info(f"Building index for {len(documents)} documents")

        # Generate embeddings
        texts = [doc['content'] for doc in documents]
        embeddings = self.embed_model.encode(texts, show_progress_bar=True)

        # Normalize embeddings for cosine similarity
        embeddings = np.array(embeddings)
        faiss.normalize_L2(embeddings)

        # Create FAISS index
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity

        # Add vectors to index
        index.add(embeddings)

        # Save index and metadata
        index_path.parent.mkdir(parents=True, exist_ok=True)
        faiss.write_index(index, str(index_path))

        # Save document metadata
        metadata_path = index_path.with_suffix('.json')
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(documents, f, indent=2, ensure_ascii=False)

        logger.info(f"Saved index to {index_path}")
        logger.info(f"Saved metadata to {metadata_path}")

def main():
    parser = argparse.ArgumentParser(description="Build knowledge base index")
    parser.add_argument('--rebuild', action='store_true', help='Rebuild index even if it exists')
    parser.add_argument('--docs-dir', type=Path, help='Documents directory')
    parser.add_argument('--index-path', type=Path, help='Output index path')
    parser.add_argument('--embed-model', type=str, default='sentence-transformers/all-MiniLM-L6-v2',
                       help='Embedding model name')

    args = parser.parse_args()

    # Get paths from environment or use defaults
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent

    kb_dir = project_root / os.getenv('KB_DIR', 'knowledge_base')
    docs_dir = kb_dir / 'documents'
    index_path = project_root / os.getenv('INDEX_PATH', 'knowledge_base/embeddings/eitc.faiss')

    # Check if index already exists
    if index_path.exists() and not args.rebuild:
        logger.info(f"Index already exists at {index_path}. Use --rebuild to recreate.")
        return

    # Find all documents
    if not docs_dir.exists():
        logger.error(f"Documents directory not found: {docs_dir}")
        sys.exit(1)

    document_files = []
    for ext in ['*.pdf', '*.docx', '*.txt']:
        document_files.extend(docs_dir.glob(ext))

    if not document_files:
        logger.warning(f"No documents found in {docs_dir}")
        logger.info("Please add IRS documents (PDF, DOCX, or TXT files) to the documents directory")
        return

    logger.info(f"Found {len(document_files)} documents to process")

    # Process documents
    processor = DocumentProcessor()
    documents = []

    for file_path in document_files:
        doc_data = processor.process_file(file_path)
        if doc_data:
            documents.append(doc_data)

    if not documents:
        logger.error("No documents could be processed")
        sys.exit(1)

    # Build index
    builder = IndexBuilder(args.embed_model)
    builder.build_index(documents, index_path)

    logger.info("Index building complete!")

if __name__ == "__main__":
    main()