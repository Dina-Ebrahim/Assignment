import { application, Router } from "express";
import {
  fileValidation,
  localFileUpload,
  successResponse,
  uploadMiddleware,
} from "../../common/utils/index.js";
import {
  createMessage,
  GetAllMessages,
  deleteMessage,
  getConversationMessages,
  sendConversationMessage,
} from "./message.service.js";
import { validation } from "../../middelware/validation.middelware.js";
import * as validators from "./messsage.validation.js";
import { authentication } from "../../middelware/authentication.middelware.js";
const router = Router({ caseSensitive: true });
const messageFolderName = "messages";
router.post(
  "/",
  authentication(),
  uploadMiddleware({
    multerMiddleware: localFileUpload().array("attachments", 3),
    validation: fileValidation.image,
    customPath: messageFolderName,
    isRequired: false,
  }),
  validation(validators.createMessage),
  async (req, res, next) => {
    const data = await createMessage(req.body, req.files, req.user);
    return successResponse({ res, data, status: 201 });
  },
);
router.get(
  "/get-All-Message",
  authentication(),
  validation(validators.allMessage),
  async (req, res, next) => {
    const data = await GetAllMessages(req.validate.query, req.user);
    return successResponse({ res, data, status: 201 });
  },
);
router.delete(
  "/:messageId",
  authentication(),
  validation(validators.deleteMessage),
  async (req, res, next) => {
    const data = await deleteMessage(req.validate.params, req.user);
    return successResponse({ res, data, status: 201 });
  },
);
router.get(
  "/conversation/:conversationId/messages",
  authentication(),
  validation(validators.getConversationMessages),
  async (req, res, next) => {
    const data = await getConversationMessages(
      {
        ...req.validate.params,
        ...req.validate.query,
      },
      req.user,
    );

    return successResponse({
      res,
      data,
      status: 200,
    });
  },
);
router.post(
  "/conversation/:conversationId/messages",
  authentication(),
  uploadMiddleware({
    multerMiddleware: localFileUpload().array("attachments", 3),
    validation: fileValidation.image,
    customPath: messageFolderName,
    isRequired: false,
  }),
  validation(validators.sendConversationMessage),
  async (req, res, next) => {
    console.log(req.files);
    const data = await sendConversationMessage(
      {
        ...req.validate.params,
        ...req.validate.body,
      },
      req.user,
      req.files || [],
    );

    return successResponse({
      res,
      data,
      status: 201,
    });
  },
);
export default router;
