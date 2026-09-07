import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import {
  createNote,
  deleteNote,
  getByContent,
  getById,
  paginateSort,
  replace,
  update,
  updateAll,
  getNotesWithUser,
  aggregateNotes,
  deleteAllNote,
} from "./note.service.js";
const router = Router();
router.post("/", async (req, res) => {
  const data = await createNote(req.query.id, req.body);
  return successResponse({ res, status: 201, data });
});
router.patch("/all", async (req, res) => {
  const data = await updateAll(req.query.id);
  return successResponse({ res, status: 200, data });
});
router.patch("/:id", async (req, res) => {
  const data = await update(req.params.id, req.query.id, req.body);
  return successResponse({ res, status: 200, data });
});
router.put("/replace/:noteId", async (req, res) => {
  const data = await replace(req.params.noteId, req.query.id, req.body);
  return successResponse({ res, status: 200, data });
});
router.delete("/:noteId", async (req, res) => {
  const data = await deleteNote(req.params.noteId, req.query.id);
  return successResponse({ res, status: 200, data });
});
router.get("/paginate", async (req, res) => {
  const { id, limit, page } = req.query;
  const data = await paginateSort(id, Number(limit), Number(page));
  return successResponse({ res, status: 200, data });
});
router.get("/note-by-content", async (req, res) => {
  const data = await getByContent(req.query.id, req.query.content);
  return successResponse({ res, status: 200, data });
});

router.get("/note-with-user", async (req, res) => {
  const data = await getNotesWithUser(req.query.id);

  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/aggregate", async (req, res) => {
  const data = await aggregateNotes(req.query.id, req.query.title);

  return successResponse({
    res,
    status: 200,
    data,
  });
});

router.get("/:id", async (req, res) => {
  const data = await getById(req.params.id, req.query.id);
  return successResponse({ res, status: 200, data });
});

router.delete("/", async (req, res) => {
  const data = await deleteAllNote(req.query.id);
  return successResponse({ res, status: 200, data });
});
export default router;
