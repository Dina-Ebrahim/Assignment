import { z } from "zod";
import { generalValidationFields } from "../../common/validations.js";
import { late } from "zod/v3";

export const createMessage = (lang) => {
  return z
    .object({
      body: z.strictObject({
        content: z.string().min(2).max(50000).optional(),
        receiverId: generalValidationFields.id(lang),
      }),
      files: z.array(generalValidationFields.file(lang)).max(3).optional(),
    })
    .superRefine((data, ctx) => {
      console.log({
        data,
      });

      if (!data.body.content && !data.files?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["content"],
          message: "missing message content",
        });
      }
    });
};

export const allMessage = (lang) => {
  return z.object({
    query: z.strictObject({
      type: z.enum(["0", "1", "2"]).default("0"),
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(5),
    }),
  });
};
export const deleteMessage = (lang) => {
  return z.object({
    params: z.strictObject({
      messageId: generalValidationFields.id(lang),
    }),
  });
};

export const getConversationMessages = (lang) => {
  return z.object({
    params: z.strictObject({
      conversationId: generalValidationFields.id(lang),
    }),
    query: z.strictObject({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    }),
  });
};
export const sendConversationMessage = (lang) => {
  return z.object({
    params: z.strictObject({
      conversationId: generalValidationFields.id(lang),
    }),
    body: z.object({
      content: z.string().trim().min(2).max(50000).optional(),
    }),
  });
};
