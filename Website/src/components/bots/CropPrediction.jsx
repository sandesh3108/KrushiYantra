import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Stepper, Step } from "../component";
import Input from "../UI/Input";
import axios from "axios";
import MapComponent from "../MapComponent";

const CropPrediction = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [cropPrediction, setCropPrediction] = useState(null);
  const [error, setError] = useState("");
  const [city, setCity] = useState("Fetching location...");
  const [loadingCity, setLoadingCity] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  // Geolocation: get user's location and set the city
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const detectedCity =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Unknown Location";

            setCity(detectedCity);
          } catch (err) {
            setError("Failed to fetch location data.");
          } finally {
            setLoadingCity(false);
          }
        },
        () => {
          setError("Location access denied. Please enable location services.");
          setLoadingCity(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoadingCity(false);
    }
  }, []);

  // Handle form submission and call crop prediction API
  const onSubmit = async (data) => {
    if (loadingCity) {
      setError("Fetching location, please wait...");
      return;
    }

    setFormSubmitted(true);
    setError(""); // Reset error state before making request

    // Constructing the API payload
    const payload = {
      n: parseFloat(data.nitrogen),
      p: parseFloat(data.phosphorus),
      k: parseFloat(data.potassium),
      ph: parseFloat(data.soilPh),
      city,
    };

    console.log("🔹 Sending Payload:", payload); // Log payload

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/crop/predict`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("✅ API Response:", response.data); // Log API response

      if (response.data.status) {
        setCropPrediction(response.data.data);
      } else {
        setError("No prediction data available.");
      }
    } catch (error) {
      console.error(
        "❌ Error fetching crop prediction:",
        error.response?.data || error
      );
      setError(
        error.response?.data?.message ||
          "Failed to fetch crop prediction. Please try again."
      );
    }
  };

  return (
    <div className="font-['Navbar']">
      <form onSubmit={handleSubmit(onSubmit)}>
        {!formSubmitted ? (
          <Stepper
            initialStep={1}
            onFinalStepCompleted={handleSubmit(onSubmit)}
          >
            {/* Step 1: Soil Nutrient Information */}
            <Step>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Soil Nutrient Information
                </h2>
                <Input
                  label="Nitrogen (N)"
                  type="number"
                  {...register("nitrogen", {
                    required: "Nitrogen is required",
                    min: 0,
                    max: 150,
                    valueAsNumber: true,
                  })}
                  error={errors.nitrogen?.message}
                  placeholder="0-150"
                />
                <Input
                  label="Phosphorus (P)"
                  type="number"
                  {...register("phosphorus", {
                    required: "Phosphorus is required",
                    min: 0,
                    max: 150,
                    valueAsNumber: true,
                  })}
                  error={errors.phosphorus?.message}
                  placeholder="0-150"
                />
                <Input
                  label="Potassium (K)"
                  type="number"
                  {...register("potassium", {
                    required: "Potassium is required",
                    min: 0,
                    max: 150,
                    valueAsNumber: true,
                  })}
                  error={errors.potassium?.message}
                  placeholder="0-150"
                />
                <Input
                  label="Soil pH"
                  type="number"
                  step="0.1"
                  {...register("soilPh", {
                    required: "Soil pH is required",
                    min: 0,
                    max: 14,
                    valueAsNumber: true,
                  })}
                  error={errors.soilPh?.message}
                  placeholder="Typically 5.5-7.5"
                />
              </div>
            </Step>
          </Stepper>
        ) : (
          <div className="text-center p-6">
            {/* <h1 className="text-2xl font-bold">
              {loadingCity ? "Fetching location..." : city}
            </h1> */}
            <div>
              {latitude !== 0 && longitude !== 0 ? (
              <MapComponent latitude={latitude} longitude={longitude} />) : (
              <div className="w-full h-64 bg-gray-200 animate-pulse">
                Fetching location...
              </div>
              )}
            </div>

            {/* Crop Prediction Result */}
            {cropPrediction ? (
              <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-lg">
                <h2 className="text-xl font-bold">Recommended Crop</h2>
                <p className="text-lg">{cropPrediction.recommended_crop}</p>

                {/* Display Additional Data */}
                <div className="mt-4 text-gray-700">
                  <p>
                    <strong>Temperature:</strong> {cropPrediction.temperature}°C
                  </p>
                  <p>
                    <strong>Humidity:</strong> {cropPrediction.humidity}%
                  </p>
                  <p>
                    <strong>Rainfall:</strong> {cropPrediction.rainfall} mm
                  </p>
                </div>
              </div>
            ) : (
              error && <p className="text-red-500 mt-4">{error}</p>
            )}

            <button
              type="button"
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                setFormSubmitted(false);
                setCropPrediction(null);
                setError("");
              }}
            >
              Go Back
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CropPrediction;
