import { createUserDB, findUserByEmailDB, findUserByIdDB } from "../dao/user_dao.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type { AuthResponse } from "../types/auth_types.js";


export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await createUserDB(name, email, password);
  const accessToken = generateAccessToken(String(user._id), user.email);
  const refreshToken = generateRefreshToken(String(user._id));

  return {
    accessToken,
    refreshToken,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await findUserByEmailDB(email);
  
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(String(user._id), user.email);
  const refreshToken = generateRefreshToken(String(user._id));

  return {
    accessToken,
    refreshToken,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
  };
};

export const refreshUserToken = async (
  refreshToken: string
): Promise<{ accessToken: string }> => {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await findUserByIdDB(decoded.userId);

  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = generateAccessToken(String(user._id), user.email);

  return { accessToken };
};
