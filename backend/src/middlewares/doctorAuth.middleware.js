import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Doctor } from "../models/doctor.model.js";
import jwt from "jsonwebtoken";

const authDoctor = asyncHandler(async (req, _, next) => {

    const accToken = req.cookies?.Accesstoken;
    console.log(accToken)

    if (!accToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedAccToken = jwt.verify(
        accToken,
        process.env.ACCESS_TOKEN_SECRET
    );

    const doctor = await Doctor.findById(decodedAccToken?._id).select("-password -Refreshtoken");

    if (!doctor) {
        throw new ApiError(401, "Invalid access token");
    }

    req.doctor = doctor;
    next();
});

export { authDoctor };
