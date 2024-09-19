import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";
import jwt from "jsonwebtoken";

const authPatient = asyncHandler(async (req, _, next) => {
  const accToken = req.cookies?.Accesstoken;
  console.log(accToken);

  if (!accToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedAccToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);

  const patient = await Patient.findById(decodedAccToken?._id).select(
    " -Refreshtoken"
  );

  if (!patient) {
    throw new ApiError(401, "Invalid access token");
  }

  req.patient = patient;
  next();
});

export { authPatient };
