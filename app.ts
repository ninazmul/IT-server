import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { ErrorMiddleware } from "./middleware/error";
import rateLimit from "express-rate-limit";

require("dotenv").config();

export const app = express();

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => cors origin resource sharing
app.use(
  cors({
    // origin: process.env.ORIGIN,
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// api requeset limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// routes
app.use(
  "/api/v1",
  userRouter,
  courseRouter,
  orderRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working!",
  });
});

// unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route ${req.originalUrl} not found!`) as any;
  error.statusCode = 404;
  next(error);
});

app.use(limiter);

app.use(ErrorMiddleware);
