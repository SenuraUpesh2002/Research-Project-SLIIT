from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

@app.route('/predict-demand', methods=['POST'])
def predict_demand():
    """
    Predict fuel demand for a given date and shift.
    Returns mock predictions for now.
    """
    try:
        data = request.json
        
        # Generate realistic mock prediction
        base_demand = 1500
        variation = random.randint(-200, 300)
        predicted_demand = base_demand + variation
        
        return jsonify({
            "predicted_demand": predicted_demand,
            "confidence": round(random.uniform(0.82, 0.95), 2),
            "model": "mock_lstm_v1"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict-staffing', methods=['POST'])
def predict_staffing():
    """
    Recommend optimal staffing based on predicted demand.
    Returns mock recommendations for now.
    """
    try:
        data = request.json
        predicted_demand = data.get('predicted_demand', 1500)
        
        # Simple staffing logic: 1 employee per 500L
        recommended_staff = max(2, min(5, int(predicted_demand / 500)))
        
        # Determine confidence based on demand
        if predicted_demand < 1000:
            confidence = "high"
        elif predicted_demand < 1800:
            confidence = "medium"
        else:
            confidence = "high"
        
        return jsonify({
            "recommended_staff": recommended_staff,
            "confidence": confidence,
            "expected_wait_time": f"{random.randint(3, 6)} minutes",
            "model": "mock_random_forest_v1"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "FuelWatch ML Service",
        "version": "1.0.0-mock",
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("=" * 50)
    print("🤖 FuelWatch ML Service Starting...")
    print("=" * 50)
    print("📊 Mode: Mock Predictions (No ML models loaded)")
    print("🌐 Running on: http://localhost:5001")
    print("=" * 50)
    app.run(port=5001, debug=True)
