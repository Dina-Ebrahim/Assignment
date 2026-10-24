import { email, z } from "zod";
import { GenderEnum } from "../../common/enum/index.js";
import { generalValidationFields } from "../../common/validations.js";

export const loginSchema = (lang) => {
  return z.strictObject({
    email: generalValidationFields.email(lang),
    password: generalValidationFields.password(lang),
  });
};
export const login = (lang) => {
  return z.object({
    body: loginSchema(lang),
  });
};

export const confirmEmail = (lang) => {
  return z.object({
    body: z.strictObject({
      email: generalValidationFields.email(lang),
      otp: generalValidationFields.otp(lang),
    }),
  });
};
export const resendConfirmEmail = (lang) => {
  return z.object({
    body: z.strictObject({
      email: generalValidationFields.email(lang),
    }),
  });
};
export const requestForForgetPassword = (lang) => {
  return z.object({
    body: z.strictObject({
      email: generalValidationFields.email(lang),
    }),
  });
};
export const resetForgotPassword = (lang) => {
  return z.object({
    body: z
      .strictObject({
        email: generalValidationFields.email(lang),
        otp: generalValidationFields.otp(lang),
        password: generalValidationFields.password(lang),
        confirmPassword: generalValidationFields.password(lang),
      })
      .superRefine((data, ctx) => {
        generalValidationFields.matchField({
          original: "password",
          copy: "confirmPassword",
          data,
          ctx,
        });
      }),
  });
};
export const confirmTwoFactorSchema = (lang) =>
  z.strictObject({
    otp: generalValidationFields.otp(lang),
  });

export const confirmTwoFactor = (lang) =>
  z.object({
    body: confirmTwoFactorSchema(lang),
  });
export const verifyLoginTwoFactorSchema = (lang) =>
  z.strictObject({
    email: generalValidationFields.email(lang),
    otp: generalValidationFields.otp(lang),
  });

export const verifyLoginTwoFactor = (lang) =>
  z.object({
    body: verifyLoginTwoFactorSchema(lang),
  });
export const signup = (lang) => {
  return z.object({
    body: loginSchema(lang)
      .safeExtend({
        username: generalValidationFields.username(lang),
        phone: generalValidationFields.phone(lang),
        confirmPassword: generalValidationFields.confirmPassword(lang),
        gender: generalValidationFields.gender,
      })
      .superRefine((data, ctx) => {
        generalValidationFields.matchField({
          original: "password",
          copy: "confirmPassword",
          ctx,
          data,
        });

        if (!data.username.includes(" ")) {
          ctx.addIssue({
            code: "custom",
            path: ["username"],
            message: "username must contain space",
          });
        }
      }),
  });
};
