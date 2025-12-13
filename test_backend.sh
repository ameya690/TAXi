#!/bin/bash

echo "Testing backend on port 5001..."
echo ""

echo "1. Testing health endpoint:"
curl -s http://localhost:5001/health
echo ""
echo ""

echo "2. Testing assistant chat endpoint:"
curl -s -X POST http://localhost:5001/api/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is EITC?", "lang": "en"}' | python3 -m json.tool
echo ""
