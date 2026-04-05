import { AppError } from "../../common/utils/appError";
import { signAccessToken, signRefreshToken } from "../../common/utils/jwt";
import { generateToken } from "../../common/utils/token";
import { ENV } from "../../config/env";
import { User } from "../user/user.model";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../../infrastructure/services/email.service";

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new AppError("Email already in use", 400);
  }

  const user = await User.create(data);

  // 🔐 generate verification token
  const { rawToken, hashedToken } = generateToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await user.save();

  // 🔗 verification link
  const verifyURL = `${ENV.FRONTEND_URL}/verify-email?token=${rawToken}`;

  await sendMail(
    user.email,
    "Verify your email",
    `<h3>Click to verify:</h3><a href="${verifyURL}">${verifyURL}</a>`,
  );

  return user;

  // const accessToken = signAccessToken(user._id.toString());
  // const refreshToken = signRefreshToken(user._id.toString());

  // user.refreshToken = refreshToken;
  // await user.save();

  // return { user, accessToken, refreshToken };
};

export const verifyEmailToken = async (token: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  user.verified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;

  await user.save();

  return { user, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.verified) {
    throw new AppError("Please verify your email first", 401);
  }

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refreshUserToken = async (token: string) => {
  if (!token) throw new AppError("No refresh token", 401);

  let decoded: any;

  try {
    decoded = jwt.verify(token, ENV.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw new AppError("Token mismatch", 401);
  }

  // 🔥 ROTATION
  const newAccessToken = signAccessToken(user._id.toString());
  const newRefreshToken = signRefreshToken(user._id.toString());

  user.refreshToken = newRefreshToken;
  await user.save();

  return { newAccessToken, newRefreshToken };
};

export const logoutUser = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { rawToken, hashedToken } = generateToken();

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await user.save();

  const resetURL = `${ENV.FRONTEND_URL}/reset-password?token=${rawToken}`;

  await sendMail(
    user.email,
    "Reset your password",
    `<h3>Reset Password</h3>
     <p>Click below to reset your password:</p>
     <a href="${resetURL}">${resetURL}</a>`,
  );

  return true;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Token invalid or expired", 400);
  }

  // 🔐 update password
  user.password = newPassword;

  // 🧹 clear reset fields
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 🔥 invalidate old sessions
  user.refreshToken = "";

  await user.save();

  return user;
};
