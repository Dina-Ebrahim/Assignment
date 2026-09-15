import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { getById, getUserByEmail, update } from "./user.service.js";

const router = Router();
router.put("/users/:id", async (req, res) => {
  const data = await update(req.params.id, req.body);
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.get("/by-email", async (req, res) => {
  const data = await getUserByEmail(req.query.email);
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/:id", async (req, res) => {
  const data = await getById(req.params.id);
  return successResponse({
    res,
    status: 200,
    data,
  });
});
export default router;
