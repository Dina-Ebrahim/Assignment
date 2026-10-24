import { Router } from "express";
import {
  login,
  signup,
  signupWithGmail,
  confirmEmail,
  resendConfirmEmail,
  requestForForgetPassword,
  verifyForgotPassword,
  resetForgotPassword,
  verifyLoginTwoFactor,
} from "./authentication.service.js";
import { successResponse } from "../../common/utils/success.response.js";
import * as validators from "./authentication.validation.js";
import { validation } from "../../middelware/index.js";

const router = Router();

router.post("/signup", validation(validators.signup), async (req, res) => {
  const data = await signup(req.body);
  return successResponse({ res, status: 201, data });
});
router.post("/signup-with-gmail", async (req, res) => {
  const { data, status } = await signupWithGmail(
    req.body,
    `${req.protocol}://${req.host}`,
  );
  return successResponse({ res, status, data });
});
router.patch(
  "/confirm-email",
  validation(validators.confirmEmail),
  async (req, res) => {
    const data = await confirmEmail(req.body);
    return successResponse({ res, status: 200, data });
  },
);
router.patch(
  "/resend-confirm-email",
  validation(validators.resendConfirmEmail),
  async (req, res) => {
    const data = await resendConfirmEmail(req.body);
    return successResponse({ res, status: 200, data });
  },
);
router.post(
  "/request-forgot-password",
  validation(validators.requestForForgetPassword),
  async (req, res) => {
    const data = await requestForForgetPassword(req.body);
    return successResponse({ res, status: 201, data });
  },
);
router.post(
  "/verify-forgot-password",
  validation(validators.confirmEmail),
  async (req, res) => {
    const data = await verifyForgotPassword(req.body);
    return successResponse({ res, status: 200, data });
  },
);
router.patch(
  "/reset-forgot-password",
  validation(validators.resetForgotPassword),
  async (req, res) => {
    const data = await resetForgotPassword(req.body);
    return successResponse({ res, status: 200, data });
  },
);

router.post(
  "/verify-login-2fa",
  validation(validators.verifyLoginTwoFactor),
  async (req, res) => {
    const data = await verifyLoginTwoFactor(
      req.validate.body,
      `${req.protocol}://${req.host}`,
    );

    return successResponse({
      res,
      status: 200,
      data,
    });
  },
);

router.get("/login", validation(validators.login), async (req, res) => {
  const data = await login(req.validate.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, status: 201, data });
});

export default router;
