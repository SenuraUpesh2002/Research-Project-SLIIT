import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import json

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

print("=" * 60)
print("FUELWATCH - Synthetic Dataset Generator")
print("=" * 60)

# Configuration
START_DATE = "2022-01-01"
END_DATE = "2024-12-31"
FUEL_TYPES = ["Petrol_92", "Petrol_95", "Diesel", "Super_Diesel"]
SHIFTS = ["morning", "afternoon", "evening"]
STATIONS = ["Station_A", "Station_B", "Station_C", "Station_D", "Station_E"]

# Sri Lankan public holidays (simplified)
SRI_LANKA_HOLIDAYS = [
    "01-01", "01-14", "02-04", "04-13", "04-14", # Poya days and national
    "05-01", "05-22", "06-30", "08-15", "10-31", "12-25"
]

# Generate date range
date_range = pd.date_range(start=START_DATE, end=END_DATE, freq='D')

print(f"\nGenerating data from {START_DATE} to {END_DATE}")
print(f"Total days: {len(date_range)}")
print(f"Fuel types: {len(FUEL_TYPES)}")
print(f"Shifts per day: {len(SHIFTS)}")
print(f"Stations: {len(STATIONS)}")
print(f"Total records: {len(date_range) * len(SHIFTS) * len(STATIONS) * len(FUEL_TYPES)}")

data = []

for date in date_range:
    day_of_week = date.dayofweek # Monday=0, Sunday=6
    month = date.month
    is_weekend = day_of_week >= 5
    
    # Check if holiday
    date_str = date.strftime("%m-%d")
    is_holiday = date_str in SRI_LANKA_HOLIDAYS
    
    # Seasonal factor (higher demand in certain months)
    # Peak in December (holidays) and April (new year)
    seasonal_factor = 1 + 0.3 * np.sin(2 * np.pi * (month - 1) / 12)
    
    # Weather simulation (temperature affects demand)
    temperature = 27 + 3 * np.sin(2 * np.pi * month / 12) + np.random.normal(0, 2)
    rainfall = max(0, 50 + 100 * np.sin(2 * np.pi * (month - 5) / 12) + np.random.normal(0, 30))
    
    for shift in SHIFTS:
        # Shift timing
        shift_hour = {"morning": 8, "afternoon": 14, "evening": 20}[shift]
        
        for station in STATIONS:
            # Station-specific factors (some stations are busier)
            station_factor = {
                "Station_A": 1.2, # Busiest
                "Station_B": 1.0,
                "Station_C": 0.9,
                "Station_D": 1.1,
                "Station_E": 0.8 # Least busy
            }[station]
            
            for fuel_type in FUEL_TYPES:
                # Base demand varies by fuel type (liters)
                base_demand = {
                    "Petrol_92": 1500, # Most common
                    "Petrol_95": 900, # Premium
                    "Diesel": 1800, # Commercial vehicles
                    "Super_Diesel": 700 # Least common
                }[fuel_type]
                
                # Shift multipliers
                shift_multiplier = {
                    "morning": 1.3, # Rush hour
                    "afternoon": 1.0, # Normal
                    "evening": 0.85 # Lower
                }[shift]
                
                # Weekend multiplier (more leisure travel)
                weekend_multiplier = 1.25 if is_weekend else 1.0
                
                # Holiday multiplier (much higher demand)
                holiday_multiplier = 1.6 if is_holiday else 1.0
                
                # Weather impact (rain reduces demand slightly)
                weather_multiplier = 0.95 if rainfall > 100 else 1.0
                
                # Calculate predicted demand with all factors
                predicted_demand = (base_demand * seasonal_factor * shift_multiplier * 
                                  weekend_multiplier * holiday_multiplier * 
                                  station_factor * weather_multiplier)
                
                # Add realistic noise (±15%)
                actual_demand = max(0, predicted_demand + np.random.normal(0, base_demand * 0.15))
                
                # Round to 2 decimal places
                actual_demand = round(actual_demand, 2)
                predicted_demand = round(predicted_demand, 2)
                
                # Number of transactions (average 35-45 liters per vehicle)
                avg_liters_per_vehicle = random.uniform(35, 45)
                num_transactions = int(actual_demand / avg_liters_per_vehicle)
                
                # Average wait time (increases with demand)
                base_wait = 3 # minutes
                demand_ratio = actual_demand / base_demand
                avg_wait_time = round(base_wait + demand_ratio * 4, 1) # 3-10 minutes
                
                # Peak hour wait time (higher)
                peak_wait_time = round(avg_wait_time * 1.5, 1) if shift == "morning" else avg_wait_time
                
                # Tank capacity (10,000 - 20,000 liters)
                tank_capacity = random.choice([10000, 15000, 20000])
                
                # Stock level simulation
                # Start with random initial stock
                stock_before = random.uniform(tank_capacity * 0.5, tank_capacity * 0.95)
                stock_after = max(0, stock_before - actual_demand)
                stock_percentage = round((stock_after / tank_capacity) * 100, 1)
                
                # Alert status
                if stock_percentage < 20:
                    alert_status = "critical"
                elif stock_percentage < 40:
                    alert_status = "low"
                else:
                    alert_status = "normal"
                
                # Staff recommendation (1 staff per 500L demand)
                recommended_staff = max(2, min(5, int(actual_demand / 500) + 1))
                
                # Price per liter (LKR - Sri Lankan Rupee)
                price_per_liter = {
                    "Petrol_92": 380 + random.uniform(-5, 5),
                    "Petrol_95": 450 + random.uniform(-5, 5),
                    "Diesel": 360 + random.uniform(-5, 5),
                    "Super_Diesel": 420 + random.uniform(-5, 5)
                }[fuel_type]
                
                # Revenue calculation
                revenue = round(actual_demand * price_per_liter, 2)
                
                # Create record
                record = {
                    # Date & Time
                    "date": date.strftime("%Y-%m-%d"),
                    "day_of_week": date.strftime("%A"),
                    "day_of_week_num": day_of_week,
                    "month": month,
                    "year": date.year,
                    "shift": shift,
                    "shift_hour": shift_hour,
                    "is_weekend": int(is_weekend),
                    "is_holiday": int(is_holiday),
                    
                    # Station Info
                    "station_id": station,
                    "station_factor": station_factor,
                    
                    # Fuel Info
                    "fuel_type": fuel_type,
                    "price_per_liter": round(price_per_liter, 2),
                    
                    # Demand Data
                    "predicted_demand_liters": predicted_demand,
                    "actual_demand_liters": actual_demand,
                    "demand_accuracy": round((1 - abs(predicted_demand - actual_demand) / predicted_demand) * 100, 2),
                    
                    # Transaction Data
                    "num_transactions": num_transactions,
                    "avg_liters_per_transaction": round(actual_demand / max(1, num_transactions), 2),
                    
                    # Wait Time Data
                    "avg_wait_time_minutes": avg_wait_time,
                    "peak_wait_time_minutes": peak_wait_time,
                    
                    # Stock Data
                    "tank_capacity_liters": tank_capacity,
                    "stock_before_liters": round(stock_before, 2),
                    "stock_after_liters": round(stock_after, 2),
                    "stock_percentage": stock_percentage,
                    "alert_status": alert_status,
                    
                    # Staffing
                    "recommended_staff": recommended_staff,
                    
                    # Weather
                    "temperature_celsius": round(temperature, 1),
                    "rainfall_mm": round(rainfall, 1),
                    
                    # Financial
                    "revenue_lkr": revenue,
                    
                    # Multipliers (for analysis)
                    "seasonal_factor": round(seasonal_factor, 3),
                    "shift_multiplier": shift_multiplier,
                    "weekend_multiplier": weekend_multiplier,
                    "holiday_multiplier": holiday_multiplier,
                    "weather_multiplier": weather_multiplier
                }
                data.append(record)

