import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import axios from "axios";
// import logger from "../utils/logger.js";

const postWeather = asyncHandler(async (req, res) => {
  const { city, crop, soil, irrigation_date } = req.body;

  if (!city || !crop || !soil || !irrigation_date) {
    throw new ApiError(400, "All fields are required!");
  }

  const data = {
    city,
    crop,
    soil,
    last_irrigation: irrigation_date, 
  };

  const url = "http://127.0.0.1:6000/predict/weather"; 

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // logger.info("Irrigation Data Fetched Successfully");

    return res.status(200).json(new ApiResponse(200, response.data, "Weather Prediction Fetched!"));
  } catch (error) {
    // logger.error("Error fetching ML prediction", error);
    throw new ApiError(500, "ML Model Internal Server Error!");
  }
});

const getWeather = asyncHandler(async (req, res)=>{
    const { city } = req.params;

    if (!city) {
        throw new ApiError(400, "City is required!");
    }

    const url = 'http://127.0.0.1:6000/weather'

    try {
      const response = await axios.post(url, {city}, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      return res.status(200).json(new ApiResponse(200, response.data, "Weather Prediction Fetched!"));
    } catch (error) {
      console.error(error);
      throw new ApiError(500, "ML Model Internal Server Error!");
    }
})

export { postWeather, getWeather };
