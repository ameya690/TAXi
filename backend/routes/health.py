from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)

@health_bp.get("/")
def index():
    """API index with available endpoints."""
    return jsonify(
        service="TAX Intelligence Bot - Intelligent Tax Assistance",
        version="0.1.0",
        description="EITC (Earned Income Tax Credit) assistance API",
        endpoints={
            "health": {
                "method": "GET",
                "url": "/health",
                "description": "Health check endpoint"
            },
            "ask": {
                "method": "POST",
                "url": "/api/ask",
                "description": "Ask questions about EITC",
                "body": {
                    "question": "string (required)",
                    "lang": "string (optional, default: 'en', options: 'en', 'es')"
                }
            },
            "eligibility_schema": {
                "method": "GET",
                "url": "/api/eligibility/schema",
                "description": "Get eligibility questionnaire schema"
            },
            "eligibility_assess": {
                "method": "POST",
                "url": "/api/eligibility/assess",
                "description": "Assess EITC eligibility based on provided information"
            },
            "metrics": {
                "method": "GET",
                "url": "/metrics",
                "description": "Prometheus metrics (if enabled)"
            }
        },
        disclaimer="Informational only, not tax advice."
    )

@health_bp.get("/health")
def health():
    return jsonify(status="ok", service="TAX Intelligence Bot", version="0.1.0")
