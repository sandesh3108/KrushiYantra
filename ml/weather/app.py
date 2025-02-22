from flask import Flask, jsonify, request, abort
import requests
from datetime import datetime
from dotenv import load_dotenv
import os
from flask_cors import CORS
import traceback

# Load environment variables from .env file
load_dotenv(dotenv_path="../.env")

app = Flask(__name__)
CORS(app)

# Retrieve configuration from environment variables
API_KEY = os.getenv('API_KEY')
WEATHER_API_URL = os.getenv('WEATHER_API_URL') or "https://api.openweathermap.org/data/2.5/forecast"
PORT = os.getenv('PORT') or 6000

def get_weather_data(city):
    """
    Get a 5-day forecast (3-hour intervals) and extract one reading per day.
    Includes an icon URL for additional context.
    """
    url = f"{WEATHER_API_URL}?q={city}&appid={API_KEY}&units=metric"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        forecast = []
        # Extract one reading per day (assuming 8 intervals per day)
        for i in range(0, len(data["list"]), 8):
            day_data = data["list"][i]
            forecast.append({
                "date": datetime.utcfromtimestamp(day_data["dt"]).strftime('%Y-%m-%d'),
                "temp": day_data["main"]["temp"],
                "humidity": day_data["main"]["humidity"],
                "wind_speed": day_data["wind"]["speed"],
                "description": day_data["weather"][0]["description"],
                "icon": f"https://openweathermap.org/img/wn/{day_data['weather'][0]['icon']}@2x.png"
            })
        return forecast
    except Exception as e:
        print(f"Error fetching weather data: {e}")
        return None

def predict_irrigation(crop, soil, last_irrigation, weather_data):
    """
    Provide irrigation advice based on:
      - Whether rain is forecast
      - Soil moisture estimation based on soil type and days since last irrigation
    """
    if not weather_data:
        return "Weather data not available."
    
    # First, check if rain is expected
    upcoming_rain = any("rain" in day["description"].lower() for day in weather_data)
    if upcoming_rain:
        return "Rain is expected. No need to irrigate now."
    
    # Estimate soil moisture persistence (in days) based on soil type
    soil_moisture_days = {"sandy": 2, "loamy": 4, "clayey": 6}
    try:
        last_irrigation_date = datetime.strptime(last_irrigation, '%Y-%m-%d')
        days_since_irrigation = (datetime.now() - last_irrigation_date).days
    except ValueError:
        return "Invalid date format. Please enter the last irrigation date in YYYY-MM-DD format."
    
    if days_since_irrigation > soil_moisture_days.get(soil.lower(), 3):
        return "It's been a while since irrigation. Consider watering the crops."
    
    return "Soil moisture might still be sufficient. Check soil conditions manually."

def predict_disease(crop, weather_data):
    """
    Predict possible disease risks based on daily weather data.
    Returns a dictionary mapping each forecast date to a risk level and detailed advice.
    """
    if not weather_data:
        return "Weather data not available for disease prediction."
    
    predictions = {}
    for day in weather_data:
        date = day["date"]
        humidity = day["humidity"]
        temp = day["temp"]
        description = day["description"].lower()
        risk = "Low risk"
        details = "Conditions appear moderate."
        
        if crop.lower() == "wheat":
            if humidity > 80 and "rain" in description and temp > 10:
                risk = "High risk of Fungal Disease (Rust, Blight)"
                details = ("High humidity and rainfall can promote fungal growth on wheat. "
                           "Consider using fungicides, crop rotation, and resistant varieties.")
            elif humidity < 40:
                risk = "Risk of Drought Stress"
                details = ("Dry conditions may stress wheat plants and predispose them to other issues. "
                           "Ensure timely irrigation and soil moisture conservation.")
        elif crop.lower() == "rice":
            if humidity > 80 and "rain" in description:
                risk = "High risk of Bacterial Leaf Blight"
                details = ("Sustained rain and high humidity can lead to bacterial infections in rice. "
                           "Use disease-free seeds, maintain field sanitation, and apply organic pesticides.")
            elif humidity < 40:
                risk = "Risk of Drought Stress"
                details = ("Low humidity may result in drought stress in rice. "
                           "Plan for supplemental irrigation and moisture management.")
        else:
            # Generic guidelines for other crops
            if humidity > 85 and "rain" in description:
                risk = "High risk of Fungal Diseases"
                details = ("Excess moisture and high humidity favor fungal growth. Monitor closely and "
                           "consider preventive fungicide treatments.")
            elif humidity < 40:
                risk = "Risk of Drought Stress"
                details = ("Dry conditions may stress the crop. Ensure proper irrigation and soil management.")
        
        predictions[date] = {
            "risk": risk,
            "details": details
        }
    return predictions

