#!/usr/bin/env python3
"""
Simple HTTP server to serve the TAX Intelligence Bot chat interface
"""
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
HTML_FILE = "simple-chat.html"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

def main():
    print("\n🤖 TAX Intelligence Bot Simple Chat Server...")
    print(f"📂 Serving: {HTML_FILE}")
    print(f"🌐 URL: http://localhost:{PORT}")
    print("⚠️  Make sure the TAX Intelligence Bot backend is running on port 5000")
    print("🔄 Opening browser...")

    # Try to open browser
    try:
        webbrowser.open(f'http://localhost:{PORT}')
    except:
        print("Could not open browser automatically")

    # Start server
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n✅ Server running on http://localhost:{PORT}")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🤖 TAX Intelligence Bot server stopped.")

if __name__ == "__main__":
    main()
