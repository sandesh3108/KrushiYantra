import React, { useState } from "react";
import { Stepper, Step } from "../component";
import Input from "../UI/Input";
import Select from "../../components/UI/Select"
import axios from "axios";
import ImageCapture from "../ImageCapture";

const Disease = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [cropType, setCropType] = useState("");
  const [question, setQuestion] = useState("What disease is affecting my crop?");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  // 🚀 Handle Form Submission
  const handleSubmit = async () => {
    if (!capturedImage || !cropType || !question) {
      setError("Please provide all required details.");
      return;
    }

    const formData = new FormData();
    formData.append("crop_type", cropType);
    formData.append("question", question);

    // 🔄 Convert Base64 Image to Blob
    const blob = await fetch(capturedImage).then((res) => res.blob());
    formData.append("image", blob, "captured-image.jpg");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/submit",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data) {
        console.log("✅ Disease Prediction Response:", response.data);
        setResponseData(response.data);
      }
    } catch (err) {
      console.error("❌ Error submitting request:", err);
      setError("Failed to process request. Please try again.");
    }
  };

  return (
    <div className="font-['Navbar']">
      <h2 className="text-xl font-bold mb-4">🌾 Crop Disease Prediction</h2>

      {error && <p className="text-red-500">{error}</p>}

      {!responseData ? (
        <Stepper initialStep={1} onFinalStepCompleted={handleSubmit}>
          {/* Step 1: Image Capture */}
          <Step>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">📸 Capture Crop Image</h2>
              <ImageCapture onCapture={setCapturedImage} />
              {capturedImage && (
                <div className="mt-4">
                  <p className="text-green-600">✅ Image captured successfully!</p>
                  <img src={capturedImage} alt="Captured Crop" className="w-full h-auto rounded-lg" />
                </div>
              )}
            </div>
          </Step>

          {/* Step 2: Crop Type & Question */}
          <Step>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">🌱 Crop Details</h2>

              <Select
                label="Select Crop Type"
                options={["Select", "Wheat", "Rice", "Corn", "Soybean"]}
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
              />

              <Input
                label="Your Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

              <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </Step>
        </Stepper>
      ) : (
        // Display API Response
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          <h2 className="text-lg font-semibold">✅ Prediction Result</h2>

          <p className="mt-2"><strong>Status Code:</strong> {responseData.statuscode}</p>
          <p className="mt-2"><strong>Message:</strong> {responseData.message}</p>

          <div className="mt-2 p-3 bg-white text-black rounded-md">
            <h3 className="font-semibold">📝 Answer:</h3>
            <p>{responseData.data.answer}</p>
          </div>

          <div className="mt-2 p-3 bg-white text-black rounded-md">
            <h3 className="font-semibold">🔍 Response & Advice:</h3>
            <p>{responseData.data.response}</p>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg"
            onClick={() => setResponseData(null)}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Disease;
