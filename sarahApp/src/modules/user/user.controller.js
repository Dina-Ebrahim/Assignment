import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { profile, updateProfile, rotateToken, logOut } from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../middelware/authentication.middelware.js";
import { RoleEnum, TokenTypeEnum } from "../../common/enum/index.js";

const router = Router();
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
export default router;
