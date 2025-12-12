#!/bin/bash
# Start All Services in Separate Terminal Windows (macOS)

echo "🚀 Starting FuelWatch Development Environment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📂 Project directory: $PROJECT_DIR"
echo ""
echo "Opening 3 terminal windows:"
echo "  1️⃣  Backend (Node.js)"
echo "  2️⃣  Frontend (Vite)"
echo "  3️⃣  ML Service (Flask)"
echo ""

# Open Backend in new terminal
osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$PROJECT_DIR' && ./start-backend.sh"
end tell
EOF

sleep 1

# Open Frontend in new terminal
osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$PROJECT_DIR' && ./start-frontend.sh"
end tell
EOF

sleep 1

# Open ML Service in new terminal
osascript <<EOF
tell application "Terminal"
    activate
    do script "cd '$PROJECT_DIR' && ./start-ml.sh"
end tell
EOF

echo "✅ All services starting in separate terminals!"
echo ""
echo "Access points:"
echo "  🌐 Frontend:  http://localhost:5173"
echo "  🔧 Backend:   http://localhost:3001"
echo "  🤖 ML Service: http://localhost:5001"
echo ""
echo "Press Ctrl+C in each terminal to stop the services."
