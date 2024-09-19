import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { admin } from "../models/admin.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Sendmail } from "../utils/Nodemailer.js";
import { Receptionist } from "../models/receptionist.model.js";

const adminSignUp = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedAdmin = await admin.findOne({ email });

  if (existedAdmin) {
    throw new ApiError(400, "admin already exist");
  }

  const newAdmin = await admin.create({
    username,
    email,
    password,
  });

  if (!newAdmin) {
    throw new ApiError(400, "failed to add admin");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "admin added successfully"));
});

const generateAccessAndRefreshTokens = async (admindID) => {
  try {
    const Admin = await admin.findById(admindID);

    const Accesstoken = Admin.generateAccessToken();
    const Refreshtoken = Admin.generateRefreshToken();

    Admin.Refreshtoken = Refreshtoken;
    await Admin.save({ validateBeforeSave: false });

    return { Accesstoken, Refreshtoken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const loggedAdmin = await admin.findOne({ email });

  if (!loggedAdmin) {
    throw new ApiError(400, "admin does not exist");
  }

  const passwordCheck = await loggedAdmin.isPasswordCorrect(password);

  if (!passwordCheck) {
    throw new ApiError(400, "Password is incorrect");
  }

  const temp_admin = loggedAdmin._id;

  const { Accesstoken, Refreshtoken } = await generateAccessAndRefreshTokens(
    temp_admin
  );

  const loggedadmin = await admin
    .findById(temp_admin)
    .select("-password -Refreshtoken");

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("Accesstoken", Accesstoken, options)
    .cookie("Refreshtoken", Refreshtoken, options)
    .json(new ApiResponse(200, loggedadmin, "logged in successfully"));
});

const adminLogout = asyncHandler(async (req, res) => {
  console.log("⭐", req.body);

  console.log(req.Admin._id);

  await admin.findByIdAndUpdate(
    req.Admin._id,
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
    .json(new ApiResponse(200, {}, "admin logged out"));
});

const adminAddDoctor = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    specialist,
    dob,
    gender,
    mobileNumber,
    address,
    password,
  } = req.body;

  console.log(req.body);

  if (
    !username ||
    !email ||
    !specialist ||
    !dob ||
    !gender ||
    !mobileNumber ||
    !address ||
    !password
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    throw new ApiError(400, "Doctor already exists");
  }

  const newDoctor = await Doctor.create({
    username,
    email,
    specialist,
    dob,
    gender,
    mobileNumber,
    address,
    password,
  });

  if (!newDoctor) {
    throw new ApiError(400, "Failed to add doctor");
  }

  const doctorData = await Doctor.findById(newDoctor._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, doctorData, "Doctor added successfully"));
});

const adminSendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new ApiError(400, "Email is required");
  }
  console.log(email);
  let user;
  user = await Doctor.findOne({ email });
  if (!user) {
    user = await Receptionist.findOne({ email });
  }
  if (!user) {
    // user = await Receptionist.findOne({ email });
    throw new ApiError(404, "Doctor not found");
  }
  const otp = await user.generateOtp();
  const subject = "Your OTP Code";
  const message = `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 15 minutes.</p>`;
  const emailResult = await Sendmail(email, subject, message);
  if (!emailResult.success) {
    throw new ApiError(500, emailResult.error);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

const adminVerifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !email.trim() || !otp || !otp.trim()) {
    throw new ApiError(400, "Email and OTP are required");
  }

  let user = await Doctor.findOne({ email });
  let userType = "doctor";

  if (!user) {
    user = await Receptionist.findOne({ email });
    userType = "receptionist";
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  console.log(user, "user");

  const isValidOtp = user.verifyOtp(otp);

  if (!isValidOtp) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `${
          userType.charAt(0).toUpperCase() + userType.slice(1)
        } OTP verified successfully`
      )
    );
});

const adminResetPassword = asyncHandler(async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (
    [username, oldPassword, newPassword].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(
      400,
      "Username, old password, and new password are required"
    );
  }

  const adminUser = await admin.findOne({ username });
  if (!adminUser) {
    throw new ApiError(404, "Admin not found");
  }

  const isPasswordCorrect = await adminUser.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const isSamePassword = await adminUser.isPasswordCorrect(newPassword);
  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password cannot be the same as the old password"
    );
  }

  adminUser.password = newPassword;
  await adminUser.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

// Function to get unassigned doctors

const getUnassignedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({
      assignedReceptionist: null,
      isVerified: true,
      isDeleted: false,
    });
    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve doctors",
      error: error.message,
    });
  }
};

