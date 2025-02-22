import { Router } from "express";

const router = Router();
import upload  from "../middlewares/multer.middleware.js";
import { dieasePredict } from "../controllers/diease.controller.js"

router.post('/submit', upload.single('image'), dieasePredict);

export default router;