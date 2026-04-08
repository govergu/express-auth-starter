import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";

export const signToken = (id: string) => {
  return jwt.sign({ id }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
};

export const signAccessToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES as any,
  });
};

export const signRefreshToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES as any,
  });
};
