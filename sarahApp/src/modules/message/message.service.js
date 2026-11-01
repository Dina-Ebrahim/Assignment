import {
  BadRequestException,
  NotFoundException,
} from "../../common/exception/index.js";
import {
  create,
  createOne,
  findById,
  find,
  countDocument,
  deleteOne,
  findOne,
} from "../../common/repository/index.js";
import {
  conversationModel,
  messageModel,
  UserModel,
} from "../../DB/model/index.js";

export const createMessage = async (
  { content, receiverId } = {},
  files = [],
  user,
) => {
  const checkReceiverExist = await findById({
    model: UserModel,
    id: receiverId,
  });
  if (!checkReceiverExist) {
    throw NotFoundException({ message: "invalid ReciverID" });
  }
  if (user._id.toString() === receiverId.toString()) {
    throw BadRequestException({
      message: "You cannot send a message to yourself",
    });
  }
  const message = await createOne({
    model: messageModel,
    data: {
      senderId: user._id,

      receiverId,
      content,
      attachments: files.map((file) => file.finalPath),
      ...(user ? { senderId: user._id } : {}),
    },
  });

  return message;
};
export const GetAllMessages = async ({ type, page, limit } = {}, user) => {
  const skip = (page - 1) * limit;
  let filter = {};
  if (type == "0") {
    filter = { receiverId: user._id };
  } else if (type == "1") {
    filter = { senderId: user._id };
  } else {
    filter = {
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    };
  }
  const docs = await countDocument({ filter, model: messageModel });
  const pages = Math.ceil(docs / limit);
  const message = await find({
    model: messageModel,
    filter: {
      ...filter,
    },
    options: {
      skip,
      limit,
      sort: { createdAT: -1 },
    },
  });

  return { message, page, limit, pages, docs };
};
export const deleteMessage = async ({ messageId }, user) => {
  const message = await messageModel.findById(messageId);

  console.log("Found message =", message);
  console.log("Receiver ID =", message?.receiverId);
  const data = await deleteOne({
    model: messageModel,
    filter: { receiverId: user._id, _id: messageId },
  });
  if (!data.deletedCount) {
    throw NotFoundException({ message: "Invalid messageId" });
  }
  return data;
};
const checkConversationAccess = async (conversationId, userId) => {
  const conversation = await findOne({
    model: conversationModel,
    filter: {
      _id: conversationId,
      participants: userId,
    },
  });

  if (!conversation) {
    throw NotFoundException({
      message: "Conversation not found",
    });
  }

  return conversation;
};
export const getConversationMessages = async (
  { conversationId, page = 1, limit = 20 },
  user,
) => {
  await checkConversationAccess(conversationId, user._id);

  const skip = (page - 1) * limit;

  const filter = { conversationId };

  const [messages, totalMessages] = await Promise.all([
    find({
      model: messageModel,
      filter,
      options: {
        populate: [
          {
            path: "senderId",
            select: "fristName lastName image",
          },
        ],
        sort: { createdAt: -1 },
        skip,
        limit,
      },
    }),
    countDocument({
      model: messageModel,
      filter,
    }),
  ]);

  return {
    messages: messages.reverse(),
    pagination: {
      currentPage: page,
      limit,
      totalMessages,
      totalPages: Math.ceil(totalMessages / limit),
      hasNextPage: page < Math.ceil(totalMessages / limit),
      hasPreviousPage: page > 1,
    },
  };
};
export const sendConversationMessage = async (
  { conversationId, content },
  user,
  files = [],
) => {
  const conversation = await checkConversationAccess(conversationId, user._id);

  if (!content?.trim() && !files.length) {
    throw BadRequestException({
      message: "Message must contain text or attachments",
    });
  }

  const receiverId = conversation.participants.find(
    (participant) => participant.toString() !== user._id.toString(),
  );

  const message = await create({
    model: messageModel,
    data: [
      {
        content: content?.trim() || undefined,
        senderId: user._id,
        receiverId,
        conversationId: conversation._id,
        attachments: files.map((file) => file.finalPath),
      },
    ],
  });

  return message;
};
