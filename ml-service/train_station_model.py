"""
Train a model for Full Station Staffing Prediction.
Aggregates demand across all fuel types and predicts staffing based on total demand.
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

def train_station_model():
    print("="*50)
    print("TRAINING STATION-LEVEL STAFFING MODEL")
    print("="*50)

    # 1. Load Data
    filepath = 'fuelwatch_sample_1000.csv'
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return

    df = pd.read_csv(filepath)
    print(f"Loaded {len(df)} records.")

    # 2. Aggregate Data by (Date, Shift, Station)
    # We want TOTAL demand for the station for a specific shift
    print("\nAggregating data...")
    
    # Group by unique shift occurrences
    # We assume 'recommended_staff' is the same for the whole station-shift
    station_df = df.groupby(['date', 'shift', 'station_id']).agg({
        'actual_demand_liters': 'sum',      # Sum of all fuels
        'recommended_staff': 'max',         # Should be consistent
        'day_of_week_num': 'first',
        'is_weekend': 'first',
        'shift_multiplier': 'first',
        'seasonal_factor': 'first'
    }).reset_index()

    print(f"Aggregated into {len(station_df)} station-shifts.")
    print(station_df.head())

    # 3. Prepare Features and Target
    # Features: Total Demand + Contextual factors
    features = ['actual_demand_liters', 'day_of_week_num', 'is_weekend', 'shift_multiplier', 'seasonal_factor']
    target = 'recommended_staff'

    X = station_df[features]
    y = station_df[target]

    # 4. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 5. Train Random Forest
    print("\nTraining Random Forest Regressor...")
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)

    # 6. Evaluate
    y_pred = rf.predict(X_test)
    y_pred_rounded = np.round(y_pred)
    
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    accuracy = np.mean(y_pred_rounded == y_test) * 100

    print(f"\nModel Performance:")
    print(f"MAE: {mae:.4f}")
    print(f"R2 Score: {r2:.4f}")
    print(f"Exact Match Accuracy: {accuracy:.2f}%")

    # 7. Save Model
    os.makedirs('saved_models', exist_ok=True)
    save_path = 'saved_models/station_rf_model.pkl'
    with open(save_path, 'wb') as f:
        pickle.dump(rf, f)
    
    print(f"\nModel saved to {save_path}")

if __name__ == "__main__":
    train_station_model()
