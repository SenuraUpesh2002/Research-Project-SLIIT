import pandas as pd
import numpy as np

def analyze_data():
    df = pd.read_csv('ml-service/fuelwatch_sample_1000.csv')
    
    # Group by date, shift, station
    grouped = df.groupby(['date', 'shift', 'station_id'])
    
    consistent_staff = True
    inconsistent_groups = []
    
    print(f"Total groups: {len(grouped)}")
    
    for name, group in grouped:
        staff_counts = group['recommended_staff'].unique()
        if len(staff_counts) > 1:
            consistent_staff = False
            inconsistent_groups.append({
                'group': name,
                'staff_counts': staff_counts,
                'fuel_types': group['fuel_type'].tolist()
            })
            
    if consistent_staff:
        print("✓ recommended_staff is CONSISTENT within each (date, shift, station) group.")
    else:
        print(f"✗ recommended_staff is INCONSISTENT in {len(inconsistent_groups)} groups.")
        print("Example inconsistent group:", inconsistent_groups[0])

    # Analyze correlation between TOTAL demand and staff
    # Aggregating demand
    agg_df = grouped.agg({
        'actual_demand_liters': 'sum',
        'recommended_staff': 'max' # Assuming max or mean if consistent
    }).reset_index()
    
    print("\nAggregated Data Sample:")
    print(agg_df.head())
    
    correlation = agg_df['actual_demand_liters'].corr(agg_df['recommended_staff'])
    print(f"\nCorrelation between Total Demand and Staff: {correlation:.4f}")
    
    # Check correlation for single fuel type (original method)
    orig_corr = df['actual_demand_liters'].corr(df['recommended_staff'])
    print(f"Correlation between Single Fuel Demand and Staff (Original): {orig_corr:.4f}")

if __name__ == "__main__":
    analyze_data()
