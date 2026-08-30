import { UserModel } from "../../DB/model/user.model.js";

export const signup = async ({ email, username, password, DOB, gender }) => {
  const checkDuplicatedAccount = await UserModel.findOne({ email });
  if (checkDuplicatedAccount) {
    throw new Error("Email exist", { cause: { status: 409 } });
  }
  const account = await UserModel.insertOne({
    email,
    username,
    password,
    DOB,
    gender,
  });
  return account;
};
