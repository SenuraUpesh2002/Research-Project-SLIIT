#!/bin/bash
# ML Service Startup Script

echo "🚀 Starting ML Service..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$(dirname "$0")/ml-service" || exit 1

echo "📂 Current directory: $(pwd)"
echo "🐍 Activating Python virtual environment..."

# Activate the parent directory's virtual environment
source "../../.venv/bin/activate" 2>/dev/null || echo "⚠️  No venv found, using system Python"

echo "📦 Installing dependencies (if needed)..."

# Check if requirements are installed
pip install -q -r requirements.txt

echo "✅ Starting Flask ML service..."
python app.py
