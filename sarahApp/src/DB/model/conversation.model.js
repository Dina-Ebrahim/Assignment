import mongoose from "mongoose";

export const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
      validate: {
        validator: (value) => value.length === 2,
        message: "Conversation must have exactly two participants",
      },
    },
    originalMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      required: true,
    },
    identityRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "identityRequest",
      required: true,
      unique: true,
    },
  },
  {
    collection: "conversations",
    timestamps: true,
  },
);
export const conversationModel =
  mongoose.models.conversation ||
  mongoose.model("conversation", conversationSchema);
