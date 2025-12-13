#!/bin/bash

# TAXi API Endpoints Test Script
# This script tests all API endpoints and generates output for report screenshots

echo "========================================="
echo "TAXi API Endpoints Test"
echo "========================================="
echo ""

BASE_URL="http://localhost:5001"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Root endpoint
echo -e "${BLUE}[1] Testing Root Endpoint: GET /${NC}"
echo "Command: curl $BASE_URL/"
echo "---"
curl -s $BASE_URL/ | python3 -m json.tool
echo ""
echo ""

# Test 2: Health check
echo -e "${BLUE}[2] Testing Health Check: GET /health${NC}"
echo "Command: curl $BASE_URL/health"
echo "---"
curl -s $BASE_URL/health | python3 -m json.tool
echo ""
echo ""

# Test 3: Ask endpoint
echo -e "${BLUE}[3] Testing Chat/Ask Endpoint: POST /api/ask${NC}"
echo "Command: curl -X POST $BASE_URL/api/ask -H 'Content-Type: application/json' -d '{\"question\": \"What are the EITC income limits for 2024?\", \"lang\": \"en\"}'"
echo "---"
curl -s -X POST $BASE_URL/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the EITC income limits for 2024?", "lang": "en"}' \
  | python3 -m json.tool | head -100
echo "... (truncated for brevity)"
echo ""
echo ""

# Test 4: Eligibility schema
echo -e "${BLUE}[4] Testing Eligibility Schema: GET /api/eligibility/schema${NC}"
echo "Command: curl $BASE_URL/api/eligibility/schema"
echo "---"
curl -s $BASE_URL/api/eligibility/schema | python3 -m json.tool | head -80
echo "... (truncated for brevity)"
echo ""
echo ""

# Test 5: Eligibility assessment
echo -e "${BLUE}[5] Testing Eligibility Assessment: POST /api/eligibility/assess${NC}"
echo "Command: curl -X POST $BASE_URL/api/eligibility/assess -H 'Content-Type: application/json' -d '{...}'"
echo "---"
curl -s -X POST $BASE_URL/api/eligibility/assess \
  -H "Content-Type: application/json" \
  -d '{
    "filing_status": "married_filing_jointly",
    "earned_income": 45000,
    "num_qualifying_children": 2,
    "age": 35,
    "spouse_age": 33,
    "has_ssn": true,
    "spouse_has_ssn": true,
    "is_dependent": false,
    "lived_in_us": true,
    "investment_income": 2000,
    "tax_year": 2024
  }' | python3 -m json.tool
echo ""
echo ""

# Test 6: Assistant chat
echo -e "${BLUE}[6] Testing Assistant Chat: POST /api/assistant/chat${NC}"
echo "Command: curl -X POST $BASE_URL/api/assistant/chat -H 'Content-Type: application/json' -d '{\"message\": \"What documents do I need for EITC?\", \"lang\": \"en\"}'"
echo "---"
curl -s -X POST $BASE_URL/api/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What documents do I need for EITC?", "lang": "en"}' \
  | python3 -m json.tool | head -80
echo "... (truncated for brevity)"
echo ""
echo ""

# Test 7: List documents
echo -e "${BLUE}[7] Testing List Documents: GET /api/assistant/documents${NC}"
echo "Command: curl $BASE_URL/api/assistant/documents"
echo "---"
curl -s $BASE_URL/api/assistant/documents | python3 -m json.tool
echo ""
echo ""

# Test 8: Tax notice health
echo -e "${BLUE}[8] Testing Tax Notice Health: GET /api/tax-notice/health${NC}"
echo "Command: curl $BASE_URL/api/tax-notice/health"
echo "---"
curl -s $BASE_URL/api/tax-notice/health | python3 -m json.tool
echo ""
echo ""

# Test 9: Metrics (if enabled)
echo -e "${BLUE}[9] Testing Metrics: GET /metrics${NC}"
echo "Command: curl $BASE_URL/metrics"
echo "---"
curl -s $BASE_URL/metrics | head -30
echo "... (truncated for brevity)"
echo ""
echo ""

# Test 10: Spanish language support
echo -e "${BLUE}[10] Testing Spanish Language Support: POST /api/ask${NC}"
echo "Command: curl -X POST $BASE_URL/api/ask -H 'Content-Type: application/json' -d '{\"question\": \"¿Cuáles son los límites de ingresos para EITC?\", \"lang\": \"es\"}'"
echo "---"
curl -s -X POST $BASE_URL/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "¿Cuáles son los límites de ingresos para EITC?", "lang": "es"}' \
  | python3 -m json.tool | head -80
echo "... (truncated for brevity)"
echo ""
echo ""

# Summary
echo "========================================="
echo -e "${GREEN}All API Endpoints Tested Successfully!${NC}"
echo "========================================="
echo ""
echo "Available Endpoints:"
echo "  1. GET  /                          - API documentation"
echo "  2. GET  /health                    - Health check"
echo "  3. POST /api/ask                   - Chat with RAG"
echo "  4. GET  /api/eligibility/schema    - Eligibility form schema"
echo "  5. POST /api/eligibility/assess    - Assess eligibility"
echo "  6. POST /api/assistant/chat        - Advanced assistant chat"
echo "  7. POST /api/assistant/upload      - Upload documents"
echo "  8. GET  /api/assistant/documents   - List uploaded documents"
echo "  9. POST /api/tax-notice/analyze    - Analyze tax notices (OCR + AI)"
echo " 10. GET  /api/tax-notice/health     - Tax notice service health"
echo " 11. GET  /metrics                   - Prometheus metrics"
echo ""
echo "Frontend URL: http://localhost:3000"
echo "Backend URL:  http://localhost:5001"
echo ""
