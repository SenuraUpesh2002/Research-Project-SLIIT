import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split, learning_curve, cross_val_score
from sklearn.preprocessing import StandardScaler
import math
import datetime
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.inspection import PartialDependenceDisplay

# -----------------------------
# 1. Helper Functions
# -----------------------------

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate distance in kilometers between two coordinates"""
    R = 6371  # Earth radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

def encode_categorical(df):
    """Encode categorical columns as specified"""
    # Fuel availability mapping
    fuel_map = {'Available': 1.0, 'Limited': 0.5, 'Not Available': 0.0}
    
    # Availability confidence mapping
    confidence_map = {'High': 1.0, 'Medium': 0.6, 'Low': 0.3}
    
    # Encode all fuel availability columns
    for fuel_type in ['petrolAvailability', 'dieselAvailability', 'superPetrolAvailability']:
        df[fuel_type] = df[fuel_type].map(fuel_map)
    
    # Encode availability confidence
    df['availabilityConfidence'] = df['availabilityConfidence'].map(confidence_map)
    
    return df

def calculate_minutes_since_update(df):
    """Convert lastUpdated to minutes since last update"""
    now = datetime.datetime.now()
    # Use ISO 8601 format for parsing
    df['lastUpdated'] = pd.to_datetime(df['lastUpdated'], format='%Y-%m-%dT%H:%M:%SZ', errors='coerce')
    df['minutesSinceUpdate'] = (now - df['lastUpdated']).dt.total_seconds() / 60
    return df
# -----------------------------
# 2. Data Preparation
# -----------------------------

def load_and_preprocess_data():
    """Load and preprocess the dataset"""
    file_path = "data set Final csv format.csv"
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset not found at {file_path}. Please verify the file path.")
    
    try:
        df = pd.read_csv(file_path)
        print("Raw data shape:", df.shape)
        print("Columns in CSV:", df.columns.tolist())  # Debug: Check column names
    except Exception as e:
        raise RuntimeError(f"Failed to read CSV file: {e}")
    
    # Encode categorical variables
    df = encode_categorical(df)
    print("After encoding:", df.shape)
    
    # Convert lastUpdated to minutes since update
    df = calculate_minutes_since_update(df)
    print("After date conversion:", df.shape)
    
    # Drop stationId column to avoid string conversion errors
    if 'stationId' in df.columns:  # ✅ Use lowercase 'd' to match your CSV
        df = df.drop(columns=['stationId'])
    
    # Drop all string columns that are not part of the model
    string_columns = ['stationName', 'brand', 'province', 'town']
    df = df.drop(columns=string_columns, errors='ignore')
    
    # Fill missing values instead of dropping rows
    df.fillna({
        'petrolAvailability': 0.0,
        'dieselAvailability': 0.0,
        'superPetrolAvailability': 0.0,
        'availabilityConfidence': 0.3,
        'estimatedWaitTime': 0.0,
        'minutesSinceUpdate': 0.0
    }, inplace=True)
    
    print("After filling NaNs:", df.shape)
    
    return df

# -----------------------------
# 3. Model Training
# -----------------------------

def train_model(df):
    """Train RandomForestRegressor on the dataset"""
    # Select features and target
    features = ['petrolAvailability', 'dieselAvailability', 'superPetrolAvailability',
                'availabilityConfidence', 'estimatedWaitTime', 'minutesSinceUpdate']
    
    X = df[features]
    
    # Replace negative values with a small epsilon to avoid division by zero
    df['estimatedWaitTime'] = df['estimatedWaitTime'].clip(lower=0)
    df['minutesSinceUpdate'] = df['minutesSinceUpdate'].clip(lower=0)
    
    # Add noise to the target variable to prevent overfitting
    y = (df['petrolAvailability'] * 0.4 + 
         df['availabilityConfidence'] * 0.3 + 
         (1 / (df['estimatedWaitTime'] + 1e-6)) * 0.2 + 
         (1 / (df['minutesSinceUpdate'] + 1e-6)) * 0.1) + np.random.normal(0, 0.05, len(df))
    
    df["score"] = y
    
    # Check for NaNs in y
    if y.isna().any():
        raise ValueError("Target variable y contains NaN values. Check for invalid divisions.")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model with reduced complexity
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    
    print(f"Model Evaluation:")
    print(f"MAE: {mean_absolute_error(y_test, y_pred):.4f}")
    print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.4f}")
    print(f"R²: {r2_score(y_test, y_pred):.4f}")
    
    # Save model and scaler
    with open('recommender_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # -----------------------------
    # Visualizations
    # -----------------------------
    os.makedirs("visualizations", exist_ok=True)
    
    # 1. Feature Importance Plot
    feature_importances = model.feature_importances_
    feature_names = features
    plt.figure(figsize=(10, 6))
    sns.barplot(x=feature_importances, y=feature_names, hue=feature_names, palette="viridis", legend=False)
    plt.title("Feature Importance")
    plt.xlabel("Importance Score")
    plt.tight_layout()
    plt.savefig("visualizations/feature_importance.png")
    plt.close()
    
    # 2. Actual vs Predicted Values
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x=y_test, y=y_pred, alpha=0.6)
    plt.plot([y.min(), y.max()], [y.min(), y.max()], 'r--')  # Diagonal line
    plt.title("Actual vs Predicted Values")
    plt.xlabel("Actual")
    plt.ylabel("Predicted")
    plt.tight_layout()
    plt.savefig("visualizations/actual_vs_predicted.png")
    plt.close()
    
    # 3. Residuals Distribution
    residuals = y_test - y_pred
    plt.figure(figsize=(10, 6))
    sns.histplot(residuals, kde=True, color="skyblue")
    plt.title("Residuals Distribution")
    plt.xlabel("Residual")
    plt.tight_layout()
    plt.savefig("visualizations/residuals.png")
    plt.close()
    
    # 4. Correlation Matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(df.corr(), annot=True, cmap="coolwarm", fmt=".2f")
    plt.title("Feature Correlation Matrix")
    plt.tight_layout()
    plt.savefig("visualizations/correlation_matrix.png")
    plt.close()
    
    # 5. Learning Curve
    train_sizes, train_scores, test_scores = learning_curve(
        model, X_train_scaled, y_train, cv=5, scoring="r2", train_sizes=np.linspace(0.1, 1.0, 10)
    )
    train_scores_mean = np.mean(train_scores, axis=1)
    test_scores_mean = np.mean(test_scores, axis=1)
    plt.figure(figsize=(10, 6))
    plt.plot(train_sizes, train_scores_mean, label="Training Score")
    plt.plot(train_sizes, test_scores_mean, label="Validation Score")
    plt.title("Learning Curve")
    plt.xlabel("Training Set Size")
    plt.ylabel("R² Score")
    plt.legend()
    plt.tight_layout()
    plt.savefig("visualizations/learning_curve.png")
    plt.close()
    
    # 6. Partial Dependence Plots
    features_to_plot = [0, 1]  # Indexes of features to plot
    PartialDependenceDisplay.from_estimator(model, X_train_scaled, features_to_plot)
    plt.title("Partial Dependence Plots")
    plt.tight_layout()
    plt.savefig("visualizations/partial_dependence.png")
    plt.close()
    
    # 7. Target Variable Distribution
    plt.figure(figsize=(10, 6))
    sns.histplot(y, kde=True, color="skyblue")
    plt.title("Target Variable Distribution")
    plt.xlabel("Score")
    plt.tight_layout()
    plt.savefig("visualizations/target_distribution.png")
    plt.close()
    
    # 8. Feature Distributions
    for col in features:
        plt.figure(figsize=(10, 4))
        sns.histplot(df[col], kde=True, color="skyblue")
        plt.title(f"{col} Distribution")
        plt.tight_layout()
        plt.savefig(f"visualizations/{col}_distribution.png")
        plt.close()
    
    # 9. Cross-Validation Scores
    scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring="r2")
    plt.figure(figsize=(10, 6))
    sns.barplot(x=np.arange(1, 6), y=scores, palette="viridis")
    plt.title("Cross-Validation Scores")
    plt.xlabel("Fold")
    plt.ylabel("R² Score")
    plt.tight_layout()
    plt.savefig("visualizations/cross_validation.png")
    plt.close()
    
    # 10. Tree Depth Distribution
    tree_depths = [tree.tree_.max_depth for tree in model.estimators_]
    plt.figure(figsize=(10, 6))
    sns.histplot(tree_depths, bins=10, kde=True, color="skyblue")
    plt.title("Tree Depth Distribution")
    plt.xlabel("Max Depth")
    plt.tight_layout()
    plt.savefig("visualizations/tree_depths.png")
    plt.close()
    
    # 11. Time Series Plot
    df_sorted = df.copy()
    plt.figure(figsize=(10, 6))
    plt.plot(df_sorted.index, df_sorted["score"], label="Score")  # Use index instead of actual time
    plt.title("Score Over Time")
    plt.xlabel("Time")
    plt.ylabel("Score")
    plt.tight_layout()
    plt.savefig("visualizations/time_series.png")
    plt.close()
    
    # 12. Categorical Feature Counts
    for col in ["availabilityConfidence"]:
        plt.figure(figsize=(10, 6))
        sns.countplot(x=col, data=df, palette="viridis")
        plt.title(f"{col} Distribution")
        plt.tight_layout()
        plt.savefig(f"visualizations/{col}_counts.png")
        plt.close()
    
    # 13. Residuals vs Predicted Values
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x=y_pred, y=residuals, alpha=0.6)
    plt.axhline(y=0, color="r", linestyle="--")
    plt.title("Residuals vs Predicted Values")
    plt.xlabel("Predicted")
    plt.ylabel("Residual")
    plt.tight_layout()
    plt.savefig("visualizations/residuals_vs_predicted.png")
    plt.close()
    
    # 14. Station Heatmap (Optional)
    if 'latitude' in df.columns and 'longitude' in df.columns:
        plt.figure(figsize=(10, 6))
        sns.scatterplot(x="longitude", y="latitude", hue="score", data=df, palette="viridis")
        plt.title("Station Heatmap")
        plt.tight_layout()
        plt.savefig("visualizations/station_heatmap.png")
        plt.close()
    
    return model, scaler

# -----------------------------
# 4. Main Execution
# -----------------------------

if __name__ == "__main__":
    try:
        # Load and preprocess data
        df = load_and_preprocess_data()
        
        # Train model
        model, scaler = train_model(df)
        
        print("\n✅ Model training completed successfully!")
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")