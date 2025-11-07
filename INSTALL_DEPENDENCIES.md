# Installing System Dependencies for Tax Notice Explainer

The Tax Notice Explainer feature requires additional system dependencies for OCR and PDF processing.

## macOS

### Using Homebrew (Recommended)

```bash
# Install Tesseract OCR
brew install tesseract

# Install Poppler (for PDF processing)
brew install poppler

# Verify installations
tesseract --version
pdftoppm -v
```

### Manual Installation

1. **Tesseract OCR**
   - Download from: https://github.com/tesseract-ocr/tesseract
   - Follow installation instructions for macOS

2. **Poppler**
   - Download from: https://poppler.freedesktop.org/
   - Follow installation instructions for macOS

## Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt-get update

# Install Tesseract OCR
sudo apt-get install -y tesseract-ocr

# Install Poppler utilities
sudo apt-get install -y poppler-utils

# Verify installations
tesseract --version
pdftoppm -v
```

## Linux (CentOS/RHEL/Fedora)

```bash
# Install Tesseract OCR
sudo yum install -y tesseract

# Install Poppler utilities
sudo yum install -y poppler-utils

# Verify installations
tesseract --version
pdftoppm -v
```

## Windows

### Using Chocolatey (Recommended)

```powershell
# Install Chocolatey if not already installed
# See: https://chocolatey.org/install

# Install Tesseract OCR
choco install tesseract

# Install Poppler
choco install poppler
```

### Manual Installation

1. **Tesseract OCR**
   - Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
   - Run the installer
   - Add Tesseract to your system PATH:
     - Default location: `C:\Program Files\Tesseract-OCR`
     - Add to PATH: System Properties → Environment Variables → Path

2. **Poppler**
   - Download from: https://github.com/oschwartz10612/poppler-windows/releases
   - Extract to a folder (e.g., `C:\Program Files\poppler`)
   - Add `poppler/bin` to your system PATH

### Verify Windows Installation

```powershell
# Open PowerShell or Command Prompt
tesseract --version
pdftoppm -v
```

## Docker

If using Docker, the dependencies are included in the Dockerfile:

```dockerfile
# Already included in deployments/docker/Dockerfile
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*
```

No additional installation needed when using Docker.

## Troubleshooting

### Tesseract not found

**Error**: `pytesseract.pytesseract.TesseractNotFoundError`

**Solution**:
1. Verify Tesseract is installed: `tesseract --version`
2. Check Tesseract is in system PATH
3. On Windows, manually set the path in your code:
   ```python
   import pytesseract
   pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
   ```

### Poppler not found

**Error**: `pdf2image.exceptions.PDFInfoNotInstalledError`

**Solution**:
1. Verify Poppler is installed: `pdftoppm -v`
2. Check Poppler is in system PATH
3. On Windows, manually set the path:
   ```python
   from pdf2image import convert_from_bytes
   images = convert_from_bytes(pdf_data, poppler_path=r'C:\Program Files\poppler\bin')
   ```

### Permission issues (Linux/macOS)

If you encounter permission errors during installation:

```bash
# Use sudo for system-wide installation
sudo apt-get install tesseract-ocr poppler-utils

# Or use a package manager that doesn't require sudo
# e.g., Homebrew on macOS (recommended)
```

### Language data missing

If you need OCR support for languages other than English:

**macOS**:
```bash
brew install tesseract-lang
```

**Linux**:
```bash
sudo apt-get install tesseract-ocr-spa  # Spanish
sudo apt-get install tesseract-ocr-fra  # French
# etc.
```

**Windows**:
- Download language data from: https://github.com/tesseract-ocr/tessdata
- Place `.traineddata` files in Tesseract's `tessdata` directory

## Verification Script

Create a file `test_dependencies.py` to verify all dependencies:

```python
#!/usr/bin/env python3
"""Test script to verify system dependencies for Tax Notice Explainer."""

import sys

def test_tesseract():
    """Test Tesseract OCR installation."""
    try:
        import pytesseract
        from PIL import Image
        import io
        
        # Create a simple test image
        img = Image.new('RGB', (100, 30), color='white')
        
        # Try to run OCR
        pytesseract.image_to_string(img)
        print("✅ Tesseract OCR: OK")
        return True
    except Exception as e:
        print(f"❌ Tesseract OCR: FAILED - {e}")
        return False

def test_poppler():
    """Test Poppler installation."""
    try:
        from pdf2image import convert_from_bytes
        import PyPDF2
        from io import BytesIO
        
        # Create a minimal PDF
        pdf_writer = PyPDF2.PdfWriter()
        pdf_writer.add_blank_page(width=200, height=200)
        
        pdf_bytes = BytesIO()
        pdf_writer.write(pdf_bytes)
        pdf_bytes.seek(0)
        
        # Try to convert PDF to image
        convert_from_bytes(pdf_bytes.read())
        print("✅ Poppler: OK")
        return True
    except Exception as e:
        print(f"❌ Poppler: FAILED - {e}")
        return False

def test_pillow():
    """Test Pillow installation."""
    try:
        from PIL import Image
        img = Image.new('RGB', (100, 100))
        print("✅ Pillow: OK")
        return True
    except Exception as e:
        print(f"❌ Pillow: FAILED - {e}")
        return False

def main():
    """Run all dependency tests."""
    print("Testing Tax Notice Explainer dependencies...\n")
    
    results = [
        test_pillow(),
        test_tesseract(),
        test_poppler(),
    ]
    
    print("\n" + "="*50)
    if all(results):
        print("✅ All dependencies are properly installed!")
        return 0
    else:
        print("❌ Some dependencies are missing or not configured correctly.")
        print("Please refer to INSTALL_DEPENDENCIES.md for installation instructions.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
```

Run the test:
```bash
python test_dependencies.py
```

## Next Steps

After installing system dependencies:

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the backend:
   ```bash
   cd backend
   python app.py
   ```

3. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Navigate to http://localhost:3000 and click the "📄 Tax Notice" tab

## Support

If you continue to experience issues:
1. Check the troubleshooting section above
2. Verify your OS version is supported
3. Try reinstalling the dependencies
4. Check system PATH configuration
5. Review error logs for specific error messages
