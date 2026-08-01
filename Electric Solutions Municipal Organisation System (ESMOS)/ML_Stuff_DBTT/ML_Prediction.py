import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
# joblib to save the model so that I dont have to run it all the time
import joblib
# Dynamic pathing
import os

# Brief explanation of whats going on here:
# Take data -> Change month to monthsin and monthcos -> Declare what we want (usage) and use everything else to predict it -> Scalar it
# -> One hot encode it -> Split 80-20 -> MODEL -> Get eval results and store model + scalar

# Set pathing
base_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(base_dir, "ML_Data_DBTT.csv")

# Read the data (case sensitive I didn't realise)
# Change with your file name or if i have time i'll make it relative to the directory the .py script is placed in
# data = pd.read_csv("C:/Users/User/Downloads/ML_Stuff_DBTT/ML_Data_DBTT.csv")
data = pd.read_csv(data_path)

# Create monthsin and monthcos to accurately show that December is closer to Janurary then say August - Something like 12 is closer to 10 then 1 but not 
# In the context of months.
data["MonthSin"] = np.sin(2 * np.pi * data["Month"] / 12)
data["MonthCos"] = np.cos(2 * np.pi * data["Month"] / 12)

print("This is the data from the csv file with feature encoded Monthsin and Monthcos : ", data)

# Drop the month column, we using sin and cos instead. Inplace means the data variable itself drops it.
# data.drop("Month", axis=1, inplace=True)

# Assigning the predictor and the input variables
y = data["Usage"]
x = data.drop(["Usage", "Month"], axis = 1)
# Check if monthsin and monthcos has replaced month entirely.
print("Post month processing data for prediction : ", x, "This is the usage dataframe", y)

# Normalising
scaler = MinMaxScaler(feature_range=(0,1))
numeric_cols = ["Date", "User ID", "MonthSin", "MonthCos"]
# Original code uses df_numeric to auto get everything numeric and scale, since we know the above 4 is all we are using
# We can just declare that as the numeric cols
# df_numeric = x.select_dtypes(include=[np.number])

# Fit with scalar
x[numeric_cols] = scaler.fit_transform(x[numeric_cols])

# OHE the categorical cols
categorical_cols = x.select_dtypes(include=["object"]).columns.tolist()
x = pd.get_dummies(x, columns=categorical_cols)

# 80-20 split for training and testing
# Easter egg if you read this far : random_state is the winning number for 26/03/25 4D first prize. If I won that I wouldnt be coding this rn
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size = 0.2, random_state = 3468)

# Keep this print here for testing i guess
# Comment out to save time when we push this out.
print(x_train.shape, x_test.shape, y_train.shape, y_test.shape)


# Begin model creation
model = LinearRegression()
model.fit(x_train, y_train)
y_pred = model.predict(x_test)

# Evaluation, can be skipped when pushing it out

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("Model Features:", model.feature_names_in_)
print("Model Coefficients:", model.coef_)
print("Mean Absolute Error:", mae)
print("Mean Square Error: ", mse)
print("Coefficient of Determination or r-squared:", r2)

# Save model and scaler
joblib.dump(model, "C:/Users/User/Downloads/ML_Stuff_DBTT/room_usage_linear_model_manual.pkl")
joblib.dump(scaler, "C:/Users/User/Downloads/ML_Stuff_DBTT/room_usage_scaler.pkl")
print("✅ Model and scaler saved.")