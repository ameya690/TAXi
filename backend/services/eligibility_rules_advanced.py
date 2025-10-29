"""
Advanced EITC Eligibility Calculator
The most comprehensive EITC eligibility checker with real IRS 2024 data
"""
from typing import Dict, Any, List, Tuple
import structlog

logger = structlog.get_logger(__name__)

# 2024 Official IRS Income Limits and Credit Amounts
EITC_2024_LIMITS = {
    "single": {
        0: {"max_income": 18591, "max_credit": 632, "phase_out_start": 9800},
        1: {"max_income": 49084, "max_credit": 4213, "phase_out_start": 21560},
        2: {"max_income": 55768, "max_credit": 6960, "phase_out_start": 21560},
        3: {"max_income": 59899, "max_credit": 7830, "phase_out_start": 21560},
    },
    "married": {
        0: {"max_income": 24210, "max_credit": 632, "phase_out_start": 16370},
        1: {"max_income": 55768, "max_credit": 4213, "phase_out_start": 28120},
        2: {"max_income": 62449, "max_credit": 6960, "phase_out_start": 28120},
        3: {"max_income": 66819, "max_credit": 7830, "phase_out_start": 28120},
    }
}

# Credit percentages for calculation
CREDIT_PERCENTAGES = {
    0: {"earn_rate": 0.0765, "phase_out_rate": 0.0765},
    1: {"earn_rate": 0.34, "phase_out_rate": 0.1598},
    2: {"earn_rate": 0.40, "phase_out_rate": 0.2106},
    3: {"earn_rate": 0.45, "phase_out_rate": 0.2106},
}

INVESTMENT_INCOME_LIMIT = 11000

def get_comprehensive_schema() -> Dict[str, Any]:
    """Enhanced schema with all fields needed for comprehensive assessment."""
    return {
        "version": "2.0.0",
        "language_support": ["en", "es"],
        "fields": [
            {
                "name": "tax_year",
                "type": "number",
                "required": True,
                "default": 2024,
                "label": "Tax Year",
                "help": "The tax year you're filing for"
            },
            {
                "name": "filing_status",
                "type": "string",
                "required": True,
                "choices": [
                    {"value": "single", "label": "Single"},
                    {"value": "married_filing_jointly", "label": "Married Filing Jointly"},
                    {"value": "married_filing_separately", "label": "Married Filing Separately"},
                    {"value": "head_of_household", "label": "Head of Household"},
                    {"value": "qualifying_widow", "label": "Qualifying Surviving Spouse"}
                ],
                "label": "Filing Status",
                "help": "Your tax filing status"
            },
            {
                "name": "age",
                "type": "number",
                "required": True,
                "min": 0,
                "max": 120,
                "label": "Your Age",
                "help": "Your age on December 31 of the tax year"
            },
            {
                "name": "spouse_age",
                "type": "number",
                "required": False,
                "min": 0,
                "max": 120,
                "label": "Spouse's Age",
                "help": "Your spouse's age (if married filing jointly)"
            },
            {
                "name": "ssn_valid",
                "type": "boolean",
                "required": True,
                "label": "Valid SSN",
                "help": "Do you have a valid Social Security Number for employment?"
            },
            {
                "name": "spouse_ssn_valid",
                "type": "boolean",
                "required": False,
                "label": "Spouse Valid SSN",
                "help": "Does your spouse have a valid SSN? (if married)"
            },
            {
                "name": "is_us_resident",
                "type": "boolean",
                "required": True,
                "label": "U.S. Resident",
                "help": "Are you a U.S. citizen or resident alien all year?"
            },
            {
                "name": "qualifying_children",
                "type": "number",
                "required": True,
                "min": 0,
                "max": 10,
                "default": 0,
                "label": "Number of Qualifying Children",
                "help": "Children who meet all 4 EITC tests"
            },
            {
                "name": "earned_income",
                "type": "number",
                "required": True,
                "min": 0,
                "label": "Earned Income ($)",
                "help": "Wages, salaries, tips, net self-employment income"
            },
            {
                "name": "agi",
                "type": "number",
                "required": True,
                "min": 0,
                "label": "Adjusted Gross Income - AGI ($)",
                "help": "Your AGI from your tax return"
            },
            {
                "name": "investment_income",
                "type": "number",
                "required": False,
                "default": 0,
                "min": 0,
                "label": "Investment Income ($)",
                "help": "Interest, dividends, capital gains, rental income"
            },
            {
                "name": "has_foreign_earned_income",
                "type": "boolean",
                "required": False,
                "default": False,
                "label": "Claiming Foreign Earned Income Exclusion",
                "help": "Are you filing Form 2555?"
            },
            {
                "name": "claimed_as_dependent",
                "type": "boolean",
                "required": False,
                "default": False,
                "label": "Claimed as Someone's Dependent",
                "help": "Can someone else claim you as a dependent?"
            },
            {
                "name": "lived_in_us_over_half_year",
                "type": "boolean",
                "required": False,
                "default": True,
                "label": "Lived in U.S. Over Half Year",
                "help": "Required if claiming without children"
            },
            {
                "name": "is_self_employed",
                "type": "boolean",
                "required": False,
                "default": False,
                "label": "Self-Employed",
                "help": "Do you have self-employment income?"
            },
            {
                "name": "self_employment_tax",
                "type": "number",
                "required": False,
                "default": 0,
                "min": 0,
                "label": "Self-Employment Tax ($)",
                "help": "Your self-employment tax amount (if applicable)"
            }
        ]
    }

