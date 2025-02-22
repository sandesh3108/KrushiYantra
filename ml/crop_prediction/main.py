import requests
import joblib
import numpy as np
import warnings
import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

warnings.filterwarnings("ignore", category=UserWarning)
load_dotenv(dotenv_path="./.env")

app = Flask(__name__)

# Load models
model = joblib.load("./crop_recommendation_model.pkl")
label_encoder = joblib.load("./label_encoder.pkl")
scaler = joblib.load("./scaler.pkl")

# OpenWeather API
api_key = os.getenv('API_KEY')
PORT = os.getenv('PORT')
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_weather_data(city):
    try:
        params = {"q": city, "appid": api_key, "units": "metric"}
        response = requests.get(BASE_URL, params=params)
        data = response.json()

        if response.status_code == 200:
            temperature = data['main']['temp']
            humidity = data['main']['humidity']
            rainfall = data.get('rain', {}).get('72h', 0)  
            return temperature, humidity, rainfall
        else:
            return None, None, None
    except Exception as e:
        return None, None, None

def predict_crop(N, P, K, ph, temperature, humidity, rainfall):
    input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    scaled_input = scaler.transform(input_data)
    prediction = model.predict(scaled_input)
    crop_name = label_encoder.inverse_transform(prediction)[0]
    return crop_name

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    try:
        N = float(data['N'])
        P = float(data['P'])
        K = float(data['K'])
        ph = float(data['ph'])
        city = data['city']
    except (KeyError, ValueError):
        return jsonify({"error": "Invalid input data"}), 400

    temperature, humidity, rainfall = get_weather_data(city)
    if temperature is None:
        return jsonify({"error": "Unable to fetch weather data"}), 500

    crop = predict_crop(N, P, K, ph, temperature, humidity, rainfall)
    return jsonify({
        "temperature": temperature,
        "humidity": humidity,
        "rainfall": rainfall,
        "recommended_crop": crop
    })

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=int(PORT), use_reloader=True)
