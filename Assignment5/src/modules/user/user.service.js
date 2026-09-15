import { userModel } from "../../DB/model/index.js";
export const update = async (id, input) => {
  await userModel.upsert(
    {
      id,
      ...input,
    },
    {
      validate: false,
    },
  );
  return {
    message: "User created or updated successfully",
  };
};
export const getUserByEmail = async (email) => {
  const user = await userModel.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("no user found");
  }

  return { user };
};
export const getById = async (id) => {
  const user = await userModel.findByPk(id, {
    attributes: { exclude: ["role"] },
  });
  if (!user) {
    throw new Error("no user found");
  }
  return { user };
};
