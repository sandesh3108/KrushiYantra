import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Stepper, Step, Select } from "../component";
import Input from "../UI/Input";
import axios from "axios";
import ImageCapture from "../ImageCapture";

const Disease = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [city, setCity] = useState("Fetching location...");
  const [weatherData, setWeatherData] = useState([]);
  const [irrigationAdvice, setIrrigationAdvice] = useState("");
  const [error, setError] = useState("");

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         try {
  //           const response = await fetch(
  //             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  //           );
  //           const data = await response.json();
  //           setCity(
  //             data.address.city ||
  //               data.address.town ||
  //               data.address.village ||
  //               "Unknown Location"
  //           );
  //         } catch (err) {
  //           setError("Failed to fetch location data.");
  //         }
  //       },
  //       () => {
  //         setError("Location access denied. Please enable location services.");
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not supported by this browser.");
  //   }
  // }, []);

  const onSubmit = async (data) => {
    if (!capturedImage) {
      setError("Please capture an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("crop_type", data.crop);
    formData.append("question", "What disease is affecting my crop?");
    formData.append("image", capturedImage);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/submit",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data) {
        console.log("Disease Prediction Response:", response.data);
        setIrrigationAdvice(response.data.message); // Update the UI with the response
      }
    } catch (err) {
      console.error("Error submitting disease prediction request", err);
      setError("Failed to process request. Please try again.");
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
            {/* Step 1: Image Capture */}
            <Step>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-4">
                  Crop Image Capture
                </h2>
                <ImageCapture onCapture={setCapturedImage} />
                {capturedImage && (
                  <div className="mt-4">
                    <p className="text-green-600">
                      Image captured successfully!
                    </p>
                    <img
                      src={capturedImage}
                      alt="Captured Crop"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            </Step>

            {/* Step 2: Crop Details */}
            <Step>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold mb-4">Crop Details</h2>
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
                  {...register("irrigation_date", {
                    required: "Date is required",
                  })}
                  error={errors.irrigation_date?.message}
                />
              </div>
            </Step>
          </Stepper>
        ) : (
          <div>
            <h2>Disease Prediction Response</h2>
            <p>{irrigationAdvice}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Disease;
