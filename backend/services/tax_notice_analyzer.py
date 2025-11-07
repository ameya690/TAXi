# Copyright 2025
# Apache-2.0
"""
Tax Notice Analyzer Service
Extracts and analyzes tax notices from PDFs and images using OCR and LLM.
"""
import io
import re
import base64
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import structlog

try:
    from PIL import Image
    import pytesseract
    from pdf2image import convert_from_bytes
    from PyPDF2 import PdfReader
except ImportError as e:
    raise ImportError(
        "Missing required packages for tax notice analysis. "
        "Install with: pip install pytesseract pdf2image Pillow PyPDF2"
    ) from e

from services.llm import LLM
from config.settings import Settings

logger = structlog.get_logger(__name__)


class TaxNoticeAnalyzer:
    """Analyzes tax notices from IRS/state agencies."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.llm = LLM(settings)
        
    def analyze_notice(self, file_data: bytes, filename: str, lang: str = "en") -> Dict:
        """
        Analyze a tax notice from PDF or image.
        
        Args:
            file_data: Raw file bytes
            filename: Original filename
            lang: Language code ("en" or "es")
            
        Returns:
            Dictionary with extracted data, summary, and next steps
        """
        try:
            # Extract text from file
            extracted_text, file_type = self._extract_text(file_data, filename)
            
            if not extracted_text or len(extracted_text.strip()) < 50:
                return self._error_response(
                    "Could not extract sufficient text from the document. Please ensure the image is clear or the PDF is readable.",
                    lang
                )
            
            logger.info("text_extracted", length=len(extracted_text), file_type=file_type)
            
            # Extract key details using pattern matching
            key_details = self._extract_key_details(extracted_text)
            
            # Generate AI summary and next steps
            summary = self._generate_summary(extracted_text, key_details, lang)
            next_steps = self._generate_next_steps(extracted_text, key_details, lang)
            
            # Find referenced sections
            referenced_sections = self._find_referenced_sections(extracted_text, summary)
            
            return {
                "success": True,
                "file_type": file_type,
                "extracted_text": extracted_text[:2000],  # Limit for response size
                "key_details": key_details,
                "summary": summary,
                "next_steps": next_steps,
                "referenced_sections": referenced_sections,
                "processed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error("notice_analysis_failed", error=str(e), filename=filename)
            return self._error_response(str(e), lang)
    
    def _extract_text(self, file_data: bytes, filename: str) -> Tuple[str, str]:
        """Extract text from PDF or image file."""
        filename_lower = filename.lower()
        
        # Try PDF extraction first
        if filename_lower.endswith('.pdf'):
            try:
                text = self._extract_from_pdf(file_data)
                if text and len(text.strip()) > 50:
                    return text, "pdf"
                # If PDF text extraction failed, try OCR on PDF pages
                logger.info("pdf_text_extraction_insufficient", msg="Falling back to OCR")
                text = self._extract_from_pdf_ocr(file_data)
                return text, "pdf_ocr"
            except Exception as e:
                logger.warning("pdf_extraction_failed", error=str(e))
                # Try OCR as fallback
                text = self._extract_from_pdf_ocr(file_data)
                return text, "pdf_ocr"
        
        # Image file - use OCR
        elif any(filename_lower.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif']):
            text = self._extract_from_image(file_data)
            return text, "image"
        
        else:
            raise ValueError(f"Unsupported file type: {filename}. Please upload PDF or image files.")
    
    def _extract_from_pdf(self, file_data: bytes) -> str:
        """Extract text directly from PDF."""
        try:
            pdf_file = io.BytesIO(file_data)
            reader = PdfReader(pdf_file)
            
            text_parts = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    text_parts.append(text)
            
            return "\n\n".join(text_parts)
        except Exception as e:
            logger.error("pdf_text_extraction_error", error=str(e))
            raise
    
    def _extract_from_pdf_ocr(self, file_data: bytes) -> str:
        """Extract text from PDF using OCR (for scanned PDFs)."""
        try:
            # Convert PDF pages to images
            images = convert_from_bytes(file_data, dpi=300)
            
            text_parts = []
            for i, image in enumerate(images):
                logger.debug("ocr_processing_page", page=i+1)
                text = pytesseract.image_to_string(image, lang='eng')
                if text:
                    text_parts.append(text)
            
            return "\n\n".join(text_parts)
        except Exception as e:
            logger.error("pdf_ocr_error", error=str(e))
            raise
    
    def _extract_from_image(self, file_data: bytes) -> str:
        """Extract text from image using OCR."""
        try:
            image = Image.open(io.BytesIO(file_data))
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            text = pytesseract.image_to_string(image, lang='eng')
            return text
        except Exception as e:
            logger.error("image_ocr_error", error=str(e))
            raise
    
    def _extract_key_details(self, text: str) -> Dict:
        """Extract key details from notice text using pattern matching."""
        details = {
            "notice_number": None,
            "tax_year": None,
            "issue_date": None,
            "response_deadline": None,
            "amount_owed": None,
            "notice_type": None,
            "taxpayer_id": None
        }
        
        # Extract notice number (CP-XXX, LTR-XXXX, etc.)
        notice_patterns = [
            r'(?:Notice|CP|LTR)[\s-]?(\d{3,4}[A-Z]?)',
            r'Letter\s+(\d{3,4}[A-Z]?)',
        ]
        for pattern in notice_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                details["notice_number"] = match.group(1)
                break
        
        # Extract tax year
        year_patterns = [
            r'(?:tax year|year ending|for\s+(?:the\s+)?year)\s*:?\s*(\d{4})',
            r'(?:20\d{2})\s+(?:tax|return)',
        ]
        for pattern in year_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                details["tax_year"] = match.group(1)
                break
        
        # Extract dates
        date_patterns = [
            r'(?:dated?|issue\s+date)\s*:?\s*([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})',
            r'(\d{1,2}/\d{1,2}/\d{4})',
            r'([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})',
        ]
        dates_found = []
        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            dates_found.extend(matches)
        
        if dates_found:
            details["issue_date"] = dates_found[0]
        
        # Extract deadline
        deadline_patterns = [
            r'(?:respond by|deadline|due date|by)\s*:?\s*([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})',
            r'(?:within|by)\s+(\d+)\s+days',
        ]
        for pattern in deadline_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                details["response_deadline"] = match.group(1)
                break
        
        # Extract amounts
        amount_patterns = [
            r'\$\s*([\d,]+\.?\d{0,2})',
            r'(?:amount|balance|owe[ds]?)\s*:?\s*\$\s*([\d,]+\.?\d{0,2})',
        ]
        amounts_found = []
        for pattern in amount_patterns:
            matches = re.findall(pattern, text)
            amounts_found.extend(matches)
        
        if amounts_found:
            # Take the largest amount as likely the main amount
            amounts_numeric = [float(a.replace(',', '')) for a in amounts_found]
            max_amount = max(amounts_numeric)
            details["amount_owed"] = f"${max_amount:,.2f}"
        
        # Detect notice type
        if re.search(r'audit|examination|review', text, re.IGNORECASE):
            details["notice_type"] = "Audit/Examination"
        elif re.search(r'balance due|amount owed|payment', text, re.IGNORECASE):
            details["notice_type"] = "Balance Due"
        elif re.search(r'refund|overpayment', text, re.IGNORECASE):
            details["notice_type"] = "Refund/Credit"
        elif re.search(r'penalty|interest|late', text, re.IGNORECASE):
            details["notice_type"] = "Penalty/Interest"
        elif re.search(r'missing|incomplete|additional information', text, re.IGNORECASE):
            details["notice_type"] = "Information Request"
        
        # Extract SSN/EIN (last 4 digits only for privacy)
        ssn_pattern = r'(?:SSN|Social Security|Tax ID).*?(\d{3}[-\s]?\d{2}[-\s]?\d{4})'
        match = re.search(ssn_pattern, text, re.IGNORECASE)
        if match:
            full_ssn = match.group(1)
            details["taxpayer_id"] = "***-**-" + full_ssn[-4:]
        
        return details
    
    def _generate_summary(self, text: str, key_details: Dict, lang: str) -> str:
        """Generate a plain-language summary using LLM."""
        try:
            # Create context for LLM
            context = f"Tax Notice Content:\n{text[:1500]}\n\n"
            context += "Extracted Details:\n"
            for key, value in key_details.items():
                if value:
                    context += f"- {key.replace('_', ' ').title()}: {value}\n"
            
            if lang == "es":
                question = (
                    "Resume este aviso de impuestos en términos simples y claros. "
                    "Explica qué está pidiendo el IRS, por qué, y qué significa para el contribuyente. "
                    "Usa lenguaje sencillo que cualquier persona pueda entender."
                )
            else:
                question = (
                    "Summarize this tax notice in simple, clear terms. "
                    "Explain what the IRS is asking for, why, and what it means for the taxpayer. "
                    "Use plain language that anyone can understand."
                )
            
            summary = self.llm.generate(question, context, lang)
            return summary
            
        except Exception as e:
            logger.error("summary_generation_failed", error=str(e))
            if lang == "es":
                return "No se pudo generar un resumen automático. Revise los detalles extraídos arriba."
            return "Could not generate automatic summary. Please review the extracted details above."
    
    def _generate_next_steps(self, text: str, key_details: Dict, lang: str) -> List[str]:
        """Generate actionable next steps."""
        steps = []
        
        if lang == "es":
            # Spanish steps
            if key_details.get("response_deadline"):
                steps.append(f"📅 Responder antes de: {key_details['response_deadline']}")
            else:
                steps.append("📅 Verificar la fecha límite de respuesta en el aviso")
            
            if key_details.get("amount_owed"):
                steps.append(f"💰 Revisar el monto: {key_details['amount_owed']}")
                steps.append("💳 Considerar opciones de pago o planes de pago")
            
            if "audit" in text.lower() or "examination" in text.lower():
                steps.append("📋 Reunir documentos de respaldo (recibos, formularios W-2, 1099, etc.)")
                steps.append("👤 Considerar consultar con un profesional de impuestos o CPA")
            
            steps.append("📞 Contactar al IRS al número en el aviso si tiene preguntas")
            steps.append("📄 Guardar una copia de este aviso para sus registros")
            steps.append("✉️ Responder por escrito si es necesario, con copia certificada")
            
        else:
            # English steps
            if key_details.get("response_deadline"):
                steps.append(f"📅 Respond by: {key_details['response_deadline']}")
            else:
                steps.append("📅 Check the notice for response deadline")
            
            if key_details.get("amount_owed"):
                steps.append(f"💰 Review the amount: {key_details['amount_owed']}")
                steps.append("💳 Consider payment options or payment plans")
            
            if "audit" in text.lower() or "examination" in text.lower():
                steps.append("📋 Gather supporting documents (receipts, W-2s, 1099s, etc.)")
                steps.append("👤 Consider consulting with a tax professional or CPA")
            
            steps.append("📞 Contact the IRS at the number on the notice if you have questions")
            steps.append("📄 Keep a copy of this notice for your records")
            steps.append("✉️ Respond in writing if required, using certified mail")
        
        return steps
    
    def _find_referenced_sections(self, text: str, summary: str) -> List[Dict]:
        """Find sections of the notice that were referenced in the summary."""
        referenced = []
        
        # Split text into paragraphs
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        
        # Look for key phrases in summary and find matching paragraphs
        key_phrases = [
            "notice", "amount", "deadline", "respond", "payment",
            "audit", "examination", "penalty", "interest", "refund"
        ]
        
        for i, para in enumerate(paragraphs[:10]):  # Limit to first 10 paragraphs
            # Check if paragraph contains important information
            if len(para) > 50 and any(phrase in para.lower() for phrase in key_phrases):
                referenced.append({
                    "section": i + 1,
                    "text": para[:200] + ("..." if len(para) > 200 else ""),
                    "relevance": "high" if any(phrase in para.lower() for phrase in ["amount", "deadline", "respond"]) else "medium"
                })
        
        return referenced[:5]  # Return top 5 most relevant sections
    
    def _error_response(self, message: str, lang: str) -> Dict:
        """Generate error response."""
        return {
            "success": False,
            "error": message,
            "key_details": {},
            "summary": "",
            "next_steps": [],
            "referenced_sections": []
        }