def generate_summary_report(weather_data, disease_predictions, irrigation_advice):
    """
    Generate a summary report that includes:
      - Average temperature and humidity over the forecast period
      - Overall irrigation advice
      - A count and list of days with high disease risk
      - Detailed disease predictions for each day
    """
    if not weather_data or not isinstance(disease_predictions, dict):
        return "Summary report not available due to incomplete data."
    
    avg_temp = sum(day["temp"] for day in weather_data) / len(weather_data)
    avg_humidity = sum(day["humidity"] for day in weather_data) / len(weather_data)
    high_risk_days = [date for date, info in disease_predictions.items() if "High risk" in info["risk"]]
    
    summary = f"----- Summary Report for the Next {len(weather_data)} Days -----\n"
    summary += f"Average Temperature: {avg_temp:.1f}°C\n"
    summary += f"Average Humidity: {avg_humidity:.1f}%\n"
    summary += f"Irrigation Advice: {irrigation_advice}\n"
    if high_risk_days:
        summary += f"Days with High Disease Risk: {', '.join(high_risk_days)}\n"
    else:
        summary += "No days with high disease risk predicted.\n"
    
    summary += "\nDetailed Disease Predictions:\n"
    for date, info in disease_predictions.items():
        summary += f"{date}: {info['risk']} – {info['details']}\n"
    
    return summary

@app.route("/predict/weather", methods=["POST"])
def predict_weather():
    """
    Endpoint that accepts a JSON payload with:
      - city
      - crop
      - soil
      - last_irrigation (YYYY-MM-DD)
    
    Returns weather data, irrigation advice, disease predictions, and a summary report.
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid input, expected JSON"}), 400
    
    city = data.get("city", "").strip()
    crop = data.get("crop", "").strip()
    soil = data.get("soil", "").strip()
    last_irrigation = data.get("last_irrigation", "").strip()

    if not city or not crop or not soil or not last_irrigation:
        return jsonify({"error": "Missing required fields. Please provide city, crop, soil, and last_irrigation."}), 400

    weather_data = get_weather_data(city)
    if not weather_data:
        return jsonify({"error": "Failed to fetch weather data for the given city."}), 500

    irrigation_advice = predict_irrigation(crop, soil, last_irrigation, weather_data)
    disease_predictions = predict_disease(crop, weather_data)
    summary_report = generate_summary_report(weather_data, disease_predictions, irrigation_advice)

    return jsonify({
        "weather_data": weather_data,
        "irrigation_advice": irrigation_advice,
        "disease_predictions": disease_predictions,
        "summary_report": summary_report
    }), 200

@app.route('/weather', methods=['POST'])
def get_weather():
    """
    A simpler endpoint that returns only the weather forecast for a given city.
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Invalid input, expected JSON"}), 400

    city = data.get("city", "").strip()
    
    if not city:
        return jsonify({"error": "Missing required field: city"}), 400
    
    weather_data = get_weather_data(city)
    if not weather_data:
        return jsonify({"error": "Failed to fetch weather data for the given city."}), 500
    
    return jsonify({"weather_data": weather_data}), 200

@app.route('/', methods=["GET"])
def hello():
    return "Hello World!"

@app.errorhandler(500)
def internal_server_error(e):
    print("Internal Server Error:", str(e))
    print(traceback.format_exc())
    return jsonify({"error": "Internal Server Error!"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(PORT), use_reloader=True)
