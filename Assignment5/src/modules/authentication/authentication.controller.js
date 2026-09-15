import { Router } from "express";
import { signUp } from "./authentication.service.js";
import { successResponse } from "../../common/utils/success.response.js";
const router = Router();

router.post("/signup", async (req, res) => {
  const data = await signUp(req.body);
  return successResponse({ res, status: 201, data });
});

export default router;