def calculate_credit_amount(earned_income: float, agi: float, num_children: int, filing_status: str) -> Tuple[float, Dict[str, Any]]:
    """Calculate the exact EITC amount using IRS formulas."""
    
    # Cap children at 3+ for credit purposes
    children_key = min(num_children, 3)
    
    # Determine if single or married limits apply
    status_key = "married" if filing_status == "married_filing_jointly" else "single"
    
    # Get limits for this situation
    limits = EITC_2024_LIMITS[status_key][children_key]
    percentages = CREDIT_PERCENTAGES[children_key]
    
    # Use the lesser of earned income or AGI
    income_for_credit = min(earned_income, agi)
    
    calculation_details = {
        "income_used": income_for_credit,
        "max_credit": limits["max_credit"],
        "income_limit": limits["max_income"],
        "phase_out_starts": limits["phase_out_start"],
        "earn_phase": False,
        "plateau_phase": False,
        "phase_out": False
    }
    
    # Check if over income limit
    if income_for_credit > limits["max_income"]:
        calculation_details["phase_out"] = True
        calculation_details["over_limit"] = True
        return 0, calculation_details
    
    # Calculate credit based on phase
    max_credit = limits["max_credit"]
    phase_out_start = limits["phase_out_start"]
    
    # Earning phase: income below phase-out start
    if income_for_credit <= phase_out_start:
        credit = income_for_credit * percentages["earn_rate"]
        if credit > max_credit:
            calculation_details["plateau_phase"] = True
            return max_credit, calculation_details
        else:
            calculation_details["earn_phase"] = True
            return round(credit, 2), calculation_details
    
    # Phase-out: income between phase-out start and limit
    else:
        excess_income = income_for_credit - phase_out_start
        phase_out_amount = excess_income * percentages["phase_out_rate"]
        credit = max(0, max_credit - phase_out_amount)
        calculation_details["phase_out"] = True
        calculation_details["phase_out_amount"] = round(phase_out_amount, 2)
        return round(credit, 2), calculation_details

