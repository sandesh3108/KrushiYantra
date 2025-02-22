import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, FlipHorizontal } from "lucide-react";

const ImageCapture = ({ onCapture }) => {
  // mode: null = choose, "camera" = take picture, "upload" = select file
  const [mode, setMode] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // Camera-specific refs and states
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Open camera stream
  const openCamera = async () => {
    try {
      setError(null);
      // Stop any previous stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => videoRef.current.play();
      }
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err.name === "NotAllowedError") {
        setError("Camera access denied. Please check your browser permissions.");
      } else if (err.name === "NotFoundError") {
        setError("No camera found. Please ensure your device has a camera.");
      } else {
        setError("Error accessing camera. Please try again.");
      }
    }
  };

  // Switch camera between front and back (if available)
  const switchCamera = async () => {
    setFacingMode(prev => (prev === "environment" ? "user" : "environment"));
    await openCamera();
  };

  // Capture the image from the video stream
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      // Flip horizontally if using front camera
      if (facingMode === "user") {
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
      }
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(imageData);
      onCapture && onCapture(imageData);
      stopCamera();
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // For file upload from gallery
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setCapturedImage(imageData);
        onCapture && onCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // When mode is set to camera, open the stream
  useEffect(() => {
    if (mode === "camera") {
      openCamera();
    } else {
      // If switching away from camera, stop stream if active
      if (stream) stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Check for multiple cameras available
  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (err) {
        console.error("Error checking devices:", err);
      }
    };
    checkDevices();
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Capture Crop Image</h2>
      
      {error && (
        <div className="w-full p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Option selection */}
      {mode === null && (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setMode("camera")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Camera className="w-5 h-5" />
            Take Picture
          </button>
          <button
            onClick={() => setMode("upload")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Upload from Gallery
          </button>
        </div>
      )}
      
      {/* Camera mode */}
      {mode === "camera" && (
        <>
          <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`absolute inset-0 w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
              />
            ) : (
              <img
                src={capturedImage}
                alt="Captured"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-4 w-full justify-center">
            {!capturedImage ? (
              <>
                {!stream && (
                  <button
                    onClick={openCamera}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Open Camera
                  </button>
                )}
                {stream && (
                  <>
                    <button
                      onClick={capturePhoto}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Take Photo
                    </button>
                    {hasMultipleCameras && (
                      <button
                        onClick={switchCamera}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <FlipHorizontal className="w-5 h-5" />
                        Switch Camera
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setCapturedImage(null);
                  openCamera();
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <RefreshCw className="w-5 h-5" />
                Retake Photo
              </button>
            )}
          </div>
        </>
      )}
      
      {/* Upload mode */}
      {mode === "upload" && (
        <div className="flex flex-col items-center">
          {!capturedImage ? (
            <input type="file" accept="image/*" onChange={handleFileUpload} className="mb-4" />
          ) : (
            <div className="flex flex-col items-center">
              <img
                src={capturedImage}
                alt="Uploaded"
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={() => setCapturedImage(null)}
                className="mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <RefreshCw className="w-5 h-5" />
                Change Photo
              </button>
            </div>
          )}
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCapture;
