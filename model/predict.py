import sys
import json
import pandas as pd
import pickle
import os

# Load model and scaler from the same directory as this script
model_path = os.path.join(os.path.dirname(__file__), 'recommender_model.pkl')
scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

# Ensure model and scaler exist
if not os.path.exists(model_path) or not os.path.exists(scaler_path):
    print("Model or scaler not found. Train the model first.")
    sys.exit(1)

with open(model_path, 'rb') as f:
    model = pickle.load(f)

with open(scaler_path, 'rb') as f:
    scaler = pickle.load(f)

def predict_recommendation(station_data):
    """Predict recommendation score for a single station"""
    df = pd.DataFrame([station_data])
    
    # Encode categorical variables
    fuel_map = {'Available': 1.0, 'Limited': 0.5, 'Not Available': 0.0}
    confidence_map = {'High': 1.0, 'Medium': 0.6, 'Low': 0.3}
    
    for fuel_type in ['petrolAvailability', 'dieselAvailability', 'superPetrolAvailability']:
        df[fuel_type] = df[fuel_type].map(fuel_map)
    
    df['availabilityConfidence'] = df['availabilityConfidence'].map(confidence_map)
    
    # Calculate minutes since update
    now = pd.Timestamp.now()
    df['lastUpdated'] = pd.to_datetime(df['lastUpdated'], format='%Y-%m-%dT%H:%M:%SZ')
    df['minutesSinceUpdate'] = (now - df['lastUpdated']).dt.total_seconds() / 60
    
    # Fill missing values
    df.fillna({
        'petrolAvailability': 0.0,
        'dieselAvailability': 0.0,
        'superPetrolAvailability': 0.0,
        'availabilityConfidence': 0.3,
        'estimatedWaitTime': 0.0,
        'minutesSinceUpdate': 0.0
    }, inplace=True)
    
    # Select features
    features = ['petrolAvailability', 'dieselAvailability', 'superPetrolAvailability',
                'availabilityConfidence', 'estimatedWaitTime', 'minutesSinceUpdate']
    
    X = df[features]
    
    # Clip negative values
    X['estimatedWaitTime'] = X['estimatedWaitTime'].clip(lower=0)
    X['minutesSinceUpdate'] = X['minutesSinceUpdate'].clip(lower=0)
    
    # Scale features
    X_scaled = scaler.transform(X)
    
    # Predict
    score = model.predict(X_scaled)[0]
    return score

# Read input from command line
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <input_file_path>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    
    try:
        with open(input_path, 'r') as f:
            station_data = json.load(f)
        score = predict_recommendation(station_data)
        print(score)  # Output prediction as plain text
    except Exception as e:
        print(f"Prediction error: {e}")
        sys.exit(1)