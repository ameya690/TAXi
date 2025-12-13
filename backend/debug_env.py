#!/usr/bin/env python3
"""Debug script to check what environment variables are loaded"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file same way as app.py
env_path = Path(__file__).parent / '.env'
print(f"Loading .env from: {env_path}")
print(f"File exists: {env_path.exists()}")
print()

load_dotenv(dotenv_path=env_path)

# Check what was loaded
api_key = os.getenv('OPENROUTER_API_KEY', 'NOT SET')
model = os.getenv('OPENROUTER_MODEL', 'NOT SET')
provider = os.getenv('LLM_PROVIDER', 'NOT SET')

print("Environment Variables:")
print(f"  LLM_PROVIDER: {provider}")
print(f"  OPENROUTER_MODEL: {model}")
print(f"  OPENROUTER_API_KEY: {api_key[:20]}...{api_key[-10:] if len(api_key) > 30 else api_key}")
print()

# Check if key looks valid
if api_key.startswith('sk-or-v1-'):
    print("✅ API key format looks correct")
    print(f"   Key length: {len(api_key)} characters")
else:
    print("❌ API key format looks wrong")
    print(f"   Expected to start with: sk-or-v1-")
    print(f"   Actually starts with: {api_key[:15]}")
