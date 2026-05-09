import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth_service.js";
import { ExpressError } from "../utils/expressError.js";
import { findUserByIdDB } from "../dao/user_dao.js";
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
  req: Request,
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
