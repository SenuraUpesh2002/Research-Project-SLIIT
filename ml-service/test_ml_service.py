"""
FUELWATCH ML Service - Test Script
Tests all endpoints and validates responses
"""
import requests
import json
from datetime import datetime, timedelta

# Configuration
ML_SERVICE_URL = "http://localhost:5001"

COLORS = {
    'GREEN': '\033[92m',
    'RED': '\033[91m',
    'YELLOW': '\033[93m',
    'BLUE': '\033[94m',
    'END': '\033[0m'
}

def print_success(message):
    print(f"{COLORS['GREEN']}✓ {message}{COLORS['END']}")

def print_error(message):
    print(f"{COLORS['RED']}✗ {message}{COLORS['END']}")

def print_info(message):
    print(f"{COLORS['BLUE']}ℹ {message}{COLORS['END']}")

def print_warning(message):
    print(f"{COLORS['YELLOW']}⚠ {message}{COLORS['END']}")

def print_header(message):
    print(f"\n{'=' * 80}")
    print(f"{COLORS['BLUE']}{message}{COLORS['END']}")
    print('=' * 80)

def test_health_check():
    """Test health check endpoint"""
    print_header("TEST 1: Health Check")
    try:
        response = requests.get(f"{ML_SERVICE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print_success(f"Service is {data['status']}")
            print_info(f"Version: {data['version']}")
            print_info(f"Models loaded: {data['models_count']}/3")
            print_info(f"LSTM: {data['models']['lstm']}")
            print_info(f"ARIMA: {data['models']['arima']}")
            print_info(f"Random Forest: {data['models']['random_forest']}")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to ML service. Is it running on port 5001?")
        print_info("Start the service with: python ml-service/app.py")
        return False
    except Exception as e:
        print_error(f"Health check error: {e}")
        return False

def test_models_info():
    """Test models info endpoint"""
    print_header("TEST 2: Models Information")
    try:
        response = requests.get(f"{ML_SERVICE_URL}/models/info")
        if response.status_code == 200:
            data = response.json()
            print_success("Models info retrieved")
            for model_name, info in data.items():
                status = "✓ Loaded" if info['loaded'] else "✗ Not loaded"
                print(f"\n{model_name.upper()}:")
                print(f"  Status: {status}")
                print(f"  Purpose: {info['purpose']}")
                if info['path']:
                    print(f"  Path: {info['path']}")
            return True
        else:
            print_error(f"Models info failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Models info error: {e}")
        return False

def test_predict_demand():
    """Test demand prediction endpoint"""
    print_header("TEST 3: Demand Prediction")
    
    test_cases = [
        {
            "name": "Morning shift - Weekday",
            "data": {
                "date": "2024-12-16", # Monday
                "shift": "morning",
                "fuel_type": "Petrol_92",
                "station_id": "Station_A"
            }
        },
        {
            "name": "Afternoon shift - Weekend",
            "data": {
                "date": "2024-12-14", # Saturday
                "shift": "afternoon",
                "fuel_type": "Diesel",
                "station_id": "Station_B"
            }
        },
        {
            "name": "Evening shift - Holiday",
            "data": {
                "date": "2024-12-25", # Christmas
                "shift": "evening",
                "fuel_type": "Petrol_95",
                "station_id": "Station_C"
            }
        }
    ]
    
    all_passed = True
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n--- Test Case {i}: {test_case['name']} ---")
        try:
            response = requests.post(
                f"{ML_SERVICE_URL}/predict-demand",
                json=test_case['data']
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ['predicted_demand', 'confidence', 'model', 'date', 'shift']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print_error(f"Missing fields: {missing_fields}")
                    all_passed = False
                    continue
                    
                # Validate values
                demand = data['predicted_demand']
                confidence = data['confidence']
                
                if demand < 0 or demand > 5000:
                    print_warning(f"Demand out of expected range: {demand}")
                    
                if confidence < 0 or confidence > 1:
                    print_warning(f"Confidence out of range [0,1]: {confidence}")
                    
                print_success("Prediction successful")
                print_info(f"Predicted Demand: {demand:.2f} liters")
                print_info(f"Confidence: {confidence:.2%}")
                print_info(f"Model: {data['model']}")
                print_info(f"Factors: {json.dumps(data.get('factors', {}), indent=2)}")
                
            else:
                print_error(f"Prediction failed: {response.status_code}")
                print_error(f"Response: {response.text}")
                all_passed = False
                
        except Exception as e:
            print_error(f"Test case error: {e}")
            all_passed = False
            
    return all_passed

def test_predict_staffing():
    """Test staffing prediction endpoint"""
    print_header("TEST 4: Staffing Prediction")
    
    test_cases = [
        {
            "name": "Low demand",
            "data": {
                "predicted_demand": 900,
                "date": "2024-12-16",
                "shift": "evening"
            },
            "expected_staff_range": (2, 3)
        },
        {
            "name": "Medium demand",
            "data": {
                "predicted_demand": 1500,
                "date": "2024-12-16",
                "shift": "afternoon"
            },
            "expected_staff_range": (3, 4)
        },
        {
            "name": "High demand",
            "data": {
                "predicted_demand": 2200,
                "date": "2024-12-14",
                "shift": "morning"
            },
            "expected_staff_range": (4, 5)
        }
    ]
    
    all_passed = True
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n--- Test Case {i}: {test_case['name']} ---")
        try:
            response = requests.post(
                f"{ML_SERVICE_URL}/predict-staffing",
                json=test_case['data']
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Validate response structure
                required_fields = ['recommended_staff', 'confidence', 'expected_wait_time', 'model']
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    print_error(f"Missing fields: {missing_fields}")
                    all_passed = False
                    continue
                    
                # Validate values
                staff = data['recommended_staff']
                min_staff, max_staff = test_case['expected_staff_range']
                
                if staff < 2 or staff > 5:
                    print_error(f"Staff out of valid range [2,5]: {staff}")
                    all_passed = False
                    
                in_expected_range = min_staff <= staff <= max_staff
                
                if in_expected_range:
                    print_success("Staffing prediction successful")
                else:
                    print_warning(f"Staff {staff} outside expected range [{min_staff}-{max_staff}]")
                    
                print_info(f"Recommended Staff: {staff}")
                print_info(f"Confidence: {data['confidence']}")
                print_info(f"Expected Wait Time: {data['expected_wait_time']}")
                print_info(f"Model: {data['model']}")
                
            else:
                print_error(f"Staffing prediction failed: {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print_error(f"Test case error: {e}")
            all_passed = False
            
    return all_passed

def test_batch_predict():
    """Test batch prediction endpoint"""
    print_header("TEST 5: Batch Predictions")
    
    test_data = {
        "predictions": [
            {"date": "2024-12-16", "shift": "morning"},
            {"date": "2024-12-16", "shift": "afternoon"},
            {"date": "2024-12-16", "shift": "evening"}
        ]
    }
    
    try:
        response = requests.post(
            f"{ML_SERVICE_URL}/batch-predict",
            json=test_data
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and 'count' in data:
                print_success(f"Batch prediction successful: {data['count']} predictions")
                for i, result in enumerate(data['results'], 1):
                    print(f"\n  Prediction {i}:")
                    print(f"    Date: {result['date']}, Shift: {result['shift']}")
                    print(f"    Demand: {result['demand']['predicted_demand']:.2f}L")
                    print(f"    Staff: {result['staffing']['recommended_staff']}")
                return True
            else:
                print_error("Invalid response structure")
                return False
        else:
            print_error(f"Batch prediction failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Batch prediction error: {e}")
        return False

def test_error_handling():
    """Test error handling"""
    print_header("TEST 6: Error Handling")
    
    test_cases = [
        {
            "name": "Missing required fields",
            "endpoint": "/predict-demand",
            "data": {},
            "expected_status": 400
        },
        {
            "name": "Invalid date format",
            "endpoint": "/predict-demand",
            "data": {"date": "invalid", "shift": "morning"},
            "expected_status": 500
        },
        {
            "name": "Missing predicted_demand",
            "endpoint": "/predict-staffing",
            "data": {},
            "expected_status": 400
        }
    ]
    
    all_passed = True
    
    for test_case in test_cases:
        print(f"\n--- {test_case['name']} ---")
        try:
            response = requests.post(
                f"{ML_SERVICE_URL}{test_case['endpoint']}",
                json=test_case['data']
            )
            
            if response.status_code == test_case['expected_status']:
                print_success(f"Correct error handling: {response.status_code}")
            else:
                print_warning(f"Expected {test_case['expected_status']}, got {response.status_code}")
                
        except Exception as e:
            print_error(f"Error test failed: {e}")
            all_passed = False
            
    return all_passed

def main():
    """Run all tests"""
    print("\n" + "=" * 80)
    print(f"{COLORS['BLUE']}FUELWATCH ML SERVICE - TEST SUITE{COLORS['END']}")
    print("=" * 80)
    print(f"Target: {ML_SERVICE_URL}")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {
        "Health Check": test_health_check(),
        "Models Info": test_models_info(),
        "Demand Prediction": test_predict_demand(),
        "Staffing Prediction": test_predict_staffing(),
        "Batch Predictions": test_batch_predict(),
        "Error Handling": test_error_handling()
    }
    
    # Summary
    print_header("TEST SUMMARY")
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    for test_name, passed in results.items():
        status = f"{COLORS['GREEN']}✓ PASSED{COLORS['END']}" if passed else f"{COLORS['RED']}✗ FAILED{COLORS['END']}"
        print(f"{test_name:.<40} {status}")
        
    print("\n" + "=" * 80)
    print(f"Total: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print_success("All tests passed! 🚀")
        print_info("\nYour ML service is ready for integration with the backend.")
    else:
        print_error(f"{total_tests - passed_tests} test(s) failed")
        print_info("\nCheck the error messages above and fix the issues.")
    print("=" * 80 + "\n")
    
    return passed_tests == total_tests

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