// Admin adds a new receptionist and assigns doctors
const adminAddReceptionist = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    dob,
    gender,
    mobileNumber,
    address,
    password,
    doctor, // This will be an array of doctor ObjectIds
  } = req.body;

  // Validate required fields
  if (
    !username ||
    !email ||
    !password ||
    !dob ||
    !gender ||
    !mobileNumber ||
    !address ||
    (doctor && !Array.isArray(doctor))
  ) {
    throw new ApiError(
      400,
      "All fields are required, and doctor should be an array"
    );
  }

  // Check if the receptionist already exists
  const existingReceptionist = await Receptionist.findOne({ email });
  if (existingReceptionist) {
    throw new ApiError(400, "Receptionist already exists");
  }

  // Validate doctors and ensure they are not already assigned to another receptionist
  const doctors = await Doctor.find({
    _id: { $in: doctor },
    $or: [
      { assignedReceptionist: { $exists: false } },
      { assignedReceptionist: null },
    ],
  });

  if (doctors.length !== doctor.length) {
    const assignedDoctorIds = doctor.filter(
      (id) => !doctors.some((doc) => doc._id.equals(id))
    );
    throw new ApiError(
      400,
      `Some doctors are already assigned to another receptionist: ${assignedDoctorIds.join(
        ", "
      )}`
    );
  }

  // Create new receptionist with doctor ObjectIds
  const newReceptionist = await Receptionist.create({
    username,
    email,
    password,
    dob,
    gender,
    mobileNumber,
    address,
    doctor: doctor, // Store the array of doctor ObjectIds
  });

  // Update doctors to assign them to the new receptionist
  await Doctor.updateMany(
    { _id: { $in: doctor } },
    { assignedReceptionist: newReceptionist._id }
  );

  if (!newReceptionist) {
    throw new ApiError(400, "Failed to add receptionist");
  }

  // Fetch receptionist data excluding the password field
  const receptionistData = await Receptionist.findById(
    newReceptionist._id
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, receptionistData, "Receptionist added successfully")
    );
});

const getVerifiedUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;
    console.log(search, "backend -------------------");

    // Define a filter for the search functionality
    const nameFilter = search
      ? {
          username: { $regex: search, $options: "i" },
          isVerified: true,
          isDeleted: false,
        }
      : { isVerified: true, isDeleted: false };

    // Query to find all verified doctors based on the filter
    const verifiedDoctors = await Doctor.find(nameFilter);

    // Query to find all verified receptionists based on the filter
    const verifiedReceptionists = await Receptionist.find(nameFilter);

    res.status(200).json({
      success: true,
      data: {
        doctors: verifiedDoctors,
        receptionists: verifiedReceptionists,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve verified doctors and receptionists",
      error: error.message,
    });
  }
};
const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Try finding the user in the Doctor collection
    let user = await Doctor.findById(id);
    console.log(user, "user----");

    // If not found in Doctor collection, check Receptionist collection
    if (!user || user === null) {
      user = await Receptionist.findById(id);
      // console.log(user, "user");
    }

    // If the user is not found in either collection, return a 404
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the user
    await user.updateOne(updatedData);

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Similar logic can be used for deleting:
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Try finding the user in the Doctor collection
    let user = await Doctor.findById(id);

    // If not found in Doctor collection, check Receptionist collection
    if (!user) {
      user = await Receptionist.findById(id);
    }

    // If the user is not found in either collection, return a 404
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Mark the user as deleted
    await user.updateOne({ isDeleted: true, isVerified: false });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getUnVerifiedUsers = async (req, res) => {
  try {
    const { search = "" } = req.query;
    console.log(search, "backend -------------------");

    // Define a filter for the search functionality
    const nameFilter = search
      ? {
          username: { $regex: search, $options: "i" },
          isVerified: false,
          isDeleted: false,
        }
      : { isVerified: false, isDeleted: false };

    // Query to find all verified doctors based on the filter
    const verifiedDoctors = await Doctor.find(nameFilter);

    // Query to find all verified receptionists based on the filter
    const verifiedReceptionists = await Receptionist.find(nameFilter);

    res.status(200).json({
      success: true,
      data: {
        doctors: verifiedDoctors,
        receptionists: verifiedReceptionists,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve verified doctors and receptionists",
      error: error.message,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const { search = "", type = "all" } = req.query;

    // Define a filter for the search functionality
    const nameFilter = search
      ? {
          username: { $regex: search, $options: "i" },
          isDeleted: false,
        }
      : { isDeleted: false };

    let doctors = [];
    let receptionists = [];

    // Query to find all verified doctors based on the filter
    if (type === "all" || type === "Doctor") {
      doctors = await Doctor.find(nameFilter);
    }

    // Query to find all verified receptionists based on the filter
    if (type === "all" || type === "Receptionist") {
      receptionists = await Receptionist.find(nameFilter);
    }

    // Prepare the response data based on the type
    const responseData = {};
    if (type === "all") {
      responseData.doctors = doctors;
      responseData.receptionists = receptionists;
    } else if (type === "Doctor") {
      responseData.doctors = doctors;
    } else if (type === "Receptionist") {
      responseData.receptionists = receptionists;
    }

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve verified doctors and receptionists",
      error: error.message,
    });
  }
};
const editProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Try finding the user in the Doctor collection
    let user = await admin.findById(id);
    // console.log(user, "user----");

    await user.updateOne(updatedData);

    res
      .status(200)
      .json({ success: true, message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  adminSignUp,
  adminLogin,
  adminLogout,
  adminAddDoctor,
  adminSendOtp,
  adminVerifyOtp,
  adminResetPassword,
  getUnassignedDoctors,
  adminAddReceptionist,
  getVerifiedUsers,
  getUnVerifiedUsers,
  getAllUsers,
  deleteUser,
  editProfile,
  editUser,
};
