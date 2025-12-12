#!/bin/bash
# Backend Development Server Startup Script

echo "🚀 Starting Backend Development Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$(dirname "$0")/backend" || exit 1

echo "📂 Current directory: $(pwd)"
echo "📦 Installing dependencies (if needed)..."

# Check if node_modules exists, if not install
if [ ! -d "node_modules" ]; then
    echo "⏳ Running npm install..."
    npm install
fi

echo "✅ Starting Node.js server with nodemon..."
npm run dev
