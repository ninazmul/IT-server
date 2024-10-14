import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis"; // Import from redis.ts

// Token options (same as before)
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none";
  secure?: boolean;
}

// Parse environment variables with fallback values
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
); // In seconds
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
); // In seconds

// Cookie options
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 1000),
  maxAge: accessTokenExpire * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 1000),
  maxAge: refreshTokenExpire * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
};

// Send tokens and upload session to Redis
export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  try {
    await redis.set(user.id, JSON.stringify(user)); // Store user session in Redis
  } catch (err) {
    console.error("Failed to set user session in Redis:", err);
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
