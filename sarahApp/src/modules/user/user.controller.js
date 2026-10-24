import { Router } from "express";
import {
  fileValidation,
  localFileUpload,
  processMulterUplaod,
  successResponse,
  uploadMiddleware,
} from "../../common/utils/index.js";
import {
  profile,
  updateProfile,
  rotateToken,
  logOut,
  enableTwoFactor,
  confirmTwoFactor,
} from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../middelware/authentication.middelware.js";
import { TokenTypeEnum } from "../../common/enum/index.js";
import * as validators from "../authentication/authentication.validation.js";
import { validation } from "../../middelware/index.js";
const router = Router();
router.patch(
  "/profile-image",
  authentication(),
  uploadMiddleware({
    multerMiddleware: localFileUpload({ maxFileSize: 2 }).array("attechment"),
    customPath: "user",
    validation: fileValidation.image,
  }),
  async (req, res, next) => {
    // req.user.image = req.file.finalPath;
    // await req.user.save();
    return successResponse({ res, data: { file: req.file ?? req.files } });
  },
);
router.get("/", authentication(), async (req, res, next) => {
  const data = await profile(req.user);
  return successResponse({ res, status: 201, data });
});
router.patch(
  "/update",
  authentication(),
  authorization(),
  async (req, res, next) => {
    const data = await updateProfile(req.user, req.body);
    return successResponse({ res, status: 201, data });
  },
);

router.post(
  "/rotate-token",
  authentication(TokenTypeEnum.REFRESH),
  async (req, res) => {
    const data = await rotateToken(
      req.payload,
      req.user,
      `${req.protocol}://${req.host}`,
    );
    return successResponse({ res, status: 201, data });
  },
);

router.post("/log-out", authentication(), async (req, res) => {
  const data = await logOut(req.payload, req.user, req.body);
  return successResponse({ res, status: 201, data });
});
router.post("/enable-2fa", authentication(), async (req, res) => {
  const data = await enableTwoFactor({ user: req.user });
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.patch(
  "/confirm-2fa",
  authentication(),
  validation(validators.confirmTwoFactor),
  async (req, res) => {
    const data = await confirmTwoFactor({
      user: req.user,
      otp: req.validate.body.otp,
    });
    return successResponse({
      res,
      status: 200,
      data,
    });
  },
);

export default router;
