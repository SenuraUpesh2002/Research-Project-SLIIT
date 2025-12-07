import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:5001"

def print_header(msg):
    print(f"\n{'='*50}\n{msg}\n{'='*50}")

def print_success(msg):
    print(f"✅ {msg}")

def print_error(msg):
    print(f"❌ {msg}")

def test_weather_endpoints():
    print_header("TEST 1: Weather Endpoints")
    
    # 1. Current Weather
    try:
        print("Testing GET /weather/current...")
        response = requests.get(f"{BASE_URL}/weather/current")
        if response.status_code == 200:
            data = response.json()
            print_success("Current weather fetched successfully")
            print(f"   Temp: {data.get('temperature')}°C, Cond: {data.get('condition')}")
            if data.get('is_mock'):
                print("   (Note: Using mock data)")
        else:
            print_error(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print_error(f"Connection error: {e}")

    # 2. Forecast
    try:
        print("\nTesting GET /weather/forecast...")
        response = requests.get(f"{BASE_URL}/weather/forecast", params={"date": "2024-12-25"})
        if response.status_code == 200:
            data = response.json()
            print_success("Forecast fetched successfully")
            print(f"   Date: 2024-12-25, Temp: {data.get('temperature')}°C")
        else:
            print_error(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print_error(f"Connection error: {e}")

def test_enhanced_staffing_prediction():
    print_header("TEST 2: Enhanced Staffing Prediction")
    
    payload = {
        "predicted_demand": 1200,
        "date": "2024-12-25",
        "shift": "morning",
        "include_weather": True,
        "include_holidays": True
    }
    
    try:
        print(f"Sending payload: {json.dumps(payload, indent=2)}")
        response = requests.post(f"{BASE_URL}/predict-staffing", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Prediction successful")
            print(f"   Recommended Staff: {data.get('recommended_staff')}")
            
            # Check for new fields
            if 'weather' in data:
                print_success("Weather context included in response")
            else:
                print_error("Weather context MISSING in response")
                
            if 'factors' in data:
                print_success("Factors analysis included in response")
                print(f"   Factors: {json.dumps(data.get('factors'), indent=2)}")
            else:
                print_error("Factors analysis MISSING in response")
                
        else:
            print_error(f"Failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print_error(f"Connection error: {e}")

if __name__ == "__main__":
    print(f"Targeting ML Service at: {BASE_URL}")
    test_weather_endpoints()
    test_enhanced_staffing_prediction()
