import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Patient } from "../models/patient.model.js";
import { Appointment } from "../models/appointment.model.js";

const generateAccessAndRefreshTokens = async (patientID) => {
  try {
    const patient = await Patient.findById(patientID);

    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    const Accesstoken = patient.generateAccessToken();
    const Refreshtoken = patient.generateRefreshToken();

    patient.Refreshtoken = Refreshtoken;
    await patient.save({ validateBeforeSave: false });

    return { Accesstoken, Refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const patientLogin = asyncHandler(async (req, res) => {
  const { code } = req.body;
  // console.log(loginCode,'loginCode');

  if (!code?.trim()) {
    throw new ApiError(400, "Login code is required");
  }

  const loggedPatient = await Patient.findOne({ code });

  if (!loggedPatient) {
    throw new ApiError(400, "Patient does not exist or invalid login code");
  }

  const temp_patient = loggedPatient._id;

  const { Accesstoken, Refreshtoken } = await generateAccessAndRefreshTokens(
    temp_patient
  );

  const loggedPatientInfo = await Patient.findById(temp_patient).select(
    "-Refreshtoken"
  );

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("Accesstoken", Accesstoken, options)
    .cookie("Refreshtoken", Refreshtoken, options)
    .json(new ApiResponse(200, loggedPatientInfo, "Logged in successfully"));
});

const patientLogout = asyncHandler(async (req, res) => {
  await Patient.findByIdAndUpdate(
    req.patient._id,
    {
      $set: {
        Refreshtoken: null,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("Accesstoken", options)
    .clearCookie("Refreshtoken", options)
    .json(new ApiResponse(200, {}, "Patient logged out"));
});

const getAppointmentsByPatientId = asyncHandler(async (req, res) => {
  const { _id } = req.patient;
  const { currentDate } = req.body;
  const patientId = _id;

  // Validate patientId
  if (!patientId) {
    throw new ApiError(400, "Patient ID is required");
  }

  // Fetch all appointments associated with the patientId
  const appointments = await Appointment.find({
    patientId: patientId,
    date: currentDate,
  }).populate("doctorId slotId");

  // Check if appointments were found
  if (!appointments.length) {
    throw new ApiError(404, "No appointments found for this patient");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully")
    );
});
const getTotalAppointmentsByPatientId = asyncHandler(async (req, res) => {
  const { _id } = req.patient;
  const patientId = _id;

  // Validate patientId
  if (!patientId) {
    throw new ApiError(400, "Patient ID is required");
  }

  try {
    // Count the total number of appointments for the given patientId
    const totalAppointments = await Appointment.countDocuments({ patientId });
    const totalDeletedAppointments = await Appointment.countDocuments({
      patientId,
      isDeleted: true,
    });
    const totalNotDeletedAppointments = await Appointment.countDocuments({
      patientId,
      isDeleted: false,
    });

    // Check if appointments were found
    if (totalAppointments === 0) {
      throw new ApiError(404, "No appointments found for this patient");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalAppointments,
          totalDeletedAppointments,
          totalNotDeletedAppointments,
        },
        "Total appointments fetched successfully"
      )
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
export {
  patientLogin,
  patientLogout,
  getAppointmentsByPatientId,
  getTotalAppointmentsByPatientId,
};