# Create DataFrame
df = pd.DataFrame(data)

print("\n" + "=" * 60)
print("Dataset Generation Complete!")
print("=" * 60)
print(f"\nTotal records generated: {len(df):,}")
print(f"\nDataset shape: {df.shape}")
print(f"\nColumns: {len(df.columns)}")

# Display sample data
print("\n" + "=" * 60)
print("Sample Data (First 5 rows):")
print("=" * 60)
print(df.head().to_string())

# Display statistics
print("\n" + "=" * 60)
print("Dataset Statistics:")
print("=" * 60)
print(f"\nDate Range: {df['date'].min()} to {df['date'].max()}")
print(f"Total Fuel Demand: {df['actual_demand_liters'].sum():,.2f} liters")
print(f"Average Daily Demand: {df.groupby('date')['actual_demand_liters'].sum().mean():,.2f} liters")
print(f"Total Revenue: LKR {df['revenue_lkr'].sum():,.2f}")

print(f"\nDemand by Fuel Type:")
print(df.groupby('fuel_type')['actual_demand_liters'].sum().sort_values(ascending=False))

print(f"\nDemand by Shift:")
print(df.groupby('shift')['actual_demand_liters'].sum().sort_values(ascending=False))

print(f"\nDemand by Station:")
print(df.groupby('station_id')['actual_demand_liters'].sum().sort_values(ascending=False))

# Save to CSV
csv_filename = "fuelwatch_synthetic_dataset.csv"
df.to_csv(csv_filename, index=False)
print(f"\n✓ Dataset saved as: {csv_filename}")

# Save a smaller sample for testing
sample_df = df.sample(n=min(1000, len(df)), random_state=42)
sample_filename = "fuelwatch_sample_1000.csv"
sample_df.to_csv(sample_filename, index=False)
print(f"✓ Sample dataset (1000 rows) saved as: {sample_filename}")

# Save summary statistics
summary = {
    "total_records": len(df),
    "date_range": {
        "start": df['date'].min(),
        "end": df['date'].max()
    },
    "fuel_types": FUEL_TYPES,
    "shifts": SHIFTS,
    "stations": STATIONS,
    "total_demand_liters": float(df['actual_demand_liters'].sum()),
    "total_revenue_lkr": float(df['revenue_lkr'].sum()),
    "avg_demand_accuracy": float(df['demand_accuracy'].mean())
}

with open("dataset_summary.json", "w") as f:
    json.dump(summary, f, indent=2)
    
print(f"✓ Summary saved as: dataset_summary.json")

print("\n" + "=" * 60)
print("Files Generated:")
print("=" * 60)
print(f"1. {csv_filename} - Full dataset")
print(f"2. {sample_filename} - Sample for testing")
print(f"3. dataset_summary.json - Dataset summary")

print("\n" + "=" * 60)
print("Next Steps:")
print("=" * 60)
print("1. Use the CSV file to train your ML models (LSTM, ARIMA)")
print("2. Import data into MySQL database")
print("3. Use for testing prediction endpoints")
print("4. Visualize data in your dashboard")
print("\n" + "=" * 60)
