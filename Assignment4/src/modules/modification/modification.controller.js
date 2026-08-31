import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";
import {
  addCategory,
  changeContactNumber,
  makeProductNameNotNull,
  removeCategory,
} from "./modification.service.js";

const router = Router();
router.post("/add-category", async (req, res) => {
  const data = await addCategory();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.delete("/remove-category", async (req, res) => {
  const data = await removeCategory();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.patch("/contact-number", async (req, res) => {
  const data = await changeContactNumber();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.patch("/product-name-not-null", async (req, res) => {
  const data = await makeProductNameNotNull();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
export default router;
