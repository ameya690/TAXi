import json
import os
import sys
import pytest

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_ask_missing_question(client):
    rv = client.post('/api/ask', json={})
    assert rv.status_code == 400

def test_ask_ok(client, monkeypatch):
    # monkeypatch LLM.generate to avoid heavy model load during test
    from backend.services import llm as llm_mod
    class DummyLLM:
        def __init__(self, s): pass
        def generate(self, question, context, lang='en'):
            return "demo answer — Informational only, not tax advice."
    monkeypatch.setattr(llm_mod, "LLM", DummyLLM)
    rv = client.post('/api/ask', json={"question": "What is EITC?", "lang": "en"})
    assert rv.status_code == 200
    data = rv.get_json()
    assert "answer" in data
