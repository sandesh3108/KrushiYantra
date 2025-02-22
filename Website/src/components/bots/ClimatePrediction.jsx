import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Stepper, Step, Select } from "../component";
import Input from "../UI/Input";
import axios from "axios";
import { translateText } from "../../translate/translate";

const ClimatePrediction = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const { i18n } = useTranslation();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [city, setCity] = useState("Fetching location...");
  const [weatherData, setWeatherData] = useState([]);
  const [irrigationAdvice, setIrrigationAdvice] = useState("");
  const [diseasePredictions, setDiseasePredictions] = useState({});
  const [summaryReport, setSummaryReport] = useState("");
  const [error, setError] = useState("");
  const [rawApiData, setRawApiData] = useState(null);
  const [stepError, setStepError] = useState("");

  // Restore persisted data if available (including submittedData)
  useEffect(() => {
    const savedData = localStorage.getItem("climateData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormSubmitted(true);
      setRawApiData(parsedData.rawApiData);
      setCity(parsedData.city);
      setSubmittedData(parsedData.submittedData);
      runTranslations(parsedData.rawApiData, i18n.language);
    }
  }, [i18n.language]);

  // Function to translate API data
  const runTranslations = async (apiData, targetLang) => {
    const translatedIrrigationAdvice = await translateText(
      apiData.irrigation_advice,
      "en",
      targetLang
    );
    setIrrigationAdvice(translatedIrrigationAdvice);

    if (apiData.summary_report) {
      const translatedSummaryReport = await translateText(
        apiData.summary_report,
        "en",
        targetLang
      );
      setSummaryReport(translatedSummaryReport);
    }

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

    if (
      apiData.disease_predictions &&
      typeof apiData.disease_predictions === "object"
    ) {
      let translatedDiseasePredictions = {};
      for (const [date, prediction] of Object.entries(
        apiData.disease_predictions
      )) {
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

  // Step validation logic similar to SignUp component
  const validateStep = async (step) => {
    let fieldsToValidate = [];
    switch (step) {
      case 1:
        fieldsToValidate = ["nitrogen", "phosphorus", "potassium", "soilPh"];
        break;
      case 2:
        fieldsToValidate = ["soil", "irrigation_date"];
        break;
      default:
        return true;
    }
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      if (step === 1) {
        setStepError("Please enter valid soil nutrient information");
      } else if (step === 2) {
        setStepError("Please enter valid irrigation details");
      }
    } else {
      setStepError("");
    }
    return isValid;
  };

  const handleStepChange = async (newStep) => {
    setStepError(""); // Clear previous error
    const isValid = await validateStep(newStep - 1);
    return isValid;
  };

  // onSubmit handles form submission, API call and state updates
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
        // Persist the API data, city and submitted data so that refreshing shows the result view
        localStorage.setItem(
          "climateData",
          JSON.stringify({ rawApiData: apiData, city, submittedData: data })
        );
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
          <Stepper
            initialStep={1}
            onStepChange={handleStepChange}
            onFinalStepCompleted={handleSubmit(onSubmit)}
          >
            {/* Step 1: Soil Nutrient Information */}
            <Step>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Soil Nutrient Information
                </h2>
                {stepError && (
                  <div className="text-red-500 text-sm mb-2">{stepError}</div>
                )}
                <Input
                  label="Nitrogen (N)"
                  type="number"
                  {...register("nitrogen", {
                    required: "Nitrogen value is required",
                    min: { value: 0, message: "Value must be at least 0" },
                    max: { value: 150, message: "Value must be 150 or less" },
                  })}
                  error={errors.nitrogen?.message}
                  placeholder="Standard range: 0-150"
                />
                <Input
                  label="Phosphorus (P)"
                  type="number"
                  {...register("phosphorus", {
                    required: "Phosphorus value is required",
                    min: { value: 0, message: "Value must be at least 0" },
                    max: { value: 150, message: "Value must be 150 or less" },
                  })}
                  error={errors.phosphorus?.message}
                  placeholder="Standard range: 0-150"
                />
                <Input
                  label="Potassium (K)"
                  type="number"
                  {...register("potassium", {
                    required: "Potassium value is required",
                    min: { value: 0, message: "Value must be at least 0" },
                    max: { value: 150, message: "Value must be 150 or less" },
                  })}
                  error={errors.potassium?.message}
                  placeholder="Standard range: 0-150"
                />
                <Input
                  label="Soil pH"
                  type="number"
                  step="0.1"
                  {...register("soilPh", {
                    required: "Soil pH is required",
                    min: { value: 0, message: "pH must be at least 0" },
                    max: { value: 14, message: "pH must be 14 or less" },
                  })}
                  error={errors.soilPh?.message}
                  placeholder="Typically between 5.5 and 7.5"
                />
              </div>
            </Step>
            {/* Step 2: Irrigation Details */}
            <Step>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Irrigation Details
                </h2>
                {stepError && (
                  <div className="text-red-500 text-sm mb-2">{stepError}</div>
                )}
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
                  {...register("irrigation_date", {
                    required: "Date is required",
                  })}
                  error={errors.irrigation_date?.message}
                />
              </div>
            </Step>
          </Stepper>
        ) : (
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold">{city}</h1>

            {/* Render submitted data if available */}
            {submittedData && (
              <div className="mt-6 p-4 border rounded bg-gray-50">
                <h2 className="text-xl font-bold mb-4">Submitted Data</h2>
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(submittedData, null, 2)}
                </pre>
              </div>
            )}

            {/* Irrigation Advice */}
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
                <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 mb-4">
                  <h2 className="text-xl font-bold mb-2">Today’s Weather</h2>
                  <p className="text-gray-600">{weatherData[0].date}</p>
                  <p className="text-gray-700 font-medium">
                    {weatherData[0].description}
                  </p>
                  <div className="flex justify-around mt-2">
                    <p>🌡️ {weatherData[0].temp.toFixed(2)}°C</p>
                    <p>💧 {weatherData[0].humidity}%</p>
                    <p>🌬️ {weatherData[0].wind_speed} m/s</p>
                  </div>
                </div>
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
                  {Object.entries(diseasePredictions).map(
                    ([date, prediction], index) => (
                      <div
                        key={index}
                        className="p-4 bg-red-100 text-red-800 border border-red-400 rounded-lg shadow-md text-left"
                      >
                        <h3 className="font-bold">{date}</h3>
                        <p className="font-medium">{prediction.risk}</p>
                        <p className="text-sm">{prediction.details}</p>
                      </div>
                    )
                  )}
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

export default ClimatePrediction;
