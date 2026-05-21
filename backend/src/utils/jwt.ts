import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { jwtAccessExpiresIn, jwtRefreshExpiresIn, jwtSecret, jwtRefreshSecret } from "../config/constants.js";
import type { JwtPayload } from "../types/jwt_types.js";

export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    jwtSecret as Secret,
    { expiresIn: jwtAccessExpiresIn as SignOptions['expiresIn'] }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    jwtRefreshSecret as Secret,
    { expiresIn: jwtRefreshExpiresIn as SignOptions['expiresIn'] }
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, jwtRefreshSecret) as { userId: string };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
