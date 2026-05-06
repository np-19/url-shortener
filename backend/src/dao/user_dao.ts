import { UserModel } from "../models/user_model.js";
import type { IUser } from "../types/mongo_types.js";

export const createUserDB = async (
  name: string,
  email: string,
  password: string
): Promise<IUser> => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = new UserModel({ name, email, password });
  return await user.save();
};

export const findUserByEmailDB = async (email: string): Promise<IUser | null> => {
  return await UserModel.findOne({ email }).select("+password");
};

export const findUserByIdDB = async (userId: string): Promise<IUser | null> => {
  return await UserModel.findById(userId);
};

export const getAllUsersDB = async (): Promise<IUser[]> => {
  return await UserModel.find().select("-password");
};

export const updateUserDB = async (
  userId: string,
  updates: Partial<IUser>
): Promise<IUser | null> => {
  return await UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");
};

export const deleteUserDB = async (userId: string): Promise<boolean> => {
  const result = await UserModel.findByIdAndDelete(userId);
  return !!result;
};
