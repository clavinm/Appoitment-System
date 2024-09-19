import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Receptionist } from "../models/receptionist.model.js";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Slot } from "../models/slot.model.js";
import { Appointment } from "../models/appointment.model.js";
// import jwt from "jsonwebtoken";
// import { Sendmail } from "../utils/Nodemailer.js";

const generateAccessAndRefreshTokens = async (receptionistID) => {
  try {
    const receptionist = await Receptionist.findById(receptionistID);

    if (!receptionist) {
      throw new ApiError(404, "Receptionist not found");
    }

    const Accesstoken = receptionist.generateAccessToken();
    const Refreshtoken = receptionist.generateRefreshToken();

    receptionist.Refreshtoken = Refreshtoken;
    await receptionist.save({ validateBeforeSave: false });

    return { Accesstoken, Refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const receptionistLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const loggedReceptionist = await Receptionist.findOne({ email });

  if (!loggedReceptionist) {
    throw new ApiError(400, "Receptionist does not exist");
  }

  const passwordCheck = await loggedReceptionist.isPasswordCorrect(password);

  if (!passwordCheck) {
    throw new ApiError(400, "Password is incorrect");
  }

  if (!loggedReceptionist.isVerified) {
    throw new ApiError(400, "Receptionist is not verified");
  }

  const temp_receptionist = loggedReceptionist._id;

  const { Accesstoken, Refreshtoken } = await generateAccessAndRefreshTokens(
    temp_receptionist
  );

  const loggedReceptionistInfo = await Receptionist.findById(
    temp_receptionist
  ).select("-password -Refreshtoken");

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("Accesstoken", Accesstoken, options)
    .cookie("Refreshtoken", Refreshtoken, options)
    .json(
      new ApiResponse(200, loggedReceptionistInfo, "Logged in successfully")
    );
});

const receptionistLogout = asyncHandler(async (req, res) => {
  await Receptionist.findByIdAndUpdate(
    req.receptionist._id,
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
    .json(new ApiResponse(200, {}, "Receptionist logged out"));
});

const receptionistResetPassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if ([email, oldPassword, newPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(
      400,
      "Email, old password, and new password are required"
    );
  }

  const receptionist = await Receptionist.findOne({ email });
  if (!receptionist) {
    throw new ApiError(404, "Receptionist not found");
  }

  if (!receptionist.isVerified) {
    throw new ApiError(
      403,
      "Receptionist is not verified. Password reset is not allowed."
    );
  }

  const isPasswordCorrect = await receptionist.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const isSamePassword = await receptionist.isPasswordCorrect(newPassword);
  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  receptionist.password = newPassword;
  await receptionist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

// Helper function to generate a random 5-digit code
const generateUniqueCode = async () => {
  let code;
  let exists = true;

  do {
    code = Math.floor(10000 + Math.random() * 90000).toString();
    const existingPatient = await Patient.findOne({ code });
    if (!existingPatient) exists = false;
  } while (exists);

  return code;
};

const addPatient = asyncHandler(async (req, res) => {
  const { username, email, mobileNumber, dob, gender, address } = req.body;

  if (!username || !email || !dob || !gender || !address) {
    throw new ApiError(
      400,
      "Username, email, password, and date of birth are required"
    );
  }

  // Check if patient with the same email or username already exists
  const existingPatient = await Patient.findOne({
    $or: [{ email }, { username }],
  });
  if (existingPatient) {
    throw new ApiError(
      400,
      "Patient with this email or username already exists"
    );
  }

  const code = await generateUniqueCode();

  const newPatient = await Patient.create({
    code,
    username,
    email,
    mobileNumber,
    dob,
    gender,
    address,
  });

  const patientData = await Patient.findById(newPatient._id);

  return res
    .status(200)
    .json(new ApiResponse(200, patientData, "Patient added successfully"));
});

const editPatient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // Find the patient by ID
  let patient = await Patient.findById(id);

  // If patient not found, return a 404 error
  if (!patient) {
    return res
      .status(404)
      .json({ success: false, message: "Patient not found" });
  }

  // Update the patient
  await patient.updateOne(updatedData);

  res
    .status(200)
    .json({ success: true, message: "Patient updated successfully" });
});

const getAllPatients = asyncHandler(async (req, res) => {
  try {
    const { search = "" } = req.query;

    // Define a filter for the search functionality
    const codeFilter = search
      ? {
          code: { $regex: search, $options: "i" },
          isDeleted: false,
        }
      : { isDeleted: false };

    // Query to find all patients based on the filter
    const patients = await Patient.find(codeFilter);

    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve patients",
      error: error.message,
    });
  }
});

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Try finding the user in the Doctor collection
    const user = await Patient.findById(id);

    // If the user is not found in either collection, return a 404
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Mark the user as deleted
    await user.updateOne({ isDeleted: true });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const editRecepProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Try finding the user in the Doctor collection
    const user = await Receptionist.findById(id);
    // console.log(user, "user----");

    await user.updateOne(updatedData);

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const sendDoctors = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the receptionist by ID
  const receptionist = await Receptionist.findById(id);

  if (
    !receptionist ||
    !receptionist.doctor ||
    receptionist.doctor.length === 0
  ) {
    throw new ApiError(404, "No doctors found for the given receptionist");
  }

  // Extract the array of doctor IDs
  const doctorIds = receptionist.doctor;

  // Find all doctors by their IDs
  const doctors = await Doctor.find({ _id: { $in: doctorIds } });

  if (!doctors || doctors.length === 0) {
    throw new ApiError(404, "No doctors found");
  }

  // Map over the doctors to get an array of objects containing id and name
  const doctorDetails = doctors.map((doctor) => ({
    id: doctor._id,
    name: doctor.username, // Assuming 'username' is the field that stores the doctor's name
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, doctorDetails, "Doctors fetched successfully"));
});

