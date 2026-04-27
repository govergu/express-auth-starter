import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./common/middlewares/error.middleware";
import { notFound } from "./common/middlewares/notFound.middleware";
import { AppError } from "./common/utils/appError";

import authRoutes from "./modules/auth/auth.routes";
import { protect } from "./common/middlewares/auth.middleware";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // DO NOT use '*'
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//Authentication Routes
app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
