from typing import Dict, Any
import structlog

logger = structlog.get_logger(__name__)

def get_questionnaire_schema() -> Dict[str, Any]:
    return {
        "version": "0.1.0",
        "language_support": ["en", "es"],
        "fields": [
            {"name": "tax_year", "type": "number", "required": True, "example": 2024},
            {"name": "filing_status", "type": "string", "required": True, "choices": ["single","married_filing_jointly","married_filing_separately","head_of_household","qualifying_widow(er)"]},
            {"name": "age", "type": "number", "required": True},
            {"name": "ssn_valid", "type": "boolean", "required": True},
            {"name": "is_us_resident", "type": "boolean", "required": True},
            {"name": "qualifying_children", "type": "number", "required": True, "min": 0, "max": 5},
            {"name": "earned_income", "type": "number", "required": True},
            {"name": "agi", "type": "number", "required": True},
            {"name": "investment_income", "type": "number", "required": False, "default": 0},
            {"name": "has_foreign_earned_income", "type": "boolean", "required": False, "default": False},
            {"name": "claimed_as_dependent", "type": "boolean", "required": False, "default": False},
        ]
    }

def assess_eligibility(answers: Dict[str, Any]) -> Dict[str, Any]:
    """Assess EITC eligibility based on provided answers.
    
    NOTE: This demo does **not** ship with official dollar thresholds.
    It performs structural checks and returns 'informational only' results.
    For production, update numeric thresholds for each tax year from IRS.
    
    Args:
        answers: Dictionary containing user responses
        
    Returns:
        Dictionary with eligibility assessment results
    """
    try:
        year = int(answers.get("tax_year", 2024))
        filing_status = answers.get("filing_status", "single")
        age = int(answers.get("age", 0))
        ssn_valid = bool(answers.get("ssn_valid", False))
        is_us_resident = bool(answers.get("is_us_resident", False))
        qc = max(0, int(answers.get("qualifying_children", 0)))
        earned_income = float(answers.get("earned_income", 0))
        agi = float(answers.get("agi", 0))
        investment_income = float(answers.get("investment_income", 0))
        has_foreign = bool(answers.get("has_foreign_earned_income", False))
        dependent = bool(answers.get("claimed_as_dependent", False))
    except (ValueError, TypeError) as e:
        logger.error("invalid_input_data", error=str(e), answers=answers)
        return {
            "eligible": False,
            "reasons": ["Invalid input data provided. Please check all fields."],
            "error": str(e),
            "disclaimer": "Informational only, not tax advice."
        }

    reasons = []
    eligible = True

    # Structural rules
    if filing_status == "married_filing_separately":
        eligible = False
        reasons.append("Married filing separately generally does not qualify for EITC.")
    if not ssn_valid:
        eligible = False
        reasons.append("Valid SSN requirement not met for taxpayer/spouse/children.")
    if dependent:
        eligible = False
        reasons.append("You cannot be claimed as a dependent by another taxpayer.")
    if has_foreign:
        eligible = False
        reasons.append("Foreign earned income exclusion generally disqualifies EITC.")
    if not is_us_resident:
        eligible = False
        reasons.append("Must be a U.S. citizen or resident alien for the year.")
    if qc == 0 and age < 25:
        eligible = False
        reasons.append("Without qualifying children, primary taxpayer must be at least age 25.")
    if qc == 0 and age >= 65:
        # IRS raised upper age limit in recent years; left permissive here, but call out to verify.
        reasons.append("Verify age rules for the selected year if no qualifying children.")

    # Income rules (placeholders; advisory only)
    # We do not compute amounts. We only signal that income/AGI caps must be checked.
    if investment_income > 0:
        reasons.append("Investment income limit applies and changes annually—verify for your tax year.")
    if agi < earned_income:
        reasons.append("AGI should usually be >= earned income; verify inputs.")

    result = {
        "tax_year": year,
        "eligible": eligible,
        "reasons": reasons,
        "estimated_credit": None,  # not computed in demo
        "notes": [
            "This is an informational screening only. Dollar limits and credit amounts change each year.",
            "Load current IRS materials into the knowledge base and confirm numeric thresholds before relying on results."
        ],
        "disclaimer": "Informational only, not tax advice."
    }
    
    logger.info("eligibility_assessed", year=year, eligible=eligible, num_reasons=len(reasons))
    return result
