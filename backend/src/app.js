import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend domain and port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("server is running");
});

import verifyProtectedRoutes from "./routes/verifyProtected.routes.js";
app.use("/api", verifyProtectedRoutes);

import adminRouter from "./routes/admin.routes.js";
app.use("/api/admin", adminRouter);

import doctorRouter from "./routes/doctor.routes.js";
app.use("/api/doctor", doctorRouter);

import receptionistRouter from "./routes/receptionist.routes.js";
app.use("/api/receptionist", receptionistRouter);

import patientRouter from "./routes/patient.routes.js";
app.use("/api/patient", patientRouter);

app.use("*", (req, res, next) => {
  const error = new Error(`Cant find the ${req.originalUrl} on the server`);
  error.statusCode = 404;
  error.status = "fail";
  next(error);
});

app.use((err, req, res, next) => {
  if (err.isJoi === true) {
    err.statusCode = 422;
  }

  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
});

export { app };
