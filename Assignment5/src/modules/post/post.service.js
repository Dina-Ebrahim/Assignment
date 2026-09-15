import { fn, col } from "sequelize";
import { postModel } from "../../DB/model/post.model.js";
import { userModel } from "../../DB/model/user.model.js";

export const createPost = async (input) => {
  const post = postModel.build(input);
  await post.save();
  return {
    message: "Post created successfully.",
  };
};
export const deletePost = async (id, userId) => {
  const post = await postModel.findByPk(id);
  if (!post) {
    throw new Error("Post not found");
  }
  if (post.userId !== userId) {
    throw new Error("You are not authorized to delete this post.");
  }
  await post.destroy();

  return {
    message: "Post deleted.",
  };
};
export const getPostsDetails = async () => {
  const posts = await postModel.findAll({
    attributes: ["id", "title"],
    include: [
      {
        model: userModel,
        attributes: ["id", "name"],
      },
      {
        model: commentModel,
        attributes: ["id", "content"],
      },
    ],
  });

  return posts;
};

export const getPostsCommentCount = async () => {
  return await postModel.findAll({
    attributes: [
      "id",
      "title",
      [fn("COUNT", col("commentModels.c_id")), "commentCount"],
    ],
    include: [
      {
        model: commentModel,
        attributes: [],
      },
    ],
    group: ["postModel.p_id", "postModel.p_title"],
  });
};