def assess_comprehensive_eligibility(answers: Dict[str, Any]) -> Dict[str, Any]:
    """
    The most comprehensive EITC eligibility assessment.
    Checks all IRS rules and calculates exact credit amounts.
    """
    try:
        # Extract all fields with defaults
        year = int(answers.get("tax_year", 2024))
        filing_status = answers.get("filing_status", "single")
        age = int(answers.get("age", 0))
        spouse_age = int(answers.get("spouse_age", 0)) if answers.get("spouse_age") else None
        ssn_valid = bool(answers.get("ssn_valid", False))
        spouse_ssn_valid = bool(answers.get("spouse_ssn_valid", True))
        is_us_resident = bool(answers.get("is_us_resident", False))
        qc = max(0, int(answers.get("qualifying_children", 0)))
        earned_income = float(answers.get("earned_income", 0))
        agi = float(answers.get("agi", 0))
        investment_income = float(answers.get("investment_income", 0))
        has_foreign = bool(answers.get("has_foreign_earned_income", False))
        dependent = bool(answers.get("claimed_as_dependent", False))
        lived_in_us = bool(answers.get("lived_in_us_over_half_year", True))
        is_self_employed = bool(answers.get("is_self_employed", False))
        self_employment_tax = float(answers.get("self_employment_tax", 0))
        
    except (ValueError, TypeError) as e:
        logger.error("invalid_input_data", error=str(e))
        return {
            "eligible": False,
            "confidence": "high",
            "reasons": ["❌ Invalid input data. Please check all fields and try again."],
            "estimated_credit": 0,
            "error": str(e),
            "disclaimer": "Informational only, not tax advice."
        }
    
    reasons = []
    warnings = []
    eligible = True
    confidence = "high"
    
    # CRITICAL ELIGIBILITY CHECKS
    
    # 1. Filing Status Check
    if filing_status == "married_filing_separately":
        eligible = False
        reasons.append("❌ MARRIED FILING SEPARATELY status: You cannot claim EITC with this status (except in very rare circumstances).")
    
    # 2. SSN Validation
    if not ssn_valid:
        eligible = False
        reasons.append("❌ INVALID SSN: You must have a valid Social Security Number for employment.")
    
    if filing_status == "married_filing_jointly" and not spouse_ssn_valid:
        eligible = False
        reasons.append("❌ SPOUSE SSN: Your spouse must have a valid SSN for EITC.")
    
    # 3. U.S. Residency
    if not is_us_resident:
        eligible = False
        reasons.append("❌ NON-RESIDENT: You must be a U.S. citizen or resident alien for the entire year.")
    
    # 4. Foreign Earned Income
    if has_foreign:
        eligible = False
        reasons.append("❌ FOREIGN INCOME EXCLUSION: Filing Form 2555 disqualifies you from EITC.")
    
    # 5. Dependent Status
    if dependent:
        eligible = False
        reasons.append("❌ CLAIMED AS DEPENDENT: You cannot claim EITC if someone else can claim you as a dependent.")
    
    # 6. Investment Income Limit
    if investment_income > INVESTMENT_INCOME_LIMIT:
        eligible = False
        reasons.append(f"❌ INVESTMENT INCOME TOO HIGH: ${investment_income:,.2f} exceeds the ${INVESTMENT_INCOME_LIMIT:,.2f} limit for 2024.")
    
    # 7. Age Requirements (for workers without children)
    if qc == 0:
        if age < 25:
            eligible = False
            reasons.append(f"❌ AGE TOO LOW: Without qualifying children, you must be at least age 25 (you are {age}).")
        if age >= 65:
            eligible = False
            reasons.append(f"❌ AGE TOO HIGH: Without qualifying children, you must be under age 65 (you are {age}).")
        if not lived_in_us:
            eligible = False
            reasons.append("❌ RESIDENCY: Without qualifying children, you must live in the U.S. for more than half the year.")
        
        # For married filing jointly without children, at least one spouse must meet age
        if filing_status == "married_filing_jointly" and spouse_age:
            if age < 25 and spouse_age < 25:
                eligible = False
                reasons.append(f"❌ BOTH SPOUSES TOO YOUNG: At least one spouse must be age 25-64 (ages: {age}, {spouse_age}).")
            if age >= 65 and spouse_age >= 65:
                eligible = False
                reasons.append(f"❌ BOTH SPOUSES TOO OLD: At least one spouse must be age 25-64 (ages: {age}, {spouse_age}).")
    
    # 8. Earned Income Requirement
    if earned_income <= 0:
        eligible = False
        reasons.append("❌ NO EARNED INCOME: You must have earned income from work (wages, salary, or self-employment).")
    
    # 9. Self-Employment Adjustment
    adjusted_earned_income = earned_income
    if is_self_employed and self_employment_tax > 0:
        adjusted_earned_income = earned_income - (self_employment_tax / 2)
        warnings.append(f"ℹ️ Self-Employment Adjustment: Earned income adjusted by ${self_employment_tax/2:,.2f} (half of SE tax).")
    
    # 10. Income Limits Check
    status_key = "married" if filing_status == "married_filing_jointly" else "single"
    children_key = min(qc, 3)
    income_limit = EITC_2024_LIMITS[status_key][children_key]["max_income"]
    
    income_for_check = max(adjusted_earned_income, agi)
    
    if income_for_check > income_limit:
        eligible = False
        reasons.append(f"❌ INCOME TOO HIGH: ${income_for_check:,.2f} exceeds the ${income_limit:,.2f} limit for {qc} children ({filing_status}).")
    
    # 11. AGI vs Earned Income Sanity Check
    if agi < earned_income - 10000:  # Allow some deviation for deductions
        warnings.append(f"⚠️ UNUSUAL: AGI (${agi:,.2f}) is significantly less than earned income (${earned_income:,.2f}). This is unusual but may be correct if you have large deductions.")
        confidence = "medium"
    
    # 12. Additional Warnings for Edge Cases
    if qc > 3:
        warnings.append(f"ℹ️ MULTIPLE CHILDREN: You have {qc} children, but EITC credit amount caps at 3 children.")
    
    if investment_income > INVESTMENT_INCOME_LIMIT * 0.8:
        warnings.append(f"⚠️ INVESTMENT INCOME CLOSE TO LIMIT: ${investment_income:,.2f} is close to the ${INVESTMENT_INCOME_LIMIT:,.2f} limit.")
    
    # Calculate credit amount if eligible
    estimated_credit = 0
    calculation_details = None
    
    if eligible:
        estimated_credit, calculation_details = calculate_credit_amount(
            adjusted_earned_income, agi, qc, filing_status
        )
        
        if estimated_credit > 0:
            reasons.append(f"✅ ELIGIBLE: You qualify for EITC!")
            reasons.append(f"💰 ESTIMATED CREDIT: ${estimated_credit:,.2f}")
            reasons.append(f"📊 Based on: {qc} children, ${income_for_check:,.2f} income, {filing_status} status")
        else:
            reasons.append("✅ You meet basic requirements, but your income results in $0 credit.")
            confidence = "medium"
    
    # Compile success factors if eligible
    success_factors = []
    if eligible:
        success_factors.append(f"✓ Valid SSN for all required persons")
        success_factors.append(f"✓ U.S. citizen/resident for full year")
        success_factors.append(f"✓ Earned income: ${adjusted_earned_income:,.2f}")
        success_factors.append(f"✓ Investment income within limit: ${investment_income:,.2f}")
        success_factors.append(f"✓ Filing status: {filing_status}")
        if qc > 0:
            success_factors.append(f"✓ {qc} qualifying child(ren)")
        else:
            success_factors.append(f"✓ Age requirement met ({age} years old)")
    
    # Build comprehensive result
    result = {
        "eligible": eligible,
        "confidence": confidence,
        "estimated_credit": round(estimated_credit, 2) if estimated_credit else 0,
        "tax_year": year,
        "filing_status": filing_status,
        "num_children": qc,
        "income_used": income_for_check if eligible else 0,
        "reasons": reasons,
        "warnings": warnings,
        "success_factors": success_factors if eligible else [],
        "calculation_details": calculation_details if eligible else None,
        "next_steps": generate_next_steps(eligible, estimated_credit, qc),
        "additional_credits": suggest_other_credits(qc, agi, eligible),
        "disclaimer": "This is an informational screening only based on 2024 IRS guidelines. Actual eligibility and credit amounts may vary. Consult IRS Publication 596 or a qualified tax professional for your specific situation. — Informational only, not tax advice."
    }
    
    logger.info("comprehensive_assessment_completed", 
                eligible=eligible, 
                credit=estimated_credit, 
                children=qc,
                confidence=confidence)
    
    return result

