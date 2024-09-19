import { Router } from "express";
import {
  adminSignUp,
  adminLogin,
  adminLogout,
  adminAddDoctor,
  adminSendOtp,
  adminVerifyOtp,
  adminResetPassword,
  getUnassignedDoctors,
  adminAddReceptionist,
  editUser,
  deleteUser,
  getVerifiedUsers,
  getUnVerifiedUsers,
  getAllUsers,
  editProfile,
} from "../controllers/admin.controller.js";
import { authAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route("/signup").post(adminSignUp);

router.route("/login").post(adminLogin);

router.route("/resetPassword").post(authAdmin, adminResetPassword);

router.route("/logout").post(authAdmin, adminLogout);

router.route("/addDoctor").post(authAdmin, adminAddDoctor);

router.route("/sendOtp").post(authAdmin, adminSendOtp);

router.route("/verifyOtp").post(authAdmin, adminVerifyOtp);

router.route("/unassignedDoctors").get(authAdmin, getUnassignedDoctors);

router.route("/addReceptionist").post(authAdmin, adminAddReceptionist);

router.route("/verifiedUserDetails").get(authAdmin, getVerifiedUsers);

router.route("/unVerifiedUserDetails").get(authAdmin, getUnVerifiedUsers);

router.route("/allUserDetails").get(authAdmin, getAllUsers);

router.route("/edit/:id").put(authAdmin, editUser);

router.route("/delete/:id").delete(authAdmin, deleteUser);

router.route("/editProfile/:id").put(authAdmin, editProfile);

export default router;
