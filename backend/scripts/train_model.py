import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import json
import joblib
from sklearn.metrics import accuracy_score

# Load the dataset
with open('training_dataset.json', 'r') as f:
    data = json.load(f)

df = pd.DataFrame(data)

# Handle missing values (replace None with a placeholder or use imputation)
df = df.fillna('N/A')

# Separate features (X) and target (y)
X = df.drop('station_id', axis=1)
y = df['station_id']

# Encode categorical features
# For simplicity, we'll use LabelEncoder for all categorical columns.
# In a real-world scenario, OneHotEncoder might be more appropriate for some features.
label_encoders = {}
for column in X.columns:
    if X[column].dtype == 'object': # Check if the column is of object type (usually strings)
        le = LabelEncoder()
        X[column] = le.fit_transform(X[column])
        label_encoders[column] = le

# Encode target variable
le_y = LabelEncoder()
y_encoded = le_y.fit_transform(y)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Initialize and train the Decision Tree Classifier
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Make predictions on the test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")

# Save the trained model and label encoders
joblib.dump(model, 'decision_tree_model.joblib')
joblib.dump(label_encoders, 'label_encoders.joblib')
joblib.dump(le_y, 'target_label_encoder.joblib')

print("Decision Tree model and label encoders trained and saved successfully.")
