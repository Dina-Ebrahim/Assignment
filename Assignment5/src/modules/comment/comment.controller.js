import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";
import {
  creatComment,
  update,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getByPk,
} from "./comment.service.js";
const router = Router();
router.post("/", async (req, res) => {
  const { comments } = req.body;

  const data = await creatComment(comments);
  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.post("/find-or-create", async (req, res) => {
  const { postId, userId, content } = req.body;

  const result = await findOrCreateComment(postId, userId, content);

  return res.json(result);
});
router.get("/search", async (req, res) => {
  const { word } = req.query;

  const result = await searchComments(word);

  if (result.count === 0) {
    return res.json({
      message: "no comments found.",
    });
  }

  return res.json(result);
});
router.get("/newest/:postId", async (req, res) => {
  const data = await getNewestComments(req.params.postId);
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/details/:id", async (req, res) => {
  const data = await getByPk(req.params.id);
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.patch("/:commentId", async (req, res) => {
  const { userId, content } = req.body;

  const data = await update(req.params.commentId, userId, content);

  return successResponse({
    res,
    status: 200,
    data,
  });
});

export default router;
