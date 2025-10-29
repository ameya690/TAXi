#!/usr/bin/env bash
set -euo pipefail

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python knowledge_base/scripts/build_index.py
python backend/app.py
