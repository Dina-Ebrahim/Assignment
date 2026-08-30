import { Router } from "express";
import { createLog, insertLogs } from "./log.service.js";
import { successResponse } from "../../common/utils/index.js";

const router = Router();
router.post("/capped", async (req, res) => {
  const data = await createLog();
  return successResponse({
    res,
    status: 201,
    data,
  });
});

router.post("/insert", async (req, res) => {
  const data = await insertLogs(req.body);
  return successResponse({
    res,
    status: 201,
    data,
  });
});
export default router;
