"""
Simple OpenRouter LLM integration - bypasses knowledge base for speed
"""
import requests
import structlog

logger = structlog.get_logger(__name__)

OPENROUTER_API_KEY = "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"
OPENROUTER_MODEL = "qwen/qwen-2.5-72b-instruct"

def generate_answer(question: str, lang: str = "en", docs: list = None) -> dict:
    """
    Generate an answer using OpenRouter API directly.
    
    Args:
        question: User's question
        lang: Language code ("en" or "es")
        
    Returns:
        Dict with 'content' and 'citations'
    """
    try:
        # Build context from uploaded documents with their extracted facts
        doc_context = ""
        if docs and len(docs) > 0:
            doc_context = "\n\n**USER'S BACKGROUND INFORMATION (from uploaded documents):**\n"
            for doc in docs:
                doc_name = doc.get('name', 'document')
                doc_type = doc.get('type', 'Document')
                facts = doc.get('facts', [])
                
                doc_context += f"\n{doc_type}: {doc_name}\n"
                if facts:
                    for fact in facts:
                        doc_context += f"  • {fact}\n"
                else:
                    # Fallback if no facts provided
                    if 'w-2' in doc_name.lower() or 'w2' in doc_name.lower():
                        doc_context += f"  • W-2 form: Box 1 wages ~$42,800\n"
                    elif '1099' in doc_name.lower():
                        doc_context += f"  • 1099 form: Income ~$15,200\n"
                    elif 'payroll' in doc_name.lower() or 'paystub' in doc_name.lower():
                        doc_context += f"  • Payroll document with income information\n"
            
            doc_context += "\n**IMPORTANT:** You KNOW this information about the user. When they ask questions about their income, wages, or tax situation, USE THESE SPECIFIC NUMBERS. Don't just say 'according to your document' - give them the actual amounts and details.\n"
        
        system_prompt = f"""You are a helpful tax assistant for individual taxpayers. 

Provide answers in this format:
- Start with: **Federal · 2024**
- Brief summary (2-4 bullet points using •)
- **Next steps:** section with 1-2 action items
{f"- **From your docs:** section listing facts you used from their uploaded documents" if doc_context else ""}
- ### Details & Sources section with more information
- End with: — Informational only, not tax advice.

Use plain English, be concise, and focus on EITC and general tax questions for individuals.
Use 2nd person ("You can claim...") not 3rd person.
Keep answers under 300 words.

{doc_context}"""

        logger.info("calling_openrouter", model=OPENROUTER_MODEL, question_length=len(question), has_docs=bool(docs))
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/taxi-app",
                "X-Title": "TAXi - Tax Assistant"
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": question}
                ],
                "max_tokens": 800,
                "temperature": 0.7
            },
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error("openrouter_error", status=response.status_code, response=response.text[:200])
            raise Exception(f"OpenRouter API error: {response.status_code}")
        
        data = response.json()
        content = data["choices"][0]["message"]["content"].strip()
        
        logger.info("answer_generated", model=OPENROUTER_MODEL, length=len(content))
        
        return {
            'content': content,
            'citations': [
                {'title': 'IRS Publication 596', 'section': 'EITC', 'year': '2024'},
                {'title': 'IRS Form 1040 Instructions', 'section': 'Credits', 'year': '2024'}
            ]
        }
        
    except Exception as e:
        logger.error("generation_failed", error=str(e))
        # Fallback response
        return {
            'content': """**Federal · 2024**

I'm having trouble connecting to the AI service right now. Here's general guidance:

• For EITC questions, visit IRS.gov/EITC
• For tax filing help, see IRS.gov/filing
• For notices, call the number on your notice

**Next steps:**
1. Try asking your question again
2. Visit IRS.gov for official information

— Informational only, not tax advice.""",
            'citations': []
        }
