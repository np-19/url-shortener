import { createUserDB, findUserByEmailDB } from "../dao/user_dao.js";
import { generateToken } from "../utils/jwt.js";
import type { AuthResponse } from "../types/auth_types.js";


export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const user = await createUserDB(name, email, password);
  const token = generateToken(String(user._id), user.email);

  return {
    token,
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

  const token = generateToken(String(user._id), user.email);

  return {
    token,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
    },
  };
};
