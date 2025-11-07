# Copyright 2025
# Apache-2.0
"""
Tax Notice Analysis Routes
Handles upload and analysis of tax notices (PDF/images).
"""
from flask import Blueprint, request, jsonify
import structlog

from config.settings import Settings
from services.tax_notice_analyzer import TaxNoticeAnalyzer

logger = structlog.get_logger(__name__)
tax_notice_bp = Blueprint("tax_notice", __name__)

SETTINGS = Settings()
analyzer = TaxNoticeAnalyzer(SETTINGS)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'tiff', 'bmp', 'gif'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@tax_notice_bp.route("/analyze", methods=["POST"])
def analyze_notice():
    """
    Analyze a tax notice from uploaded file.
    
    Expected form data:
    - file: PDF or image file
    - lang: Language code (optional, default: "en")
    
    Returns:
        JSON with extracted details, summary, and next steps
    """
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file provided. Please upload a PDF or image file."
            }), 400
        
        file = request.files['file']
        
        # Check if file has a filename
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected."
            }), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({
                "success": False,
                "error": f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400
        
        # Read file data
        file_data = file.read()
        
        # Check file size
        if len(file_data) > MAX_FILE_SIZE:
            return jsonify({
                "success": False,
                "error": f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
            }), 400
        
        # Get language from form data
        lang = request.form.get('lang', 'en')
        if lang not in ['en', 'es']:
            lang = 'en'
        
        logger.info(
            "analyzing_tax_notice",
            filename=file.filename,
            size=len(file_data),
            lang=lang
        )
        
        # Analyze the notice
        result = analyzer.analyze_notice(file_data, file.filename, lang)
        
        if result.get("success"):
            logger.info("notice_analyzed_successfully", filename=file.filename)
            return jsonify(result), 200
        else:
            logger.warning("notice_analysis_failed", filename=file.filename, error=result.get("error"))
            return jsonify(result), 400
        
    except Exception as e:
        logger.error("analyze_notice_error", error=str(e))
        return jsonify({
            "success": False,
            "error": f"An error occurred while processing your file: {str(e)}"
        }), 500


@tax_notice_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "tax_notice_analyzer",
        "allowed_extensions": list(ALLOWED_EXTENSIONS),
        "max_file_size_mb": MAX_FILE_SIZE // (1024*1024)
    }), 200
