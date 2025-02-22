import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Stepper, Step, Select } from "../component";
import Input from "../UI/Input";
import axios from "axios";
import { translateText } from "../../translate/translate";

const Climate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onChange" });
  const { i18n } = useTranslation();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [city, setCity] = useState("Fetching location...");
  const [weatherData, setWeatherData] = useState([]);
  const [irrigationAdvice, setIrrigationAdvice] = useState("");
  const [diseasePredictions, setDiseasePredictions] = useState({});
  const [summaryReport, setSummaryReport] = useState("");
  const [error, setError] = useState("");
  // Store raw API data for re-translation and persistence
  const [rawApiData, setRawApiData] = useState(null);

  // On mount, try to restore persisted data
  useEffect(() => {
    const savedData = localStorage.getItem("climateData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormSubmitted(true);
      setRawApiData(parsedData.rawApiData);
      setCity(parsedData.city);
      // Run translations using the stored raw API data and current language
      runTranslations(parsedData.rawApiData, i18n.language);
    }
  }, [i18n.language]);

  // Geolocation: get user's location and set the city
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            setCity(
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Unknown Location"
            );
          } catch (err) {
            setError("Failed to fetch location data.");
          }
        },
        () => {
          setError("Location access denied. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to translate API data using the current target language
  const runTranslations = async (apiData, targetLang) => {
    // Translate irrigation advice
    const translatedIrrigationAdvice = await translateText(
      apiData.irrigation_advice,
      "en",
      targetLang
    );
    setIrrigationAdvice(translatedIrrigationAdvice);

    // Translate summary report if available
    if (apiData.summary_report) {
      const translatedSummaryReport = await translateText(
        apiData.summary_report,
        "en",
        targetLang
      );
      setSummaryReport(translatedSummaryReport);
    }

    // Translate weather data descriptions
    if (apiData.weather_data && Array.isArray(apiData.weather_data)) {
      const translatedWeatherData = await Promise.all(
        apiData.weather_data.map(async (day) => {
          const translatedDesc = await translateText(
            day.description,
            "en",
            targetLang
          );
          return { ...day, description: translatedDesc };
        })
      );
      setWeatherData(translatedWeatherData);
    }

    // Translate disease predictions
    if (apiData.disease_predictions && typeof apiData.disease_predictions === "object") {
      let translatedDiseasePredictions = {};
      for (const [date, prediction] of Object.entries(apiData.disease_predictions)) {
        const translatedRisk = await translateText(
          prediction.risk,
          "en",
          targetLang
        );
        const translatedDetails = await translateText(
          prediction.details,
          "en",
          targetLang
        );
        translatedDiseasePredictions[date] = {
          ...prediction,
          risk: translatedRisk,
          details: translatedDetails,
        };
      }
      setDiseasePredictions(translatedDiseasePredictions);
    }
  };

  // Re-run translations when the language changes (if raw API data is available)
  useEffect(() => {
    if (rawApiData) {
      runTranslations(rawApiData, i18n.language);
    }
  }, [i18n.language, rawApiData]);

  const onSubmit = async (data) => {
    setSubmittedData(data);
    setFormSubmitted(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/weather/irrigation`,
        {
          city,
          crop: data.crop,
          soil: data.soil,
          irrigation_date: data.irrigation_date,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const apiData = response.data.data;
      if (response.data.status) {
        setRawApiData(apiData);
        // Persist the raw API data and city in localStorage
        localStorage.setItem("climateData", JSON.stringify({ rawApiData: apiData, city }));
        // Run translations using the current language
        runTranslations(apiData, i18n.language);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to fetch weather data. Please try again later.");
    }
  };

  // Clear persisted data and reset the form view
  const handleGoBack = () => {
    setFormSubmitted(false);
    setRawApiData(null);
    localStorage.removeItem("climateData");
  };

  return (
    <div className="font-['Navbar']">
      <form onSubmit={handleSubmit(onSubmit)}>
        {!formSubmitted ? (
          <Stepper initialStep={1} onFinalStepCompleted={handleSubmit(onSubmit)}>
            <Step>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-4">Crop Information</h2>
                <Input
                  label="Crop Name"
                  {...register("crop", { required: "Crop name is required" })}
                  error={errors.crop?.message}
                />
                <Select
                  label="What is your soil type?"
                  options={["Select", "sandy", "loamy", "clayey"]}
                  {...register("soil", {
                    validate: (value) =>
                      value !== "Select" || "Please select a soil type",
                  })}
                  error={errors.soil?.message}
                />
                <Input
                  label="Date of Irrigation"
                  type="date"
                  {...register("irrigation_date", { required: "Date is required" })}
                  error={errors.irrigation_date?.message}
                />
              </div>
            </Step>
          </Stepper>
        ) : (
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold">{city}</h1>

            {/* Irrigation Advice Card */}
            <div className="mt-4 p-4 bg-blue-100 text-blue-800 border border-blue-400 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">Irrigation Advice</h2>
              <p className="text-gray-700 italic">{irrigationAdvice}</p>
            </div>

            {/* Summary Report */}
            {summaryReport && (
              <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-400 rounded-lg shadow-md text-left whitespace-pre-wrap">
                <h2 className="text-xl font-bold">Summary Report</h2>
                <p className="text-gray-700">{summaryReport}</p>
              </div>
            )}

            {/* Weather Cards */}
            {weatherData.length > 0 && (
              <div className="mt-6">
                {/* Current Day Weather - Large Card */}
                <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 mb-4">
                  <h2 className="text-xl font-bold mb-2">Today’s Weather</h2>
                  <p className="text-gray-600">{weatherData[0].date}</p>
                  <p className="text-gray-700 font-medium">{weatherData[0].description}</p>
                  <div className="flex justify-around mt-2">
                    <p>🌡️ {weatherData[0].temp.toFixed(2)}°C</p>
                    <p>💧 {weatherData[0].humidity}%</p>
                    <p>🌬️ {weatherData[0].wind_speed} m/s</p>
                  </div>
                </div>

                {/* Next Days Weather - Small Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {weatherData.slice(1).map((day, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-100 shadow-md rounded-lg border border-gray-300 text-gray-800"
                    >
                      <h3 className="font-bold">{day.date}</h3>
                      <p className="text-gray-600">{day.description}</p>
                      <div className="flex justify-between mt-2">
                        <p>🌡️ {day.temp.toFixed(2)}°C</p>
                        <p>💧 {day.humidity}%</p>
                      </div>
                      <p className="text-sm mt-1">🌬️ {day.wind_speed} m/s</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disease Predictions */}
            {Object.keys(diseasePredictions).length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Disease Predictions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(diseasePredictions).map(([date, prediction], index) => (
                    <div
                      key={index}
                      className="p-4 bg-red-100 text-red-800 border border-red-400 rounded-lg shadow-md text-left"
                    >
                      <h3 className="font-bold">{date}</h3>
                      <p className="font-medium">{prediction.risk}</p>
                      <p className="text-sm">{prediction.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleGoBack}
            >
              Go Back
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Climate;
