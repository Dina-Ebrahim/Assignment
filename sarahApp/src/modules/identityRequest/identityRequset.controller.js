import { Router } from "express";
import { authentication } from "../../middelware/authentication.middelware.js";
import { validation } from "../../middelware/validation.middelware.js";

import * as validators from "./identityRequest.validation.js";
import { successResponse } from "../../common/utils/success.response.js";
import {
  createIdentityRequest,
  getIdentityRequests,
  respondToIdentityRequest,
} from "./identityRequest.service.js";
const router = Router();
router.post(
  "/:messageId",
  authentication(),
  validation(validators.createIdentityRequest),
  async (req, res, next) => {
    const data = await createIdentityRequest(req.validate.params, req.user);

    return successResponse({ res, data, status: 201 });
  },
);
router.get("/", authentication(), async (req, res, next) => {
  const data = await getIdentityRequests(req.user);

  return successResponse({
    res,
    data,
    status: 200,
  });
});
router.patch(
  "/:requestId/respond",
  authentication(),
  validation(validators.respondToIdentityRequest),
  async (req, res, next) => {
    const data = await respondToIdentityRequest(
      {
        ...req.validate.params,
        ...req.validate.body,
      },
      req.user,
    );

    return successResponse({ res, data, status: 200 });
  },
);
export default router;
