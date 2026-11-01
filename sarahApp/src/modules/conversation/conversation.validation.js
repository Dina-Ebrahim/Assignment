import { z } from "zod";
import { generalValidationFields } from "../../common/validations.js";

export const createIdentityRequest = (lang) => {
  return z.object({
    params: z.strictObject({
      messageId: generalValidationFields.id(lang),
    }),
  });
};
export const respondToIdentityRequest = (lang) => {
  return z.object({
    params: z.strictObject({
      requestId: generalValidationFields.id(lang),
    }),
    body: z.strictObject({
      status: z.enum(["1", "2"]),
    }),
  });
};
