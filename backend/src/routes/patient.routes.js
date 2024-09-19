import { Router } from "express";
import { authPatient } from "../middlewares/patientAuth.middleware.js";
import {
  getAppointmentsByPatientId,
  getTotalAppointmentsByPatientId,
  patientLogin,
  patientLogout,
} from "../controllers/patient.controller.js";

const router = Router();

router.route("/login").post(patientLogin);

router.route("/logout").post(authPatient, patientLogout);

router
  .route("/getAppoitmentForPatient")
  .post(authPatient, getAppointmentsByPatientId);

router
  .route("/getTotalAppointmentsByPatientId")
  .get(authPatient, getTotalAppointmentsByPatientId);

export default router;
