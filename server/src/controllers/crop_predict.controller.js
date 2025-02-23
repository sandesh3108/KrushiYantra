import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import axios from "axios";

const predictCrop = asyncHandler(async (req, res) => {
  const { n, p, k, ph, city } = req.body;

  if (!n || !p || !k || !ph || !city) {
    throw new ApiError(400, "all fields are required");
  }

  try {
    const url = "http://127.0.0.1:5050/predict";
    const data = {
      N: n,
      P: p,
      K: k,
      ph: ph,
      city,
    };

    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.send(new ApiResponse(200, response.data, "data sent to ml Successfully"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Ml crop prediction bot error", error.details)
  }
});


export {
  predictCrop
}