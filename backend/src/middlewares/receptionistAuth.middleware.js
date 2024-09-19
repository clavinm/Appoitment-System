import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Receptionist } from "../models/receptionist.model.js";
import jwt from "jsonwebtoken";

const authReceptionist = asyncHandler(async (req, _, next) => {
  const accToken = req.cookies?.Accesstoken;
  console.log(accToken);

  if (!accToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedAccToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);

  const receptionist = await Receptionist.findById(decodedAccToken?._id).select(
    "-password -Refreshtoken"
  );

  if (!receptionist) {
    throw new ApiError(401, "Invalid access token");
  }

  req.receptionist = receptionist;
  next();
});

export { authReceptionist };
