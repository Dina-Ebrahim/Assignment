import { Router } from "express";
import {
  createProduct,
  DELETE,
  getAll,
  getAllbyId,
  UPDATE,
  seedProducts,
  updateProductPrice,
  deleteEgg,
  HighStock,
  allProductNeverSale,
  getAllSale,
} from "./product.service.js";
import { successResponse } from "../../common/utils/success.response.js";
const router = Router();
router.post("/", async (req, res) => {
  const { data } = await createProduct(req.body);
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
router.get("/highStock", async (req, res) => {
  const data = await HighStock();
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.get("/getAllSale", async (req, res) => {
  const data = await getAllSale();
  return successResponse({
    res,
    status: 201,
    data,
  });
});

router.get("/allProductNeverSale", async (req, res) => {
  const data = await allProductNeverSale();
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.get("/:id", async (req, res) => {
  const data = await getAllbyId({ p_id: req.params.id });
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.patch("/bread-price", async (req, res) => {
  const data = await updateProductPrice(req.body);

  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.patch("/:id", async (req, res) => {
  const data = await UPDATE({ ...req.body, p_id: req.params.id });
  return successResponse({
    res,
    status: 201,
    data,
  });
});

router.delete("/deleteegg", async (req, res) => {
  const data = await deleteEgg();
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.delete("/:id", async (req, res) => {
  const data = await DELETE({ p_id: req.params.id });
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.post("/seed", async (req, res, next) => {
  const data = await seedProducts(req.body);

  return successResponse({
    res,
    status: 201,
    data,
  });
});

export default router;
