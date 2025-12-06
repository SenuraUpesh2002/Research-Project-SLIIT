"""
FUELWATCH - ML Model Training Suite
Includes: LSTM, ARIMA, and Random Forest models for demand prediction and staffing
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import pickle
import json
import warnings
import os

warnings.filterwarnings('ignore')

# ML Libraries
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Deep Learning
try:
    from tensorflow import keras
    from keras.models import Sequential
    from keras.layers import LSTM, Dense, Dropout
    from keras.callbacks import EarlyStopping, ModelCheckpoint
    KERAS_AVAILABLE = True
except ImportError:
    print(" TensorFlow/Keras not installed. LSTM model will be skipped.")
    KERAS_AVAILABLE = False

# Time Series
try:
    from statsmodels.tsa.arima.model import ARIMA
    from statsmodels.tsa.stattools import adfuller
    STATSMODELS_AVAILABLE = True
except ImportError:
    print(" Statsmodels not installed. ARIMA model will be skipped.")
    STATSMODELS_AVAILABLE = False

print("=" * 80)
print("FUELWATCH - ML MODEL TRAINING SUITE")
print("=" * 80)

# ===========================================================================
# 1. DATA LOADING AND PREPROCESSING
# ===========================================================================

def load_and_preprocess_data(filepath='fuelwatch_synthetic_dataset.csv'):
    """Load and preprocess the dataset"""
    print("\n Loading dataset...")
    if not os.path.exists(filepath):
        print(f"Dataset not found at {filepath}. Please run generate_dataset.py first.")
        return None
        
    df = pd.read_csv(filepath)
    
    # Convert date to datetime
    df['date'] = pd.to_datetime(df['date'])
    
    # Sort by date
    df = df.sort_values('date')
    
    print(f"✓ Dataset loaded: {len(df):,} records")
    print(f"✓ Date range: {df['date'].min()} to {df['date'].max()}")
    return df

# ===========================================================================
# 2. FEATURE ENGINEERING
# ===========================================================================

def create_features(df):
    """Create additional features for ML models"""
    print("\n Creating features...")
    df = df.copy()
    
    # Lag features (previous days' demand)
    df['demand_lag_1'] = df.groupby(['station_id', 'fuel_type', 'shift'])['actual_demand_liters'].shift(1)
    df['demand_lag_7'] = df.groupby(['station_id', 'fuel_type', 'shift'])['actual_demand_liters'].shift(7)
    df['demand_lag_30'] = df.groupby(['station_id', 'fuel_type', 'shift'])['actual_demand_liters'].shift(30)
    
    # Rolling statistics
    df['demand_rolling_mean_7'] = df.groupby(['station_id', 'fuel_type', 'shift'])['actual_demand_liters'].transform(
        lambda x: x.rolling(window=7, min_periods=1).mean()
    )
    df['demand_rolling_std_7'] = df.groupby(['station_id', 'fuel_type', 'shift'])['actual_demand_liters'].transform(
        lambda x: x.rolling(window=7, min_periods=1).std()
    )
    
    # Cyclical features (sin/cos encoding)
    df['day_sin'] = np.sin(2 * np.pi * df['day_of_week_num'] / 7)
    df['day_cos'] = np.cos(2 * np.pi * df['day_of_week_num'] / 7)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    
    # Drop rows with NaN from lag features
    df = df.dropna()
    
    print(f"✓ Features created. Dataset shape: {df.shape}")
    return df

# ===========================================================================
# 3. LSTM MODEL (Deep Learning for Time Series)
# ===========================================================================

def train_lstm_model(df, save_path='saved_models/'):
    """Train LSTM model for demand prediction"""
    if not KERAS_AVAILABLE:
        print("\n Skipping LSTM model (TensorFlow not available)")
        return None
        
    print("\n" + "=" * 80)
    print(" TRAINING LSTM MODEL")
    print("=" * 80)
    
    # Prepare data for LSTM
    features = ['day_of_week_num', 'month', 'is_weekend', 'is_holiday', 
                'temperature_celsius', 'rainfall_mm', 'seasonal_factor', 
                'shift_multiplier', 'demand_lag_1', 'demand_lag_7', 
                'demand_rolling_mean_7']
    
    # Filter for one station and fuel type for simplicity
    df_filtered = df[(df['station_id'] == 'Station_A') & (df['fuel_type'] == 'Petrol_92')].copy()
    
    X = df_filtered[features].values
    y = df_filtered['actual_demand_liters'].values
    
    # Normalize data
    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    
    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y.reshape(-1, 1))
    
    # Create sequences for LSTM (use past 7 days to predict next day)
    def create_sequences(X, y, time_steps=7):
        Xs, ys = [], []
        for i in range(len(X) - time_steps):
            Xs.append(X[i:(i + time_steps)])
            ys.append(y[i + time_steps])
        return np.array(Xs), np.array(ys)
    
    TIME_STEPS = 7
    X_seq, y_seq = create_sequences(X_scaled, y_scaled, TIME_STEPS)
    
    # Split data
    train_size = int(len(X_seq) * 0.8)
    X_train, X_test = X_seq[:train_size], X_seq[train_size:]
    y_train, y_test = y_seq[:train_size], y_seq[train_size:]
    
    print(f"Training set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Build LSTM model
    model = Sequential([
        LSTM(128, activation='relu', return_sequences=True, input_shape=(TIME_STEPS, X.shape[1])),
        Dropout(0.2),
        LSTM(64, activation='relu', return_sequences=False),
        Dropout(0.2),
        Dense(32, activation='relu'),
        Dense(1)
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    
    print("\n Model Architecture:")
    model.summary()
    
    # Callbacks
    early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    checkpoint = ModelCheckpoint(f'{save_path}lstm_best.h5', monitor='val_loss', save_best_only=True)
    
    # Train model
    print("\n Training LSTM model...")
    history = model.fit(
        X_train, y_train,
        validation_split=0.2,
        epochs=50,
        batch_size=32,
        callbacks=[early_stop, checkpoint],
        verbose=1
    )
    
    # Evaluate
    y_pred_scaled = model.predict(X_test)
    y_pred = scaler_y.inverse_transform(y_pred_scaled)
    y_test_actual = scaler_y.inverse_transform(y_test)
    
    mae = mean_absolute_error(y_test_actual, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test_actual, y_pred))
    r2 = r2_score(y_test_actual, y_pred)
    mape = np.mean(np.abs((y_test_actual - y_pred) / y_test_actual)) * 100
    
    print("\n LSTM Model Performance:")
    print(f"MAE: {mae:.2f} liters")
    print(f"RMSE: {rmse:.2f} liters")
    print(f"R² Score: {r2:.4f}")
    print(f"MAPE: {mape:.2f}%")
    
    # Save model and scalers
    model.save(f'{save_path}lstm_model.h5')
    with open(f'{save_path}lstm_scaler_X.pkl', 'wb') as f:
        pickle.dump(scaler_X, f)
    with open(f'{save_path}lstm_scaler_y.pkl', 'wb') as f:
        pickle.dump(scaler_y, f)
        
    print(f"\n✓ LSTM model saved to {save_path}")
    
    return {
        'model': model,
        'scaler_X': scaler_X,
        'scaler_y': scaler_y,
        'metrics': {'mae': mae, 'rmse': rmse, 'r2': r2, 'mape': mape},
        'history': history.history
    }

# ===========================================================================
# 4. ARIMA MODEL (Statistical Time Series)
# ===========================================================================

def train_arima_model(df, save_path='saved_models/'):
    """Train ARIMA model for demand prediction"""
    if not STATSMODELS_AVAILABLE:
        print("\n Skipping ARIMA model (Statsmodels not available)")
        return None
        
    print("\n" + "=" * 80)
    print(" TRAINING ARIMA MODEL")
    print("=" * 80)
    
    # Filter for one station, fuel type, and shift
    df_filtered = df[
        (df['station_id'] == 'Station_A') & 
        (df['fuel_type'] == 'Petrol_92') & 
        (df['shift'] == 'morning')
    ].copy()
    
    # Sort by date
    df_filtered = df_filtered.sort_values('date')
    
    # Create time series
    ts = df_filtered.set_index('date')['actual_demand_liters']
    
    # Check stationarity
    try:
        adf_result = adfuller(ts.dropna())
        print(f"\nADF Statistic: {adf_result[0]:.4f}")
        print(f"p-value: {adf_result[1]:.4f}")
        
        if adf_result[1] > 0.05:
            print(" Series is non-stationary. Differencing may be needed.")
        else:
            print("✓ Series is stationary")
    except Exception as e:
        print(f"ADF test failed: {e}")
    
    # Split data
    train_size = int(len(ts) * 0.8)
    train, test = ts[:train_size], ts[train_size:]
    
    print(f"\nTraining set: {len(train)} days")
    print(f"Test set: {len(test)} days")
    
    # Train ARIMA model
    print("\n Training ARIMA model...")
    # Using (p=5, d=1, q=2) - you can tune these parameters
    try:
        model = ARIMA(train, order=(5, 1, 2))
        model_fit = model.fit()
        
        print("\n ARIMA Model Summary:")
        print(model_fit.summary())
        
        # Make predictions
        predictions = model_fit.forecast(steps=len(test))
        
        # Evaluate
        mae = mean_absolute_error(test, predictions)
        rmse = np.sqrt(mean_squared_error(test, predictions))
        r2 = r2_score(test, predictions)
        mape = np.mean(np.abs((test - predictions) / test)) * 100
        
        print("\n ARIMA Model Performance:")
        print(f"MAE: {mae:.2f} liters")
        print(f"RMSE: {rmse:.2f} liters")
        print(f"R² Score: {r2:.4f}")
        print(f"MAPE: {mape:.2f}%")
        
        # Save model
        with open(f'{save_path}arima_model.pkl', 'wb') as f:
            pickle.dump(model_fit, f)
            
        print(f"\n✓ ARIMA model saved to {save_path}")
        
        return {
            'model': model_fit,
            'metrics': {'mae': mae, 'rmse': rmse, 'r2': r2, 'mape': mape},
            'predictions': predictions,
            'test': test
        }
    except Exception as e:
        print(f"ARIMA training failed: {e}")
        return None

# ===========================================================================
# 5. RANDOM FOREST MODEL (For Staffing Recommendations)
# ===========================================================================

def train_random_forest_model(df, save_path='saved_models/'):
    """Train Random Forest model for staffing recommendations"""
    print("\n" + "=" * 80)
    print(" TRAINING RANDOM FOREST MODEL (Staffing)")
    print("=" * 80)
    
    # Features for staffing prediction
    features = ['actual_demand_liters', 'num_transactions', 'avg_wait_time_minutes', 
                'day_of_week_num', 'is_weekend', 'is_holiday', 'shift_multiplier', 
                'temperature_celsius', 'seasonal_factor']
    
    X = df[features].values
    y = df['recommended_staff'].values
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Train model
    print("\n Training Random Forest model...")
    rf_model = RandomForestRegressor(
        n_estimators=100, 
        max_depth=10, 
        min_samples_split=5, 
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)
    
    # Predictions
    y_pred = rf_model.predict(X_test)
    y_pred = np.round(y_pred).astype(int) # Round to nearest integer
    y_pred = np.clip(y_pred, 2, 5) # Ensure between 2-5 staff
    
    # Evaluate
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    # Accuracy (exact match)
    accuracy = np.mean(y_pred == y_test) * 100
    
    print("\n Random Forest Model Performance:")
    print(f"MAE: {mae:.2f} staff")
    print(f"RMSE: {rmse:.2f} staff")
    print(f"R² Score: {r2:.4f}")
    print(f"Accuracy (exact match): {accuracy:.2f}%")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n Feature Importance:")
    print(feature_importance.to_string(index=False))
    
    # Save model
    with open(f'{save_path}random_forest_model.pkl', 'wb') as f:
        pickle.dump(rf_model, f)
        
    # Save feature names
    with open(f'{save_path}rf_features.pkl', 'wb') as f:
        pickle.dump(features, f)
        
    print(f"\n✓ Random Forest model saved to {save_path}")
    
    return {
        'model': rf_model,
        'metrics': {'mae': mae, 'rmse': rmse, 'r2': r2, 'accuracy': accuracy},
        'feature_importance': feature_importance,
        'features': features
    }

# ===========================================================================
# 6. MAIN TRAINING PIPELINE
# ===========================================================================

def main():
    """Main training pipeline"""
    # Create saved_models directory
    import os
    os.makedirs('saved_models', exist_ok=True)
    
    # Load data
    df = load_and_preprocess_data()
    if df is None:
        return
        
    # Create features
    df = create_features(df)
    
    # Train models
    results = {}
    
    # 1. LSTM Model
    lstm_result = train_lstm_model(df)
    if lstm_result:
        results['lstm'] = lstm_result
        
    # 2. ARIMA Model
    arima_result = train_arima_model(df)
    if arima_result:
        results['arima'] = arima_result
        
    # 3. Random Forest Model
    rf_result = train_random_forest_model(df)
    if rf_result:
        results['random_forest'] = rf_result
        
    # Save training summary
    summary = {
        'training_date': datetime.now().isoformat(),
        'dataset_size': len(df),
        'models_trained': list(results.keys()),
        'metrics': {}
    }
    
    for model_name, result in results.items():
        if 'metrics' in result:
            summary['metrics'][model_name] = result['metrics']
            
    with open('saved_models/training_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
        
    print("\n" + "=" * 80)
    print(" TRAINING COMPLETE!")
    print("=" * 80)
    print("\n Models saved in 'saved_models/' directory:")
    print(" - lstm_model.h5 (LSTM for demand prediction)")
    print(" - arima_model.pkl (ARIMA for time series forecasting)")
    print(" - random_forest_model.pkl (Random Forest for staffing)")
    print(" - training_summary.json (Training metrics)")
    print("\n Next Steps:")
    print(" 1. Integrate models into Flask ML service (ml-service/app.py)")
    print(" 2. Update prediction endpoints to use trained models")
    print(" 3. Test predictions with real data")
    print(" 4. Deploy to production")
    
    return results

if __name__ == "__main__":
    main()
