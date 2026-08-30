import { Router } from "express";
const router = Router();
import { successResponse } from "../../common/utils/index.js";
import {
  aggregation1,
  createBook,
  createIndex,
  deleteBook,
  excludeGenres,
  findAll,
  findBook,
  findBooksByGenre,
  Insertbook,
  insertMany,
  skipLimit,
  typeYear,
  updata,
  aggregation2,
  aggregation3,
  aggregation4,
} from "./book.service.js";
router.post("/", async (req, res) => {
  const data = await createBook();
  return successResponse({
    res,
    status: 201,
    data,
  });
});

router.post("/index", async (req, res) => {
  const data = await createIndex();
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.post("/insert", async (req, res) => {
  const data = await Insertbook(req.body);
  return successResponse({
    res,
    status: 201,
    data,
  });
});

router.post("/insertM", async (req, res) => {
  const data = await insertMany(req.body);
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.patch("/:title", async (req, res, next) => {
  const data = await updata({
    ...req.body,
    title: req.params.title,
  });

  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/title", async (req, res) => {
  const data = await findBook({
    title: req.query.title,
  });
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/year", async (req, res) => {
  const data = await findAll({ from: req.query.from, to: req.query.to });

  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/genre", async (req, res) => {
  const data = await findBooksByGenre(req.query.genre);
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/skip-limit", async (req, res) => {
  const data = await skipLimit();
  return successResponse({
    res,
    status: 200,
    data,
  });
});

router.get("/year-integer", async (req, res) => {
  const data = await typeYear();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/exclude-genres", async (req, res) => {
  const data = await excludeGenres();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
export default router;

router.delete("/before-year", async (req, res) => {
  const data = await deleteBook(req.query.year);
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/aggregate1", async (req, res) => {
  const data = await aggregation1();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/aggregate2", async (req, res) => {
  const data = await aggregation2();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/aggregate3", async (req, res) => {
  const data = await aggregation3();
  return successResponse({
    res,
    status: 200,
    data,
  });
});

router.get("/aggregate4", async (req, res) => {
  const data = await aggregation4();
  return successResponse({
    res,
    status: 200,
    data,
  });
});
