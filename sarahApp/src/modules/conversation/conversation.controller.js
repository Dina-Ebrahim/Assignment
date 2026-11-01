import { Router } from "express";
import { authentication } from "../../middelware/authentication.middelware.js";
import { getMyConversations } from "./conversation.service.js";
import { successResponse } from "../../common/utils/index.js";
const router = Router();
router.get("/", authentication(), async (req, res, next) => {
  const data = await getMyConversations(req.user);
  return successResponse({ res, data, status: 200 });
});
export default router;
