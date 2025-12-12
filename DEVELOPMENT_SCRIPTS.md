# FuelWatch Development Scripts 🚀

Quick startup scripts to run your development environment with a single command!

## Available Scripts

### Individual Services

#### Frontend
```bash
./start-frontend.sh
```
Starts the React frontend on http://localhost:5173

#### Backend
```bash
./start-backend.sh
```
Starts the Node.js backend on http://localhost:3001

#### ML Service
```bash
./start-ml.sh
```
Starts the Flask ML service on http://localhost:5001

---

### Start Everything (Recommended) ⭐

```bash
./start-all.sh
```

This will:
- ✅ Open 3 separate terminal windows
- ✅ Start backend, frontend, and ML service
- ✅ Auto-install dependencies if needed
- ✅ Show clear status messages

---

## First Time Setup

Make sure scripts are executable:
```bash
chmod +x start-*.sh
```

---

## Usage from Anywhere

### Option 1: Create Shell Aliases

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
# FuelWatch shortcuts
alias fw-all='cd "$HOME/Documents/Research web/Research-Project-SLIIT" && ./start-all.sh'
alias fw-frontend='cd "$HOME/Documents/Research web/Research-Project-SLIIT" && ./start-frontend.sh'
alias fw-backend='cd "$HOME/Documents/Research web/Research-Project-SLIIT" && ./start-backend.sh'
alias fw-ml='cd "$HOME/Documents/Research web/Research-Project-SLIIT" && ./start-ml.sh'
```

Then reload:
```bash
source ~/.zshrc
```

Now from ANY directory, just type:
```bash
fw-all        # Start everything
fw-frontend   # Just frontend
fw-backend    # Just backend
fw-ml         # Just ML service
```

---

### Option 2: Add to PATH

```bash
# Add project scripts to PATH
export PATH="$HOME/Documents/Research web/Research-Project-SLIIT:$PATH"
```

Then you can run from anywhere:
```bash
start-all.sh
start-frontend.sh
```

---

## What Each Script Does

### start-frontend.sh
1. Changes to frontend directory
2. Checks for node_modules
3. Runs `npm install` if needed
4. Starts `npm run dev`

### start-backend.sh
1. Changes to backend directory
2. Checks for node_modules
3. Runs `npm install` if needed
4. Starts `npm run dev` (with nodemon)

### start-ml.sh
1. Changes to ml-service directory
2. Activates Python virtual environment
3. Installs requirements if needed
4. Starts `python app.py`

### start-all.sh
1. Opens 3 new Terminal windows
2. Runs each service script in its own window
3. Shows access URLs

---

## Stopping Services

### Individual Windows
Press `Ctrl + C` in each terminal

### All at Once
```bash
# Kill all Node.js processes (frontend + backend)
pkill -f "node"

# Kill Python ML service
pkill -f "python.*app.py"
```

Or create a stop script if you want!

---

## Troubleshooting

### "Permission denied"
```bash
chmod +x start-*.sh
```

### "Command not found"
Run from project root:
```bash
cd ~/Documents/Research\ web/Research-Project-SLIIT
./start-all.sh
```

### Port already in use
Kill existing processes:
```bash
lsof -ti:5173 | xargs kill  # Frontend
lsof -ti:3001 | xargs kill  # Backend
lsof -ti:5001 | xargs kill  # ML Service
```

---

## Comparison: Before vs After

### Before 😫
```bash
# Terminal 1
cd Documents/Research\ web/Research-Project-SLIIT
cd backend
npm run dev

# Terminal 2
cd Documents/Research\ web/Research-Project-SLIIT
cd frontend
npm run dev

# Terminal 3
cd Documents/Research\ web/Research-Project-SLIIT
cd ml-service
source ../.venv/bin/activate
python app.py
```

### After 🎉
```bash
fw-all
```

---

## Bonus: Create Desktop Shortcuts (macOS)

1. Open **Automator**
2. New Document → **Application**
3. Add **Run Shell Script** action
4. Paste:
   ```bash
   cd "$HOME/Documents/Research web/Research-Project-SLIIT"
   ./start-all.sh
   ```
5. Save as "FuelWatch Dev" to Desktop

Now double-click the icon to start everything!

---

Happy coding! 🚀
