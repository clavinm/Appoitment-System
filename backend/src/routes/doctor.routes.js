import { Router } from "express";
import {
  createDoctorSlots,
  doctorLogin,
  doctorLogout,
  doctorResetPassword,
  editDoctorProfile,
  getChatsByPatientAndDoctor,
  getPatientsDoctorChat,
  getPatientsForDoctor,
  getReceptionistById,
  getSlotsForDate,
  uploadDoctorDocument,
} from "../controllers/doctor.controller.js";
import { authDoctor } from "../middlewares/doctorAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/login").post(doctorLogin);

router.route("/logout").post(authDoctor, doctorLogout);

router.route("/resetPassword").post(authDoctor, doctorResetPassword);

router.route("/editProfile/:id").put(authDoctor, editDoctorProfile);

router.route("/createSlots").post(authDoctor, createDoctorSlots);

router.route("/getSlots").post(authDoctor, getSlotsForDate);

router.route("/getPatientsForDoctor").post(authDoctor, getPatientsForDoctor);


router.route("/getPatientsDoctorChat").post(authDoctor, getPatientsDoctorChat);

router.post("/upload", upload.single("file"), authDoctor, uploadDoctorDocument);

router
  .route("/getChatsByPatientAndDoctor")
  .post(authDoctor, getChatsByPatientAndDoctor);
//getReceptionistById
router.route("/getReceptionistById").get(authDoctor, getReceptionistById);
export default router;
