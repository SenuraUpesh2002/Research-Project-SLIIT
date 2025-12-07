import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Configuration
DATA_PATH = 'fuelwatch_synthetic_dataset.csv'
MODEL_PATH = 'saved_models/random_forest_model.pkl' # Overwrite existing or new? Let's overwrite as per request implies "Upgrade"
ENHANCED_MODEL_PATH = 'saved_models/random_forest_model_enhanced.pkl' # Actually, let's save as new to be safe

def generate_enhanced_features(df):
    """Add new research focus features to the dataset"""
    print("Generating enhanced features...")
    
    # 1. Weather Features (Synthetic)
    # Simulate weather based on simple rules or random for training
    df['temperature'] = np.random.uniform(25, 34, size=len(df))
    df['rainfall_mm'] = np.random.exponential(2, size=len(df)) # Skewed towards 0
    df['is_rainy'] = (df['rainfall_mm'] > 1.0).astype(int)
    
    # Temperature categories
    conditions = [
        (df['temperature'] < 25),
        (df['temperature'] >= 25) & (df['temperature'] < 30),
        (df['temperature'] >= 30)
    ]
    choices = [0, 1, 2] # Cold, Mild/Warm, Hot
    df['temp_category'] = np.select(conditions, choices, default=1)
    
    # 2. Time-Based Features
    # Assuming 'timestamp' or 'hour' exists or we derive it
    # The synthetic dataset might not have 'hour', let's check. 
    # If not, we'll simulate it based on 'shift'
    
    if 'hour' not in df.columns:
        # Simulate hour based on shift
        # Morning: 6-13, Afternoon: 14-21, Evening: 22-5 (approx)
        def assign_hour(shift):
            if shift == 'morning': return np.random.randint(6, 14)
            if shift == 'afternoon': return np.random.randint(14, 22)
            return np.random.randint(22, 24) # Evening/Night
        
        df['hour'] = df['shift'].apply(assign_hour)

    df['is_peak_hour'] = df['hour'].isin([7, 8, 9, 12, 13, 14, 17, 18, 19]).astype(int)
    
    # 3. Holiday Features
    # Randomly assign 5% as holidays
    df['is_holiday'] = np.random.choice([0, 1], size=len(df), p=[0.95, 0.05])
    df['is_long_weekend'] = (df['is_holiday'] == 1) & (df['day_of_week_num'].isin([0, 4, 5, 6])).astype(int)
    
    # 4. Busy Time Patterns
    # Previous demand lag (simulated)
    df['prev_hour_demand'] = df['demand'] * np.random.uniform(0.8, 1.2)
    
    return df

def train_enhanced_model():
    print(f"Loading data from {DATA_PATH}...")
    try:
        df = pd.read_csv(DATA_PATH)
    except FileNotFoundError:
        print("Dataset not found. Please run generate_dataset.py first.")
        return

    # Basic preprocessing
    df['date'] = pd.to_datetime(df['date'])
    df['day_of_week_num'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    
    # Generate enhanced features
    df = generate_enhanced_features(df)
    
    # Define features for training
    feature_cols = [
        'demand', 'day_of_week_num', 'month', 'is_weekend',
        'temperature', 'is_rainy', 'temp_category',
        'hour', 'is_peak_hour',
        'is_holiday', 'is_long_weekend',
        'prev_hour_demand'
    ]
    
    # Target: Staff count (synthetic rule: 1 staff per 400L + noise)
    # We recalculate target to match enhanced logic
    df['required_staff'] = np.ceil(df['demand'] / 450).astype(int)
    # Adjust for peaks and weather
    df['required_staff'] += df['is_peak_hour'] # Add 1 staff for peaks
    df['required_staff'] -= df['is_rainy'] * 0.5 # Reduce slightly for rain (less walk-ins?)
    df['required_staff'] = df['required_staff'].round().clip(2, 6) # Ensure bounds
    
    X = df[feature_cols]
    y = df['required_staff']
    
    print(f"Training with {len(feature_cols)} features...")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"MAE: {mae:.4f} staff members")
    print(f"R² Score: {r2:.4f}")
    
    # Save model
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    print(f"\nModel saved to {MODEL_PATH}")
    
    # Save feature names
    with open('saved_models/rf_features_enhanced.pkl', 'wb') as f:
        pickle.dump(feature_cols, f)

if __name__ == "__main__":
    train_enhanced_model()
