import { userModel } from "../../DB/model/index.js";

export const signUp = async (inputs) => {
  const { email } = inputs;

  const exist = await userModel.findOne({
    where: { email },
  });

  if (exist) {
    throw new Error("Email already exists.");
  }

  const user = userModel.build(inputs);

  await user.save();

  return {
    message: "User added successfully.",
  };
};
