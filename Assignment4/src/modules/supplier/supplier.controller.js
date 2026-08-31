import { Router } from "express";
const router = Router();
import {
  createSupplier,
  DELETE,
  getAll,
  seedSupplier,
  StartingWithF,
  UPDATE,
} from "./supplier.service.js";
import { successResponse } from "../../common/utils/success.response.js";
router.post("/", async (req, res) => {
  const { data } = await createSupplier(req.body);
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.get("/", async (req, res) => {
  const data = await getAll();
  return successResponse({
    res,
    status: 201,
    data,
  });
});

router.patch("/:id", async (req, res) => {
  const data = await UPDATE({ ...req.body, sup_id: req.params.id });
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.delete("/:id", async (req, res) => {
  const data = await DELETE({ sup_id: req.params.id });
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.post("/seed", async (req, res) => {
  const data = await seedSupplier(req.body);
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/StartingWithF", async (req, res) => {
  const data = await StartingWithF();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
export default router;
