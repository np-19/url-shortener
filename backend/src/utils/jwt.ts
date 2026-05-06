import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { jwtExpiresIn, jwtSecret } from "../config/constants.js";
import type { JwtPayload } from "../types/jwt_types.js";

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    jwtSecret as Secret,
    { expiresIn: jwtExpiresIn as SignOptions['expiresIn'] }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
