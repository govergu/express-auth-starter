import { NextFunction, Request, Response } from "express";
import { ENV } from "../../config/env";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error: ", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  if (ENV.NODE_ENV === "development") {
    return res.status(statusCode).json({
      status: err.status || "error",
      message,
      stack: err.stack,
    });
  }

  return res.status(statusCode).json({
    status: err.status || "error",
    message,
  });
};
