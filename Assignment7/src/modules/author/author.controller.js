import { Router } from "express";
import { createAuthor } from "./author.service.js";
import { successResponse } from "../../common/utils/index.js";

const router = Router();

router.post("/", async (req, res) => {
  const data = await createAuthor(req.body);
  return successResponse({
    res,
    status: 201,
    data,
  });
});

export default router;
