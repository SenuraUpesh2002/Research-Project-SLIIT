# FUELWATCH - Project Startup Guide

This guide explains how to start the different services of the FuelWatch project and how to resolve common issues like "Port already in use".

## 📋 Prerequisites
- **MySQL**: Running on port `8889` (default for MAMP) with database `fuelwatch_db`.
- **Node.js**: Installed for Frontend and Backend.
- **Anaconda/Python**: Required for ML Service dependencies (TensorFlow, Statsmodels).

---

## 🚀 How to Start Services

### 1. Backend (API)
The backend manages data flow and database connections.
```bash
cd backend
npm run dev
```
- **URL**: http://localhost:3001
- **Log**: Should show "Database connected successfully".

### 2. ML Service (Intelligence)
The ML service provides demand and staffing predictions. It is recommended to use the Anaconda environment.
```bash
cd ml-service
/opt/anaconda3/bin/python app.py
```
- **URL**: http://localhost:5001
- **Log**: Should show "✓ LSTM model loaded", "✓ ARIMA model loaded", etc.

### 3. Frontend (Dashboard)
The user interface to interact with the system.
```bash
cd frontend
npm run dev
```
- **URL**: http://localhost:5173

---

## 🛠 Troubleshooting: "Port already in use"

If you see an error like `Address already in use` or `Port 5001 is in use`, it means a previous instance of the service is still running in the background.

### How to Kill and Restart (ML Service Example)

1. **Find and Kill the process on Port 5001**:
   Run this command in your terminal:
   ```bash
   lsof -ti:5001 | xargs kill -9
   ```

2. **Restart the Service**:
   ```bash
   cd ml-service
   /opt/anaconda3/bin/python app.py
   ```

### Quick Commands for other Ports:
- **Kill Backend (3001)**: `lsof -ti:3001 | xargs kill -9`
- **Kill Frontend (5173)**: `lsof -ti:5173 | xargs kill -9`
- **Kill All FuelWatch Ports**: `kill $(lsof -t -i:5001,3001,5173)`

---

## ⚡ Quick Start Script
You can attempt to start all services at once using:
```bash
./start-all.sh
```
*Note: On macOS, you might need to grant Terminal "Accessibility" or "Apple Events" permissions in System Settings for this script to open new windows.*
