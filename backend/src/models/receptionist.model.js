import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const receptionistSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      match: [/^\d{10}$/, "Please enter a valid mobile number"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    doctor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
      },
    ],
    role: {
      type: String,
      default: "receptionist",
    },
  },
  {
    timestamps: true,
  }
);

receptionistSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

receptionistSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

receptionistSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

receptionistSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

receptionistSchema.methods.generateOtp = async function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = crypto.createHash("sha256").update(otp).digest("hex");
  this.otpExpiry = Date.now() + 15 * 60 * 1000;
  await this.save();
  return otp;
};

receptionistSchema.methods.verifyOtp = function (inputOtp) {
  if (Date.now() > this.otpExpiry) {
    return false;
  }
  const hashedOtp = crypto.createHash("sha256").update(inputOtp).digest("hex");
  return hashedOtp === this.otp;
};

const Receptionist = mongoose.model("Receptionist", receptionistSchema);

export { Receptionist };
