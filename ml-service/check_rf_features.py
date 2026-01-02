
import pickle
import os

model_path = 'saved_models/station_rf_model.pkl'
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(f"Model type: {type(model)}")
    if hasattr(model, 'n_features_in_'):
        print(f"Number of features: {model.n_features_in_}")
    if hasattr(model, 'feature_names_in_'):
        print(f"Feature names: {model.feature_names_in_}")
    else:
        print("Feature names not available in model")

features_path = 'saved_models/rf_features.pkl'
if os.path.exists(features_path):
    with open(features_path, 'rb') as f:
        features = pickle.load(f)
    print(f"rf_features.pkl content: {features}")
