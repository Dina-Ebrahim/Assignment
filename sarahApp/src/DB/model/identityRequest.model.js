import mongoose from "mongoose";
import { Status } from "../../common/enum/index.js";

export const identityRequestSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Types.ObjectId,
      ref: "message",
      required: true,
      unique: true,
    },
    senderId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.pending,
    },
  },
  {
    collection: "identityRequests",
    timestamps: true,
  },
);
export const identityRequestModel =
  mongoose.models.identityRequest ||
  mongoose.model("identityRequest", identityRequestSchema);
