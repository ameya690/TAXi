# OpenRouter API Setup Guide

## 🚀 Quick Setup

Your `.env` file has been configured to use OpenRouter API! Follow these steps:

### 1. Get Your OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to **Keys** in the dashboard
4. Click **Create Key**
5. Copy your API key

### 2. Add Your API Key

Edit `/Users/spartan/projects/TAXi/backend/.env`:

```bash
# Change this line:
OPENROUTER_API_KEY=your_api_key_here

# To your actual key:
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxx
```

### 3. Choose Your Model

The default model is **Claude 3.5 Sonnet** (best quality). You can change it in `.env`:

```bash
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

**Recommended Models:**

| Model | Best For | Context | Cost |
|-------|----------|---------|------|
| `anthropic/claude-3.5-sonnet` | **Best overall** - Long docs, complex analysis | 200K tokens | $$$ |
| `openai/gpt-4-turbo` | High quality, fast | 128K tokens | $$$ |
| `openai/gpt-3.5-turbo` | **Fast & affordable** - Quick queries | 16K tokens | $ |
| `meta-llama/llama-3.1-70b-instruct` | **Open source** - Good quality | 128K tokens | $$ |
| `google/gemini-pro-1.5` | Long context, multimodal | 1M tokens | $$ |

### 4. Restart the Backend

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd /Users/spartan/projects/TAXi
source .venv/bin/activate
python backend/app.py
```

### 5. Test It!

1. **Upload your PDF** in the Assistant tab
2. **Ask a question** about the document
3. **Get detailed answers** with full document analysis!

## 🎯 What You'll Get

### Before (FLAN-T5-base):
- ❌ 512 token limit (~400 words)
- ❌ Only sees first part of documents
- ❌ Tends to hallucinate
- ❌ Limited comprehension

### After (Claude 3.5 Sonnet):
- ✅ 200,000 token limit (~150,000 words)
- ✅ Analyzes entire documents
- ✅ Accurate, detailed responses
- ✅ Deep comprehension and reasoning

## 📊 Example Comparison

**Question:** "What are the key tax implications in this document?"

**FLAN-T5-base:**
```
Tax Planning Documents in scope: contract.pdf === This is about tax...
[truncated, hallucinated content]
```

**Claude 3.5 Sonnet:**
```
Based on the uploaded contract, here are the key tax implications:

1. **Income Recognition**: The agreement specifies payment terms that 
   trigger income recognition in Q4 2024, which may impact your tax 
   liability for the current year.

2. **Deductible Expenses**: Section 3.2 outlines consulting fees 
   totaling $45,000, which are fully deductible as ordinary business 
   expenses under IRC §162.

3. **Capital Gains Considerations**: The equity compensation in 
   Section 5 may be subject to capital gains treatment if held for 
   more than one year...

[Detailed, accurate analysis continues]

— Informational only, not tax advice.
```

## 💰 Cost Estimates

OpenRouter charges per token (input + output):

**Claude 3.5 Sonnet:**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens

**Example costs:**
- 10-page PDF analysis: ~$0.05 - $0.10
- 50-page contract review: ~$0.25 - $0.50
- 100 questions/day: ~$2 - $5

**Tips to save money:**
- Use `gpt-3.5-turbo` for simple queries ($0.50/1M input)
- Use Claude for complex analysis
- Set up usage limits in OpenRouter dashboard

## 🔧 Configuration Options

### Switch Between Models

Edit `.env` to change models instantly:

```bash
# For best quality (recommended for PDFs):
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# For speed and cost:
OPENROUTER_MODEL=openai/gpt-3.5-turbo

# For open source:
OPENROUTER_MODEL=meta-llama/llama-3.1-70b-instruct
```

### Switch Back to Local Model

To use the free local model again:

```bash
# In .env, change:
LLM_PROVIDER=openrouter

# To:
LLM_PROVIDER=transformers
```

No code changes needed - just restart the server!

## 🛠️ Troubleshooting

### "API key missing" error
**Solution:** Make sure you set `OPENROUTER_API_KEY` in `.env` and restarted the server

### "Rate limit exceeded"
**Solution:** You've hit OpenRouter's rate limit. Wait a minute or upgrade your plan

### "Model not found"
**Solution:** Check the model name is correct. See [OpenRouter Models](https://openrouter.ai/models)

### Still getting short answers
**Solution:** 
1. Check `.env` has `LLM_PROVIDER=openrouter`
2. Restart the backend server
3. Check logs for "answer_generated_openrouter"

## 📝 Advanced Configuration

### Custom Temperature

Add to the OpenRouter API call in `backend/services/llm.py`:

```python
"temperature": 0.7  # Lower = more focused, Higher = more creative
```

### Custom Max Tokens

```python
"max_tokens": 2000  # Increase for longer responses
```

### Add Streaming (Future)

OpenRouter supports streaming responses for real-time output. This can be added later for better UX.

## 🔐 Security Notes

- ✅ API key is in `.env` (not committed to git)
- ✅ `.env` is in `.gitignore`
- ✅ Never share your API key
- ✅ Rotate keys if exposed

## 📚 Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Available Models](https://openrouter.ai/models)
- [Pricing](https://openrouter.ai/docs#pricing)
- [API Reference](https://openrouter.ai/docs#api-reference)

## ✅ Verification Checklist

Before testing:
- [ ] OpenRouter account created
- [ ] API key copied
- [ ] `.env` file updated with your key
- [ ] `LLM_PROVIDER=openrouter` in `.env`
- [ ] Backend server restarted
- [ ] Logs show "answer_generated_openrouter"

## 🎉 You're Ready!

Your Assistant can now:
- ✅ Analyze entire PDFs (not just first page)
- ✅ Understand complex tax documents
- ✅ Provide detailed, accurate answers
- ✅ Handle long conversations
- ✅ Reason about multiple documents

**Next Steps:**
1. Add your API key to `.env`
2. Restart the backend
3. Upload your PDF
4. Ask detailed questions
5. Get comprehensive answers!

Enjoy your upgraded AI assistant! 🚀
