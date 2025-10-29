from flask import Blueprint, request, jsonify
import structlog
from services.eligibility_rules_advanced import get_questionnaire_schema, assess_eligibility

logger = structlog.get_logger(__name__)

eligibility_bp = Blueprint("eligibility", __name__)

@eligibility_bp.get("/schema")
def schema():
    """Get the eligibility questionnaire schema."""
    try:
        logger.debug("schema_request")
        return jsonify(get_questionnaire_schema())
    except Exception as e:
        logger.error("schema_failed", error=str(e))
        return jsonify(error="Failed to retrieve schema"), 500

@eligibility_bp.post("/assess")
def assess():
    """Assess EITC eligibility based on user inputs."""
    try:
        data = request.get_json(force=True, silent=True) or {}
        logger.info("assess_request", num_fields=len(data))
        
        if not data:
            logger.warning("assess_empty_data")
            return jsonify(error="Missing assessment data"), 400
        
        result = assess_eligibility(data)
        logger.info("assess_completed", eligible=result.get("eligible"))
        return jsonify(result)
        
    except Exception as e:
        logger.error("assess_failed", error=str(e))
        return jsonify(error="Failed to assess eligibility"), 500
