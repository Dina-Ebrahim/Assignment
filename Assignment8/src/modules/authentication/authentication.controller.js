import { Router } from "express";
import { login, signup } from "./authentication.service.js";
import { successResponse } from "../../common/utils/success.response.js";
const router = Router();

router.post("/signup", async (req, res) => {
  const data = await signup(req.body);
  return successResponse({ res, status: 201, data });
});
router.get("/login", async (req, res) => {
  const data = await login(req.body);
  return successResponse({ res, status: 201, data });
});
export default router;
