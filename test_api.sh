#!/bin/bash

echo "Testing TAXI API endpoints..."
echo ""

echo "1. Root endpoint:"
curl -X GET http://127.0.0.1:5000/
echo -e "\n"

echo "2. Health check:"
curl -X GET http://127.0.0.1:5000/health
echo -e "\n"

echo "3. Ask EITC question:"
curl -X POST http://127.0.0.1:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Who qualifies for EITC?", "lang": "en"}'
echo -e "\n"

echo "4. Get eligibility schema:"
curl -X GET http://127.0.0.1:5000/api/eligibility/schema
echo -e "\n"
