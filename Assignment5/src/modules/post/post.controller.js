import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";
import {
  createPost,
  deletePost,
  getPostsDetails,
  getPostsCommentCount,
} from "./post.service.js";

const router = Router();
router.post("/", async (req, res) => {
  const data = await createPost(req.body);

  return successResponse({
    res,
    status: 201,
    data,
  });
});
router.delete("/:id", async (req, res) => {
  console.log(req.body);
  const data = await deletePost(req.params.id, Number(req.body.userId));
  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/details", async (req, res) => {
  const data = await getPostsDetails();

  return successResponse({
    res,
    status: 200,
    data,
  });
});
router.get("/comment-count", async (req, res) => {
  const data = await getPostsCommentCount();

  return successResponse({
    res,
    status: 200,
    data,
  });
});
export default router;
