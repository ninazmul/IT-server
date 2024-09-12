import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  // Handle specific error types
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    const message = `Json web token is expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  // Send response
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
};