const getSlotsForDates = asyncHandler(async (req, res) => {
  const updateData = req.body; // Destructure date and doctorId from req.body
  console.log(updateData, "updateData");

  const { date, doctorId } = updateData;
  console.log(date, doctorId, "date, doctorId");

  // Ensure both date and doctorId are provided
  if (!date || !doctorId) {
    throw new ApiError(400, "Date and Doctor ID are required");
  }

  try {
    // Fetch the slots for the given date and doctorId, sorted by slot number
    const slots = await Slot.find({ date, doctorId }).sort({ slotNo: 1 });

    if (slots.length === 0) {
      return res
        .status(200)
        .json({ message: "No slots found for this date", data: [] });
    }

    return res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    throw new ApiError(500, "Failed to fetch slots");
  }
});

const createAppointment = asyncHandler(async (req, res) => {
  const updateData = req.body;
  const { slotId, patientToken } = updateData;

  // Validate required fields
  if ([slotId, patientToken].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Slot ID and Patient Token are required");
  }

  // Find the patient using patientToken (code)
  const patient = await Patient.findOne({ code: patientToken });
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  // Check if the slot exists and populate required fields
  const slot = await Slot.findById(slotId).populate("doctorId");
  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  const { date, time, doctorId } = slot;

  // Check if the doctor exists (this is optional since the slot is already associated with a doctor)
  if (!doctorId) {
    throw new ApiError(404, "Doctor not found");
  }

  // Check if the patient has already booked the same slot on the same day
  const existingAppointment = await Appointment.findOne({
    date,
    slotId,
    patientToken,
    isDeleted: false,
  });

  if (existingAppointment) {
    throw new ApiError(
      400,
      "Patient already has an appointment for this slot on the same day"
    );
  }

  // Create the new appointment
  const newAppointment = await Appointment.create({
    date,
    time,
    slotId,
    doctorId,
    patientId: patient._id, // Store patient ID in the appointment
    patientToken, // Optionally store patientToken for reference
  });

  if (!newAppointment) {
    throw new ApiError(500, "Failed to create appointment");
  }
  await Slot.findByIdAndUpdate(slotId, { $inc: { peoples: 1 } }, { new: true });

  return res
    .status(200)
    .json(
      new ApiResponse(200, newAppointment, "Appointment created successfully")
    );
});

const fetchAppointmentsWithPatientDetails = asyncHandler(async (req, res) => {
  const { slotId, search = "" } = req.body;

  if (!slotId) {
    throw new ApiError(400, "Slot ID is required");
  }

  // Define a filter for the search functionality
  const searchFilter = search
    ? {
        patientToken: { $regex: search, $options: "i" },
      }
    : {};

  // Fetch all appointments for the given slotId and apply the search filter
  const appointments = await Appointment.find({
    slotId,
    isDeleted: false,
    ...searchFilter,
  }).populate({
    path: "patientId",
    select: "username email mobileNumber",
  });

  if (!appointments.length) {
    return res
      .status(404)
      .json(new ApiError(404, "No appointments found for this slot"));
  }

  // Add appointmentId to each appointment document
  const appointmentsWithPatientDetails = appointments.map((appointment) => ({
    ...appointment.toObject(),
    appointmentId: appointment._id,
  }));

  return res.status(200).json({
    status: 200,
    data: appointmentsWithPatientDetails,
    message: "Appointments with patient details fetched successfully",
  });
});

const getSlotDetailsById = asyncHandler(async (req, res) => {
  const { slotId } = req.body;

  if (!slotId) {
    throw new ApiError(400, "Slot ID is required");
  }

  try {
    const slot = await Slot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    return res.status(200).json(slot);
  } catch (error) {
    console.error("Error fetching slot details:", error);
    throw new ApiError(500, "Failed to fetch slot details");
  }
});

const deleteAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  if (!appointmentId) {
    throw new ApiError(400, "Appointment ID is required");
  }

  // Find the appointment and update the isDeleted field
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { isDeleted: true },
    { new: true, runValidators: true } // Return the updated document
  );

  if (!appointment) {
    return res.status(404).json(new ApiError(404, "Appointment not found"));
  }
  const slotId = appointment.slotId;

  await Slot.findByIdAndUpdate(
    slotId,
    { $inc: { peoples: -1 } },
    { new: true }
  );

  return res.status(200).json({
    status: 200,
    data: appointment,
    message: "Appointment marked as deleted and slots updated successfully",
  });
});

export {
  receptionistLogin,
  receptionistLogout,
  receptionistResetPassword,
  addPatient,
  editPatient,
  getAllPatients,
  deletePatient,
  editRecepProfile,
  sendDoctors,
  getSlotsForDates,
  createAppointment,
  fetchAppointmentsWithPatientDetails,
  getSlotDetailsById,
  deleteAppointment,
};
