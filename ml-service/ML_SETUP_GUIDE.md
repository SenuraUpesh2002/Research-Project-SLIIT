# FUELWATCH ML Setup Guide

## Requirements
**requirements.txt**
```
# Flask & API
flask==3.0.0
flask-cors==4.0.0

# Data Processing
pandas==2.1.0
numpy==1.24.3

# Machine Learning
scikit-learn==1.3.0

# Deep Learning (LSTM)
tensorflow==2.15.0
keras==2.15.0

# Time Series (ARIMA)
statsmodels==0.14.0

# Visualization (optional)
matplotlib==3.7.2
seaborn==0.12.2

# Utilities
python-dateutil==2.8.2
```

## Quick Start Guide

### Step 1: Install Dependencies
```bash
cd ml-service
pip install -r requirements.txt
```

### Step 2: Generate Dataset
```bash
# Run dataset generator
python generate_dataset.py
```
This will create:
- `fuelwatch_synthetic_dataset.csv` - Full dataset (~54,000 records)
- `fuelwatch_sample_1000.csv` - Sample dataset
- `dataset_summary.json` - Summary statistics

### Step 3: Train ML Models
```bash
# Train all models (LSTM, ARIMA, Random Forest)
python train_models.py
```
This will create models in `saved_models/` directory:
- `lstm_model.h5` - LSTM model for demand prediction
- `lstm_scaler_X.pkl` - Feature scaler for LSTM
- `lstm_scaler_y.pkl` - Target scaler for LSTM
- `arima_model.pkl` - ARIMA model for time series
- `random_forest_model.pkl` - Random Forest for staffing
- `rf_features.pkl` - Feature names for Random Forest
- `training_summary.json` - Training metrics

### Step 4: Run ML Service
```bash
python app.py
```
The service will start on `http://localhost:5001`

## Testing the API

### 1. Health Check
```bash
curl http://localhost:5001/health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "FuelWatch ML Service",
  "version": "2.0.0",
  "models": {
    "lstm": true,
    "arima": true,
    "random_forest": true
  },
  "models_count": 3,
  "timestamp": "2024-12-03T12:00:00"
}
```

### 2. Predict Demand
```bash
curl -X POST http://localhost:5001/predict-demand \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-12-15",
    "shift": "morning",
    "fuel_type": "Petrol_92",
    "station_id": "Station_A"
  }'
```

### 3. Predict Staffing
```bash
curl -X POST http://localhost:5001/predict-staffing \
  -H "Content-Type: application/json" \
  -d '{
    "predicted_demand": 1847.23,
    "date": "2024-12-15",
    "shift": "morning"
  }'
```

### 4. Batch Predictions
```bash
curl -X POST http://localhost:5001/batch-predict \
  -H "Content-Type: application/json" \
  -d '{
    "predictions": [
      {"date": "2024-12-15", "shift": "morning"},
      {"date": "2024-12-15", "shift": "afternoon"},
      {"date": "2024-12-16", "shift": "morning"}
    ]
  }'
```

## Model Performance Expectations

### LSTM Model
- **MAE**: ~100-150 liters
- **RMSE**: ~150-200 liters
- **MAPE**: ~8-10%
- **R²**: ~0.85-0.90

### ARIMA Model
- **MAE**: ~120-180 liters
- **RMSE**: ~180-220 liters
- **MAPE**: ~10-12%
- **R²**: ~0.80-0.85

### Random Forest (Staffing)
- **MAE**: ~0.3-0.5 staff
- **Accuracy**: ~85-90% (exact match)
- **R²**: ~0.75-0.85

## Integration with Backend

Update your backend `predictionController.js` to call the ML service:

```javascript
const axios = require('axios');
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

exports.predictDemand = async (req, res) => {
    try {
        const { date, shift, fuelType, stationId } = req.body;
        
        const response = await axios.post(`${ML_SERVICE_URL}/predict-demand`, {
            date,
            shift,
            fuel_type: fuelType,
            station_id: stationId
        });
        
        // Save prediction to database
        await savePredictionToDB(response.data);
        
        res.json(response.data);
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ error: 'Prediction failed' });
    }
};
```

## Troubleshooting

### Issue: TensorFlow not installing
**Solution**: Use CPU version
```bash
pip install tensorflow-cpu==2.15.0
```

### Issue: Models not loading
**Solution**: Check file paths
```bash
# Verify models exist
ls -la saved_models/
```

### Issue: Out of memory during training
**Solution**: Reduce batch size or use smaller dataset
```python
# In train_models.py, reduce batch_size
history = model.fit(
    X_train, y_train,
    batch_size=16, # Reduce from 32
    epochs=50
)
```

## Security Considerations
1. **API Authentication**: Add API keys for production
2. **Rate Limiting**: Prevent abuse
3. **Input Validation**: Validate all inputs
4. **Model Access Control**: Restrict who can reload models
5. **Logging**: Log all predictions for audit

---
**Last Updated**: December 3, 2024
**Version**: 2.0.0
**Contact**: FUELWATCH Development Team
