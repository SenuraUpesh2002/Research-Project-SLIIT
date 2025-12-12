#!/bin/bash
# Frontend Development Server Startup Script

echo "🚀 Starting Frontend Development Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$(dirname "$0")/frontend" || exit 1

echo "📂 Current directory: $(pwd)"
echo "📦 Installing dependencies (if needed)..."

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
    echo "⏳ Running npm install..."
    npm install
fi

echo "✅ Starting Vite dev server..."
npm run dev
