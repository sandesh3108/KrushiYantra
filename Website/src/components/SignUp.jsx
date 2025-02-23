import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Stepper, Step, Select } from "./component";
import Input from "./UI/Input";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [stepError, setStepError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsLoggedIn(true);
      navigate(`/main-page/${role}`);
    }
  }, [navigate]);


  const validateStep = async (step) => {
    if (step === 1) return true;
    let fieldsToValidate =
      step === 2 ? ["name", "role"] : ["phone", "email", "password"];
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      setStepError(
        step === 2
          ? "Please fill in your name and select your role"
          : "Please fill in all contact information correctly"
      );
    } else {
      setStepError("");
    }
    return isValid;
  };

  const handleStepChange = async (newStep) => {
    setStepError(""); // Clear previous error
    return await validateStep(newStep - 1);
  };

  const handleSignUp = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/register", formData);
      console.log("User registered successfully:", response.data);
  
      // Save user details in localStorage
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("role", formData.role);
  
      setIsLoggedIn(true);
  
      // Redirect to main page based on role
      navigate(`/main-page/${formData.role}`);
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    const formData = {
      username: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
    };

    await handleSignUp(formData);
  };

  return (
    <div className="font-['Navbar']">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stepper
          initialStep={1}
          onStepChange={handleStepChange}
          onFinalStepCompleted={handleSubmit(onSubmit)} // ✅ Auto-submits when last step is reached
          backButtonText="Previous"
          nextButtonText="Next"
          disableStepIndicators={true}
        >
          <Step>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to the Krushi Yantra!
              </h2>
              <p className="text-gray-600">
                Click on next to set up your account!
              </p>
            </div>
          </Step>

          <Step>
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              {stepError && (
                <div className="text-red-500 text-sm mb-2">{stepError}</div>
              )}
              <Input
                label="Your Name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                error={errors.name?.message}
              />
              <Select
                label="Who are You?"
                options={["Select", "Farmer", "Buyer"]}
                {...register("role", {
                  validate: (value) =>
                    value !== "Select" || "Please select a role",
                })}
                error={errors.role?.message}
              />
            </div>
          </Step>

          <Step>
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              {stepError && (
                <div className="text-red-500 text-sm mb-2">{stepError}</div>
              )}
              <Input
                label="Phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number",
                  },
                })}
                error={errors.phone?.message}
              />
              <Input
                label="Your Email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                error={errors.email?.message}
              />
              <Input
                label="Create Password"
                type="password"
                placeholder="Create your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
              />
            </div>
          </Step>
        </Stepper>
      </form>
    </div>
  );
};

export default SignUp;
