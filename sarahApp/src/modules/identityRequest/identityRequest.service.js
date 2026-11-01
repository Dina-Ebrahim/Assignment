import { populate } from "dotenv";
import {
  NotFoundException,
  BadRequestException,
} from "../../common/exception/error.excption.js";
import {
  create,
  find,
  findById,
  findOne,
} from "../../common/repository/db.repository.js";
import { identityRequestModel } from "../../DB/model/identityRequest.model.js";
import { messageModel } from "../../DB/model/message.model.js";
import { Status } from "../../common/enum/identityReques.js";
import { conversationModel } from "../../DB/model/conversation.model.js";

export const createIdentityRequest = async ({ messageId }, user) => {
  const message = await findById({ model: messageModel, id: messageId });
  if (!message) {
    throw NotFoundException({ message: "Message not found" });
  }
  if (message.receiverId.toString() !== user._id.toString()) {
    throw BadRequestException({
      message: "You are not the receiver of this message",
    });
  }
  if (message.senderId.toString() === user._id.toString()) {
    throw BadRequestException({
      message: "You cannot request your own identity",
    });
  }
  const existingRequest = await findOne({
    model: identityRequestModel,
    filter: { messageId },
  });
  if (existingRequest) {
    throw BadRequestException({
      message: "Identity request already exists",
    });
  }

  const requestData = {
    messageId: message._id,
    senderId: message.senderId,
    receiverId: message.receiverId,
  };

  const identityRequest = await identityRequestModel.create(requestData);

  return identityRequest;
};

export const getIdentityRequests = async (user) => {
  const requests = await find({
    model: identityRequestModel,
    filter: {
      senderId: user._id,
    },
    options: {
      populate: [
        {
          path: "messageId",
          select: "content attachments createdAt",
        },
        {
          path: "receiverId",
          select: "fristName lastName image",
        },
      ],
      sort: { createdAt: -1 },
    },
  });

  return requests;
};
export const respondToIdentityRequest = async ({ requestId, status }, user) => {
  const request = await findById({
    model: identityRequestModel,
    id: requestId,
  });
  if (!request) {
    throw NotFoundException({ message: "Identity request not found" });
  }
  if (request.senderId.toString() !== user._id.toString()) {
    throw BadRequestException({
      message: "You are not allowed to respond to this request",
    });
  }
  if (Number(request.status) !== Status.pending) {
    throw BadRequestException({
      message: "Request already processed",
    });
  }
  if (status == "2") {
    request.status = Status.rejected;
    await request.save();

    return {
      request,
      conversation: null,
    };
  }
  request.status = Status.accepted;
  await request.save();
  const conversationData = {
    participants: [request.senderId, request.receiverId],
    originalMessageId: request.messageId,
    identityRequestId: request._id,
  };

  const conversation = await create({
    model: conversationModel,
    data: [conversationData],
  });
  return {
    request,
    conversation,
  };
};
