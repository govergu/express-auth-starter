import { Response } from "express";
import { ENV } from "../../config/env";

export const setTokenCookie = (
  res: Response,
  name: "accessToken" | "refreshToken",
  token: string,
  expiresInSeconds: number,
) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiresInSeconds * 1000, // Convert to milliseconds
  });
};
