"""
Train Station Demand Model using Historical Averages
This approach computes actual historical averages per day-of-week from the CSV data.
Predictions will be deterministic (no randomness) and reflect real patterns.
"""
import pandas as pd
import numpy as np
import pickle
import os

print("=" * 60)
print("FUELWATCH - Training Station Demand Predictor")
print("=" * 60)

# Load dataset
print("\n[1/4] Loading dataset...")
df = pd.read_csv('fuelwatch_sample_1000.csv')
print(f"   Loaded {len(df)} records")

# Parse date
df['date'] = pd.to_datetime(df['date'])
df['day_of_week_num'] = df['date'].dt.dayofweek

# Aggregate by date to get TOTAL station demand per day
print("\n[2/4] Aggregating daily station demand...")
daily_demand = df.groupby('date').agg({
    'actual_demand_liters': 'sum',
    'day_of_week_num': 'first',
    'is_weekend': 'first',
    'month': 'first'
}).reset_index()

print(f"   Found {len(daily_demand)} unique days")
print(f"   Daily demand range: {daily_demand['actual_demand_liters'].min():.0f}L - {daily_demand['actual_demand_liters'].max():.0f}L")
print(f"   Average daily demand: {daily_demand['actual_demand_liters'].mean():.0f}L")

# Compute historical averages by day-of-week
print("\n[3/4] Computing historical averages by day-of-week...")
day_averages = daily_demand.groupby('day_of_week_num')['actual_demand_liters'].mean().to_dict()

day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
print("\n   Average Daily Demand by Day:")
for dow, avg in sorted(day_averages.items()):
    print(f"   {day_names[dow]:12s}: {avg:,.0f} liters")

# Compute monthly adjustment factors
month_averages = daily_demand.groupby('month')['actual_demand_liters'].mean()
overall_avg = daily_demand['actual_demand_liters'].mean()
month_factors = (month_averages / overall_avg).to_dict()

print("\n   Monthly Adjustment Factors:")
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
for m, factor in sorted(month_factors.items()):
    print(f"   {month_names[m-1]:4s}: {factor:.2f}x")

# Save the lookup tables as a model
model_data = {
    'day_averages': day_averages,
    'month_factors': month_factors,
    'overall_average': overall_avg,
    'shift_factors': {'morning': 0.40, 'afternoon': 0.35, 'evening': 0.25},  # Distribution of daily demand across shifts
    'version': '2.0'
}

# Create saved_models directory if it doesn't exist
if not os.path.exists('saved_models'):
    os.makedirs('saved_models')

model_path = 'saved_models/station_demand_model.pkl'
with open(model_path, 'wb') as f:
    pickle.dump(model_data, f)

print(f"\n[4/4] Model saved to {model_path}")
print("\n" + "=" * 60)
print("Training Complete!")
print("=" * 60)
print("\nPrediction Method:")
print("  1. Get base demand from day-of-week average")
print("  2. Apply monthly adjustment factor")
print("  3. Apply shift factor (morning=40%, afternoon=35%, evening=25%)")
print("\nThis ensures:")
print("  ✓ Predictions are deterministic (no randomness)")
print("  ✓ Different days show different demand (weekday vs weekend)")
print("  ✓ Predictions reflect actual historical patterns from data")
print("=" * 60)
