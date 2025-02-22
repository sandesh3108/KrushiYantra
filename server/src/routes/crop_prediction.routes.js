import express from "express";

const router = express.Router();

import { validateCrop } from "../middlewares/crop_predict.middleware.js";
import { predictCrop } from "../controllers/crop_predict.controller.js";

router.post('/crop/predict', validateCrop, predictCrop);

export default router;