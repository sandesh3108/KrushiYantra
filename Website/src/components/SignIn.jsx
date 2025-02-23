import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Stepper, Step } from "./component";
import Input from "./UI/Input";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
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
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // ✅ Check if user is already logged in on page load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("role");
    if (token && role) {
      setIsLoggedIn(true);
      navigate(`/main-page/${role}`); // Redirect user to main page
    }
  }, [navigate, setIsLoggedIn]);

  const validateStep = async (step) => {
    if (step === 1) return true;
    let fieldsToValidate = step === 2 ? ["email", "password"] : [];
    const isValid = await trigger(fieldsToValidate);

    if (!isValid) {
      setStepError("Please fill in all required fields correctly");
    } else {
      setStepError("");
    }
    return isValid;
  };

  const handleStepChange = async (newStep) => {
    setStepError(""); // Clear previous error
    return await validateStep(newStep - 1);
  };

  const handleSignIn = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/login", formData);
      console.log(formData)
      console.log("User logged in successfully:", response.data);

      // ✅ Store token & role in localStorage
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("role", response.data.data.role);


      setIsLoggedIn(true);

      // ✅ Navigate to role-based main page
      console.log(response.data.data.role)
      navigate(`/main-page/${response.data.data.role}`);
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    console.log("Login Form submitted:", data);
    const formData = {
      email: data.email, // Email or Phone
      password: data.password,
      role: data.role,
    };

    await handleSignIn(formData);
  };

  return (
    <div className="font-['Navbar']">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stepper
          initialStep={1}
          onStepChange={handleStepChange}
          onFinalStepCompleted={handleSubmit(onSubmit)} // ✅ Auto-submits on last step
          backButtonText="Previous"
          nextButtonText="Next"
          disableStepIndicators={true}
        >
          <Step>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome Back to Krushi Yantra!</h2>
              <p className="text-gray-600">Click on next to log into your account.</p>
            </div>
          </Step>

          <Step>
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold mb-4">Sign In</h2>
              {stepError && <div className="text-red-500 text-sm mb-2">{stepError}</div>}
              <Input
                label="Email"
                type="email"
                placeholder="Enter your phone number or Email"
                {...register("email", {
                  required: "Email or phone number is required",
                })}
                error={errors.email?.message}
              />
              <Input
                label="Enter Password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
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

export default SignIn;
