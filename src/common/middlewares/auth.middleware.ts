import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
import { User } from "../../modules/user/user.model";
import { AppError } from "../utils/appError";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;

  // ✅ 1. Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ✅ 2. Check cookies (IMPORTANT for your system)
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // ❌ No token found
  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  try {
    // ✅ 3. Verify ACCESS token (NOT refresh token)
    const decoded: any = jwt.verify(token, ENV.JWT_ACCESS_SECRET);

    // ✅ 4. Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User no longer exists", 401));
    }

    // ✅ 5. Attach user
    req.user = user;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!roles.includes(user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};
