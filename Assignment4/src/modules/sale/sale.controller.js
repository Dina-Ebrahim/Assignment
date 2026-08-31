import { Router } from "express";
import {
  createSale,
  getAll,
  getSalesByProduct,
  seedSale,
  TotalQuantitySold,
} from "./sale.service.js";
import { successResponse } from "../../common/utils/success.response.js";
const router = Router();
router.post("/", async (req, res) => {
  const { data } = await createSale(req.body);
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
router.get("/total-sold", async (req, res) => {
  const data = await TotalQuantitySold();
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.get("/product/:id", async (req, res) => {
  const data = await getSalesByProduct({ p_id: req.params.id });
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.post("/seed", async (req, res) => {
  const data = await seedSale(req.body);
  return successResponse({
    res,
    status: 201,
    data,
  });
});

export default router;
