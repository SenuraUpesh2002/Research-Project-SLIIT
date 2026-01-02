# FuelWatch: Data Flow Diagram

This document details the data lifecycle for the Attendance and AI Prediction modules.

## Architecture Overview

```mermaid
graph TD
    User([Manager/Employee]) -- Interactions --> UI[React Frontend]
    UI -- Attendance Hooks --> APIService[API Service Layer]
    UI -- Prediction Hooks --> APIService
    
    APIService -- HTTP Requests --> Backend[Express Server]
    
    Backend -- Attendance Logic --> Controllers[Attendance Controller]
    Backend -- Prediction Logic --> PredController[Prediction Controller]
    
    Controllers -- SQL --> Database[(MySQL Database)]
    PredController -- HTTP POST --> MLService[Python ML Service]
    PredController -- HTTP GET --> WeatherAPI[Open-Meteo API]
    
    MLService -- Predictions --> PredController
    WeatherAPI -- Real-time Data --> PredController
    Database -- Records --> Controllers
    
    PredController -- Enhanced Insights --> APIService
    Controllers -- Status/History --> APIService
    APIService -- Processed Data --> UI
    UI -- Rendered View --> User
```

## Detailed Data Flows

### 1. Attendance & Shift Management
- **Flow**: User Interacts (Check-in/out) → Dashboard UI → `attendanceService` → Backend Controller → MySQL.
- **Data**: Employee info, timestamps, location coordinates, and session status recorded in the `attendance` table.

### 2. AI Demand Intelligence (ML Integration)
- **Forecast Phase**:
    1. frontend triggers `useForecast` hook.
    2. Backend `getForecast` calls the **Python ML Service** (`/predict-station-demand`).
    3. Python service uses LSTM/ARIMA models to project fuel demand.
- **Staffing Recommendation**:
    1. Backend calls ML Service (`/predict-staffing`) based on demand figures.
    2. Backend enrichment: Real-time weather data is pulled from **Open-Meteo API**.
    3. Final payload includes "Dynamic Insights" (Traffic estimates, Weather impact, ML Confidence).

### 3. Key Tech Stack
- **Frontend**: React (Vite) + React Query + Framer Motion.
- **Backend API**: Node.js (Express).
- **ML Layer**: Python (Flask) + TensorFlow/Scikit-learn.
- **Database**: MySQL.
- **External**: Open-Meteo API.
