import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import { Slot } from "../models/slot.model.js";
import jwt from "jsonwebtoken";
import { Appointment } from "../models/appointment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Chat from "../models/chat.model.js";
import { Patient } from "../models/patient.model.js";
import { Receptionist } from "../models/receptionist.model.js";

const generateAccessAndRefreshTokens = async (doctorID) => {
  try {
    const doctor = await Doctor.findById(doctorID);

    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }

    const Accesstoken = doctor.generateAccessToken();
    const Refreshtoken = doctor.generateRefreshToken();

    doctor.Refreshtoken = Refreshtoken;
    await doctor.save({ validateBeforeSave: false });

    return { Accesstoken, Refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const doctorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const loggedDoctor = await Doctor.findOne({ email });

  if (!loggedDoctor) {
    throw new ApiError(400, "Doctor does not exist");
  }

  const passwordCheck = await loggedDoctor.isPasswordCorrect(password);

  if (!passwordCheck) {
    throw new ApiError(400, "Password is incorrect");
  }

  if (!loggedDoctor.isVerified) {
    throw new ApiError(400, "Doctor is not verified");
  }

  const temp_doctor = loggedDoctor._id;

  const { Accesstoken, Refreshtoken } = await generateAccessAndRefreshTokens(
    temp_doctor
  );

  const loggedDoctorInfo = await Doctor.findById(temp_doctor).select(
    "-password -Refreshtoken"
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
    .json(new ApiResponse(200, loggedDoctorInfo, "Logged in successfully"));
});

const doctorLogout = asyncHandler(async (req, res) => {
  console.log(req.doctor._id);

  await Doctor.findByIdAndUpdate(
    req.doctor._id,
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
    .json(new ApiResponse(200, {}, "Doctor logged out"));
});

const doctorResetPassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if ([email, oldPassword, newPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(
      400,
      "Email, old password, and new password are required"
    );
  }

  const doctor = await Doctor.findOne({ email });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  if (!doctor.isVerified) {
    throw new ApiError(
      403,
      "Doctor is not verified. Password reset is not allowed."
    );
  }

  const isPasswordCorrect = await doctor.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const isSamePassword = await doctor.isPasswordCorrect(newPassword);
  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  doctor.password = newPassword;
  await doctor.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const editDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const user = await Doctor.findById(id);
    await user.updateOne(updatedData);
    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getSlotsForDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  // Ensure the date is provided
  if (!date) {
    throw new ApiError(400, "Date is required");
  }

  // Check for the access token in cookies
  const accToken = req.cookies?.Accesstoken;

  if (!accToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  let doctorId;
  try {
    // Verify the access token
    const decodedAccToken = jwt.verify(
      accToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    doctorId = decodedAccToken?._id;

    if (!doctorId) {
      throw new ApiError(401, "Invalid access token");
    }
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  try {
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

const createDoctorSlots = asyncHandler(async (req, res) => {
  const { date, slots } = req.body;
  console.log(date, slots, "date, slots");

  if (!date || !slots || !Array.isArray(slots)) {
    throw new ApiError(400, "Date and slots are required");
  }

  if (slots.length === 0) {
    throw new ApiError(400, "At least one slot is required");
  }

  const isValidSlots = slots.every(
    (slot) =>
      slot.time &&
      typeof slot.slotNo === "number" &&
      typeof slot.isAvailable === "boolean"
  );
  if (!isValidSlots) {
    throw new ApiError(400, "Invalid slot data");
  }

  const hasAvailableSlot = slots.some((slot) => slot.isAvailable);
  if (!hasAvailableSlot) {
    throw new ApiError(400, "At least one slot must be available");
  }

  const accToken = req.cookies?.Accesstoken;

  if (!accToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedAccToken = jwt.verify(accToken, process.env.ACCESS_TOKEN_SECRET);
  const doctorId = decodedAccToken?._id;

  if (!doctorId) {
    throw new ApiError(401, "Invalid access token");
  }

  const existingSlots = await Slot.find({
    date: new Date(date),
    doctorId,
  });

  if (existingSlots.length > 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Slots already created for this date"));
  }

  const slotDocs = slots.map((slot) => ({
    doctorId,
    date: new Date(date),
    time: slot.time,
    slotNo: slot.slotNo,
    isAvailable: slot.isAvailable,
  }));

  try {
    await Slot.insertMany(slotDocs);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Slots created successfully"));
  } catch (error) {
    console.error("Error creating slots:", error);
    throw new ApiError(500, "Failed to create slots");
  }
});

const getPatientsForDoctor = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.body;
  console.log(doctorId, date, "doctorId, date");

  // Validate inputs
  if (!doctorId || !date) {
    throw new ApiError(400, "Doctor ID and Date are required");
  }

  // Fetch all appointments associated with the doctorId and date, and populate patient details
  const appointments = await Appointment.find({
    doctorId,
    date,
    isDeleted: false,
  })
    .populate("slotId")
    .populate("patientId"); // Populating patient details

  // Check if appointments were found
  if (!appointments.length) {
    throw new ApiError(
      404,
      "No appointments found for the specified doctor and date"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, appointments, "Appointments fetched successfully")
    );
});

const getPatientsDoctorChat = asyncHandler(async (req, res) => {
  const { _id } = req.doctor;
  const { searchTerm } = req.body;

  // Validate inputs
  if (!_id) {
    throw new ApiError(400, "Doctor ID is required");
  }

  // Fetch all distinct patient IDs associated with the doctorId
  const patientIds = await Appointment.distinct("patientId", {
    doctorId: _id,
    isDeleted: false,
  });

  // Check if any patients were found
  if (!patientIds.length) {
    throw new ApiError(404, "No patients found for the specified doctor");
  }

  // Create a query object for searching patients
  let query = {
    _id: { $in: patientIds },
  };

  // If searchTerm is provided, filter by code
  if (searchTerm) {
    query.code = searchTerm;
  }

  // Fetch patients based on the query
  const patients = await Patient.find(query);

  return res
    .status(200)
    .json(new ApiResponse(200, patients, "Patients fetched successfully"));
});

//chattt
const uploadDoctorDocument = asyncHandler(async (req, res) => {
  const { _id } = req.doctor;
  const doctorId = _id;
  const { patientId, message } = req.body;
  const localFilePath = req.file?.path;
  console.log(patientId, "localFilePath");

  if (!doctorId || !patientId) {
    throw new ApiError(400, "Doctor ID and Patient ID are required");
  }

  if (message) {
    const chatEntry = new Chat({ doctorId, patientId, message, type: "text" });
    await chatEntry.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Message saved successfully"));
  } else if (localFilePath) {
    const result = await uploadOnCloudinary(localFilePath);

    if (!result) {
      throw new ApiError(500, "Failed to upload file to Cloudinary");
    }

    const chatEntry = new Chat({
      doctorId,
      patientId,
      message: result.secure_url,
      filename: result.original_filename,
      type: "file",
    });
    await chatEntry.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "File uploaded and URL saved successfully"));
  } else {
    throw new ApiError(400, "Either a file or a message is required");
  }
});
const getChatsByPatientAndDoctor = asyncHandler(async (req, res) => {
  const { _id } = req.doctor;
  const doctorId = _id;
  const { patientId, date } = req.body;

  if (!doctorId || !patientId) {
    throw new ApiError(400, "Doctor ID and Patient ID are required");
  }

  // Build the query conditionally
  const query = {
    doctorId,
    patientId,
  };

  // If date is provided, add a date range query to match the full day
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Move to the next day to cover the full date range

    query.createdAt = {
      $gte: startDate,
      $lt: endDate, // Use $lt for non-inclusive upper bound
    };
  }

  const chats = await Chat.find(query).sort({ createdAt: 1 }); // Sort by oldest first

  if (!chats.length) {
    throw new ApiError(
      404,
      "No chats found for the specified doctor and patient"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "Chats fetched successfully"));
});

const getReceptionistById = asyncHandler(async (req, res) => {
  const { assignedReceptionist } = req.doctor;

  if (!assignedReceptionist) {
    res.status(400).json({ message: "Receptionist ID is required" });
    return;
  }

  try {
    const receptionist = await Receptionist.findById(assignedReceptionist);

    if (!receptionist) {
      res.status(404).json({ message: "Receptionist not found" });
      return;
    }

    res.status(200).json(receptionist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
export {
  doctorLogin,
  doctorLogout,
  doctorResetPassword,
  editDoctorProfile,
  createDoctorSlots,
  getSlotsForDate,
  getPatientsForDoctor,
  uploadDoctorDocument,
  getChatsByPatientAndDoctor,
  getPatientsDoctorChat,
  getReceptionistById,
};
