#!/bin/bash

echo "Testing OpenRouter API directly..."
echo ""

curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen/qwen-2.5-72b-instruct",
    "messages": [
      {"role": "system", "content": "You are a helpful tax assistant."},
      {"role": "user", "content": "What is EITC in one sentence?"}
    ],
    "max_tokens": 100
  }' | python3 -m json.tool

echo ""
echo ""
echo "If you see a proper response above, the API key works!"
echo "If you see an error, the API key is invalid."
