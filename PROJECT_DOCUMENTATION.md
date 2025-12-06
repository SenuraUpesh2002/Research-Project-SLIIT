# FUELWATCH - Project Documentation

## Project Overview

**FUELWATCH** is an AI-Powered Smart Surveillance & Predictive Analysis Platform for Fuel Station Management developed as a research project at SLIIT.

The system consists of three main components:
- **Backend API** (Node.js/Express)
- **Frontend Dashboard** (React/Vite)
- **ML Service** (Flask/Python)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  Frontend (React)│
│  Port: 5173      │
└────────┬─────────┘
         │
         ├──────────────────────┐
         │                      │
┌────────▼─────────┐   ┌────────▼──────────┐
│  Backend (Node)  │   │  ML Service (Flask)│
│  Port: 5000      │   │  Port: 5001       │
└────────┬─────────┘   └───────────────────┘
         │
┌────────▼─────────┐
│  MySQL Database  │
│  fuelwatch_db    │
└──────────────────┘
```

---

## 📁 Project Structure

```
Research-Project-SLIIT/
├── backend/                 # Node.js/Express Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Database models
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
│
├── frontend/              # React/Vite Frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── tabs/          # Dashboard tab components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
├── ml-service/            # Flask ML Service
│   ├── models/            # ML model definitions
│   ├── saved_models/      # Trained model files
│   ├── utils/             # ML utility functions
│   ├── app.py             # Flask application
│   └── requirements.txt   # Python dependencies
│
└── database/              # Database scripts
    └── schema.sql         # Database schema
