import express from "express";
const app = express();
import ErrorHandler from "./utils/errorHandler.js";
import cors from "cors";

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173", "http://localhost:5175", "http://localhost:5176"], 
  credentials: true
}));

import googleLogin from "./routes/auth.routes.js";
import users from "./routes/user.routes.js";
import weather from "./routes/weather.routes.js";
import cropPredict from './routes/crop_prediction.routes.js';
import diease from "./routes/diease.routes.js";

app.use('/api/v1/weather', weather);
app.use('/api/v1/auth', googleLogin);
app.use('/api/v1', users);
app.use('/api/v1', cropPredict);
app.use('/api/v1', diease);
app.use(ErrorHandler)

app.get('/', (req, res)=>{
  res.send("hello");
})

export default app;