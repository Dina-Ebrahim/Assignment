import bcrypt from "bcrypt";
import { SALT } from "../../config.js";
export const hash = async (plainText, saltRounds = SALT, minor = "b") => {
  const saltSignature = await bcrypt.genSalt(saltRounds, minor);
  const cipherText = await bcrypt.hash(plainText, saltSignature);
  return cipherText;
};

export const compare = async (plainText, cipherText) => {
  const match = await bcrypt.compare(plainText, cipherText);
  return match;
};
