import { z } from "zod";
import { GenderEnum, LanguageEnum } from "./enum/index.js";
const validationMessage = {
  100: {
    ar: "عفوا، الحد الأدنى لطول اسم المستخدم هو 2 أحرف",
    en: "minium username length is 2",
  },
  101: {
    ar: "الايميل غير صالح، يرجى إضافة بريد إلكتروني صالح مثل example@any.com",
    en: "Invalid email format please add vaild email like example@any.com",
  },
  102: {
    ar: "رقم الهاتف غير صالح",
    en: "Invalid phone number",
  },
  103: {
    ar: "كلمة المرور يجب أن تكون بين 8 و 16 حرفًا",
    en: "password must be between 8 and 16 characters",
  },
};
const getValidationMessage = (lang, code) => {
  return lang == LanguageEnum.AR
    ? validationMessage[code].ar
    : validationMessage[code].en;
};

export const matchField = ({ original, copy, ctx, data, lang }) => {
  if (data[original] != data[copy]) {
    ctx.addIssue({
      code: "custom",
      path: [copy],
      message:
        lang == LanguageEnum.AR
          ? `فشل في مطابقة ${original} و ${copy}`
          : `fail to match between ${original}and ${copy}`,
    });
  }
};
export const generalValidationFields = {
  username: (lang) =>
    z.string().min(2, {
      message: getValidationMessage(lang, 100),
    }),
  phone: (lang) =>
    z.e164({
      message: getValidationMessage(lang, 102),
    }),
  confirmPassword: (lang) =>
    z
      .string({
        message: getValidationMessage(lang, 103),
      })
      .min(2)
      .max(16),
  gender: z.enum(GenderEnum),
  email: (lang) =>
    z.email({
      message: getValidationMessage(lang, 101),
    }),
  otp: (lang) => z.string().regex(/^\d{6}$/),
  password: (lang) =>
    z
      .string({
        message: getValidationMessage(lang, 103),
      })
      .regex(
        /^(?=.*[a-z])(?=.*\s{0,})(?=.*[A-Z])(?=.*\d)(?=.*[!#_@$%^&*()]).{8,16}$/,
      )

      .min(8)
      .max(16),
  matchField,
};
