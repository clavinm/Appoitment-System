import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../models/admin.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Receptionist } from "../models/receptionist.model.js";
import { Patient } from "../models/patient.model.js";

const verifyProtectedRoutes = asyncHandler(async (req, res, next) => {
  const accToken = req.cookies?.Accesstoken;

  if (!accToken) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, null, "Unauthenticated: No access token provided")
      );
  }

  try {
    const decodedAccToken = jwt.verify(
      accToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const { role, _id } = decodedAccToken;

    if (!role || !_id) {
      throw new Error("Invalid token: Role or ID not found in token");
    }

    let currentUser;

    if (role === "admin") {
      console.log("admin");

      currentUser = await admin.findById(_id).select("-password -Refreshtoken");
    } else if (role === "doctor") {
      currentUser = await Doctor.findById(_id).select(
        "-password -Refreshtoken"
      );
    } else if (role === "receptionist") {
      currentUser = await Receptionist.findById(_id).select(
        "-password -Refreshtoken"
      );
    } else if (role === "patient") {
      currentUser = await Patient.findById(_id).select(" -Refreshtoken");
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid user role"));
    }

    if (!currentUser) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Optionally, attach the user to the request object for further middleware or route handling
    req.currentUser = currentUser;

    return res
      .status(200)
      .json(new ApiResponse(200, currentUser, "Token is valid"));
  } catch (err) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, null, "Unauthenticated: Token expired or invalid")
      );
  }
});

export { verifyProtectedRoutes };
