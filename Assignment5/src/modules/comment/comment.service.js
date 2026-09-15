import { commentModel } from "../../DB/model/comments.model.js";
import { Op, col } from "sequelize";
import { postModel } from "../../DB/model/post.model.js";
import { userModel } from "../../DB/model/user.model.js";
export const creatComment = async (inputs) => {
  await commentModel.bulkCreate(inputs);

  return {
    message: "Comments created.",
  };
};
export const update = async (id, userId, content) => {
  const comment = await commentModel.findByPk(id);

  if (!comment) {
    throw new Error("comment not found.");
  }

  if (comment.userId !== userId) {
    throw new Error("You are not authorized to update this comment.");
  }

  await commentModel.update({ content }, { where: { id } });

  return { message: "Comment updated." };
};
export const findOrCreateComment = async (postId, userId, content) => {
  const [comment, created] = await commentModel.findOrCreate({
    where: {
      postId,
      userId,
      content,
    },
    defaults: {
      postId,
      userId,
      content,
    },
  });
  return {
    comment,
    created,
  };
};
export const searchComments = async (word) => {
  const comment = await commentModel.findAll({
    where: {
      content: {
        [Op.like]: `%${word}%`,
      },
    },
  });
  const count = await commentModel.count({
    where: {
      content: {
        [Op.like]: `%${word}%`,
      },
    },
  });
  return {
    count,
    comment,
  };
};

export const getNewestComments = async (postId) => {
  const comments = await commentModel.findAll({
    where: { postId },
    order: [[col("c_createdAt"), "DESC"]],
    limit: 3,
  });

  return comments;
};

export const getByPk = async (id) => {
  const comment = await commentModel.findByPk(id, {
    include: [
      {
        model: userModel,
        attributes: ["id", "name", "email"],
      },
      {
        model: postModel,
        attributes: ["id", "title", "content"],
      },
    ],
  });
  return comment;
};