def generate_next_steps(eligible: bool, credit: float, num_children: int) -> List[str]:
    """Generate personalized next steps."""
    steps = []
    
    if eligible:
        steps.append("1️⃣ Gather all W-2 forms, 1099 forms, and income records")
        steps.append("2️⃣ File your federal tax return (Form 1040)")
        if num_children > 0:
            steps.append("3️⃣ Complete and attach Schedule EIC (Earned Income Credit)")
            steps.append("4️⃣ Keep documentation: birth certificates, school records, medical records")
        steps.append("5️⃣ E-file and choose direct deposit for fastest refund")
        steps.append("6️⃣ Refunds with EITC typically available by early March")
        steps.append("7️⃣ Use IRS Free File if your income qualifies (under $73,000)")
    else:
        steps.append("1️⃣ Review the reasons why you don't qualify")
        steps.append("2️⃣ Check if you'll qualify in a future tax year")
        steps.append("3️⃣ Consider consulting a tax professional")
        steps.append("4️⃣ Explore other tax credits you may qualify for")
        steps.append("5️⃣ Visit IRS.gov/EITC for more information")
    
    return steps

def suggest_other_credits(num_children: int, agi: float, eitc_eligible: bool) -> List[str]:
    """Suggest other tax credits user might qualify for."""
    credits = []
    
    if num_children > 0:
        credits.append("💡 Child Tax Credit (CTC) - Up to $2,000 per qualifying child")
        credits.append("💡 Additional Child Tax Credit (ACTC) - Refundable portion of CTC")
        credits.append("💡 Child and Dependent Care Credit - For childcare expenses")
    
    if agi < 80000:
        credits.append("💡 Saver's Credit - For retirement contributions")
        credits.append("💡 Premium Tax Credit - For health insurance costs")
    
    credits.append("💡 Education Credits - American Opportunity or Lifetime Learning")
    
    if not eitc_eligible:
        credits.append("ℹ️ Even if you don't qualify for EITC, you may qualify for other credits!")
    
    return credits

# Export the new comprehensive function as the default
def assess_eligibility(answers: Dict[str, Any]) -> Dict[str, Any]:
    """Wrapper to use the comprehensive assessment by default."""
    return assess_comprehensive_eligibility(answers)

def get_questionnaire_schema() -> Dict[str, Any]:
    """Wrapper to use the comprehensive schema by default."""
    return get_comprehensive_schema()
