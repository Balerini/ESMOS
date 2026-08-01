from flask import Flask, jsonify
import pandas as pd
import numpy as np
import joblib
# CORS configs
from flask_cors import CORS
import os

app = Flask(__name__)
# add a cors in to bypass funny CORS error on web app
CORS(app)

# Get the current directory (where this script is located) and build relative paths
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "room_usage_linear_model_manual.pkl")
scaler_path = os.path.join(base_dir, "room_usage_scaler.pkl")

# Load the models
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

@app.route("/predict/user1", methods=["GET"])
def predict_static_user1():
    # Static input values, since its for wireframe just set it to return user 1's values
    month = 4
    year = 2025
    user_id = 1

    # Compute cyclical encoding for month
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)

    # Rooms to predict
    rooms = [
        {"Room Name": "Living Room", "Room Type": "Living"},
        {"Room Name": "John's Room", "Room Type": "Bedroom"},
        {"Room Name": "Master Room", "Room Type": "Bedroom"},
        {"Room Name": "Rented Room", "Room Type": "Bedroom(Rented)"},
        {"Room Name": "Kitchen", "Room Type": "Kitchen"}
    ]

    # Add user, date, month sin/cos to each room entry
    for room in rooms:
        room["User ID"] = user_id
        room["Date"] = year
        room["MonthSin"] = month_sin
        room["MonthCos"] = month_cos

    # Convert to DataFrame
    df = pd.DataFrame(rooms)

    # Normalize numeric columns using saved scaler (Done because we scaled it)
    numeric_cols = ["Date", "User ID", "MonthSin", "MonthCos"]
    df[numeric_cols] = scaler.transform(df[numeric_cols][numeric_cols].values)

    # One-hot encode categorical features to match training
    df_encoded = pd.get_dummies(df)

    # Align columns with model (add missing cols if needed)
    model_features = model.feature_names_in_
    for col in model_features:
        if col not in df_encoded.columns:
            df_encoded[col] = 0
    df_encoded = df_encoded[model_features]  # Ensure column order

    # Make prediction
    predictions = model.predict(df_encoded)
    usage_values = [round(val, 2) for val in predictions]

    return jsonify(usage_values)

if __name__ == "__main__":
    app.run(host="0.0.0.0",  port=5001, debug=True)