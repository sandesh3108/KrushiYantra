import joi from "joi";
import ApiError from "../utils/ApiError.js";

const validateCrop = async (req, res, next) => {
  const cropSchema = joi.object({
    n: joi.number().required(),
    p: joi.number().required(),
    k: joi.number().required(),
    ph: joi.number().required(),
    city: joi.string().required()
  })

  const { error } = cropSchema.validate(req.body);

  if(error){
    throw new ApiError(400, "all fields are required!", error.details);
  }

  next();
}

export {
  validateCrop
}