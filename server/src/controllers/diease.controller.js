import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import axios from "axios"
import fs from "fs"
import FormData from "form-data";

const dieasePredict = asyncHandler(async (req, res) => {
  try {

  console.log(req.body);
    const { crop_type, question } = req.body;
    const image = req.file;

    if (!crop_type || !question || !image) {
      throw new ApiError(400, "All fields are required: crop_type, question, and image")
    }

    const FLASK_API_URL = 'http://127.0.0.1:6969/submit';

    const formData = new FormData();
    formData.append("crop_type", crop_type);
    formData.append("question", question);
    formData.append("image", fs.createReadStream(image.path));

    const response = await axios.post(FLASK_API_URL, formData, {
      headers: { ...formData.getHeaders() },
    });

    res.send(new ApiResponse(200, response.data, "img sent successfully!"));
  } catch (error) {
    console.error("Error communicating with Flask API:", error.message);
    res.status(500).json({ error: "Failed to process request" });
  }
});

export { 
  dieasePredict
}
