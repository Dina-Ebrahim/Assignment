import { UserModel } from "../../DB/model/index.js";
export const signup = async (data) => {
  const { name, password, email, phone, age } = data;
  const exitingUser = await UserModel.findOne({ email });
  if (exitingUser) {
    throw new Error("Email already exists");
  }
  const user = await UserModel.create({
    name,
    password,
    email,
    phone,
    age,
  });
  return user;
};
export const login = async (data) => {
  const { email, password } = data;
  const user = await UserModel.findOne({ email });
  if (!user || password !== user.password) {
    throw new Error("Invalid email or password");
  }
  return user;
};
