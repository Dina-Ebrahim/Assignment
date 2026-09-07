import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { deleteUser, getById, updateUser } from "./user.service.js";

const router = Router();

router.patch("/:id", async (req, res) => {
  const data = await updateUser(req.params.id, req.body);
  return successResponse({ res, status: 201, data });
});
router.delete("/:id", async (req, res) => {
  const data = await deleteUser(req.params.id);
  return successResponse({ res, status: 201, data });
});
router.get("/:id", async (req, res) => {
  const data = await getById(req.params.id);
  return successResponse({ res, status: 201, data });
});

export default router;
