# Quick Start Guide - Tax Notice Explainer

## 🚀 Get Started in 5 Minutes

### Step 1: Install System Dependencies (One-time setup)

**macOS**:
```bash
brew install tesseract poppler
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get update
sudo apt-get install -y tesseract-ocr poppler-utils
```

**Windows**: See [INSTALL_DEPENDENCIES.md](./INSTALL_DEPENDENCIES.md)

### Step 2: Install Python Dependencies

```bash
cd backend
pip install -r ../requirements.txt
```

### Step 3: Start the Backend

```bash
cd backend
python app.py
```

You should see:
```
INFO starting_taxi host=0.0.0.0 port=5000 env=development
```

### Step 4: Start the Frontend

In a new terminal:
```bash
cd frontend
npm install  # First time only
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Step 5: Use the Feature

1. Open http://localhost:3000 in your browser
2. Click the **"📄 Tax Notice"** tab
3. Drag and drop a tax notice PDF or image
4. Click **"🔍 Analyze Notice"**
5. Review the results!

## 📋 Test with Sample Data

### Create a Test Notice

Create a file `test_notice.txt` with this content:
```
DEPARTMENT OF THE TREASURY
INTERNAL REVENUE SERVICE

Notice: CP-2000
Tax Year: 2023
Date: January 15, 2024

Dear Taxpayer,

We have identified a discrepancy in your 2023 tax return.

Amount Due: $1,234.56

Please respond by February 15, 2024.

If you agree with the changes, sign and return the response form.
If you disagree, provide supporting documentation.

For questions, call 1-800-829-1040.

Sincerely,
Internal Revenue Service
```

Convert to PDF or use as-is for testing.

### Test via API (Optional)

```bash
# Test with curl
curl -X POST http://localhost:5000/api/tax-notice/analyze \
  -F "file=@test_notice.pdf" \
  -F "lang=en"
```

## 🔍 Verify Installation

Run this quick test:

```python
# test_setup.py
import sys

try:
    import pytesseract
    print("✅ pytesseract installed")
except ImportError:
    print("❌ pytesseract not installed")
    sys.exit(1)

try:
    from pdf2image import convert_from_bytes
    print("✅ pdf2image installed")
except ImportError:
    print("❌ pdf2image not installed")
    sys.exit(1)

try:
    from PIL import Image
    print("✅ Pillow installed")
except ImportError:
    print("❌ Pillow not installed")
    sys.exit(1)

try:
    pytesseract.get_tesseract_version()
    print("✅ Tesseract OCR accessible")
except Exception as e:
    print(f"❌ Tesseract OCR not accessible: {e}")
    sys.exit(1)

print("\n✅ All dependencies are ready!")
```

Run it:
```bash
python test_setup.py
```

## 🐛 Common Issues

### "Tesseract not found"
```bash
# Verify installation
tesseract --version

# If not found, install it
brew install tesseract  # macOS
```

### "Poppler not found"
```bash
# Verify installation
pdftoppm -v

# If not found, install it
brew install poppler  # macOS
```

### "Module not found: pytesseract"
```bash
# Reinstall Python dependencies
pip install -r requirements.txt
```

### Port already in use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

## 📚 Next Steps

- **Full Documentation**: [TAX_NOTICE_EXPLAINER.md](./TAX_NOTICE_EXPLAINER.md)
- **Installation Guide**: [INSTALL_DEPENDENCIES.md](./INSTALL_DEPENDENCIES.md)
- **Implementation Details**: [FEATURE_IMPLEMENTATION_SUMMARY.md](./FEATURE_IMPLEMENTATION_SUMMARY.md)

## 🎯 Quick Tips

1. **Best Results**: Use high-quality scans (300 DPI)
2. **Fastest Processing**: Searchable PDFs work best
3. **File Size**: Keep under 10MB
4. **Language**: Switch between English/Spanish in the UI
5. **Privacy**: Only last 4 digits of SSN are shown

## 🔗 Useful Links

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/tax-notice/health
- Metrics: http://localhost:5000/metrics

## 💡 Example Usage

### Via Web UI
1. Navigate to http://localhost:3000
2. Click "📄 Tax Notice" tab
3. Upload your notice
4. Get instant analysis!

### Via API
```bash
curl -X POST http://localhost:5000/api/tax-notice/analyze \
  -F "file=@notice.pdf" \
  -F "lang=en" \
  | jq .
```

### Via Python
```python
import requests

url = "http://localhost:5000/api/tax-notice/analyze"
files = {"file": open("notice.pdf", "rb")}
data = {"lang": "en"}

response = requests.post(url, files=files, data=data)
result = response.json()

print(f"Notice Type: {result['key_details']['notice_type']}")
print(f"Summary: {result['summary']}")
```

## ✅ Success!

You're all set! The Tax Notice Explainer is ready to use.

**Need help?** Check the troubleshooting section in [TAX_NOTICE_EXPLAINER.md](./TAX_NOTICE_EXPLAINER.md)