```

---

## 🔧 Backend (Node.js/Express)

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (mysql2)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator
- **Other**: axios, cors, dotenv, qrcode

### Port
- **5000** (default)

### File Structure

#### Controllers (`backend/controllers/`)
1. **authController.js** - User authentication (login/register)
2. **employeeController.js** - Employee CRUD operations
3. **attendanceController.js** - Attendance management
4. **checkinController.js** - Employee check-in/check-out
5. **fuelStockController.js** - Fuel stock monitoring
6. **predictionController.js** - Demand predictions (integrates with ML service)
7. **qrController.js** - QR code generation and validation

#### Models (`backend/models/`)
1. **Employee.js** - Employee data model
2. **CheckIn.js** - Check-in records model
3. **DailyQR.js** - Daily QR code model
4. **FuelStock.js** - Fuel stock data model

#### Routes (`backend/routes/`)
1. **auth.js** - `/api/auth/*`
   - `POST /register` - Register new user
   - `POST /login` - User login

2. **employee.js** - `/api/employees/*`
   - `GET /` - Get all employees (protected)
   - `GET /:id` - Get employee by ID (protected)
   - `PUT /:id` - Update employee (protected)
   - `DELETE /:id` - Delete employee (protected)

3. **qr.js** - `/api/qr/*`
   - QR code generation and validation

4. **checkin.js** - `/api/checkin/*`
   - Employee check-in/check-out operations

5. **fuelStock.js** - `/api/fuel/*`
   - `GET /stocks` - Get all fuel stocks (protected)
   - `PUT /stocks/:id` - Update stock level (protected)

6. **prediction.js** - `/api/predictions/*`
   - Demand prediction endpoints (integrates with ML service)

7. **attendance.js** - `/api/attendance/*`
   - Attendance tracking and reporting

#### Middleware (`backend/middleware/`)
- **authMiddleware.js** - JWT token verification for protected routes

#### Configuration (`backend/config/`)
- **db.js** - MySQL database connection configuration

#### Seed Scripts
- **seedAdmin.js** - Seed admin user
- **seedAttendance.js** - Seed attendance data
- **seedCheckIns.js** - Seed check-in records
- **seedSampleData.js** - Seed sample data for testing

### Environment Variables (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fuelwatch_db
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:5001
```

### Dependencies (package.json)
```json
{
  "dependencies": {
    "axios": "^1.13.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "express": "^4.18.0",
    "express-validator": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "mysql2": "^3.6.0",
    "qrcode": "^1.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### Running the Backend
```bash
cd backend
npm install
npm run dev    # Development mode with nodemon
npm start      # Production mode
```

---

## 🎨 Frontend (React/Vite)

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **UI Components**: Lucide React (icons)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **QR Code**: qrcode.react, html5-qrcode
- **Date Handling**: date-fns

### Port
- **5173** (default Vite dev server)

### File Structure

#### Pages (`frontend/src/pages/`)
1. **Login.jsx** - User login page
2. **Dashboard.jsx** - Main dashboard with tabs
3. **EmployeeRegistration.jsx** - Employee registration form
4. **MobileCheckIn.jsx** - Mobile check-in interface
5. **LiveStockDemo.jsx** - Live fuel stock demonstration

#### Components (`frontend/src/components/`)
1. **Navbar.jsx** - Navigation bar
2. **EmployeeCard.jsx** - Employee information card
3. **ExpandableFuelGrid.jsx** - Expandable fuel stock grid display
4. **LiveStockCard.jsx** - Live stock monitoring card
5. **PredictionChart.jsx** - Demand prediction chart
6. **QRCodeDisplay.jsx** - QR code display component
7. **StaffingRecommendation.jsx** - AI staffing recommendations

#### Tabs (`frontend/src/tabs/`)
1. **EmployeeDetailsTab.jsx** - Employee management tab
2. **LiveStocksTab.jsx** - Live fuel stocks monitoring tab
3. **PredictionsTab.jsx** - Demand predictions and staffing tab

#### Services (`frontend/src/services/`)
- API service layer for backend communication

#### Routing
```javascript
/login                  → Login page
/dashboard              → Main dashboard (protected)
/register-employee      → Employee registration (protected)
/mobile-checkin         → Mobile check-in (protected)
/                       → Redirects to /dashboard
```

### Dependencies (package.json)
```json
{
  "dependencies": {
    "axios": "^1.13.2",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.23.24",
    "html5-qrcode": "^2.3.8",
    "lucide-react": "^0.554.0",
    "qrcode.react": "^4.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-qr-scanner": "^1.0.0-alpha.11",
    "react-router-dom": "^7.9.6",
    "recharts": "^3.5.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.17",
    "vite": "^7.2.4",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.22",
    "postcss": "^8.5.6"
  }
}
```

### Running the Frontend
```bash
cd frontend
npm install
npm run dev      # Development mode
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 🤖 ML Service (Flask/Python)

### Technology Stack
- **Framework**: Flask 3.0.0
- **CORS**: flask-cors 4.0.0
- **ML Libraries**: (To be added - currently using mock predictions)

### Port
- **5001**

### File Structure
- **app.py** - Main Flask application
- **models/** - ML model definitions
- **saved_models/** - Trained model files
- **utils/** - ML utility functions
- **requirements.txt** - Python dependencies

### API Endpoints

#### 1. Predict Demand
```
POST /predict-demand
```
**Request Body:**
```json
{
  "date": "2024-12-03",
  "shift": "morning"
}
```
**Response:**
```json
{
  "predicted_demand": 1650,
  "confidence": 0.89,
  "model": "mock_lstm_v1"
}
```

#### 2. Predict Staffing
```
POST /predict-staffing
```
**Request Body:**
```json
{
  "predicted_demand": 1650
}
```
**Response:**
```json
{
  "recommended_staff": 3,
  "confidence": "high",
  "expected_wait_time": "4 minutes",
  "model": "mock_random_forest_v1"
}
```

#### 3. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "FuelWatch ML Service",
  "version": "1.0.0-mock",
  "timestamp": "2024-12-03T12:40:17"
}
```

### Current Implementation
The ML service currently uses **mock predictions** with realistic random data. The actual ML models (LSTM for demand prediction, Random Forest for staffing) are planned for future implementation.

### Staffing Logic
- 1 employee per 500L of predicted demand
- Minimum: 2 employees
- Maximum: 5 employees
- Confidence levels: high/medium based on demand

### Dependencies (requirements.txt)
```
flask==3.0.0
flask-cors==4.0.0
```

### Running the ML Service
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

---

## 💾 Database Schema

### Database Name
`fuelwatch_db`

### Tables

#### 1. employees
Stores employee information and credentials.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| employee_id | VARCHAR(20) UNIQUE | Unique employee identifier |
| full_name | VARCHAR(100) | Employee full name |
| email | VARCHAR(100) UNIQUE | Email address |
| phone | VARCHAR(20) | Phone number |
| role | ENUM | attendant, supervisor, manager |
| password_hash | VARCHAR(255) | Hashed password |
| device_fingerprint | VARCHAR(255) | Device identification |
| registered_at | TIMESTAMP | Registration timestamp |
| is_active | BOOLEAN | Active status |

#### 2. daily_qr_codes
Stores daily QR codes for check-in validation.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| qr_code_data | TEXT | QR code data |
| station_id | INT | Fuel station ID |
| valid_date | DATE | Valid date |
| created_at | TIMESTAMP | Creation timestamp |
| expires_at | TIMESTAMP | Expiration timestamp |

#### 3. check_ins
Tracks employee check-ins and check-outs.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| employee_id | INT (FK) | References employees(id) |
| check_in_time | TIMESTAMP | Check-in time |
| check_out_time | TIMESTAMP | Check-out time |
| shift_type | ENUM | morning, afternoon, evening |
| location_validated | BOOLEAN | Location validation status |
| device_validated | BOOLEAN | Device validation status |
| qr_code_id | INT (FK) | References daily_qr_codes(id) |
| status | ENUM | active, completed |

#### 4. fuel_stocks
Monitors fuel stock levels.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| fuel_type | ENUM | petrol, diesel, super_diesel, petrol_95 |
| current_level | DECIMAL(10,2) | Current fuel level |
| capacity | DECIMAL(10,2) | Tank capacity |
| last_updated | TIMESTAMP | Last update time |
| sensor_id | VARCHAR(50) | IoT sensor ID |
| station_id | INT | Fuel station ID |

#### 5. fuel_transactions
Records fuel dispensing transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| fuel_type | VARCHAR(50) | Type of fuel |
| amount_dispensed | DECIMAL(10,2) | Amount dispensed |
| timestamp | TIMESTAMP | Transaction time |
| shift_type | VARCHAR(20) | Shift during transaction |
| station_id | INT | Fuel station ID |

#### 6. demand_predictions
Stores AI-generated demand predictions.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| prediction_date | DATE | Date of prediction |
| shift_type | VARCHAR(20) | Shift type |
| predicted_demand | DECIMAL(10,2) | Predicted fuel demand |
| confidence_score | DECIMAL(5,4) | Prediction confidence |
| created_at | TIMESTAMP | Creation timestamp |

#### 7. staffing_recommendations
Stores AI-generated staffing recommendations.

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK, AI) | Primary key |
| prediction_date | DATE | Date of prediction |
| shift_type | VARCHAR(20) | Shift type |
| predicted_demand | DECIMAL(10,2) | Predicted demand |
| recommended_staff | INT | Recommended staff count |
| confidence | VARCHAR(20) | Confidence level |
| created_at | TIMESTAMP | Creation timestamp |

---

## 🔐 Authentication & Authorization

### Authentication Flow
1. User logs in via `/api/auth/login`
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token sent in Authorization header for protected routes

### Protected Routes
- All `/api/employees/*` endpoints
- All `/api/fuel/*` endpoints
- All `/api/predictions/*` endpoints
- All `/api/attendance/*` endpoints
- All `/api/qr/*` endpoints
- All `/api/checkin/*` endpoints

### Role-Based Access
- **Attendant**: Basic check-in/check-out
- **Supervisor**: View reports, manage attendance
- **Manager**: Full access including employee management

---

## 🚀 Key Features

### 1. Employee Management
- Employee registration with role assignment
- Employee profile management (view, edit, delete)
- Device fingerprinting for security
- Role-based access control

### 2. Smart Check-In System
- QR code-based check-in/check-out
- Daily rotating QR codes
- Location validation
- Device validation
- Shift tracking (morning/afternoon/evening)

### 3. Fuel Stock Monitoring
- Real-time fuel level tracking
- Multiple fuel types support
- IoT sensor integration (simulated)
- Stock alerts and notifications

### 4. AI-Powered Predictions
- Fuel demand forecasting
- Staffing recommendations
- Historical data analysis
- Confidence scoring

### 5. Attendance Tracking
- Automated attendance recording
- Shift-based tracking
- Attendance reports
- Check-in/check-out history

### 6. Dashboard Analytics
- Live fuel stock visualization
- Demand prediction charts
- Staffing recommendations
- Employee statistics

---

## 🔄 Data Flow

### Check-In Flow
```
Employee scans QR → Frontend validates → Backend checks QR validity
→ Validates device & location → Records check-in → Returns success
```

### Prediction Flow
```
User requests prediction → Frontend sends date/shift → Backend forwards to ML service
→ ML service generates prediction → Backend stores in DB → Returns to frontend
```

### Stock Update Flow
```
IoT sensor (simulated) → Backend receives update → Updates fuel_stocks table
→ Frontend polls for updates → Displays real-time data
```

---

## 📊 API Integration

### Backend ↔ ML Service
- Backend uses axios to communicate with ML service
- ML service URL configured in backend .env
- Endpoints: `/predict-demand`, `/predict-staffing`

### Frontend ↔ Backend
- Frontend uses axios for all API calls
- Base URL configured in frontend
- JWT token included in Authorization header
- Error handling and loading states

---

## 🛠️ Development Setup

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MySQL (v8.0+)

### Complete Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd Research-Project-SLIIT
```

2. **Database Setup**
```bash
mysql -u root -p
source database/schema.sql
```

3. **Backend Setup**
```bash
cd backend
npm install
# Configure .env file
npm run dev
```

4. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

5. **ML Service Setup**
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

### Access Points
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- ML Service: http://localhost:5001

---

## 📝 Notes

### Current Status
- ✅ Backend API fully functional
- ✅ Frontend dashboard operational
- ✅ Database schema implemented
- ✅ Authentication system working
- ✅ Employee management complete
- ✅ QR code system functional
- ⚠️ ML service using mock predictions (real ML models pending)
- ⚠️ IoT integration simulated (real sensors pending)

### Future Enhancements
- Implement actual LSTM model for demand prediction
- Implement Random Forest model for staffing
- Real IoT sensor integration
- Mobile app development
- Advanced analytics dashboard
- Report generation
- Email notifications
- SMS alerts

---

## 👥 User Roles & Permissions

| Feature | Attendant | Supervisor | Manager |
|---------|-----------|------------|---------|
| Check-in/Check-out | ✅ | ✅ | ✅ |
| View own attendance | ✅ | ✅ | ✅ |
| View all attendance | ❌ | ✅ | ✅ |
| View predictions | ❌ | ✅ | ✅ |
| View fuel stocks | ❌ | ✅ | ✅ |
| Manage employees | ❌ | ❌ | ✅ |
| Generate reports | ❌ | ✅ | ✅ |

---

## 📞 Support & Documentation

For more information or support, please refer to:
- Backend API documentation (in-code comments)
- Frontend component documentation (in-code comments)
- Database schema (database/schema.sql)

---

**Last Updated**: December 3, 2024
**Version**: 1.0.0
**Project**: SLIIT Research Project - FUELWATCH
