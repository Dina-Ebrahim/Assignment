import { find } from "../../common/repository/index.js";
import { conversationModel } from "../../DB/model/index.js";

export const getMyConversations = async (user) => {
  const conversations = await find({
    model: conversationModel,
    filter: {
      participants: user._id,
    },
    options: {
      populate: [
        {
          path: "participants",
          select: "fristName lastName image",
        },
      ],
      sort: {
        createdAt: -1,
      },
    },
  });

  return conversations;
};
