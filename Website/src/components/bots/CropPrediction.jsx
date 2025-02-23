import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Stepper, Step } from "../component";
import Input from "../UI/Input";
import axios from "axios";

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

  // Handle form submission and call crop prediction API
  const onSubmit = async (data) => {
    setFormSubmitted(true);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/crop/predict`,
        {
          n: data.nitrogen,
          p: data.phosphorus,
          k: data.potassium,
          ph: data.soilPh,
          city,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status) {
        setCropPrediction(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching crop prediction:", error);
      setError("Failed to fetch crop prediction. Please try again.");
    }
  };

  return (
    <div className="font-['Navbar']">
      <form onSubmit={handleSubmit(onSubmit)}>
        {!formSubmitted ? (
          <Stepper initialStep={1} onFinalStepCompleted={handleSubmit(onSubmit)}>
            {/* Step 1: Soil Nutrient Information */}
            <Step>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Soil Nutrient Information
                </h2>
                <Input
                  label="Nitrogen (N)"
                  type="number"
                  {...register("nitrogen", { required: "Required", min: 0, max: 150 })}
                  error={errors.nitrogen?.message}
                  placeholder="0-150"
                />
                <Input
                  label="Phosphorus (P)"
                  type="number"
                  {...register("phosphorus", { required: "Required", min: 0, max: 150 })}
                  error={errors.phosphorus?.message}
                  placeholder="0-150"
                />
                <Input
                  label="Potassium (K)"
                  type="number"
                  {...register("potassium", { required: "Required", min: 0, max: 150 })}
                  error={errors.potassium?.message}
                  placeholder="0-150"
                />
                <Input
                  label="Soil pH"
                  type="number"
                  step="0.1"
                  {...register("soilPh", { required: "Required", min: 0, max: 14 })}
                  error={errors.soilPh?.message}
                  placeholder="Typically 5.5-7.5"
                />
              </div>
            </Step>
          </Stepper>
        ) : (
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold">{city}</h1>

            {/* Crop Prediction Result */}
            {cropPrediction ? (
              <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-lg">
                <h2 className="text-xl font-bold">Recommended Crop</h2>
                <p className="text-lg">{cropPrediction.recommended_crop}</p>
                <p className="text-sm">{cropPrediction.details}</p>
              </div>
            ) : (
              error && <p className="text-red-500 mt-4">{error}</p>
            )}

            <button
              type="button"
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setFormSubmitted(false)}
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
