import { execPath } from "node:process";
import { UserModel } from "../../DB/model/index.js";
export const updateUser = async (id, data) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  if (data.email && data.email !== user.email) {
    const existsEmail = await UserModel.findOne({ email: data.email });
    if (existsEmail) {
      throw new Error("Email already exists.");
    }
  }
  delete data.password;
  await UserModel.findByIdAndUpdate(id, data);
  return { message: "User updated" };
};
export const deleteUser = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  await UserModel.findByIdAndDelete(id);
  return { message: "User deleted" };
};
export const getById = async (id) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
