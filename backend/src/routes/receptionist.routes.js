import { Router } from "express";
import {
  addPatient,
  createAppointment,
  deleteAppointment,
  deletePatient,
  editPatient,
  editRecepProfile,
  fetchAppointmentsWithPatientDetails,
  getAllPatients,
  getSlotDetailsById,
  getSlotsForDates,
  receptionistLogin,
  receptionistLogout,
  receptionistResetPassword,
  sendDoctors,
} from "../controllers/receptionist.controller.js";
import { authReceptionist } from "../middlewares/receptionistAuth.middleware.js";

const router = Router();

router.route("/login").post(receptionistLogin);

router.route("/logout").post(authReceptionist, receptionistLogout);

router
  .route("/receptionistResetPassword")
  .post(authReceptionist, receptionistResetPassword);

router.route("/addPatient").post(authReceptionist, addPatient);

router.route("/editPatient/:id").put(authReceptionist, editPatient);

router.route("/alllPatients").get(authReceptionist, getAllPatients);

router.route("/delete/:id").delete(authReceptionist, deletePatient);

router.route("/editProfile/:id").put(authReceptionist, editRecepProfile);

router.route("/sendDoctors/:id").get(authReceptionist, sendDoctors);

router.route("/getSlotsForDate").post(authReceptionist, getSlotsForDates);
//createAppointment
router.route("/createAppointment").post(authReceptionist, createAppointment);

router
  .route("/appoitmentPatientDetails")
  .post(authReceptionist, fetchAppointmentsWithPatientDetails);

router.route("/slotDetailsById").post(authReceptionist, getSlotDetailsById);

router.route("/deleteAppointment").post(authReceptionist, deleteAppointment);

export default router;
