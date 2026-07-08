import { Request, Response } from "express";
import { registerUser, loginUser, refreshUserToken } from "../services/auth_service.js";
import { AuthenticatedRequest } from "../types/auth_types.js";
import { ExpressError } from "../utils/expressError.js";
import { findUserByIdDB, isEmailInUseDB } from "../dao/user_dao.js";
import { createUserSchema, loginUserSchema } from "../validations/user_val.js";
import { formatZodError } from "../utils/zodError.js";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const createUser = createUserSchema.safeParse(req.body);
  if (!createUser.success) {
    throw new ExpressError(`Validation error: ${formatZodError(createUser.error)}`, 400);
  }
  const { name, email, password } = createUser.data;
  console.log("Registering user:", { name, email }); // Debug log

  try {
    const authResponse = await registerUser(name, email, password);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: authResponse,
    });
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      throw new ExpressError(error.message, 409);//409 is custom error code for conflict, which is appropriate for duplicate email registration attempts
    }
    throw new ExpressError(error.message, 400);
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const loginData = loginUserSchema.safeParse(req.body);
  if (!loginData.success) {
    throw new ExpressError(`Validation error: ${formatZodError(loginData.error)}`, 400);
  }
  const { email, password } = loginData.data;

  try {
    const authResponse = await loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: authResponse,
    });
  } catch (error: any) {
    throw new ExpressError(error.message, 401);
  }
};

export const getMeController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if(!req.user) {
    throw new ExpressError("Unauthorized", 401);
  }
  const userId: string = req.user.userId; //! is used to tell TypeScript that we are sure user is not undefined here.
  
  const user = await findUserByIdDB(userId);
  
  if (!user) {
    throw new ExpressError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ExpressError("Refresh token is required", 400);
  }

  try {
    const { accessToken } = await refreshUserToken(refreshToken);
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken },
    });
  } catch (error: any) {
    throw new ExpressError(error.message, 401);
  }
};

export const checkEmailAvailabilityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const email = String(req.query.email ?? '').trim().toLowerCase();

  if (!email) {
    throw new ExpressError('Email is required', 400);
  }

  const isInUse = await isEmailInUseDB(email);

  res.status(200).json({
    available: !isInUse,
    message: isInUse ? 'Email is already in use' : 'Email is available',
  });
};
