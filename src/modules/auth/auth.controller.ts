import { Request, Response } from "express";
import { catchAsync } from "../../common/utils/catchAsync";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  resetPassword,
  verifyEmailToken,
} from "./auth.service";
import { setTokenCookie } from "../../common/utils/cookies";
import { ENV } from "../../config/env";
import { User } from "../user/user.model";
import { AppError } from "../../common/utils/appError";

// Define constants for clarity (or pull from ENV)
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXPIRY = Number(ENV.COOKIE_EXPIRES_DAYS) * 24 * 60 * 60;

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  res.status(201).json({ status: "success", data: user });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    throw new AppError("Token missing", 400);
  }

  const { user, accessToken, refreshToken } = await verifyEmailToken(
    token as string,
  );

  setTokenCookie(res, "accessToken", accessToken, ACCESS_TOKEN_EXPIRY);
  setTokenCookie(res, "refreshToken", refreshToken, REFRESH_TOKEN_EXPIRY);

  res.json({
    status: "success",
    message: "Email verified successfully",
    data: { user },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await loginUser(email, password);

  setTokenCookie(res, "accessToken", accessToken, ACCESS_TOKEN_EXPIRY);
  setTokenCookie(res, "refreshToken", refreshToken, REFRESH_TOKEN_EXPIRY);

  res.status(200).json({ status: "success", data: { user } });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const { newAccessToken } = await refreshUserToken(token);

  setTokenCookie(res, "accessToken", newAccessToken, ACCESS_TOKEN_EXPIRY);
  // setTokenCookie(res, "refreshToken", newRefreshToken, REFRESH_TOKEN_EXPIRY);

  res.json({ status: "success" });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  // Clear both cookies
  await logoutUser(req.user._id);
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ status: "success", message: "Logged out" });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  res.json({
    status: "success",
    data: req.user,
  });
});

// export const updateProfile = catchAsync(async (req: Request, res: Response) => {
//   const user = await User.findByIdAndUpdate(req.user.id, req.body, {
//     new: true,
//   });

//   res.json({
//     status: "success",
//     data: user,
//   });
// });

export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      throw new AppError("User doesn't exist", 404);
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      throw new AppError("Current password incorrect", 400);
    }

    user.password = newPassword;
    await user.save();

    res.json({
      status: "success",
      message: "Password updated",
    });
  },
);

export const forgotPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    await forgotPassword(email);

    res.json({
      status: "success",
      message: "Password reset email sent",
    });
  },
);

export const resetPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token) {
      throw new AppError("Token missing", 400);
    }

    await resetPassword(token as string, newPassword);

    res.json({
      status: "success",
      message: "Password reset successful",
    });
  },
);
