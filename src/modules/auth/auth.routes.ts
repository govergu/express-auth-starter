import express from "express";
import {
  changePassword,
  forgotPasswordController,
  getMe,
  login,
  logout,
  refresh,
  register,
  resetPasswordController,
  verifyEmail,
} from "./auth.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { validate } from "../../common/middlewares/validation.middleware";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.get("/verify-email", verifyEmail);

router.post("/login", validate(loginSchema), login);

router.get("/refresh", refresh);

router.get("/logout", protect, logout);

router.get("/me", protect, getMe);

router.post(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword,
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordController,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController,
);

export default router;
