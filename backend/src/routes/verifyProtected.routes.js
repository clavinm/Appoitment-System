import { Router } from "express";
import { verifyProtectedRoutes } from "../controllers/verifyProtectedRoutes.js";

const router = Router();

router.route("/verifyProtectedRoutes").get(verifyProtectedRoutes);

export default router;
